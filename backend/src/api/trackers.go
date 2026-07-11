package api

import (
	"fmt"
	"net/http"

	"github.com/eeritvan/progress-tracker/src/models"
	"github.com/eeritvan/progress-tracker/src/sqlc"
	"github.com/google/uuid"
	"github.com/labstack/echo/v5"
)

// /trackers/new
func (s *Server) AddTracker(c *echo.Context) error {
	userId := c.Get("userId").(uuid.UUID)

	body := new(models.AddTracker)
	if err := c.Bind(&body); err != nil {
		fmt.Println(err)
		return c.JSON(http.StatusBadRequest, nil)
	}

	if err := c.Validate(body); err != nil {
		fmt.Println(err)
		return c.JSON(http.StatusBadRequest, nil)
	}

	fmt.Println(body)

	ctx := c.Request().Context()
	queryResp, _ := s.queries.AddTracker(ctx, sqlc.AddTrackerParams{
		OwnerID:     userId,
		Title:       body.Title,
		Description: body.Description,
	})

	return c.JSON(http.StatusOK, queryResp)
}
