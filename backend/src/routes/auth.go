package routes

import (
	"github.com/eeritvan/progress-tracker/src/api"
	"github.com/labstack/echo/v5"
)

func authRoutes(e *echo.Group, s *api.Server) {
	auth := e.Group("/auth")

	auth.POST("/login", s.Login)
	auth.POST("/signup", s.Signup)
}
