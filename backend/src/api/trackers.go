package api

import (
	"net/http"
	"time"

	"github.com/eeritvan/progress-tracker/src/models"
	"github.com/eeritvan/progress-tracker/src/sqlc"
	"github.com/eeritvan/progress-tracker/src/utils"
	"github.com/google/uuid"
	"github.com/labstack/echo/v5"
)

// (GET /trackers)
func (s *Server) GetTrackers(c *echo.Context) error {
	userId, err := utils.GetUserID(c)
	if err != nil {
		return nil
	}

	ctx := c.Request().Context()
	queryResp, _ := s.queries.GetTracker(ctx, userId)

	return c.JSON(http.StatusOK, queryResp)
}

// (POST /trackers/new)
func (s *Server) AddTracker(c *echo.Context) error {
	userId, err := utils.GetUserID(c)
	if err != nil {
		return nil
	}

	body := new(models.AddTracker)
	if err := c.Bind(&body); err != nil {
		return c.JSON(http.StatusBadRequest, nil)
	}

	if err := c.Validate(body); err != nil {
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
	userId, err := utils.GetUserID(c)
	if err != nil {
		return nil
	}

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

// (POST /trackers/:id/complete)
func (s *Server) AddTrackerCompletion(c *echo.Context) error {
	_, err := utils.GetUserID(c)
	if err != nil {
		return nil
	}

	trackerId, _ := echo.PathParam[uuid.UUID](c, "id")

	body := new(models.EditTracker)
	if err := c.Bind(&body); err != nil {
		return c.JSON(http.StatusBadRequest, nil)
	}

	if err := c.Validate(body); err != nil {
		return c.JSON(http.StatusBadRequest, nil)
	}

	// todo: check permissions

	now := time.Now()
	ctx := c.Request().Context()
	s.queries.AddTrackerCompletion(ctx, sqlc.AddTrackerCompletionParams{
		TrackerID:   trackerId,
		CompletedOn: now,
	})

	return c.JSON(http.StatusOK, nil)
}

// (DELETE /trackers/:id/completion)
func (s *Server) DeleteTrackerCompletion(c *echo.Context) error {
	_, err := utils.GetUserID(c)
	if err != nil {
		return nil
	}

	trackerId, _ := echo.PathParam[uuid.UUID](c, "id")

	body := new(models.EditTracker)
	if err := c.Bind(&body); err != nil {
		return c.JSON(http.StatusBadRequest, nil)
	}

	if err := c.Validate(body); err != nil {
		return c.JSON(http.StatusBadRequest, nil)
	}

	dateNow := time.Now()
	ctx := c.Request().Context()
	s.queries.DeleteTrackerCompletion(ctx, sqlc.DeleteTrackerCompletionParams{
		TrackerID:   trackerId,
		CompletedOn: dateNow,
	})

	return c.JSON(http.StatusOK, nil)
}

// (DELETE /trackers/:id)
func (s *Server) DeleteTracker(c *echo.Context) error {
	userId, err := utils.GetUserID(c)
	if err != nil {
		return nil
	}

	trackerId, err := echo.PathParam[uuid.UUID](c, "id")
	if err != nil {
		return c.JSON(http.StatusBadRequest, nil)
	}

	ctx := c.Request().Context()
	if err := s.queries.DeleteTracker(ctx, sqlc.DeleteTrackerParams{
		ID:      trackerId,
		OwnerID: userId,
	}); err != nil {
		return c.JSON(http.StatusInternalServerError, nil)
	}

	return c.NoContent(http.StatusNoContent)
}
