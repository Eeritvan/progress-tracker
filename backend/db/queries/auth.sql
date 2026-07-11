-- name: Login :one
SELECT id, name, password_hash
FROM users
WHERE name = $1;

-- name: Signup :one
INSERT INTO users (name, password_hash)
VALUES ($1, $2)
RETURNING id, name;
