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

	"github.com/go-playground/validator/v10"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
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

	e.Use(middleware.BodyLimit(524_288)) // 500kb

	server := api.NewServer(queries, pool)

	routes.RegisterRoutes(e, server)

	port := os.Getenv("PORT")
	log.Fatal(e.Start("127.0.0.1:" + port))
}
