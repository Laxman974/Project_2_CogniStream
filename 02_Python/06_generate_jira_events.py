import csv
import random
from datetime import datetime, timedelta
from pathlib import Path

project_root = Path(__file__).resolve().parent.parent

output_file = project_root / "01_Dataset" / "events" / "jira_events.csv"

random.seed(45)

developers = [f"DEV{i:03d}" for i in range(1, 501)]

projects = [
    "COGNI",
    "DATA",
    "DEVOPS"
]

issue_types = [
    "Task",
    "Bug",
    "Story",
    "Improvement"
]

statuses = [
    "To Do",
    "In Progress",
    "Code Review",
    "Testing",
    "Done"
]

priorities = [
    "Low",
    "Medium",
    "High",
    "Critical"
]

event_types = [
    "issue_created",
    "status_changed",
    "issue_assigned",
    "comment_added",
    "issue_updated"
]

start_time = datetime(2026, 8, 1, 9, 0, 0)

rows = []

total_events = 5000

for i in range(total_events):
    timestamp = start_time + timedelta(
        minutes=random.randint(0, 14 * 24 * 60)
    )

    developer_id = random.choice(developers)
    project = random.choice(projects)

    rows.append({
        "event_id": f"JR{i + 1:05d}",
        "timestamp": timestamp.strftime("%Y-%m-%d %H:%M:%S"),
        "developer_id": developer_id,
        "issue_key": f"{project}-{random.randint(100, 9999)}",
        "issue_type": random.choice(issue_types),
        "status": random.choice(statuses),
        "priority": random.choice(priorities),
        "event_type": random.choice(event_types)
    })

rows.sort(key=lambda x: x["timestamp"])

with open(output_file, "w", newline="", encoding="utf-8") as file:
    writer = csv.DictWriter(
        file,
        fieldnames=[
            "event_id",
            "timestamp",
            "developer_id",
            "issue_key",
            "issue_type",
            "status",
            "priority",
            "event_type"
        ]
    )

    writer.writeheader()
    writer.writerows(rows)

print("Jira event data generated successfully.")
print(f"Total developers: {len(developers)}")
print(f"Total events: {len(rows)}")
print(f"Saved to: {output_file}")