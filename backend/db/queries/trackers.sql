-- name: GetTracker :many
SELECT
  t.id,
  t.owner_id,
  t.title,
  t.description,
  COALESCE(
    array_agg(tc.completed_on ORDER BY tc.completed_on)
      FILTER (WHERE tc.completed_on IS NOT NULL),
    ARRAY[]::date[]
  ) AS completed_days
FROM trackers t
LEFT JOIN tracker_completions tc
  ON tc.tracker_id = t.id
WHERE t.owner_id = $1
GROUP BY t.id, t.owner_id, t.title, t.description;

-- name: AddTracker :one
INSERT INTO trackers (owner_id, title, description)
VALUES ($1, $2, sqlc.narg('description'))
RETURNING id, owner_id, title, description;

-- name: EditTracker :one
UPDATE trackers
SET
    title = COALESCE(sqlc.narg('title'), title),
    description = COALESCE(sqlc.narg('description'), description)
WHERE id = $1
  AND owner_id = $2
RETURNING id, owner_id, title, description;

-- name: DeleteTracker :exec
DELETE FROM trackers
WHERE id = $1
  AND owner_id = $2;
