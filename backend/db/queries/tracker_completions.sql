-- name: AddTrackerCompletion :exec
INSERT INTO tracker_completions (tracker_id, completed_on)
VALUES ($1, $2);

-- name: DeleteTrackerCompletion :exec
DELETE FROM tracker_completions
WHERE tracker_id = $1
  AND completed_on = $2;
