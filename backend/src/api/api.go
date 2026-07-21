package api

import (
	"context"

	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/eeritvan/progress-tracker/src/sqlc"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Server struct {
	queries *sqlc.Queries
	pool    *pgxpool.Pool
	bucket  *s3.Client
}

func NewServer(queries *sqlc.Queries, pool *pgxpool.Pool, bucket *s3.Client) *Server {
	return &Server{
		queries: queries,
		pool:    pool,
		bucket:  bucket,
	}
}

func (s *Server) GetUserInfo(ctx context.Context, id uuid.UUID) (sqlc.GetUserInfoRow, error) {
	return s.queries.GetUserInfo(ctx, id)
}
