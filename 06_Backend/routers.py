from typing import List

from fastapi import APIRouter, HTTPException

from database import get_clickhouse_client
from schemas import (
    DeveloperFlowState,
    FlowSummary,
)

router = APIRouter()


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
    FROM developer_flow_state
    ORDER BY developer_id
    """

    result = client.query(query)

    return result.named_results()


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
    FROM developer_flow_state
    """

    summary = client.query(query).named_results()[0]

    return summary


@router.get(
    "/developer/{developer_id}",
    response_model=DeveloperFlowState,
)
def get_developer(developer_id: str):

    client = get_clickhouse_client()

    query = f"""
    SELECT
        developer_id,
        flow_score,
        flow_state
    FROM developer_flow_state
    WHERE developer_id = '{developer_id}'
    """

    result = client.query(query).named_results()

    if len(result) == 0:
        raise HTTPException(
            status_code=404,
            detail="Developer not found",
        )

    return result[0]