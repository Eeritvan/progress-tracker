package api

import (
	"context"

	"github.com/eeritvan/progress-tracker/src/sqlc"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Server struct {
	queries *sqlc.Queries
	pool    *pgxpool.Pool
}

func NewServer(queries *sqlc.Queries, pool *pgxpool.Pool) *Server {
	return &Server{
		queries: queries,
		pool:    pool,
	}
}

func (s *Server) GetUserInfo(ctx context.Context, id uuid.UUID) (sqlc.GetUserInfoRow, error) {
	return s.queries.GetUserInfo(ctx, id)
}
