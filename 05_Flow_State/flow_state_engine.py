import pandas as pd
import clickhouse_connect

from config import (
    CLICKHOUSE_HOST,
    CLICKHOUSE_PORT,
    CLICKHOUSE_USER,
    CLICKHOUSE_PASSWORD,
    CLICKHOUSE_DATABASE,
)

from metrics import (
    calculate_github_metrics,
    calculate_slack_metrics,
    calculate_jira_metrics,
    calculate_ide_metrics,
)

from scoring import calculate_flow_scores
from classifier import classify_flow_state
from storage import save_flow_states


def connect_clickhouse():
    """Create ClickHouse connection."""

    client = clickhouse_connect.get_client(
        host=CLICKHOUSE_HOST,
        port=CLICKHOUSE_PORT,
        username=CLICKHOUSE_USER,
        password=CLICKHOUSE_PASSWORD,
        database=CLICKHOUSE_DATABASE,
    )

    return client


def load_event_tables(client):
    """Load all event tables."""

    github_df = client.query_df(
        "SELECT * FROM github_events"
    )

    slack_df = client.query_df(
        "SELECT * FROM slack_events"
    )

    jira_df = client.query_df(
        "SELECT * FROM jira_events"
    )

    ide_df = client.query_df(
        "SELECT * FROM ide_events"
    )

    return (
        github_df,
        slack_df,
        jira_df,
        ide_df,
    )


def main():

    print("=" * 50)
    print("CogniStream Flow State Engine")
    print("=" * 50)

    print("\nConnecting to ClickHouse...")

    client = connect_clickhouse()

    print("Connection Successful.\n")

    (
        github_df,
        slack_df,
        jira_df,
        ide_df,
    ) = load_event_tables(client)

    print("Event Summary")
    print("-" * 50)

    print(f"GitHub Events : {len(github_df)}")
    print(f"Slack Events  : {len(slack_df)}")
    print(f"Jira Events   : {len(jira_df)}")
    print(f"IDE Events    : {len(ide_df)}")

    github_metrics = calculate_github_metrics(
        github_df
    )

    slack_metrics = calculate_slack_metrics(
        slack_df
    )

    jira_metrics = calculate_jira_metrics(
        jira_df
    )

    ide_metrics = calculate_ide_metrics(
        ide_df
    )

    print("\nGitHub Metrics")
    print("-" * 50)
    print(github_metrics)

    print("\nSlack Metrics")
    print("-" * 50)
    print(slack_metrics)

    print("\nJira Metrics")
    print("-" * 50)
    print(jira_metrics)

    print("\nIDE Metrics")
    print("-" * 50)
    print(ide_metrics)

    flow_scores = calculate_flow_scores(
        github_metrics,
        slack_metrics,
        jira_metrics,
        ide_metrics,
    )

    print("\nFlow Scores")
    print("-" * 50)
    print(flow_scores)

    flow_states = classify_flow_state(
        flow_scores
    )

    print("\nDeveloper Flow States")
    print("-" * 50)
    print(flow_states)

    save_flow_states(
    flow_states,
    )

    #print("\nFlow states saved to ClickHouse.")

    print("\nFlow State Engine Ready.")


if __name__ == "__main__":
    main()