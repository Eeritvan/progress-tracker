package auth

import (
	"fmt"

	"github.com/pquerna/otp/totp"
)

var (
	ErrTotpRequired  = fmt.Errorf("totp required")
	ErrTotpIncorrect = fmt.Errorf("incorrect totp")
	ErrTotpGenFailed = fmt.Errorf("failed to generate totp key")
)

func GenerateTotpKey(username string) (string, error) {
	key, err := totp.Generate(totp.GenerateOpts{
		Issuer:      "void",
		AccountName: username,
	})
	if err != nil {
		return "", ErrTotpGenFailed
	}
	return key.Secret(), nil
}

func ValidateTotp(userTotp *string, inputTotp *string) error {
	if *userTotp != "" {
		if inputTotp == nil {
			return ErrTotpRequired
		}
		if !totp.Validate(*inputTotp, *userTotp) {
			return ErrTotpIncorrect
		}
	}
	return nil
}
