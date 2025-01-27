package auth

import (
	"fmt"

	"golang.org/x/crypto/bcrypt"
)

var (
	ErrPasswordHashingFail = fmt.Errorf("error hashing password")
	ErrIncorrectPassword   = fmt.Errorf("incorrect password")
)

func GeneratePasswordHash(password string) ([]byte, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, ErrPasswordHashingFail
	}
	return hashedPassword, nil
}

func ValidatePassword(hash string, password string) error {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	if err != nil {
		return ErrIncorrectPassword
	}
	return nil
}
