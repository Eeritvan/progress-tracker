//go:build !dev

package utils

import "net/http"

const cookieSameSite = http.SameSiteLaxMode
