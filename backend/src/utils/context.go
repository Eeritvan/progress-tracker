package utils

import (
	"fmt"

	"github.com/google/uuid"
	"github.com/labstack/echo/v5"
)

const UserIDContextKey string = "userId"

func GetUserID(c *echo.Context) (uuid.UUID, error) {
	value := c.Get(UserIDContextKey)
	if value == nil {
		return uuid.UUID{}, fmt.Errorf("error")
	}

	userID, ok := value.(uuid.UUID)
	if !ok {
		return uuid.UUID{}, fmt.Errorf("error")
	}

	return userID, nil
}
