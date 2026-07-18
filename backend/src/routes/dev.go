//go:build dev

package routes

import (
	"github.com/eeritvan/progress-tracker/src/api"
	"github.com/labstack/echo/v5"
)

func devRoutes(e *echo.Group, s *api.Server) {
	dev := e.Group("/dev")

	dev.GET("/me", s.Me)
}
