-- name: Login :one
SELECT id, name, password_hash
FROM Users
WHERE name = $1;


-- name: Signup :many
INSERT INTO Users (name, password_hash)
VALUES ($1, $2)
RETURNING id, name;
