package db

import (
	"context"
	"log"
	"os"

	"github.com/jackc/pgx/v5"
)

func ConnectToDB(ctx context.Context) *pgx.Conn {
	dbUrl := os.Getenv("DB_URL")
	conn, err := pgx.Connect(ctx, dbUrl)
	if err != nil {
		log.Fatalln("Connection to db failed", err)
		return nil
	}
	log.Println("Successfully connected to database")
	return conn
}

func CheckForTable(conn *pgx.Conn, ctx context.Context) error {
	var exists bool

	err := conn.QueryRow(ctx, `
        SELECT EXISTS (
            SELECT FROM pg_tables 
            WHERE schemaname = 'public' 
            AND tablename = 'users'
        );`).Scan(&exists)
	if err != nil {
		return err
	}

	if !exists {
		sqlFile, _ := os.ReadFile("./schema.sql")
		_, err = conn.Exec(ctx, string(sqlFile))
		if err != nil {
			return err
		}
		log.Println("Users table created successfully")
	}
	return nil
}
