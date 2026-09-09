USE cognistream;

SELECT
    developer_id,
    count(*) AS total_commits
FROM github_events
WHERE event_type = 'commit'
GROUP BY developer_id
ORDER BY total_commits DESC
LIMIT 10;