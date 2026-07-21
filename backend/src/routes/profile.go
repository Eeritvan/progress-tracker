package routes

import (
	"github.com/eeritvan/progress-tracker/src/api"
	"github.com/labstack/echo/v5"
)

func profileRoutes(e *echo.Group, s *api.Server) {
	profile := e.Group("/profile")

	profile.GET("/pfp", s.GetProfilePicture)
	profile.POST("/pfp", s.UploadProfilePicture)
}
