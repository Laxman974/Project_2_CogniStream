USE cognistream;

CREATE OR REPLACE VIEW developer_flow_summary AS
SELECT
    developer_id,
    count() AS total_sessions,
    sum(duration_seconds) AS total_coding_time,
    avg(duration_seconds) AS avg_session_time
FROM ide_events
GROUP BY developer_id;