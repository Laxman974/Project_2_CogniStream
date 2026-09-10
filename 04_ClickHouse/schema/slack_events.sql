CREATE TABLE IF NOT EXISTS cognistream.slack_events
(
    event_id String,
    timestamp DateTime,
    developer_id String,
    channel String,
    notification_type String
)
ENGINE = MergeTree
ORDER BY (timestamp, developer_id);