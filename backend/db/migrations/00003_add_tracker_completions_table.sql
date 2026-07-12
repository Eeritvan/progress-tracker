-- +goose Up
CREATE TABLE IF NOT EXISTS tracker_completions (
    tracker_id UUID NOT NULL REFERENCES trackers(id) ON DELETE CASCADE,
    completed_on DATE NOT NULL,
    PRIMARY KEY (tracker_id, completed_on)
);

-- +goose Down
DROP TABLE IF EXISTS tracker_completions;