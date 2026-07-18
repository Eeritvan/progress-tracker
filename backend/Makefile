ENV?=local
include .env.$(ENV)

GOCMD=go
GORUN=$(GOCMD) run
GOBUILD=$(GOCMD) build
GOTEST=$(GOCMD) test
BINARY_NAME=progress_tracker
MIGRATIONS_ORIGIN=db/migrations
SEED_ORIGIN=db/seed
DB_DRIVER=postgres
DEV_MODE=true

.PHONY: start build test clean generate


# development
dev air:
	@air --build.cmd "go build -tags=dev -o ./tmp/main ."

start: build
	./$(BINARY_NAME)

build: clean frontend_build
	GOEXPERIMENT=jsonv2 $(GOBUILD) -o $(BINARY_NAME)

frontend_build:
	cd ../frontend && npm run build && rm -rf ../backend/dist && mv dist ../backend/dist

clean:
	rm -f $(binary_name) && rm -rf tmp && rm -rf dist

test:
	go test ./tests


# sqlc
sqlc: sqlc-vet
	sqlc generate

sqlc-vet:
	sqlc vet

sqlc-diff:
	sqlc diff


# migrations
migrate-create:
	@goose create $(name) sql -dir $(MIGRATIONS_ORIGIN) -s

migrate-up:
	@goose -dir $(MIGRATIONS_ORIGIN) $(DB_DRIVER) $(DB_URL) up

migrate-down:
	@goose -dir $(MIGRATIONS_ORIGIN) $(DB_DRIVER) $(DB_URL) down

migrate-reset:
	@goose -dir $(MIGRATIONS_ORIGIN) $(DB_DRIVER) $(DB_URL) reset

migrate-version:
	@goose -dir $(MIGRATIONS_ORIGIN) $(DB_DRIVER) $(DB_URL) version

migrate-status:
	@goose -dir $(MIGRATIONS_ORIGIN) $(DB_DRIVER) $(DB_URL) status
