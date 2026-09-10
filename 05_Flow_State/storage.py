import clickhouse_connect

from config import (
    CLICKHOUSE_HOST,
    CLICKHOUSE_PORT,
    CLICKHOUSE_USER,
    CLICKHOUSE_PASSWORD,
    CLICKHOUSE_DATABASE,
)


def save_flow_states(flow_state_df):
    """Save flow state results into ClickHouse."""

    client = clickhouse_connect.get_client(
        host=CLICKHOUSE_HOST,
        port=CLICKHOUSE_PORT,
        username=CLICKHOUSE_USER,
        password=CLICKHOUSE_PASSWORD,
        database=CLICKHOUSE_DATABASE,
    )

    client.command("""
    CREATE TABLE IF NOT EXISTS developer_flow_state
    (
        developer_id String,
        flow_score Float64,
        flow_state String
    )
    ENGINE = MergeTree()
    ORDER BY developer_id
    """)

    client.command("TRUNCATE TABLE developer_flow_state")

    client.insert(
        "developer_flow_state",
        flow_state_df.values.tolist(),
        column_names=flow_state_df.columns.tolist(),
    )

    print("\nFlow states saved to ClickHouse.")