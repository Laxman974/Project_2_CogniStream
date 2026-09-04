from pathlib import Path
from datetime import datetime

import pandas as pd
import pendulum
from airflow.sdk import dag, task
from airflow.utils.email import send_email



# Project Paths


PROJECT_ROOT = Path("/mnt/d/Projects/Project_2_CogniStream")

# Dataset events folder
EVENTS_FOLDER = PROJECT_ROOT / "01_Dataset" / "events"



# DAG Definition


@dag(
    dag_id="cognistream_event_pipeline",
    schedule="0 8 * * *",  # Every day at 8:00 AM IST
    start_date=pendulum.datetime(
        2026,
        8,
        1,
        tz="Asia/Kolkata",
    ),
    catchup=False,
    tags=["cognistream", "developer-analytics"],
)
def cognistream_event_pipeline():

    @task
    def check_event_files():
        """Check whether all required event files are available."""

        required_files = [
            "github_events.csv",
            "slack_events.csv",
        ]

        missing_files = []

        print("Checking CogniStream event files...")

        for filename in required_files:
            file_path = EVENTS_FOLDER / filename

            if file_path.exists():
                print(f"Found: {filename}")
            else:
                missing_files.append(filename)

        if missing_files:
            raise FileNotFoundError(
                f"Missing files: {', '.join(missing_files)}"
            )

        return True


    @task
    def process_github_events():
        """Read and validate GitHub events."""

        file_path = EVENTS_FOLDER / "github_events.csv"

        df = pd.read_csv(file_path)

        required_columns = [
            "event_id",
            "timestamp",
            "developer_id",
            "event_type",
            "repository",
        ]

        missing_columns = [
            column
            for column in required_columns
            if column not in df.columns
        ]

        if missing_columns:
            raise ValueError(
                f"Missing GitHub columns: {missing_columns}"
            )

        github_rows = len(df)

        print(f"GitHub Records: {github_rows}")

        return {
            "rows": github_rows,
            "file": "github_events.csv",
        }


    @task
    def process_slack_events():
        """Read and validate Slack events."""

        file_path = EVENTS_FOLDER / "slack_events.csv"

        df = pd.read_csv(file_path)

        required_columns = [
            "event_id",
            "timestamp",
            "developer_id",
            "channel",
            "notification_type",
        ]

        missing_columns = [
            column
            for column in required_columns
            if column not in df.columns
        ]

        if missing_columns:
            raise ValueError(
                f"Missing Slack columns: {missing_columns}"
            )

        slack_rows = len(df)

        print(f"Slack Records: {slack_rows}")

        return {
            "rows": slack_rows,
            "file": "slack_events.csv",
        }


    @task
    def send_success_email(github_info, slack_info):
        """Send daily pipeline report."""

        github_rows = github_info["rows"]
        slack_rows = slack_info["rows"]

        total_rows = github_rows + slack_rows

        execution_time = datetime.now().strftime(
            "%d-%m-%Y %I:%M:%S %p"
        )

        subject = "CogniStream Daily Report"

        html_content = f"""
        <h2>CogniStream Daily Report</h2>

        <p><b>Pipeline Status:</b> SUCCESS ✅</p>

        <table border="1" cellpadding="8" cellspacing="0">

            <tr>
                <th align="left">Metric</th>
                <th align="left">Value</th>
            </tr>

            <tr>
                <td>GitHub Records</td>
                <td>{github_rows}</td>
            </tr>

            <tr>
                <td>Slack Records</td>
                <td>{slack_rows}</td>
            </tr>

            <tr>
                <td><b>Total Records</b></td>
                <td><b>{total_rows}</b></td>
            </tr>

            <tr>
                <td>Execution Time</td>
                <td>{execution_time}</td>
            </tr>

            <tr>
                <td>Processed Files</td>
                <td>
                    ✓ github_events.csv<br>
                    ✓ slack_events.csv
                </td>
            </tr>

            <tr>
                <td>Missing Files</td>
                <td>None</td>
            </tr>

            <tr>
                <td>Server</td>
                <td>Apache Airflow</td>
            </tr>

        </table>

        <br>

        <p>
        Regards,<br>
        <b>CogniStream Pipeline</b>
        </p>
        """

        send_email(
            to="cognistream.analytics@gmail.com",
            subject=subject,
            html_content=html_content,
        )

        print("Daily report email sent successfully.")


    
    # Task Dependencies
    
    files_checked = check_event_files()

    github_info = process_github_events()

    slack_info = process_slack_events()

    email_task = send_success_email(
        github_info,
        slack_info,
    )

    files_checked >> [github_info, slack_info]

    [github_info, slack_info] >> email_task


# Register the DAG
cognistream_event_pipeline()
