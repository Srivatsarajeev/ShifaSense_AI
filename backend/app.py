import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from scipy.spatial import distance

app = Flask(__name__)
# Allow all origins on all /api/* routes
CORS(app, resources={r"/api/*": {"origins": "*"}})

# --- IN-MEMORY STORAGE FOR RECENT ANALYSES ---
RECENT_ANALYSES = []

# --- LOAD DATASET ---
CSV_PATH = 'shifasense_enhanced_10k.csv'
if not os.path.exists(CSV_PATH):
    # If not in same dir, try parent
    CSV_PATH = os.path.join(os.path.dirname(__file__), 'shifasense_enhanced_10k.csv')

try:
    df = pd.read_csv(CSV_PATH)
    print(f"Dataset loaded: {len(df)} rows.")
except Exception as e:
    print(f"Error loading dataset: {e}")
    df = pd.DataFrame() # Empty fallback

# Pre-calculate Min/Max for normalization
FEATURES = ['Age', 'Sleep_Hours', 'Water_Liters', 'Activity_Mins', 'Stress_Level', 'BMI']
STATS = {}
if not df.empty:
    for f in FEATURES:
        STATS[f] = {
            'min': df[f].min(),
            'max': df[f].max(),
            'avg': df[f].mean()
        }

# --- ENDPOINT 1: ANALYZE ---
@app.route('/api/analyze', methods=['POST'])
def analyze():
    if df.empty:
        return jsonify({"error": "Dataset not loaded"}), 500
    
    data = request.json
    try:
        # Preprocessing
        user_age = data.get('age', 30)
        user_sleep = data.get('sleep', 7)
        user_water = data.get('hydration', 8) * 0.25 # Convert glasses to Liters
        user_activity = data.get('activity', 30)
        user_stress = data.get('stress', 5)
        user_bmi = data.get('bmi', 24)
        
        user_smoking = data.get('smoking', 'Non-smoker')
        user_alcohol = data.get('alcohol', 'Never')
        user_food = data.get('foodHabits', 'Mostly Home Cooked')
        
        # Normalize User Data
        def normalize(val, field):
            return (val - STATS[field]['min']) / (STATS[field]['max'] - STATS[field]['min'])
        
        user_vec = np.array([
            normalize(user_age, 'Age'),
            normalize(user_sleep, 'Sleep_Hours'),
            normalize(user_water, 'Water_Liters'),
            normalize(user_activity, 'Activity_Mins'),
            normalize(user_stress, 'Stress_Level'),
            normalize(user_bmi, 'BMI')
        ])
        
        # Normalize Dataset
        df_norm = df.copy()
        for f in FEATURES:
            df_norm[f] = (df[f] - STATS[f]['min']) / (STATS[f]['max'] - STATS[f]['min'])
        
        # KNN Logic
        # Weights: Sleep: 0.25, Stress: 0.25, Activity: 0.20, Water: 0.15, Age: 0.10, BMI: 0.05
        weights = np.array([0.10, 0.25, 0.15, 0.20, 0.25, 0.05])
        
        # Calculate Weighted Euclidean Distance using Vectorized NumPy (Instant)
        diffs = df_norm[FEATURES].values - user_vec
        squared_diffs = (diffs ** 2) * weights
        df['dist'] = np.sqrt(squared_diffs.sum(axis=1))
        
        # Get 20 nearest neighbors
        neighbors = df.nsmallest(20, 'dist')
        
        # Calculate Results
        risk_score = neighbors['Disease_Risk_Percentage'].mean()
        risk_label_raw = neighbors['Disease_Risk'].mode()[0]
        std_dev = neighbors['Disease_Risk_Percentage'].std()
        confidence = round(1 - (std_dev / 50), 2)
        confidence = max(0.5, min(0.99, confidence))
        
        # Breakdown
        counts = neighbors['Disease_Risk'].value_counts()
        breakdown = {
            "low": int(counts.get('Low', 0)),
            "medium": int(counts.get('Medium', 0)),
            "high": int(counts.get('High', 0))
        }
        
        health_score = round(100 - risk_score, 1)
        
        # Map Labels
        label_map = {"Low": "Healthy", "Medium": "Moderate Risk", "High": "High Risk Pattern"}
        color_map = {"Low": "#10B981", "Medium": "#F59E0B", "High": "#EF4444"}
        
        risk_label = label_map.get(risk_label_raw, "Moderate Risk")
        risk_color = color_map.get(risk_label_raw, "#F59E0B")
        
        # Find Impactful Factors (Risk Factors)
        healthy_neighbors = neighbors[neighbors['Disease_Risk'] == 'Low']
        ref_group = healthy_neighbors if not healthy_neighbors.empty else neighbors
            
        factors = []
        # Check numerical deviations
        devs = [
            ("Sleep", user_sleep, ref_group['Sleep_Hours'].mean(), "h"),
            ("Stress", user_stress, ref_group['Stress_Level'].mean(), "/10"),
            ("Activity", user_activity, ref_group['Activity_Mins'].mean(), " mins"),
            ("Hydration", user_water, ref_group['Water_Liters'].mean(), "L"),
            ("BMI", user_bmi, ref_group['BMI'].mean(), "")
        ]
        
        impacts = []
        for name, u_val, n_val, unit in devs:
            if name in ["Sleep", "Activity", "Hydration"]:
                diff = n_val - u_val
            else:
                diff = u_val - n_val
            impacts.append((diff, name, u_val, n_val, unit))
            
        # Add categorical risks if applicable
        if user_smoking != 'Non-smoker':
            factors.append(f"Smoking: {user_smoking} habit increases vascular risk")
        if user_alcohol == 'Regular':
            factors.append("Alcohol: Regular consumption impacting metabolic health")
        if user_food == 'Mostly Junk Food':
            factors.append("Diet: High processed food intake detected")

        # Sort numerical impacts
        impacts.sort(key=lambda x: x[0], reverse=True)
        
        for diff, name, u_val, n_val, unit in impacts:
            if len(factors) >= 4: break
            if diff > 0:
                factors.append(f"{name}: {u_val}{unit} (vs avg {round(n_val, 1)}{unit})")
        
        if not factors:
            factors.extend(["Consistent monitoring recommended", "Hydration balance optimal"])

        res_obj = {
            "riskScore": round(risk_score, 1),
            "healthScore": health_score,
            "riskLabel": risk_label,
            "riskColor": risk_color,
            "confidence": confidence,
            "breakdown": breakdown,
            "riskFactors": factors,
            "neighborStats": {
                "avgSleep": round(neighbors['Sleep_Hours'].mean(), 1),
                "avgStress": round(neighbors['Stress_Level'].mean(), 1),
                "avgActivity": round(neighbors['Activity_Mins'].mean(), 0),
                "avgWater": round(neighbors['Water_Liters'].mean(), 1),
                "avgBMI": round(neighbors['BMI'].mean(), 1)
            },
            "sampleSize": 20,
            "datasetSize": 10000,
            "dataMessage": "Risk score calculated from 20 similar profiles in our dataset of 10,000 health records"
        }

        # Save clinical record for Admin Panel
        clinical_record = {
            "id": len(RECENT_ANALYSES) + 1,
            "name": data.get('name', 'Anonymous'),
            "age": user_age,
            "gender": data.get('gender', 'Unknown'),
            "bmi": user_bmi,
            "sleep": user_sleep,
            "activity": user_activity,
            "healthScore": health_score,
            "riskLabel": risk_label,
            "riskColor": risk_color,
            "timestamp": pd.Timestamp.now().strftime("%I:%M %p, %b %d")
        }
        RECENT_ANALYSES.append(clinical_record)

        return jsonify(res_obj)
    except Exception as e:
        print(f"Error in analysis: {e}")
        return jsonify({"error": str(e)}), 400

# --- ENDPOINT 2: STATS ---
@app.route('/api/stats', methods=['GET'])
def get_stats():
    if df.empty:
        return jsonify({"error": "Dataset not loaded"}), 500
    
    counts = df['Disease_Risk'].value_counts()
    total = len(df)
    
    return jsonify({
        "totalProfiles": total,
        "riskDistribution": {
            "low": int(counts.get('Low', 0)),
            "medium": int(counts.get('Medium', 0)),
            "high": int(counts.get('High', 0))
        },
        "lowPct": round(int(counts.get('Low', 0)) / total * 100, 1),
        "mediumPct": round(int(counts.get('Medium', 0)) / total * 100, 1),
        "highPct": round(int(counts.get('High', 0)) / total * 100, 1),
        "avgRiskScore": round(df['Disease_Risk_Percentage'].mean(), 1),
        "avgSleep": round(df['Sleep_Hours'].mean(), 1),
        "avgStress": round(df['Stress_Level'].mean(), 1),
        "avgActivity": round(df['Activity_Mins'].mean(), 0),
        "avgBMI": round(df['BMI'].mean(), 1),
        "avgWater": round(df['Water_Liters'].mean(), 1)
    })

# --- ENDPOINT 3: HEALTH ---
@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        "status": "ok",
        "dataset": "loaded" if not df.empty else "failed",
        "rows": len(df)
    })

# --- ENDPOINT 4: ADMIN RECORDS ---
@app.route('/api/admin/records', methods=['GET'])
def get_admin_records():
    return jsonify(RECENT_ANALYSES[::-1]) # Latest first

if __name__ == '__main__':
    # Kill existing process on port 5000 if needed (handled by runner usually)
    app.run(port=5000, debug=True)
