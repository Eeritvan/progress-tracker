package routes

import (
	"github.com/eeritvan/progress-tracker/src/api"
	"github.com/labstack/echo/v5"
)

func trackerRoutes(e *echo.Group, s *api.Server) {
	trackers := e.Group("/trackers")

	trackers.POST("/new", s.AddTracker)
}
