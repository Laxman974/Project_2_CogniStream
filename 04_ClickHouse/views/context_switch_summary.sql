USE cognistream;

CREATE OR REPLACE VIEW context_switch_summary AS
SELECT
    developer_id,
    count() AS total_notifications
FROM slack_events
GROUP BY developer_id;