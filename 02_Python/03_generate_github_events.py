import csv
import random
from datetime import datetime, timedelta
from pathlib import Path

project_root = Path(__file__).resolve().parent.parent

output_file = project_root / "01_Dataset" / "events" / "github_events.csv"

random.seed(42)

developers = [f"DEV{i:03d}" for i in range(1, 501)]

repositories = [
    "cognistream-api",
    "cognistream-dashboard",
    "data-pipeline",
    "analytics-service",
    "developer-tools"
]

event_types = [
    "commit",
    "pull_request",
    "code_review",
    "issue_created",
    "issue_closed"
]

start_time = datetime(2026, 8, 1, 9, 0, 0)

rows = []

total_events = 5000

for i in range(total_events):
    timestamp = start_time + timedelta(
        minutes=random.randint(0, 14 * 24 * 60)
    )

    developer_id = random.choice(developers)
    event_type = random.choice(event_types)
    repository = random.choice(repositories)

    rows.append({
        "event_id": f"GH{i + 1:05d}",
        "timestamp": timestamp.strftime("%Y-%m-%d %H:%M:%S"),
        "developer_id": developer_id,
        "event_type": event_type,
        "repository": repository
    })

rows.sort(key=lambda x: x["timestamp"])

with open(output_file, "w", newline="", encoding="utf-8") as file:
    writer = csv.DictWriter(
        file,
        fieldnames=[
            "event_id",
            "timestamp",
            "developer_id",
            "event_type",
            "repository"
        ]
    )

    writer.writeheader()
    writer.writerows(rows)

print("GitHub event data generated successfully.")
print(f"Total developers: {len(developers)}")
print(f"Total events: {len(rows)}")
print(f"Saved to: {output_file}")