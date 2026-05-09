import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import joblib

# Load dataset
df = pd.read_csv("../dataset/sleep.csv")

# Encode categorical columns
encoder = LabelEncoder()

df["Gender"] = encoder.fit_transform(df["Gender"])
df["Occupation"] = encoder.fit_transform(df["Occupation"])
df["BMI Category"] = encoder.fit_transform(df["BMI Category"])

# Features
X = df[[
    "Sleep Duration",
    "Quality of Sleep",
    "Physical Activity Level",
    "Stress Level",
    "Heart Rate",
    "Daily Steps"
]]

# Target
y = df["BMI Category"]

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# Train model
model = RandomForestClassifier()

model.fit(X_train, y_train)

# Save model
joblib.dump(model, "../model/model.pkl")

print("Model Trained Successfully")