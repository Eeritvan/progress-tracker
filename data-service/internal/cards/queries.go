package cards

import (
	"context"
	"data-service/graph/model"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
)

type DBConnection interface {
	QueryRow(ctx context.Context, query string, args ...interface{}) pgx.Row
	Exec(ctx context.Context, query string, args ...interface{}) (pgconn.CommandTag, error)
	Query(ctx context.Context, query string, args ...interface{}) (pgx.Rows, error)
}

func DB_CreateCard(ctx context.Context, db DBConnection, username string, input model.NewCard) (*model.Card, error) {
	var card model.Card
	if err := db.QueryRow(ctx, `
		WITH inserted AS (
			INSERT INTO cards (owner, name, description, color_id, icon_id)
        	SELECT $1, $2, $3, 
            	(SELECT id FROM colors WHERE name = $4),
            	(SELECT id FROM icons WHERE name = $5)
			RETURNING id, name, description, completed_days, color_id, icon_id
		)
		SELECT i.id, i.name, i.description, i.completed_days, c.name, ic.name
		FROM inserted i
		LEFT JOIN colors c ON i.color_id = c.id
		LEFT JOIN icons ic ON i.icon_id = ic.id
	`, username, input.Name, input.Desc, input.Color, input.Icon).Scan(
		&card.ID,
		&card.Name,
		&card.Desc,
		&card.CompletedDays,
		&card.Color,
		&card.Icon,
	); err != nil {
		return nil, err
	}

	return &card, nil

}

func DB_DeleteCard(ctx context.Context, db DBConnection, username string, input string) (bool, error) {
	if _, err := db.Exec(ctx, `
		DELETE FROM cards
		WHERE owner = $1 AND id=$2
	`, username, input); err != nil {
		return false, err
	}
	return true, nil
}

func DB_CompleteDay(ctx context.Context, db DBConnection, username string, input string) (bool, error) {
	currentTime := time.Now().Format("2006-01-02")

	var isCompleted bool
	err := db.QueryRow(ctx, `
		UPDATE cards
		SET completed_days = CASE 
			WHEN $3 = ANY(completed_days) THEN array_remove(completed_days, $3)
			ELSE array_append(completed_days, $3)
		END
		WHERE owner = $1 AND id = $2
		RETURNING $3 = ANY(completed_days)
	`, username, input, currentTime).Scan(&isCompleted)
	if err != nil {
		return false, err
	}

	return isCompleted, nil
}

func DB_ReorderCards(ctx context.Context, db DBConnection, username string, input []string) (bool, error) {
	for i, id := range input {
		_, err := db.Exec(ctx, `
            UPDATE cards 
            SET order_index = $1
            WHERE owner = $2 AND id = $3
        `, i, username, id)
		if err != nil {
			return false, err
		}
	}
	return true, nil
}

func DB_GetCards(ctx context.Context, db DBConnection, username string) ([]*model.Card, error) {
	var cards []*model.Card
	rows, err := db.Query(ctx, `
		SELECT C.id, C.name, C.description, C.completed_days, COL.name, I.name
		FROM cards C
		LEFT JOIN colors COL ON C.color_id=COL.id
		LEFT JOIN icons I ON C.icon_id=I.id
		WHERE owner = $1
		ORDER BY C.order_index ASC
	`, username)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var card model.Card
		if err := rows.Scan(
			&card.ID,
			&card.Name,
			&card.Desc,
			&card.CompletedDays,
			&card.Color,
			&card.Icon,
		); err != nil {
			return nil, err
		}
		cards = append(cards, &card)
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}

	return cards, nil
}
