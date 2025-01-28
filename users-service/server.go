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
	"github.com/joho/godotenv"
	"github.com/vektah/gqlparser/v2/ast"

	"users-service/internal/db"
	"users-service/internal/middleware"
)

const defaultPort = "8080"

func main() {
	godotenv.Load()
	ctx := context.Background()

	DB := db.ConnectToDB(ctx)
	if DB != nil {
		db.CheckForTable(DB, ctx)
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
	http.Handle("/query", handler)
	setupPlayground(port)

	log.Fatal(http.ListenAndServe(":"+port, nil))
}
