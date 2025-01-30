package users

import (
	"context"
	"errors"
	"fmt"
	"log"
	"time"
	"users-service/graph/model"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
)

const timeout = 5 * time.Second

var (
	ErrInformationFetch      = fmt.Errorf("failed to fetch user information")
	ErrTransactionBeginFail  = fmt.Errorf("failed to begin transaction")
	ErrTransactionCommitFail = fmt.Errorf("failed to commit transaction")
	ErrTotpUpdateFail        = fmt.Errorf("failed to update TOTP")
	ErrUserCreationFailed    = fmt.Errorf("error creating user")
	ErrUserExists            = fmt.Errorf("username already exists")
)

type DBConnection interface {
	QueryRow(ctx context.Context, query string, args ...interface{}) pgx.Row
	Begin(ctx context.Context) (pgx.Tx, error)
	Exec(ctx context.Context, query string, args ...interface{}) (pgconn.CommandTag, error)
}

func rollbackTransaction(ctx context.Context, tx pgx.Tx) {
	if err := tx.Rollback(ctx); err != nil {
		log.Fatalf("rollback failed: %v\n", err)
	}
}

func QueryUser(ctx context.Context, db DBConnection, username string) (*model.User, error) {
	ctx, cancel := context.WithTimeout(ctx, timeout)
	defer cancel()

	var user model.User
	if err := db.QueryRow(ctx, `
		SELECT username, password_hash, COALESCE(totp, '')
		FROM users
		WHERE username = $1
	`, username).Scan(&user.Username, &user.Password, &user.Totp); err != nil {
		return nil, ErrInformationFetch
	}
	return &user, nil
}

func UpdateUserTotp(ctx context.Context, db DBConnection, username string, totpSecret string) error {
	ctx, cancel := context.WithTimeout(ctx, timeout)
	defer cancel()

	tx, err := db.Begin(ctx)
	if err != nil {
		return ErrTransactionBeginFail
	}
	defer rollbackTransaction(ctx, tx)

	_, err = db.Exec(ctx, `
        UPDATE users 
        SET totp = $2
        WHERE username = $1
	`, username, totpSecret)
	if err != nil {
		return ErrTotpUpdateFail
	}

	if err := tx.Commit(ctx); err != nil {
		return ErrTransactionCommitFail
	}

	return nil
}

func CreateUser(ctx context.Context, db DBConnection, username string, password []byte) (*model.User, error) {
	ctx, cancel := context.WithTimeout(ctx, timeout)
	defer cancel()

	tx, err := db.Begin(ctx)
	if err != nil {
		return nil, ErrTransactionBeginFail
	}
	defer rollbackTransaction(ctx, tx)

	var user model.User
	if err := db.QueryRow(ctx, `
		INSERT INTO users (username, password_hash)
		VALUES ($1, $2)
		RETURNING id, username, password_hash, totp
	`, username, password).Scan(
		&user.ID,
		&user.Username,
		&user.Password,
		&user.Totp,
	); err != nil {
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) {
			switch pgErr.Code {
			case "23505":
				return nil, ErrUserExists
			case "23514":
				return nil, ErrInvalidUsername
			default:
				return nil, ErrUserCreationFailed
			}
		}
		return nil, err
	}

	if err := tx.Commit(ctx); err != nil {
		return nil, ErrTransactionCommitFail
	}

	return &user, nil
}
