USE cognistream;

SELECT
    developer_id,
    sum(duration_seconds) AS total_coding_seconds,
    round(sum(duration_seconds) / 60, 2) AS total_minutes
FROM ide_events
WHERE activity_type = 'coding'
GROUP BY developer_id
ORDER BY total_coding_seconds DESC;