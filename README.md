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
# Project 2 – CogniStream

## 📌 Project Overview

**CogniStream** is a data engineering and analytics project designed to collect, process, and organize developer productivity and activity data from multiple sources.

The project focuses on building a structured event-data pipeline using developer productivity data and simulated events from platforms such as GitHub, Slack, IDE activity, and Jira.

The project is being developed in multiple stages, including data exploration, data cleaning, event generation, workflow orchestration, data storage, backend processing, frontend development, and dashboard creation.

---

## 🎯 Project Objectives

* Explore and understand developer productivity data.
* Clean and prepare raw datasets for further processing.
* Generate structured developer activity events.
* Organize events from multiple sources such as GitHub, Slack, IDE, and Jira.
* Build an automated data pipeline.
* Store processed event data in a scalable database.
* Develop backend and frontend components.
* Create dashboards for analysing developer productivity and activity.
* Build a complete end-to-end data engineering and analytics workflow.

---

## 🏗️ Project Structure

```text
Project_2_CogniStream/
│
├── 01_Dataset/
│   ├── ai_dev_productivity.csv
│   ├── cleaned_ai_dev_productivity.csv
│   └── events/
│       ├── github_events.csv
│       ├── ide_events.csv
│       ├── jira_events.csv
│       └── slack_events.csv
│
├── 02_Python/
│   ├── 01_dataset_exploration.py
│   ├── 02_data_cleaning.py
│   ├── 03_generate_github_events.py
│   ├── 04_generate_slack_events.py
│   ├── 05_generate_ide_events.py
│   └── 06_generate_jira_events.py
│
├── 03_Airflow/
│   └── dags/
│       └── cognistream_event_pipeline.py
│
├── 04_ClickHouse/
│   ├── sql/
│   │   └── 01_create_tables.sql
│   └── scripts/
│       └── 02_load_data.py
│
├── 05_Flow_State/
│
├── 06_Backend/
│
├── 07_Frontend/
│
├── 08_Dashboard/
│
├── .gitignore
└── README.md
```

> The project is being developed incrementally. Some modules are currently under development.

---

# ✅ Completed Work

## 1. Dataset Collection and Preparation

The initial AI developer productivity dataset was added to the project.

### Dataset

```text
01_Dataset/
├── ai_dev_productivity.csv
└── cleaned_ai_dev_productivity.csv
```

The project also contains generated event datasets:

```text
01_Dataset/events/
├── github_events.csv
├── ide_events.csv
├── jira_events.csv
└── slack_events.csv
```

---

## 2. Dataset Exploration

Initial exploratory data analysis was performed using Python.

File:

```text
02_Python/01_dataset_exploration.py
```

The exploration included:

* Loading the dataset.
* Inspecting dataset structure.
* Checking columns and data types.
* Examining missing values.
* Understanding the data distribution.
* Performing initial statistical exploration.

---

## 3. Data Cleaning

A separate Python script was created for data cleaning.

File:

```text
02_Python/02_data_cleaning.py
```

The cleaning stage prepares the raw productivity dataset for further processing and analysis.

---

## 4. GitHub Event Generation

GitHub developer activity events were generated and stored as a structured CSV dataset.

File:

```text
02_Python/03_generate_github_events.py
```

Output:

```text
01_Dataset/events/github_events.csv
```

---

## 5. Slack Event Generation

Slack activity events were generated to simulate developer communication and collaboration activity.

File:

```text
02_Python/04_generate_slack_events.py
```

Output:

```text
01_Dataset/events/slack_events.csv
```

Example event fields include:

```text
event_id
timestamp
developer_id
channel
notification_type
```

---

## 6. IDE Event Generation

IDE activity events were generated to represent developer coding activities.

File:

```text
02_Python/05_generate_ide_events.py
```

Output:

```text
01_Dataset/events/ide_events.csv
```

Example event fields include:

```text
event_id
timestamp
developer_id
activity_type
language
duration_seconds
```

---

## 7. Jira Event Generation

Jira project-management events were generated to represent issue-related developer activity.

File:

```text
02_Python/06_generate_jira_events.py
```

Output:

```text
01_Dataset/events/jira_events.csv
```

Example event fields include:

```text
event_id
timestamp
developer_id
issue_key
issue_type
status
priority
event_type
```

---

# 🔄 Airflow Pipeline

An Apache Airflow DAG was added for the CogniStream event pipeline.

File:

```text
03_Airflow/dags/cognistream_event_pipeline.py
```

The Airflow component is intended to help orchestrate the project data pipeline and automate the processing workflow.

---

# 🗄️ ClickHouse

The ClickHouse component is currently under development.

Planned responsibilities include:

* Creating analytical tables.
* Loading event datasets.
* Storing processed event data.
* Running analytical queries.
* Preparing data for downstream analytics and dashboards.

Current structure:

```text
04_ClickHouse/
├── sql/
│   └── 01_create_tables.sql
│
└── scripts/
    └── 02_load_data.py
```

Python ClickHouse connectivity has also been prepared using:

```text
clickhouse-connect
```

---

# 🚧 Upcoming Modules

The following components are planned/in progress:

### 05 – Flow State

Responsible for handling and managing event/data flow state.

### 06 – Backend

Planned backend services and APIs for processing and serving project data.

### 07 – Frontend

Planned user interface for interacting with the CogniStream system.

### 08 – Dashboard

Planned analytics dashboard for visualizing developer productivity and event-based insights.

---

# 🛠️ Technologies

The project currently uses or is planned to use:

* **Python**
* **Pandas**
* **NumPy**
* **Apache Airflow**
* **ClickHouse**
* **SQL**
* **Git**
* **GitHub**
* **Docker**
* **Frontend technologies**
* **Backend technologies**
* **Data visualization / Dashboard tools**

---

# 📊 Data Sources

CogniStream currently works with simulated/structured event data representing:

| Source | Event Type                            |
| ------ | ------------------------------------- |
| GitHub | Developer repository/activity events  |
| Slack  | Communication and notification events |
| IDE    | Coding and development activity       |
| Jira   | Issue and project-management events   |

---

# 🔁 Data Pipeline

The overall planned workflow is:

```text
Raw Productivity Data
        │
        ▼
Data Exploration
        │
        ▼
Data Cleaning
        │
        ▼
Event Generation
        │
        ├── GitHub Events
        ├── Slack Events
        ├── IDE Events
        └── Jira Events
        │
        ▼
Apache Airflow
        │
        ▼
ClickHouse
        │
        ▼
Backend
        │
        ▼
Frontend
        │
        ▼
Dashboard
```

---

# 📁 Current Development Status

| Module          | Status                             |
| --------------- | ---------------------------------- |
| 01 – Dataset    | ✅ Completed                        |
| 02 – Python     | ✅ Completed                        |
| 03 – Airflow    | ✅ Initial implementation completed |
| 04 – ClickHouse | 🔄 In Progress                     |
| 05 – Flow State | ⏳ Upcoming                         |
| 06 – Backend    | ⏳ Upcoming                         |
| 07 – Frontend   | ⏳ Upcoming                         |
| 08 – Dashboard  | ⏳ Upcoming                         |

---

# 💻 Environment Setup

A Python virtual environment is used for the project.

```text
.venv/
```

The following ClickHouse Python connector has been installed:

```text
clickhouse-connect
```

The virtual environment and other local development files are excluded from version control where appropriate through `.gitignore`.

---

# 🚀 Future Goal

The final goal of CogniStream is to build an end-to-end developer productivity analytics platform that can:

1. Collect developer activity data.
2. Generate and process event streams.
3. Orchestrate data processing workflows.
4. Store analytical data efficiently.
5. Process and serve data through a backend.
6. Provide a frontend interface.
7. Visualize productivity and activity metrics through dashboards.

---

# 👩‍💻 Project Status

**Project:** Project 2 – CogniStream

**Current Phase:** Data Pipeline & ClickHouse Development

**Branch:** `sahla-sharin`

**Repository:** `Project_2_CogniStream`

The project is being developed incrementally, with each module being implemented and committed as development progresses.
