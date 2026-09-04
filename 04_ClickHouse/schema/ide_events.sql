CREATE TABLE IF NOT EXISTS cognistream.ide_events
(
    event_id String,
    timestamp DateTime,
    developer_id String,
    activity_type String,
    language String,
    duration_seconds UInt32
)
ENGINE = MergeTree
ORDER BY (timestamp, developer_id);