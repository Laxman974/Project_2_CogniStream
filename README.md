# ClickHouse

## Purpose

This folder contains the ClickHouse database objects used in the CogniStream project. It stores developer event data and supports fast analytical queries for flow state and context switching analysis.

## Folder Structure

schema/
- create_database.sql
- github_events.sql
- slack_events.sql
- jira_events.sql
- activitywatch_events.sql

views/
- developer_flow_summary.sql
- context_switch_summary.sql

queries/
- flow_state.sql
- interruption_analysis.sql
- context_switch_tax.sql
- top_developers.sql

## Workflow

1. Create the ClickHouse database.
2. Create tables for each event source.
3. Load event data into ClickHouse.
4. Create analytical views.
5. Run SQL queries for dashboard metrics.

## Data Sources

- GitHub Events
- Slack Events
- Jira Events
- ActivityWatch Events

## Technologies

- ClickHouse
- SQL# Project_2_CogniStream