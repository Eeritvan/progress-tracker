package api

import (
	"fmt"
	"net/http"

	"github.com/eeritvan/progress-tracker/src/models"
	"github.com/eeritvan/progress-tracker/src/sqlc"
	"github.com/eeritvan/progress-tracker/src/utils"
	"github.com/labstack/echo/v5"
	"golang.org/x/crypto/bcrypt"
)

// (POST /auth/login)
func (s *Server) Login(c *echo.Context) error {
	fmt.Println("here0")
	body := new(models.Login)
	if err := c.Bind(&body); err != nil {
		fmt.Println("1", err)
		return c.JSON(http.StatusBadRequest, nil)
	}

	fmt.Println("here1")
	if err := c.Validate(body); err != nil {
		fmt.Println("2", err)
		return c.JSON(http.StatusBadRequest, nil)
	}

	fmt.Println("here2")

	ctx := c.Request().Context()
	queryRes, _ := s.queries.Login(ctx, body.Name)

	fmt.Println("here3")
	if err := bcrypt.CompareHashAndPassword([]byte(queryRes.PasswordHash), []byte(body.Password)); err != nil {
		fmt.Println("3", err)
		return c.JSON(http.StatusUnauthorized, nil)
	}

	fmt.Println("here4")
	jwtToken, err := utils.GenerateJWT(queryRes.ID.String())
	if err != nil {
		fmt.Println("4", err)
		return c.JSON(http.StatusInternalServerError, nil)
	}

	fmt.Println("here5")
	jwtCookie := utils.CreateJWTCookie(jwtToken)
	c.SetCookie(jwtCookie)

	fmt.Println("here6")

	return c.JSON(http.StatusOK, queryRes)
}

// (POST /auth/signup)
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

// (POST /auth/logout)
func (s *Server) Logout(c *echo.Context) error {
	jwtCookie := utils.DeleteJWTCookie()
	c.SetCookie(jwtCookie)

	return c.NoContent(http.StatusNoContent)
}
