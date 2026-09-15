PROJECT_2_CogniStream

Objective

Develop an end-to-end Developer Flow State Analytics system that collects developer activity events from GitHub, Slack, Jira, and IDE sources, processes the data using Python and Apache Airflow, stores it in ClickHouse, calculates developer flow scores and flow states, and provides analytics through a FastAPI backend and React dashboard.

Datasets

GitHub Events
Slack Events
Jira Events
IDE Events

Technologies Used

Python
Pandas
Apache Airflow
ClickHouse
FastAPI
React
Vite
Axios
SQL
GitHub

Project Structure

01_Dataset

Contains the event datasets and generated developer activity data.

02_Python

Contains Python scripts for dataset exploration, cleaning, and event generation.

03_Airflow

Contains the Apache Airflow DAG used to automate the event processing and ClickHouse loading pipeline.

04_ClickHouse

Contains ClickHouse database schema, analytical views, and SQL queries.

05_Flow_State

Contains the Flow State Engine used to calculate developer metrics, flow scores, and flow states.

06_Backend

Contains the FastAPI backend and REST API implementation.

07_Frontend

Contains the React and Vite dashboard used to visualize project analytics.

08_Screenshots

Contains screenshots of the completed pipeline, database, Flow State Engine, API, and dashboard.

Python Files

01_dataset_exploration.py
02_data_cleaning.py
03_generate_github_events.py
04_generate_slack_events.py
05_generate_ide_events.py
06_generate_jira_events.py

Data Generation

500 Developers
5,000 GitHub Events
5,000 Slack Events
5,000 Jira Events
10,000 IDE Events
25,000 Total Events

Airflow

DAG Name

cognistream_event_pipeline.py

Airflow Workflow

Check event files.
Process GitHub events.
Process Slack events.
Process Jira events.
Process IDE events.
Load processed event data into ClickHouse.
Send success notification.

ClickHouse

Purpose

ClickHouse is used as the analytical database for storing developer event data and processed flow-state results.

Data Sources

GitHub Events
Slack Events
Jira Events
IDE Events

Analytical Views

developer_flow_summary
context_switch_summary

SQL Analysis

Flow State Analysis
Interruption Analysis
Context Switch Analysis
Top Developer Analysis

Flow State Engine

Purpose

The Flow State Engine processes developer activity data and calculates developer metrics, flow scores, and flow states.

Folder Structure

classifier.py
config.py
flow_state_engine.py
metrics.py
scoring.py
storage.py

Flow State Workflow

Connect to ClickHouse.
Load GitHub, Slack, Jira, and IDE event data.
Calculate developer-level metrics.
Calculate flow scores.
Classify developers into flow states.
Store the calculated results in ClickHouse.

Flow States

Deep Flow
Focused
Neutral
Distracted
Burnout Risk

Flow State Results

500 Developer Flow States Generated
Average Flow Score: 50.16
Minimum Flow Score: 25.50
Maximum Flow Score: 69.39
Neutral: 140 Developers
Distracted: 313 Developers
Burnout Risk: 47 Developers
Deep Flow: 0 Developers
Focused: 0 Developers

Backend

Purpose

The FastAPI backend provides REST APIs for accessing developer flow state, summary, context switching, and coding activity data.

Folder Structure

database.py
main.py
routers.py
schemas.py

API Endpoints

GET /
GET /health
GET /developers
GET /summary
GET /developer/{developer_id}
GET /context-switch
GET /flow-summary

Backend Features

Developer Flow State API
Flow Score API
Flow Summary API
Context Switching API
Coding Activity API
Developer Details API
ClickHouse Integration

Frontend

Purpose

The React frontend provides an interactive dashboard for visualizing developer flow state analytics.

Technologies

React
Vite
Axios

Dashboard Features

Total Developers
Average Flow Score
Flow State Distribution
Developer Flow State Table
Context Switching Analysis
Coding Activity Analysis
Developer Summary
Top Flow Scores
Total Notifications
Total Coding Time
Total Sessions
Interactive Dashboard Views

Project Statistics

Total Developers: 500
Total Events: 25,000
GitHub Events: 5,000
Slack Events: 5,000
Jira Events: 5,000
IDE Events: 10,000
Developer Flow States: 500
Total Sessions: 10,000
Total Notifications: 5,000
Total Coding Time: Approximately 2,550 Hours

Screenshots

The 08_Screenshots folder contains screenshots of the completed CogniStream project.

Screenshot Files

airflow_pipeline.png
clickhouse_data.png
cognistream_dashboard1.png
cognistream_dashboard2.png
cognistream_dashboard3.png
fastapi_swagger.png
flow_score_summary.png
flow_state_events.png
flow_state_output.png
flow_state_output1.png

End-to-End Project Workflow

Generate developer activity events using Python.
Store the generated events in the dataset folder.
Use Apache Airflow to automate event processing.
Load the processed events into ClickHouse.
Calculate developer metrics using the Flow State Engine.
Calculate flow scores and classify developer flow states.
Store the results in ClickHouse.
Expose analytics through FastAPI REST APIs.
Connect the React frontend with the FastAPI backend.
Visualize developer flow state and activity analytics through the dashboard.

Week 1

Project setup
Dataset preparation
Python development
Event data generation
Initial data processing
GitHub repository setup

Week 2

Apache Airflow setup
Airflow DAG development
Event file validation
Event processing workflow
ClickHouse integration
Database and table setup

Week 3

ClickHouse event loading
Analytical views
SQL analysis
Flow State Engine development
Developer metric calculation
Flow score calculation
Flow state classification
ClickHouse result storage

Week 4

Scaled dataset to 500 developers and 25,000 events.
Completed Flow State Engine execution.
Developed FastAPI backend APIs.
Connected React frontend with the backend.
Developed the CogniStream analytics dashboard.
Added developer flow state, flow score, context switching, and coding activity analysis.
Added dashboard statistics and visualizations.
Added project screenshots.
Updated documentation and GitHub repository.

Project Outcome

The CogniStream project successfully implements an end-to-end Developer Flow State Analytics pipeline. The project processes 25,000 developer activity events from GitHub, Slack, Jira, and IDE sources for 500 developers. Apache Airflow automates the data pipeline, ClickHouse provides analytical data storage, the Flow State Engine calculates developer flow metrics and states, FastAPI provides REST APIs, and the React dashboard presents the final analytics in an interactive format.