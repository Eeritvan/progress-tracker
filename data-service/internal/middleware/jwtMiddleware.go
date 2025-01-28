package middleware

import (
	"context"
	"net/http"
	"strings"
)

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
