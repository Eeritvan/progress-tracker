package auth

import (
	"testing"
)

func TestGeneratePasswordHash(t *testing.T) {
	tests := []struct {
		name     string
		password string
		wantErr  error
	}{
		{"valid password to hash", "testpassword", nil},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			hash, err := GeneratePasswordHash(tt.password)
			if err != tt.wantErr {
				t.Errorf("GenerateJWT() error = %v, wantErr %v", err, tt.wantErr)
			} else if len(hash) == 0 {
				t.Errorf("GenerateJWT() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func GenerateHash(t *testing.T, password string) []byte {
	hash, err := GeneratePasswordHash(password)
	if err != nil {
		t.Fatalf("failed to generate hash: %v", err)
	}
	return hash
}

func TestValidatePassword(t *testing.T) {
	tests := []struct {
		name     string
		password string
		hash     string
		wantErr  error
	}{
		{
			name:     "valid password",
			password: "testpassword",
			hash:     string(GenerateHash(t, "testpassword")),
			wantErr:  nil,
		},
		{
			name:     "invalid password",
			password: "wrongpassword",
			hash:     string(GenerateHash(t, "testpassword")),
			wantErr:  ErrIncorrectPassword,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := ValidatePassword(tt.hash, tt.password)
			if err != tt.wantErr {
				t.Errorf("ValidatePassword() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}
