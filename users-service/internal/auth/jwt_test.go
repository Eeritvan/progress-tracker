package auth

import (
	"os"
	"testing"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func TestGenerateJWT(t *testing.T) {
	os.Setenv("JWT_KEY", "JWT")
	defer os.Unsetenv("JWT_KEY")

	tests := []struct {
		name     string
		username string
		wantErr  error
	}{
		{"valid username", "testuser", nil},
		{"empty username", "", nil},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			token, err := GenerateJWT(tt.username)
			if err != tt.wantErr {
				t.Errorf("GenerateJWT() error = %v, wantErr %v", err, tt.wantErr)
				return
			}

			if token == "" {
				t.Errorf("GenerateJWT() returned empty token")
				return
			}

			parsedToken, err := jwt.Parse(token, func(token *jwt.Token) (interface{}, error) {
				return []byte(os.Getenv("JWT_KEY")), nil
			})
			if err != nil {
				t.Errorf("GenerateJWT(): JWT failed to parse token: %v", err)
				return
			}

			if !parsedToken.Valid {
				t.Errorf("GenerateJWT(): Generated token is not valid")
			}

			claims, ok := parsedToken.Claims.(jwt.MapClaims)
			if !ok {
				t.Errorf("GenerateJWT(): Failed to parse claims")
				return
			}

			if claims["username"] != tt.username {
				t.Errorf("GenerateJWT(): Token username claim = %v, want %v", claims["username"], tt.username)
			}

			if exp, ok := claims["exp"].(float64); !ok || exp <= float64(time.Now().Unix()) {
				t.Errorf("GenerateJWT(): Token exp claim is invalid or expired")
			}
		})
	}
}
