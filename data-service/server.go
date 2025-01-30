package main

import (
	"context"
	"data-service/graph"
	"log"
	"net/http"
	"os"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/lru"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/joho/godotenv"
	"github.com/vektah/gqlparser/v2/ast"

	"data-service/internal/db"
	"data-service/internal/middleware"
)

const defaultPort = "8081"

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	ctx := context.Background()

	DB := db.ConnectToDB(ctx)
	if DB != nil {
		if err := db.CheckForTable(DB, ctx); err != nil {
			log.Fatalf("Checking for table failed: %v", err)
		}
		defer DB.Close(ctx)
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	srv := handler.New(graph.NewExecutableSchema(graph.Config{
		Resolvers: &graph.Resolver{
			DB: DB,
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

	handler := middleware.CorsMiddleware(srv)
	handler = middleware.AuthHeaderMiddleware(handler)

	http.Handle("/query", handler)
	setupPlayground(port)

	log.Fatal(http.ListenAndServe(":"+port, nil))
}
