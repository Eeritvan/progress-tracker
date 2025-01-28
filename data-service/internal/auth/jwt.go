package auth

import (
	"context"
	"fmt"
	"os"

	"github.com/golang-jwt/jwt/v5"
)

type CustomClaims struct {
	Username string `json:"username"`
	jwt.RegisteredClaims
}

func GetAuthToken(ctx context.Context) string {
	token, _ := ctx.Value("authToken").(string)
	return token
}

func ValidateToken(ctx context.Context) (string, error) {
	JWTtoken := GetAuthToken(ctx)
	JWTkey := os.Getenv("JWT_KEY")

	token, err := jwt.ParseWithClaims(JWTtoken, &CustomClaims{}, func(t *jwt.Token) (interface{}, error) {
		return []byte(JWTkey), nil
	})

	if err != nil {
		return "", fmt.Errorf("invalid token: %w", err)
	}

	claims, ok := token.Claims.(*CustomClaims)
	if !ok || !token.Valid {
		return "", fmt.Errorf("invalid token claims")
	}

	return claims.Username, nil
}
