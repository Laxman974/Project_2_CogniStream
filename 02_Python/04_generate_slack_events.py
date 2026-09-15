import csv
import random
from datetime import datetime, timedelta
from pathlib import Path

project_root = Path(__file__).resolve().parent.parent

output_file = project_root / "01_Dataset" / "events" / "slack_events.csv"

random.seed(43)

developers = [f"DEV{i:03d}" for i in range(1, 501)]

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

total_events = 5000

for i in range(total_events):
    timestamp = start_time + timedelta(
        minutes=random.randint(0, 14 * 24 * 60)
    )

    developer_id = random.choice(developers)
    channel = random.choice(channels)
    notification_type = random.choice(notification_types)

    rows.append({
        "event_id": f"SL{i + 1:05d}",
        "timestamp": timestamp.strftime("%Y-%m-%d %H:%M:%S"),
        "developer_id": developer_id,
        "channel": channel,
        "notification_type": notification_type
    })

rows.sort(key=lambda x: x["timestamp"])

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
print(f"Total developers: {len(developers)}")
print(f"Total events: {len(rows)}")
print(f"Saved to: {output_file}")