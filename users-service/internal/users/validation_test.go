package users

import (
	"testing"
)

func TestValidateUsername(t *testing.T) {
	tests := []struct {
		name     string
		username string
		want     error
	}{
		{"valid username", "testuser", nil},
		{"too short username", "xx", ErrInvalidUsername},
		{"empty username", "", ErrInvalidUsername},
		{"whitespace username", "    ", ErrInvalidUsername},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := ValidateUsername(tt.username)
			if err != tt.want {
				t.Errorf("ValidateUsername(): %v, wanted %v", err, tt.want)
			}
		})
	}
}

func TestValidatePassword(t *testing.T) {
	tests := []struct {
		name     string
		password string
		want     error
	}{
		{"valid password", "testpassword", nil},
		{"too short password", "xxxxxxx", ErrInvalidPassword},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := ValidatePassword(tt.password)
			if err != tt.want {
				t.Errorf("ValidatePassword(): %v, wanted %v", err, tt.want)
			}
		})
	}
}

func TestValidateUserInput(t *testing.T) {
	tests := []struct {
		name     string
		username string
		password string
		want     error
	}{
		{"valid input", "testuser", "testpassword", nil},
		{"invalid username", "xx", "testpassword", ErrInvalidUsername},
		{"invalid password", "testuser", "xxxxxxx", ErrInvalidPassword},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := ValidateUserInput(tt.username, tt.password)
			if err != tt.want {
				t.Errorf("ValidateUserInput(): %v, wanted %v", err, tt.want)
			}
		})
	}
}
