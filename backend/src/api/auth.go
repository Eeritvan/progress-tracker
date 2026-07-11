package api

import (
	"net/http"

	"github.com/eeritvan/progress-tracker/src/models"
	"github.com/eeritvan/progress-tracker/src/sqlc"
	"github.com/eeritvan/progress-tracker/src/utils"
	"github.com/labstack/echo/v5"
	"golang.org/x/crypto/bcrypt"
)

// /auth/login
func (s *Server) Login(c *echo.Context) error {
	body := new(models.Login)
	if err := c.Bind(&body); err != nil {
		return c.JSON(http.StatusBadRequest, nil)
	}

	if err := c.Validate(body); err != nil {
		return c.JSON(http.StatusBadRequest, nil)
	}

	ctx := c.Request().Context()
	queryRes, _ := s.queries.Login(ctx, body.Name)

	if err := bcrypt.CompareHashAndPassword([]byte(queryRes.PasswordHash), []byte(body.Password)); err != nil {
		return c.JSON(http.StatusUnauthorized, nil)
	}

	jwtToken, err := utils.GenerateJWT(queryRes.ID.String())
	if err != nil {
		return c.JSON(http.StatusInternalServerError, nil)
	}

	jwtCookie := utils.CreateJWTCookie(jwtToken)
	c.SetCookie(jwtCookie)

	return c.JSON(http.StatusOK, queryRes)
}

// /auth/signup
func (s *Server) Signup(c *echo.Context) error {
	body := new(models.Signup)
	if err := c.Bind(&body); err != nil {
		return c.JSON(http.StatusBadRequest, nil)
	}

	if err := c.Validate(body); err != nil {
		return c.JSON(http.StatusBadRequest, nil)
	}

	hashedPW, err := bcrypt.GenerateFromPassword([]byte(body.Password), 12)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, nil)
	}

	ctx := c.Request().Context()
	queryRes, err := s.queries.Signup(ctx, sqlc.SignupParams{
		Name:         body.Name,
		PasswordHash: string(hashedPW),
	})

	jwtToken, err := utils.GenerateJWT(queryRes.ID.String())
	if err != nil {
		return c.JSON(http.StatusInternalServerError, nil)
	}

	jwtCookie := utils.CreateJWTCookie(jwtToken)
	c.SetCookie(jwtCookie)

	return c.JSON(http.StatusCreated, queryRes)
}

// /auth/logout
func (s *Server) Logout(c *echo.Context) error {
	jwtCookie := utils.DeleteJWTCookie()
	c.SetCookie(jwtCookie)

	return c.NoContent(http.StatusNoContent)
}
