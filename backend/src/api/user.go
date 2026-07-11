package api

import (
	"net/http"

	"github.com/google/uuid"
	"github.com/labstack/echo/v5"
)

// /user/login
func (s *Server) Login(c *echo.Context) error {
	// userId := c.Get("userId").(uuid.UUID)

	uuid, _ := uuid.NewRandom()
	return c.JSON(http.StatusOK, map[string]any{"id": uuid})
}
