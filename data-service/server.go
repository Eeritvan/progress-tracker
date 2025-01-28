package main

import (
	"context"
	"data-service/graph"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/lru"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/jackc/pgx/v5"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
	"github.com/vektah/gqlparser/v2/ast"
)

const defaultPort = "8081"

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

func checkForTable(conn *pgx.Conn, ctx context.Context) error {
	var exists bool

	err := conn.QueryRow(ctx, `
        SELECT EXISTS (
            SELECT FROM pg_tables 
            WHERE schemaname = 'public' 
            AND tablename = 'cards'
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
		log.Println("Cards table created successfully")
	}
	return nil
}

func AuthHeaderMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == "OPTIONS" {
			w.Header().Set("Access-Control-Allow-Origin", "*")
			w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Authorization, Content-Type")
			w.WriteHeader(http.StatusOK)
			return
		}

		auth := r.Header.Get("Authorization")
		if auth == "" {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
		}

		parts := strings.Split(auth, "Bearer ")
		if len(parts) != 2 {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
		}

		parsedAuth := parts[1]
		ctx := context.WithValue(r.Context(), "authToken", parsedAuth)
		r = r.WithContext(ctx)

		next.ServeHTTP(w, r)
	})
}

func main() {
	godotenv.Load()

	ctx := context.Background()

	db := connectToDB(ctx)
	if db != nil {
		checkForTable(db, ctx)
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

	handler := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
		AllowCredentials: true,
	}).Handler(srv)

	handler = AuthHeaderMiddleware(handler)

	http.Handle("/query", handler)
	setupPlayground(port)

	log.Fatal(http.ListenAndServe(":"+port, nil))
}
