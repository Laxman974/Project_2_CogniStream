CREATE TABLE IF NOT EXISTS cognistream.github_events
(
    event_id String,
    timestamp DateTime,
    developer_id String,
    event_type String,
    repository String
)
ENGINE = MergeTree
ORDER BY (timestamp, developer_id);