import pandas as pd


def calculate_github_metrics(github_df):
    """Calculate GitHub activity per developer."""

    github_metrics = (
        github_df.groupby("developer_id")
        .size()
        .reset_index(name="github_events")
    )

    return github_metrics


def calculate_slack_metrics(slack_df):
    """Calculate Slack activity per developer."""

    slack_metrics = (
        slack_df.groupby("developer_id")
        .size()
        .reset_index(name="slack_events")
    )

    return slack_metrics


def calculate_jira_metrics(jira_df):
    """Calculate Jira activity per developer."""

    jira_metrics = (
        jira_df.groupby("developer_id")
        .size()
        .reset_index(name="jira_events")
    )

    return jira_metrics


def calculate_ide_metrics(ide_df):
    """Calculate IDE coding time per developer."""

    ide_metrics = (
        ide_df.groupby("developer_id")["duration_seconds"]
        .sum()
        .reset_index(name="coding_seconds")
    )

    return ide_metrics