import polars as pl
from pathlib import Path

# Project root
project_root = Path(__file__).resolve().parent.parent

# Input and output paths
input_file = project_root / "01_Dataset" / "ai_dev_productivity.csv"
output_file = project_root / "01_Dataset" / "cleaned_ai_dev_productivity.csv"

# Load dataset using Polars
df = pl.read_csv(input_file)

print("========== ORIGINAL DATA ==========")
print(f"Rows: {df.height}")
print(f"Columns: {df.width}")

# Remove duplicate rows
df = df.unique()

# Remove rows containing null values
df = df.drop_nulls()

# Ensure numeric columns have correct data types
df = df.with_columns([
    pl.col("hours_coding").cast(pl.Float64),
    pl.col("coffee_intake_mg").cast(pl.Int64),
    pl.col("distractions").cast(pl.Int64),
    pl.col("sleep_hours").cast(pl.Float64),
    pl.col("commits").cast(pl.Int64),
    pl.col("bugs_reported").cast(pl.Int64),
    pl.col("ai_usage_hours").cast(pl.Float64),
    pl.col("cognitive_load").cast(pl.Float64),
    pl.col("task_success").cast(pl.Int64)
])

# Save cleaned dataset
df.write_csv(output_file)

print("\n========== CLEANED DATA ==========")
print(f"Rows: {df.height}")
print(f"Columns: {df.width}")
print(f"Saved to: {output_file}")