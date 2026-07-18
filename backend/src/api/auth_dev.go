//go:build dev

package api

import (
	"net/http"

	"github.com/eeritvan/progress-tracker/src/utils"
	"github.com/labstack/echo/v5"
)

// (GET /auth/me)
func (s *Server) Me(c *echo.Context) error {
	userId, err := utils.GetUserID(c)
	if err != nil {
		return nil
	}

	ctx := c.Request().Context()
	queryResp, err := s.queries.GetUserInfo(ctx, userId)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, nil)
	}

	return c.JSON(http.StatusOK, queryResp)
}
