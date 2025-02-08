package auth

import (
	"context"
	"data-service/internal/middleware"
	"os"
	"testing"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func TestGetAuthToken(t *testing.T) {
	tests := []struct {
		name    string
		context context.Context
		want    string
	}{
		{
			name:    "Should return token from context",
			context: context.WithValue(context.Background(), middleware.AuthTokenKey, "test-token"),
			want:    "test-token",
		},
		{
			name:    "Should return empty string when no token in context",
			context: context.Background(),
			want:    "",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := GetAuthToken(tt.context)
			if result != tt.want {
				t.Errorf("GetAuthToken(): %v, want %v", result, tt.want)
			}
		})
	}
}

func createTestToken(username string, expTime time.Time) string {
	JWTkey := os.Getenv("JWT_KEY")
	secretKey := []byte(JWTkey)
	token := jwt.NewWithClaims(jwt.SigningMethodHS256,
		jwt.MapClaims{
			"username": username,
			"exp":      expTime.Unix(),
		})
	signedToken, _ := token.SignedString(secretKey)
	return signedToken
}

func TestValidateToken(t *testing.T) {
	testKey := "test-key"
	testUser := "test-user"
	os.Setenv("JWT_KEY", testKey)

	tests := []struct {
		name     string
		context  context.Context
		wantUser string
		wantErr  error
	}{
		{
			name:     "Correct token returns correct user info",
			context:  context.WithValue(context.Background(), middleware.AuthTokenKey, createTestToken(testUser, time.Now().Add(time.Hour*24))),
			wantUser: testUser,
			wantErr:  nil,
		},
		{
			name:     "Wrong token returns error",
			context:  context.WithValue(context.Background(), middleware.AuthTokenKey, "wrong"),
			wantUser: "",
			wantErr:  errInvalidToken,
		},
		{
			name:     "Expired token returns error",
			context:  context.WithValue(context.Background(), middleware.AuthTokenKey, createTestToken(testUser, time.Now().Add(-time.Hour))),
			wantUser: "",
			wantErr:  errInvalidToken,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			username, err := ValidateToken(tt.context)
			if err != tt.wantErr {
				t.Errorf("ValidateToken(): returned wrong error: %v", err)
			}
			if username != tt.wantUser {
				t.Errorf("ValidateToken(): returned wrong username: %v", err)
			}
		})
	}
}
