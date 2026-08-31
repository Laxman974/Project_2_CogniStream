import csv
import random
from datetime import datetime, timedelta
from pathlib import Path

# Project root
project_root = Path(__file__).resolve().parent.parent

# Output file
output_file = project_root / "01_Dataset" / "events" / "jira_events.csv"

random.seed(44)

developers = [
    "DEV001", "DEV002", "DEV003", "DEV004", "DEV005",
    "DEV006", "DEV007", "DEV008", "DEV009", "DEV010"
]

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

for i in range(500):

    timestamp = start_time + timedelta(
        minutes=random.randint(0, 14 * 24 * 60)
    )

    developer_id = random.choice(developers)
    project = random.choice(projects)

    rows.append({
        "event_id": f"JR{i + 1:04d}",
        "timestamp": timestamp.strftime("%Y-%m-%d %H:%M:%S"),
        "developer_id": developer_id,
        "issue_key": f"{project}-{random.randint(100, 999)}",
        "issue_type": random.choice(issue_types),
        "status": random.choice(statuses),
        "priority": random.choice(priorities),
        "event_type": random.choice(event_types)
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
print(f"Total events: {len(rows)}")
print(f"Saved to: {output_file}")