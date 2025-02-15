## Prerequisites
- Go 1.23.4+
- PostgreSQL database
- [Environment variables](#env-variables) set in .env file

## Installation
```bash
# Download dependencies
go mod download
```
> \* check .env variables below

### Running the Service
**Development**
```bash
go run -tags dev .
```
**Production (without playground)**
```bash
go run .
```

## API Endpoints
**GraphQL Endpoint**
- '/query' - Main GraphQL endpoint for all operations

**Development Tools**
- '/' - GraphQL Playground (development mode only)

## Building
```bash
# Download dependencies
go mod download

# run tests
go test ./...

# build step
go build
```

## Environment Variables
- DB_URL=<DB_URL>
- JWT_KEY=<YOUR_KEY>
- PORT=<CUSTOM_PORT> (optional, default 8080)

## Tech Used
- GraphQL with 99designs/gqlgen
- PostgreSQL with jackc/pgx driver

