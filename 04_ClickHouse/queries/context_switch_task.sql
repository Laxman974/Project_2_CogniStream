USE cognistream;

SELECT
    developer_id,
    github_events,
    slack_events,
    jira_events,
    (github_events + slack_events + jira_events) AS total_context_switches
FROM
(
    SELECT
        developer_id,
        countIf(source = 'GitHub') AS github_events,
        countIf(source = 'Slack') AS slack_events,
        countIf(source = 'Jira') AS jira_events
    FROM
    (
        SELECT developer_id, 'GitHub' AS source FROM github_events
        UNION ALL
        SELECT developer_id, 'Slack' AS source FROM slack_events
        UNION ALL
        SELECT developer_id, 'Jira' AS source FROM jira_events
    )
    GROUP BY developer_id
)
ORDER BY total_context_switches DESC;