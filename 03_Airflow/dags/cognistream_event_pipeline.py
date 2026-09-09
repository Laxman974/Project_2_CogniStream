from pathlib import Path
from datetime import datetime

import pandas as pd
import pendulum
import clickhouse_connect
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
            "jira_events.csv",
            "ide_events.csv",
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
    def process_jira_events():
        """Read and validate Jira events."""

        file_path = EVENTS_FOLDER / "jira_events.csv"

        df = pd.read_csv(file_path)

        required_columns = [
            "event_id",
            "timestamp",
            "developer_id",
            "issue_key",
            "issue_type",
            "status",
            "priority",
            "event_type",
        ]

        missing_columns = [
            column
            for column in required_columns
            if column not in df.columns
        ]

        if missing_columns:
            raise ValueError(
                f"Missing Jira columns: {missing_columns}"
            )

        jira_rows = len(df)

        print(f"Jira Records: {jira_rows}")

        return {
            "rows": jira_rows,
            "file": "jira_events.csv",
        }
    
    @task
    def process_ide_events():
        """Read and validate IDE events."""

        file_path = EVENTS_FOLDER / "ide_events.csv"

        df = pd.read_csv(file_path)

        required_columns = [
            "event_id",
            "timestamp",
            "developer_id",
            "activity_type",
            "language",
            "duration_seconds",
        ]

        missing_columns = [
            column
            for column in required_columns
            if column not in df.columns
        ]

        if missing_columns:
            raise ValueError(
                f"Missing IDE columns: {missing_columns}"
            )

        ide_rows = len(df)

        print(f"IDE Records: {ide_rows}")

        return {
            "rows": ide_rows,
            "file": "ide_events.csv",
        }
    
    @task
    def load_to_clickhouse():
        """Load all event CSV files into ClickHouse."""

        client = clickhouse_connect.get_client(
            host="localhost",
            port=8123,
            username="default",
            password="laxman",
            database="cognistream",
        )

        tables = {
            "github_events": "github_events.csv",
            "slack_events": "slack_events.csv",
            "jira_events": "jira_events.csv",
            "ide_events": "ide_events.csv",
        }

        for table_name, file_name in tables.items():
            file_path = EVENTS_FOLDER / file_name

            df = pd.read_csv(file_path)
            df["timestamp"] = pd.to_datetime(df["timestamp"])

            client.command(f"TRUNCATE TABLE {table_name}")

            client.insert(
                table_name,
                df.values.tolist(),
                column_names=df.columns.tolist(),
            )

            print(f"Loaded {len(df)} rows into {table_name}")

        print("All tables loaded successfully.")



    @task
    def send_success_email(
    github_info,
    slack_info,
    jira_info,
    ide_info,
    ):
        """Send daily pipeline report."""

        github_rows = github_info["rows"]
        slack_rows = slack_info["rows"]
        jira_rows = jira_info["rows"]
        ide_rows = ide_info["rows"]

        total_rows = github_rows + slack_rows + jira_rows + ide_rows

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
                <td>Jira Records</td>
                <td>{jira_rows}</td>
            </tr>

            <tr>
                <td>IDE Records</td>
                <td>{ide_rows}</td>
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
                    ✓ slack_events.csv<br>
                    ✓ jira_events.csv<br>
                    ✓ ide_events.csv
                </td>
            </tr>

            <tr>
                <td>Missing Files</td>
                <td>None</td>
            </tr>

            <tr>
                <td>ClickHouse Load</td>
                <td>SUCCESS ✅</td>
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
    jira_info = process_jira_events()
    ide_info = process_ide_events()

    load_task = load_to_clickhouse()

    email_task = send_success_email(
        github_info,
        slack_info,
        jira_info,
        ide_info,
    )

    files_checked >> [
        github_info,
        slack_info,
        jira_info,
        ide_info,
    ]

    [
        github_info,
        slack_info,
        jira_info,
        ide_info,
    ] >> load_task

    load_task >> email_task


# Register the DAG
cognistream_event_pipeline()
