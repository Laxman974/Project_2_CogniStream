from pydantic import BaseModel


class DeveloperFlowState(BaseModel):
    developer_id: str
    flow_score: float
    flow_state: str


class FlowSummary(BaseModel):
    total_developers: int
    deep_flow: int
    focused: int
    neutral: int
    distracted: int