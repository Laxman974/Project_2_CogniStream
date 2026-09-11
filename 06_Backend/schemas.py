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


class ContextSwitchSummary(BaseModel):

    developer_id: str
    total_notifications: int


class DeveloperFlowSummary(BaseModel):

    developer_id: str
    total_sessions: int
    total_coding_time: int
    avg_session_time: float