
import pandas as pd
from pathlib import Path

# Get project root directory
project_root = Path(__file__).resolve().parent.parent

# Dataset path
file_path = project_root / "01_Dataset" / "ai_dev_productivity.csv"

# Load dataset
df = pd.read_csv(file_path)

print("========== DATASET SHAPE ==========")
print(df.shape)

print("\n========== COLUMNS ==========")
print(df.columns.tolist())

print("\n========== FIRST 5 ROWS ==========")
print(df.head())

print("\n========== DATA TYPES ==========")
print(df.dtypes)

print("\n========== MISSING VALUES ==========")
print(df.isnull().sum())

print("\n========== DUPLICATE ROWS ==========")
print(df.duplicated().sum())

print("\n========== SUMMARY STATISTICS ==========")
print(df.describe())