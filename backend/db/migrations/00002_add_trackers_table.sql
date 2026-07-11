-- +goose Up
CREATE TABLE IF NOT EXISTS trackers (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	title TEXT NOT NULL,
	description TEXT,
	UNIQUE(title, owner_id)
);

-- +goose Down
DROP TABLE IF EXISTS trackers;
