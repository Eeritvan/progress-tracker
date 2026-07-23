package api

import (
	"bytes"
	"context"
	"fmt"
	"image"
	"io"
	"net/http"
	"os"

	_ "image/jpeg"
	_ "image/png"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/disintegration/imaging"
	"github.com/eeritvan/progress-tracker/src/utils"
	"github.com/gen2brain/avif"
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
		Key:    aws.String(fmt.Sprintf("pfp/%s.avif", userId)),
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
		return c.JSON(http.StatusInternalServerError, nil)
	}

	img, _, err := image.Decode(bytes.NewReader(data))
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "invalid image")
	}

	img = imaging.Fill(
		img,
		512,
		512,
		imaging.Center,
		imaging.Lanczos,
	)

	var buf bytes.Buffer
	if err = avif.Encode(&buf, img, avif.Options{
		Quality: 60,
		Speed:   9,
	}); err != nil {
		return c.JSON(http.StatusInternalServerError, nil)
	}

	bucket := os.Getenv("S3_BUCKET")
	if _, err = s.bucket.PutObject(context.Background(), &s3.PutObjectInput{
		Bucket:      aws.String(bucket),
		Key:         aws.String(fmt.Sprintf("pfp/%s.avif", userId)),
		Body:        bytes.NewReader(buf.Bytes()),
		ContentType: aws.String("image/avif"),
	}); err != nil {
		return c.JSON(http.StatusInternalServerError, nil)
	}

	return c.NoContent(http.StatusNoContent)
}
