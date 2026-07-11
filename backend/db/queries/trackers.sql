-- name: AddTracker :one
INSERT INTO trackers (owner_id, title, description)
VALUES ($1, $2, sqlc.narg('description'))
RETURNING id, owner_id, title, description;

-- name: EditTracker :one
UPDATE trackers
SET
    title = COALESCE(sqlc.narg('title'), title),
    description = COALESCE(sqlc.narg('description'), description)
WHERE id = $1 AND owner_id = $2
RETURNING id, owner_id, title, description;
