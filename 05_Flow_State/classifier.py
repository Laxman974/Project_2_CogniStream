import pandas as pd


def classify_flow_state(flow_scores):
    """Assign a Flow State based on the Flow Score."""

    scores = flow_scores.copy()

    def get_flow_state(score):
        if score >= 85:
            return "Deep Flow"
        elif score >= 70:
            return "Focused"
        elif score >= 55:
            return "Neutral"
        elif score >= 40:
            return "Distracted"
        else:
            return "Burnout Risk"

    scores["flow_state"] = scores["flow_score"].apply(
        get_flow_state
    )

    return scores