import pandas as pd


def calculate_flow_scores(
    github_metrics,
    slack_metrics,
    jira_metrics,
    ide_metrics,
):
    """Calculate Flow State Score for each developer."""

    # Merge all metrics
    scores = github_metrics.merge(
        slack_metrics,
        on="developer_id",
    )

    scores = scores.merge(
        jira_metrics,
        on="developer_id",
    )

    scores = scores.merge(
        ide_metrics,
        on="developer_id",
    )

    # Normalize each metric (0-1)

    scores["github_score"] = (
        scores["github_events"]
        / scores["github_events"].max()
    )

    scores["slack_score"] = (
        1
        - (
            scores["slack_events"]
            / scores["slack_events"].max()
        )
    )

    scores["jira_score"] = (
        scores["jira_events"]
        / scores["jira_events"].max()
    )

    scores["ide_score"] = (
        scores["coding_seconds"]
        / scores["coding_seconds"].max()
    )

    # Final Flow Score

    scores["flow_score"] = (
        (
            scores["github_score"] * 0.30
            + scores["jira_score"] * 0.25
            + scores["ide_score"] * 0.35
            + scores["slack_score"] * 0.10
        )
        * 100
    ).round(2)

    return scores[
        [
            "developer_id",
            "flow_score",
        ]
    ]