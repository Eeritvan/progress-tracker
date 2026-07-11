-- name: AddTracker :one
INSERT INTO trackers (owner_id, title, description)
VALUES ($1, $2, sqlc.narg('description'))
RETURNING id, owner_id, title, description;
