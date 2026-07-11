package routes

import (
	"github.com/eeritvan/progress-tracker/src/api"
	"github.com/labstack/echo/v5"
)

func RegisterRoutes(e *echo.Echo, s *api.Server) {
	g := e.Group("/api")

	authRoutes(g, s)
	trackerRoutes(g, s)
}
