USE cognistream;

SELECT
    notification_type,
    count(*) AS total_notifications
FROM slack_events
GROUP BY notification_type
ORDER BY total_notifications DESC;