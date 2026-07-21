package api

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"net/http"
	"os"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/eeritvan/progress-tracker/src/utils"
	"github.com/labstack/echo/v5"
)

// (GET /profile/pfp)
func (s *Server) GetProfilePicture(c *echo.Context) error {
	userId, err := utils.GetUserID(c)
	if err != nil {
		return nil
	}

	bucket := os.Getenv("S3_BUCKET")
	out, err := s.bucket.GetObject(context.Background(), &s3.GetObjectInput{
		Bucket: aws.String(bucket),
		Key:    aws.String(fmt.Sprintf("pfp/%s.jpg", userId)),
	})
	if err != nil {
		return echo.NewHTTPError(http.StatusNotFound, "image not found")
	}
	defer out.Body.Close()

	contentType := "application/octet-stream"
	if out.ContentType != nil {
		contentType = *out.ContentType
	}

	return c.Stream(http.StatusOK, contentType, out.Body)
}

// (POST /profile/pfp)
func (s *Server) UploadProfilePicture(c *echo.Context) error {
	userId, err := utils.GetUserID(c)
	if err != nil {
		return nil
	}

	data, err := io.ReadAll(c.Request().Body)
	if err != nil {
		return err
	}

	bucket := os.Getenv("S3_BUCKET")
	_, err = s.bucket.PutObject(context.Background(), &s3.PutObjectInput{
		Bucket:      aws.String(bucket),
		Key:         aws.String(fmt.Sprintf("pfp/%s.jpg", userId)),
		Body:        bytes.NewReader(data),
		ContentType: aws.String(c.Request().Header.Get(echo.HeaderContentType)),
	})

	return c.NoContent(http.StatusNoContent)
}
