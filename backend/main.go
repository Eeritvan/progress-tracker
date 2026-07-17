package main

import (
	"context"
	"embed"
	"fmt"
	"log"
	"mime"
	"net/http"
	"os"
	"strings"

	"github.com/eeritvan/progress-tracker/src/api"
	"github.com/eeritvan/progress-tracker/src/routes"
	"github.com/eeritvan/progress-tracker/src/sqlc"
	"github.com/eeritvan/progress-tracker/src/utils"
	"github.com/golang-jwt/jwt/v5"

	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
	echojwt "github.com/labstack/echo-jwt/v5"
	"github.com/labstack/echo/v5"
	"github.com/labstack/echo/v5/middleware"
)

//go:embed "dist"
var dist embed.FS

func init() {
	_ = mime.AddExtensionType(".css", "text/css; charset=utf-8")
	_ = mime.AddExtensionType(".js", "application/javascript; charset=utf-8")
	_ = mime.AddExtensionType(".html", "text/html; charset=utf-8")
}

func main() {
	if err := godotenv.Load(".env.local"); err != nil {
		fmt.Println("Error loading .env file")
	}

	dbUrl := os.Getenv("DB_URL")
	pool, err := pgxpool.New(context.Background(), dbUrl)
	if err != nil {
		// TODO: error handling
	}

	queries := sqlc.New(pool)

	e := echo.New()

	e.Validator = &utils.CustomValidator{
		Validator: validator.New(validator.WithRequiredStructEnabled()),
	}

	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins:     []string{"http://localhost:3000", "http://127.0.0.1:3000"},
		AllowHeaders:     []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept},
		AllowCredentials: true,
	}))

	JWTkey := os.Getenv("JWT_KEY")
	e.Use(echojwt.WithConfig(echojwt.Config{
		SigningKey:  []byte(JWTkey),
		TokenLookup: "cookie:access_token",
		SuccessHandler: func(c *echo.Context) error {
			token := c.Get("user").(*jwt.Token)
			claims := token.Claims.(jwt.MapClaims)
			userIdStr := claims["userId"].(string)

			uid, err := uuid.Parse(userIdStr)
			if err != nil {
				// TODO: errro handling
				return nil
			}
			c.Set(utils.UserIDContextKey, uid)

			return nil
		},
		ErrorHandler: func(c *echo.Context, err error) error {
			if strings.HasPrefix(c.Path(), "/api") {
				return c.JSON(http.StatusUnauthorized, map[string]string{
					"message": echojwt.ErrJWTInvalid.Message,
				})
			}
			return nil
		},
		ContinueOnIgnoredError: true,
		Skipper: func(c *echo.Context) bool {
			switch c.Path() {
			case "/api/auth/signup", "/api/auth/login":
				return true
			}
			return false
		},
	}))

	e.Use(middleware.BodyLimit(524_288)) // 500kb

	server := api.NewServer(queries, pool)

	routes.RegisterRoutes(e, server, dist)

	port := os.Getenv("PORT")
	log.Fatal(e.Start("127.0.0.1:" + port))
}
