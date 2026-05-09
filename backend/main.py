import os
import joblib
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model_gemini = genai.GenerativeModel('gemini-1.5-flash')

# Load the predictive model
try:
    model_risk = joblib.load("model.pkl")
except Exception as e:
    print(f"Error loading model.pkl: {e}")
    model_risk = None

app = FastAPI()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Schema for Task 4
class RiskInput(BaseModel):
    Age: int
    Sleep_Hours: float
    Water_Liters: float
    Activity_Mins: int
    Stress_Level: int = Field(..., ge=1, le=10)
    BMI: float
    Food_Habits: str
    Smoking_Habit: str

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.post("/predict-risk")
async def predict_risk(data: RiskInput):
    if not model_risk:
        raise HTTPException(status_code=500, detail="Predictive model not loaded.")

    # Encoding logic from Task 4
    food_encoded = 1 if data.Food_Habits == "Mostly Junk Food" else 0
    
    smoking_map = {"Non-smoker": 0, "Occasional": 1, "Regular": 2}
    smoking_encoded = smoking_map.get(data.Smoking_Habit, 0)

    # Feature array in exact order: [Age, Sleep_Hours, Water_Liters, Activity_Mins, Stress_Level, BMI, food_encoded, smoking_encoded]
    features = np.array([[
        data.Age, 
        data.Sleep_Hours, 
        data.Water_Liters, 
        data.Activity_Mins, 
        data.Stress_Level, 
        data.BMI, 
        food_encoded, 
        smoking_encoded
    ]])

    try:
        # Get prediction
        prediction = model_risk.predict(features)
        risk_score = float(prediction[0])
        
        # Ensure risk score is within reasonable 0-100% bounds for display
        risk_score = max(0, min(100, risk_score))

        # Check if Gemini is configured, otherwise use fallback
        api_key = os.getenv("GEMINI_API_KEY")
        if api_key and "YOUR_GEMINI_API_KEY" not in api_key:
            try:
                # Gemini Prompt structuring from Task 4
                prompt = f"""
                Patient Profile:
                Age: {data.Age} | Sleep: {data.Sleep_Hours} hrs | Water: {data.Water_Liters} L | Activity: {data.Activity_Mins} mins
                Stress: {data.Stress_Level}/10 | BMI: {data.BMI} | Food: {data.Food_Habits} | Smoking: {data.Smoking_Habit}
                
                Calculated Risk Score: {risk_score}%
                
                Based on this profile and risk score, provide exactly 2 specific actionable sentences targeting their highest risk factors.
                """
                response = model_gemini.generate_content(prompt)
                ai_coaching = response.text.strip()
            except Exception as e:
                print(f"Gemini API Error: {e}. Falling back to local intelligence.")
                ai_coaching = None
        else:
            ai_coaching = None

        # Fallback Intelligence Logic (Task 4 Simulation)
        if not ai_coaching:
            if risk_score > 70:
                ai_coaching = f"Your elevated risk of {risk_score}% necessitates an immediate 20% reduction in sedentary time and a transition to home-cooked meals to stabilize metabolic markers. Consider a clinical consultation to address potential cardiovascular stressors identified in your profile."
            elif risk_score > 40:
                ai_coaching = f"A moderate risk score of {risk_score}% suggests focusing on sleep hygiene and increasing daily hydration to 3+ liters to improve biological recovery. Reducing occasional habits and increasing activity to 45 minutes daily will significantly lower your long-term risk profile."
            else:
                ai_coaching = f"With a low risk score of {risk_score}%, you should maintain your current activity levels while optimizing deep sleep cycles for peak cognitive performance. Continue your home-cooked meal routine to sustain these excellent metabolic baselines."

        return {
            "predicted_risk_percentage": round(risk_score, 1),
            "ai_coaching": ai_coaching
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)