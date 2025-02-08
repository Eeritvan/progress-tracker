package auth

import (
	"context"
	"fmt"
	"os"

	"data-service/internal/middleware"

	"github.com/golang-jwt/jwt/v5"
)

var (
	errTokenFail    = fmt.Errorf("invalid token claims")
	errInvalidToken = fmt.Errorf("invalid token")
)

type CustomClaims struct {
	Username string `json:"username"`
	jwt.RegisteredClaims
}

func GetAuthToken(ctx context.Context) string {
	token, _ := ctx.Value(middleware.AuthTokenKey).(string)
	return token
}

func ValidateToken(ctx context.Context) (string, error) {
	JWTtoken := GetAuthToken(ctx)
	JWTkey := os.Getenv("JWT_KEY")

	token, err := jwt.ParseWithClaims(JWTtoken, &CustomClaims{}, func(t *jwt.Token) (interface{}, error) {
		return []byte(JWTkey), nil
	})

	if err != nil {
		return "", errInvalidToken
	}

	claims, ok := token.Claims.(*CustomClaims)
	if !ok || !token.Valid {
		return "", errTokenFail
	}

	return claims.Username, nil
}
