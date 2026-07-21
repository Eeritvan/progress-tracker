package storage

import (
	"context"
	"os"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

func NewGarageClient() (*s3.Client, error) {
	S3Api := os.Getenv("S3_API")
	S3Key := os.Getenv("S3_KEY")
	S3Secret := os.Getenv("S3_SECRET")

	cfg, err := config.LoadDefaultConfig(
		context.Background(),
		config.WithRegion("garage"),
		config.WithCredentialsProvider(
			credentials.NewStaticCredentialsProvider(
				S3Key,
				S3Secret,
				"",
			),
		),
	)

	if err != nil {
		return nil, err
	}

	client := s3.NewFromConfig(cfg, func(o *s3.Options) {
		o.BaseEndpoint = aws.String(S3Api)
		o.UsePathStyle = true
	})

	return client, nil
}
