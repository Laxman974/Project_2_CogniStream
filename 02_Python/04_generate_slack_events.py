import csv
import random
from datetime import datetime, timedelta
from pathlib import Path

# Project root
project_root = Path(__file__).resolve().parent.parent

# Output file
output_file = project_root / "01_Dataset" / "events" / "slack_events.csv"

# Reproducible random data
random.seed(43)

developers = [
    "DEV001",
    "DEV002",
    "DEV003",
    "DEV004",
    "DEV005",
    "DEV006",
    "DEV007",
    "DEV008",
    "DEV009",
    "DEV010"
]

channels = [
    "engineering",
    "dev-team",
    "project-cognistream",
    "backend",
    "frontend",
    "data-team"
]

notification_types = [
    "message",
    "mention",
    "ci_cd_alert",
    "code_review_request",
    "deployment_alert"
]

start_time = datetime(2026, 8, 1, 9, 0, 0)

rows = []

for i in range(500):

    timestamp = start_time + timedelta(
        minutes=random.randint(0, 14 * 24 * 60)
    )

    developer_id = random.choice(developers)
    channel = random.choice(channels)
    notification_type = random.choice(notification_types)

    rows.append({
        "event_id": f"SL{i + 1:04d}",
        "timestamp": timestamp.strftime("%Y-%m-%d %H:%M:%S"),
        "developer_id": developer_id,
        "channel": channel,
        "notification_type": notification_type
    })

# Sort chronologically
rows.sort(key=lambda x: x["timestamp"])

# Write CSV
with open(output_file, "w", newline="", encoding="utf-8") as file:

    writer = csv.DictWriter(
        file,
        fieldnames=[
            "event_id",
            "timestamp",
            "developer_id",
            "channel",
            "notification_type"
        ]
    )

    writer.writeheader()
    writer.writerows(rows)

print("Slack event data generated successfully.")
print(f"Total events: {len(rows)}")
print(f"Saved to: {output_file}")