-- +goose Up
-- SELECT 'up SQL query';
CREATE TABLE IF NOT EXISTS Users (
    id UUID PRIMARY KEY DEFAULT uuidv4(),
    name TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
);

-- +goose Down
SELECT 'down SQL query';
