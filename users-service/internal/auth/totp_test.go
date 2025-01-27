package auth

import (
	"testing"
	"time"

	"github.com/pquerna/otp/totp"
)

func TestGenerateTotpKey(t *testing.T) {
	tests := []struct {
		name     string
		username string
		wantErr  error
	}{
		{"valid username and case", "testuser", nil},
		{"empty username", "testuser", nil},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			key, err := GenerateTotpKey(tt.username)
			if err != tt.wantErr {
				t.Errorf("GenerateTotpKey() error = %v, wantErr %v", err, tt.wantErr)
			}
			if key == "" {
				t.Error("GenerateTotpKey() error = returned empty key")
			}
			if len(key) < 16 { // TOTP keys are typically at least 16 chars
				t.Errorf("GenerateTotpKey() error: key too short: %v", len(key))
			}
		})
	}
}

func TestValidateTotp(t *testing.T) {
	userTotp, err := GenerateTotpKey("testuser")
	if err != nil {
		t.Fatalf("ValidateTotp() error = failed to generate TOTP key: %v", err)
	}
	validCode, err := totp.GenerateCode(userTotp, time.Now())
	if err != nil {
		t.Fatalf("ValidateTotp() error = failed to generate valid TOTP code: %v", err)
	}
	if err != nil {
		t.Fatalf("ValidateTotp() error = failed to generate valid TOTP code: %v", err)
	}
	invalidCode := "999999"
	emptyCode := ""

	tests := []struct {
		name      string
		userTotp  *string
		inputTotp *string
		wantErr   error
	}{
		{"valid totp code", &userTotp, &validCode, nil},
		{"invalid totp code", &userTotp, &invalidCode, ErrTotpIncorrect},
		{"missing totp input when required", &userTotp, nil, ErrTotpRequired},
		{"empty user totp - validation skipped", &emptyCode, &validCode, nil},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := ValidateTotp(tt.userTotp, tt.inputTotp)
			if err != tt.wantErr {
				t.Errorf("ValidateTotp() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}
