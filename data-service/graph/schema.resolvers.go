package graph

import (
	"context"
	"data-service/graph/model"
	"fmt"
	"os"

	"github.com/golang-jwt/jwt/v5"
)

func GetAuthToken(ctx context.Context) string {
	token, _ := ctx.Value("authToken").(string)
	return token
}

type CustomClaims struct {
	Username string `json:"username"`
	jwt.RegisteredClaims
}

func ValidateToken(tokenString string, secretKey string) (string, error) {
	token, err := jwt.ParseWithClaims(tokenString, &CustomClaims{}, func(t *jwt.Token) (interface{}, error) {
		return []byte(secretKey), nil
	})

	if err != nil {
		return "", fmt.Errorf("invalid token: %w", err)
	}

	claims, ok := token.Claims.(*CustomClaims)
	if !ok || !token.Valid {
		return "", fmt.Errorf("invalid token claims")
	}

	return claims.Username, nil
}

// CreateCard is the resolver for the createCard field.
func (r *mutationResolver) CreateCard(ctx context.Context, input model.NewCard) (*model.Card, error) {
	auth := GetAuthToken(ctx)
	JWTkey := os.Getenv("JWT_KEY")

	username, err := ValidateToken(auth, JWTkey)
	if err != nil {
		return nil, err
	}

	var card model.Card
	if err := r.DB.QueryRow(ctx, `
		WITH inserted AS (
			INSERT INTO cards (owner, name, description, color_id, icon_id)
        	SELECT $1, $2, $3, 
            	(SELECT id FROM colors WHERE name = $4),
            	(SELECT id FROM icons WHERE name = $5)
			RETURNING id, name, description, completedDays, color_id, icon_id
		)
		SELECT i.id, i.name, i.description, i.completedDays, c.name, ic.name
		FROM inserted i
		LEFT JOIN colors c ON i.color_id = c.id
		LEFT JOIN icons ic ON i.icon_id = ic.id
	`, username, input.Name, input.Desc, input.Color, input.Icon).Scan(
		&card.ID,
		&card.Name,
		&card.Desc,
		&card.CompletedDays,
		&card.Color,
		&card.Icon,
	); err != nil {
		return nil, err
	}

	return &card, nil
}

// GetCards is the resolver for the getCards field.
func (r *queryResolver) GetCards(ctx context.Context) ([]*model.Card, error) {
	auth := GetAuthToken(ctx)
	JWTkey := os.Getenv("JWT_KEY")

	username, err := ValidateToken(auth, JWTkey)
	if err != nil {
		return nil, err
	}

	var cards []*model.Card
	rows, err := r.DB.Query(ctx, `
		SELECT C.id, C.name, C.description, C.completedDays, COL.name, I.name
		FROM cards C
		LEFT JOIN colors COL ON C.color_id=COL.id
		LEFT JOIN icons I ON C.icon_id=I.id
		WHERE owner = $1
	`, username)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var card model.Card
		if err := rows.Scan(
			&card.ID,
			&card.Name,
			&card.Desc,
			&card.CompletedDays,
			&card.Color,
			&card.Icon,
		); err != nil {
			return nil, err
		}
		cards = append(cards, &card)
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}

	return cards, nil
}

// Mutation returns MutationResolver implementation.
func (r *Resolver) Mutation() MutationResolver { return &mutationResolver{r} }

// Query returns QueryResolver implementation.
func (r *Resolver) Query() QueryResolver { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
