-- +goose Up
CREATE TABLE IF NOT EXISTS Users (
    id UUID PRIMARY KEY DEFAULT uuidv4(),
    name TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
);

-- +goose Down
DROP TABLE IF EXISTS Users;
