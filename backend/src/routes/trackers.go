package routes

import (
	"github.com/eeritvan/progress-tracker/src/api"
	"github.com/labstack/echo/v5"
)

func trackerRoutes(e *echo.Group, s *api.Server) {
	trackers := e.Group("/trackers")

	trackers.GET("", s.GetTracker)
	trackers.POST("/new", s.AddTracker)
	trackers.PATCH("/edit/:id", s.EditTracker)
	trackers.DELETE("/:id", s.DeleteTracker)
}
