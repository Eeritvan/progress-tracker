package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"users-service/graph"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/lru"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/jackc/pgx/v5"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
	"github.com/vektah/gqlparser/v2/ast"
)

const defaultPort = "8080"

func connectToDB(ctx context.Context) *pgx.Conn {
	dbUrl := os.Getenv("DB_URL")
	conn, err := pgx.Connect(ctx, dbUrl)
	if err != nil {
		log.Fatalln("Connection to db failed", err)
		return nil
	}
	log.Println("Successfully connected to database")
	return conn
}

func checkForUsersTable(conn *pgx.Conn, ctx context.Context) error {
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
		_, err = conn.Exec(ctx, `
            CREATE TABLE users (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                username VARCHAR(50)  UNIQUE NOT NULL CHECK (LENGTH(username) >= 3),
                password_hash VARCHAR(60) NOT NULL,
				totp VARCHAR(50)
            );`)
		if err != nil {
			return err
		}
		log.Println("Users table created successfully")
	}
	return nil
}

func main() {
	godotenv.Load()
	ctx := context.Background()

	db := connectToDB(ctx)
	if db != nil {
		checkForUsersTable(db, ctx)
		defer db.Close(ctx)
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	srv := handler.New(graph.NewExecutableSchema(graph.Config{
		Resolvers: &graph.Resolver{
			DB: db,
		},
	}))

	srv.AddTransport(transport.Options{})
	srv.AddTransport(transport.GET{})
	srv.AddTransport(transport.POST{})

	srv.SetQueryCache(lru.New[*ast.QueryDocument](1000))

	srv.Use(extension.Introspection{})
	srv.Use(extension.AutomaticPersistedQuery{
		Cache: lru.New[string](100),
	})

	corsHandler := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
		AllowCredentials: true,
	}).Handler(srv)

	http.Handle("/query", corsHandler)
	setupPlayground(port)

	log.Fatal(http.ListenAndServe(":"+port, nil))
}
