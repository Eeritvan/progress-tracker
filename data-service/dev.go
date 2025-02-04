//go:build dev
// +build dev

package main

import (
	"log"
	"net/http"

	"github.com/99designs/gqlgen/graphql/playground"
)

func setupMainRoute(port string) {
	http.Handle("/", playground.Handler("GraphQL playground", "/query"))
	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)

	http.HandleFunc("/healthz", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	})
}
