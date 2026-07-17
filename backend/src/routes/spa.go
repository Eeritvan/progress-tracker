package routes

import (
	"encoding/json"
	"fmt"
	"io/fs"
	"net/http"
	"path"
	"strings"

	"github.com/eeritvan/progress-tracker/src/api"
	"github.com/eeritvan/progress-tracker/src/utils"
	"github.com/labstack/echo/v5"
)

type bootstrap struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

func registerSPARoutes(e *echo.Echo, s *api.Server, dist fs.FS) {
	staticFS := echo.MustSubFS(dist, "dist")
	indexHTML, err := fs.ReadFile(dist, "dist/index.html")
	if err != nil {
		panic(err)
	}

	e.GET("/*", func(c *echo.Context) error {
		requestPath := strings.TrimPrefix(path.Clean(c.Request().URL.Path), "/")
		if requestPath != "" && requestPath != "." {
			if stat, err := fs.Stat(staticFS, requestPath); err == nil && !stat.IsDir() {
				return c.FileFS(requestPath, staticFS)
			}
		}

		userID, err := utils.GetUserID(c)
		if err != nil {
			return c.HTMLBlob(http.StatusOK, indexHTML)
		}

		user, err := s.GetUserInfo(c.Request().Context(), userID)
		if err != nil {
			return c.NoContent(http.StatusInternalServerError)
		}

		data, err := json.Marshal(bootstrap{
			ID:   user.ID.String(),
			Name: user.Name,
		})
		if err != nil {
			return c.NoContent(http.StatusInternalServerError)
		}

		page := strings.Replace(
			string(indexHTML),
			"</head>",
			fmt.Sprintf(`<script>window.__USER__ = %s;</script></head>`, data),
			1,
		)

		return c.HTMLBlob(http.StatusOK, []byte(page))
	})
}
