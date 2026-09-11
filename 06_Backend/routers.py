from typing import List

from fastapi import APIRouter, HTTPException

from database import get_clickhouse_client

from schemas import (
    DeveloperFlowState,
    FlowSummary,
    ContextSwitchSummary,
    DeveloperFlowSummary,
)


router = APIRouter()


# ---------------------------------------------------------
# GET ALL DEVELOPERS
# ---------------------------------------------------------

@router.get(
    "/developers",
    response_model=List[DeveloperFlowState],
)
def get_developers():

    client = get_clickhouse_client()

    query = """
    SELECT
        developer_id,
        flow_score,
        flow_state
    FROM cognistream.developer_flow_state
    ORDER BY developer_id
    """

    result = client.query(query)

    return result.named_results()


# ---------------------------------------------------------
# GET FLOW SUMMARY
# ---------------------------------------------------------

@router.get(
    "/summary",
    response_model=FlowSummary,
)
def get_summary():

    client = get_clickhouse_client()

    query = """
    SELECT
        count() AS total_developers,
        countIf(flow_state = 'Deep Flow') AS deep_flow,
        countIf(flow_state = 'Focused') AS focused,
        countIf(flow_state = 'Neutral') AS neutral,
        countIf(flow_state = 'Distracted') AS distracted
    FROM cognistream.developer_flow_state
    """

    summary = client.query(query).named_results()[0]

    return summary


# ---------------------------------------------------------
# GET SINGLE DEVELOPER
# ---------------------------------------------------------

@router.get(
    "/developer/{developer_id}",
    response_model=DeveloperFlowState,
)
def get_developer(developer_id: str):

    client = get_clickhouse_client()

    query = """
    SELECT
        developer_id,
        flow_score,
        flow_state
    FROM cognistream.developer_flow_state
    WHERE developer_id = {developer_id:String}
    """

    result = client.query(
        query,
        parameters={
            "developer_id": developer_id
        },
    ).named_results()

    if len(result) == 0:
        raise HTTPException(
            status_code=404,
            detail="Developer not found",
        )

    return result[0]


# ---------------------------------------------------------
# GET CONTEXT SWITCH SUMMARY
# ---------------------------------------------------------

@router.get(
    "/context-switch",
    response_model=List[ContextSwitchSummary],
)
def get_context_switch():

    client = get_clickhouse_client()

    query = """
    SELECT
        developer_id,
        total_notifications
    FROM cognistream.context_switch_summary
    ORDER BY developer_id
    """

    result = client.query(query)

    return result.named_results()


# ---------------------------------------------------------
# GET DEVELOPER FLOW SUMMARY
# ---------------------------------------------------------

@router.get(
    "/flow-summary",
    response_model=List[DeveloperFlowSummary],
)
def get_flow_summary():

    client = get_clickhouse_client()

    query = """
    SELECT
        developer_id,
        total_sessions,
        total_coding_time,
        avg_session_time
    FROM cognistream.developer_flow_summary
    ORDER BY developer_id
    """

    result = client.query(query)

    return result.named_results()