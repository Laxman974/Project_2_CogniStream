from pathlib import Path

import pandas as pd
import pendulum
from airflow.sdk import dag, task


# WSL/Linux project path
PROJECT_ROOT = Path("/mnt/d/Projects/Project_2_CogniStream")

# Dataset events folder
EVENTS_FOLDER = PROJECT_ROOT / "01_Dataset" / "events"


@dag(
    dag_id="cognistream_event_pipeline",
    schedule="@daily",
    start_date=pendulum.datetime(2026, 8, 1, tz="Asia/Kolkata"),
    catchup=False,
    tags=["cognistream", "developer-analytics"],
)
def cognistream_event_pipeline():

    @task
    def check_event_files():
        """Check whether all event files are available."""

        required_files = [
            "github_events.csv",
            "slack_events.csv",
        ]

        print("Checking CogniStream event files...")

        for filename in required_files:
            file_path = EVENTS_FOLDER / filename

            if not file_path.exists():
                raise FileNotFoundError(
                    f"Required event file not found: {file_path}"
                )

            print(f"Found: {filename}")

        return True


    @task
    def process_github_events():
        """Read and validate GitHub events."""

        file_path = EVENTS_FOLDER / "github_events.csv"
        df = pd.read_csv(file_path)

        print("GitHub Events")
        print(f"Rows: {len(df)}")
        print(f"Columns: {list(df.columns)}")

        required_columns = [
            "event_id",
            "timestamp",
            "developer_id",
            "event_type",
            "repository",
        ]

        missing_columns = [
            column for column in required_columns
            if column not in df.columns
        ]

        if missing_columns:
            raise ValueError(
                f"Missing GitHub columns: {missing_columns}"
            )

        return len(df)


    @task
    def process_slack_events():
        """Read and validate Slack events."""

        file_path = EVENTS_FOLDER / "slack_events.csv"
        df = pd.read_csv(file_path)

        print("Slack Events")
        print(f"Rows: {len(df)}")
        print(f"Columns: {list(df.columns)}")

        required_columns = [
            "event_id",
            "timestamp",
            "developer_id",
            "channel",
            "notification_type",
        ]

        missing_columns = [
            column for column in required_columns
            if column not in df.columns
        ]

        if missing_columns:
            raise ValueError(
                f"Missing Slack columns: {missing_columns}"
            )

        return len(df)


    # Define task dependencies
    files_checked = check_event_files()

    github_count = process_github_events()
    slack_count = process_slack_events()

    files_checked >> [github_count, slack_count]


# Create and register the DAG
cognistream_event_pipeline()