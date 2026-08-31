import csv
import random
from datetime import datetime, timedelta
from pathlib import Path

# Project root
project_root = Path(__file__).resolve().parent.parent

# Output file
output_file = project_root / "01_Dataset" / "events" / "ide_events.csv"

random.seed(44)

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

activity_types = [
    "coding",
    "debugging",
    "file_open",
    "terminal",
    "testing",
    "idle"
]

languages = [
    "Python",
    "JavaScript",
    "TypeScript",
    "SQL",
    "Java"
]

start_time = datetime(2026, 8, 1, 9, 0, 0)

rows = []

for i in range(1000):

    timestamp = start_time + timedelta(
        minutes=random.randint(0, 14 * 24 * 60)
    )

    developer_id = random.choice(developers)
    activity_type = random.choice(activity_types)
    language = random.choice(languages)

    duration_seconds = random.randint(30, 1800)

    rows.append({
        "event_id": f"IDE{i + 1:04d}",
        "timestamp": timestamp.strftime("%Y-%m-%d %H:%M:%S"),
        "developer_id": developer_id,
        "activity_type": activity_type,
        "language": language,
        "duration_seconds": duration_seconds
    })

# Sort chronologically
rows.sort(key=lambda x: x["timestamp"])

with open(output_file, "w", newline="", encoding="utf-8") as file:

    writer = csv.DictWriter(
        file,
        fieldnames=[
            "event_id",
            "timestamp",
            "developer_id",
            "activity_type",
            "language",
            "duration_seconds"
        ]
    )

    writer.writeheader()
    writer.writerows(rows)

print("IDE activity data generated successfully.")
print(f"Total events: {len(rows)}")
print(f"Saved to: {output_file}")