CREATE TABLE IF NOT EXISTS cognistream.jira_events
(
    event_id String,
    timestamp DateTime,
    developer_id String,
    issue_key String,
    issue_type String,
    status String,
    priority String,
    event_type String
)
ENGINE = MergeTree
ORDER BY (timestamp, developer_id);