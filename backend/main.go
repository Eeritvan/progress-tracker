package main

import (
	"context"
	"fmt"
	"log"
	"os"

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
			c.Set("userId", uid)

			return nil
		},
		Skipper: func(c *echo.Context) bool {
			switch c.Path() {
			case "/*", "/api/auth/signup", "/api/auth/login":
				return true
			}
			return false
		},
	}))

	e.Use(middleware.BodyLimit(524_288)) // 500kb

	server := api.NewServer(queries, pool)

	routes.RegisterRoutes(e, server)

	port := os.Getenv("PORT")
	log.Fatal(e.Start("127.0.0.1:" + port))
}
