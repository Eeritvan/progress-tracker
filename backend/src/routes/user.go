package routes

import (
	"github.com/eeritvan/progress-tracker/src/api"
	"github.com/labstack/echo/v5"
)

func userRoutes(e *echo.Group, s *api.Server) {
	g := e.Group("/user")

	g.GET("/login", s.Login)
}
