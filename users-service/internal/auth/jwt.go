package auth

import (
	"fmt"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var (
	ErrJwtGenFailed = fmt.Errorf("failed to generate JWT")
)

func GenerateJWT(username string) (string, error) {
	JWTkey := os.Getenv("JWT_KEY")
	secretKey := []byte(JWTkey)
	token := jwt.NewWithClaims(jwt.SigningMethodHS256,
		jwt.MapClaims{
			"username": username,
			"exp":      time.Now().Add(time.Hour * 24).Unix(),
		})

	returnToken, err := token.SignedString(secretKey)
	if err != nil {
		return "", ErrJwtGenFailed
	}
	return returnToken, nil
}
