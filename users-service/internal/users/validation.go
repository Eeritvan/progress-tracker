package users

import (
	"fmt"
	"strings"
)

var (
	ErrInvalidPassword = fmt.Errorf("password must be at least 8 characters long")
	ErrInvalidUsername = fmt.Errorf("username must be at least 3 characters long")
)

func ValidateUsername(username string) error {
	if len(username) < 3 {
		return ErrInvalidUsername
	}
	if strings.TrimSpace(username) == "" {
		return ErrInvalidUsername
	}
	return nil
}

func ValidatePassword(password string) error {
	if len(password) < 8 {
		return ErrInvalidPassword
	}
	return nil
}

func ValidateUserInput(username string, password string) error {
	if err := ValidateUsername(username); err != nil {
		return err
	}
	if err := ValidatePassword(password); err != nil {
		return err
	}
	return nil
}
