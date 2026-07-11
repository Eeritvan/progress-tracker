package api

import (
	"fmt"
	"net/http"

	"github.com/eeritvan/progress-tracker/src/models"
	"github.com/eeritvan/progress-tracker/src/sqlc"
	"github.com/google/uuid"
	"github.com/labstack/echo/v5"
)

// (POST /trackers/new)
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

	ctx := c.Request().Context()
	queryResp, _ := s.queries.AddTracker(ctx, sqlc.AddTrackerParams{
		OwnerID:     userId,
		Title:       body.Title,
		Description: body.Description,
	})

	return c.JSON(http.StatusOK, queryResp)
}

// (PATCH /trackers/edit/:id)
func (s *Server) EditTracker(c *echo.Context) error {
	userId := c.Get("userId").(uuid.UUID)
	trackerId, _ := echo.PathParam[uuid.UUID](c, "id")

	body := new(models.EditTracker)
	if err := c.Bind(&body); err != nil {
		return c.JSON(http.StatusBadRequest, nil)
	}

	if err := c.Validate(body); err != nil {
		return c.JSON(http.StatusBadRequest, nil)
	}

	ctx := c.Request().Context()
	queryResp, _ := s.queries.EditTracker(ctx, sqlc.EditTrackerParams{
		ID:          trackerId,
		OwnerID:     userId,
		Title:       body.Title,
		Description: body.Description,
	})

	return c.JSON(http.StatusOK, queryResp)
}

// (DELETE /trackers/:id)
func (s *Server) DeleteTracker(c *echo.Context) error {
	trackerId, err := echo.PathParam[uuid.UUID](c, "id")
	if err != nil {
		return c.JSON(http.StatusBadRequest, nil)
	}

	userId := c.Get("userId").(uuid.UUID)

	ctx := c.Request().Context()
	if err := s.queries.DeleteTracker(ctx, sqlc.DeleteTrackerParams{
		ID:      trackerId,
		OwnerID: userId,
	}); err != nil {
		return c.JSON(http.StatusInternalServerError, nil)
	}

	return c.NoContent(http.StatusNoContent)
}
