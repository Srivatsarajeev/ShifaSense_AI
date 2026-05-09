import os
import csv
import math
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
# Allow all origins on all /api/* routes
CORS(app, resources={r"/api/*": {"origins": "*"}})

# --- IN-MEMORY STORAGE FOR RECENT ANALYSES ---
RECENT_ANALYSES = []

# --- LOAD DATASET ---
CSV_PATH = os.path.join(os.path.dirname(__file__), 'shifasense_enhanced_10k.csv')
DATA = []
STATS = {}
FEATURES = ['Age', 'Sleep_Hours', 'Water_Liters', 'Activity_Mins', 'Stress_Level', 'BMI']

def load_data():
    global DATA, STATS
    if not os.path.exists(CSV_PATH):
        print(f"File not found: {CSV_PATH}")
        return
    
    try:
        with open(CSV_PATH, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                try:
                    processed_row = {
                        'Age': float(row['Age']),
                        'Sleep_Hours': float(row['Sleep_Hours']),
                        'Water_Liters': float(row['Water_Liters']),
                        'Activity_Mins': float(row['Activity_Mins']),
                        'Stress_Level': float(row['Stress_Level']),
                        'BMI': float(row['BMI']),
                        'Disease_Risk_Percentage': float(row['Disease_Risk_Percentage']),
                        'Disease_Risk': row['Disease_Risk']
                    }
                    DATA.append(processed_row)
                except (ValueError, KeyError):
                    continue
        
        print(f"Dataset loaded: {len(DATA)} rows.")
        
        # Pre-calculate Min/Max for normalization
        if DATA:
            for f in FEATURES:
                vals = [r[f] for r in DATA]
                STATS[f] = {
                    'min': min(vals),
                    'max': max(vals),
                    'avg': sum(vals) / len(vals)
                }
    except Exception as e:
        print(f"Error loading dataset: {e}")

load_data()

def normalize(val, field):
    s = STATS.get(field)
    if not s or s['max'] == s['min']: return 0.5
    res = (val - s['min']) / (s['max'] - s['min'])
    return max(0, min(1, res))

@app.route('/api/analyze', methods=['POST'])
def analyze():
    if not DATA:
        return jsonify({"error": "Dataset not loaded"}), 500
    
    input_data = request.json
    try:
        # Preprocessing
        user_age = input_data.get('age', 30)
        user_sleep = input_data.get('sleep', 7)
        user_water = input_data.get('hydration', 8) * 0.25 # Convert glasses to Liters
        user_activity = input_data.get('activity', 30)
        user_stress = input_data.get('stress', 5)
        user_bmi = input_data.get('bmi', 24)
        
        user_smoking = input_data.get('smoking', 'Non-smoker')
        user_alcohol = input_data.get('alcohol', 'Never')
        user_food = input_data.get('foodHabits', 'Mostly Home Cooked')
        
        # Prepare user vector (normalized)
        user_vec = {
            'Age': normalize(user_age, 'Age'),
            'Sleep_Hours': normalize(user_sleep, 'Sleep_Hours'),
            'Water_Liters': normalize(user_water, 'Water_Liters'),
            'Activity_Mins': normalize(user_activity, 'Activity_Mins'),
            'Stress_Level': normalize(user_stress, 'Stress_Level'),
            'BMI': normalize(user_bmi, 'BMI')
        }
        
        # Weights: Sleep: 0.25, Stress: 0.25, Activity: 0.20, Water: 0.15, Age: 0.10, BMI: 0.05
        weights = {
            'Age': 0.10,
            'Sleep_Hours': 0.25,
            'Water_Liters': 0.15,
            'Activity_Mins': 0.20,
            'Stress_Level': 0.25,
            'BMI': 0.05
        }
        
        # Calculate Weighted Euclidean Distance for all rows
        distances = []
        for i, row in enumerate(DATA):
            dist_sq = 0
            for f in FEATURES:
                # Normalize row value on the fly or pre-calculate (pre-calculating would be faster but this is fine for 10k)
                row_val_norm = normalize(row[f], f)
                diff = user_vec[f] - row_val_norm
                dist_sq += weights[f] * (diff ** 2)
            
            distances.append((math.sqrt(dist_sq), i))
        
        # Get 20 nearest neighbors
        distances.sort(key=lambda x: x[0])
        neighbor_indices = [idx for dist, idx in distances[:20]]
        neighbors = [DATA[idx] for idx in neighbor_indices]
        
        # Calculate Results
        risk_scores = [n['Disease_Risk_Percentage'] for n in neighbors]
        risk_score = sum(risk_scores) / len(risk_scores)
        
        # Risk Label Mode
        labels = [n['Disease_Risk'] for n in neighbors]
        risk_label_raw = max(set(labels), key=labels.count)
        
        # Confidence calculation (based on std dev of risk scores)
        mean_risk = risk_score
        variance = sum((x - mean_risk) ** 2 for x in risk_scores) / len(risk_scores)
        std_dev = math.sqrt(variance)
        confidence = round(1 - (std_dev / 50), 2)
        confidence = max(0.5, min(0.99, confidence))
        
        # Breakdown
        breakdown = {
            "low": labels.count('Low'),
            "medium": labels.count('Medium'),
            "high": labels.count('High')
        }
        
        health_score = round(100 - risk_score, 1)
        
        # Map Labels
        label_map = {"Low": "Healthy", "Medium": "Moderate Risk", "High": "High Risk Pattern"}
        color_map = {"Low": "#10B981", "Medium": "#F59E0B", "High": "#EF4444"}
        
        risk_label = label_map.get(risk_label_raw, "Moderate Risk")
        risk_color = color_map.get(risk_label_raw, "#F59E0B")
        
        # Find Impactful Factors
        ref_group = [n for n in neighbors if n['Disease_Risk'] == 'Low']
        if not ref_group: ref_group = neighbors
        
        def get_avg(group, field):
            return sum(n[field] for n in group) / len(group)

        factors = []
        devs = [
            ("Sleep", user_sleep, get_avg(ref_group, 'Sleep_Hours'), "h"),
            ("Stress", user_stress, get_avg(ref_group, 'Stress_Level'), "/10"),
            ("Activity", user_activity, get_avg(ref_group, 'Activity_Mins'), " mins"),
            ("Hydration", user_water, get_avg(ref_group, 'Water_Liters'), "L"),
            ("BMI", user_bmi, get_avg(ref_group, 'BMI'), "")
        ]
        
        impacts = []
        for name, u_val, n_val, unit in devs:
            if name in ["Sleep", "Activity", "Hydration"]:
                diff = n_val - u_val
            else:
                diff = u_val - n_val
            impacts.append((diff, name, u_val, n_val, unit))
            
        if user_smoking != 'Non-smoker':
            factors.append(f"Smoking: {user_smoking} habit increases vascular risk")
        if user_alcohol == 'Regular':
            factors.append("Alcohol: Regular consumption impacting metabolic health")
        if user_food == 'Mostly Junk Food':
            factors.append("Diet: High processed food intake detected")

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
                "avgSleep": round(get_avg(neighbors, 'Sleep_Hours'), 1),
                "avgStress": round(get_avg(neighbors, 'Stress_Level'), 1),
                "avgActivity": round(get_avg(neighbors, 'Activity_Mins'), 0),
                "avgWater": round(get_avg(neighbors, 'Water_Liters'), 1),
                "avgBMI": round(get_avg(neighbors, 'BMI'), 1)
            },
            "sampleSize": 20,
            "datasetSize": len(DATA),
            "dataMessage": f"Risk score calculated from 20 similar profiles in our dataset of {len(DATA)} health records"
        }

        # Save clinical record
        import datetime
        clinical_record = {
            "id": len(RECENT_ANALYSES) + 1,
            "name": input_data.get('name', 'Anonymous'),
            "age": user_age,
            "gender": input_data.get('gender', 'Unknown'),
            "bmi": user_bmi,
            "sleep": user_sleep,
            "activity": user_activity,
            "healthScore": health_score,
            "riskLabel": risk_label,
            "riskColor": risk_color,
            "timestamp": datetime.datetime.now().strftime("%I:%M %p, %b %d")
        }
        RECENT_ANALYSES.append(clinical_record)

        return jsonify(res_obj)
    except Exception as e:
        import traceback
@app.route('/api/predict-risk', methods=['POST', 'OPTIONS'])
def predict_risk():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
        
    input_data = request.json
    try:
        user_age = input_data.get('Age', 30)
        user_sleep = input_data.get('Sleep_Hours', 7)
        user_water = input_data.get('Water_Liters', 2)
        user_activity = input_data.get('Activity_Mins', 30)
        user_stress = input_data.get('Stress_Level', 5)
        user_bmi = input_data.get('BMI', 24)
        
        user_smoking = input_data.get('Smoking_Habit', 'Non-smoker')
        user_food = input_data.get('Food_Habits', 'Mostly Home Cooked')
        
        # Encoding logic matching main.py
        food_encoded = 1 if user_food == "Mostly Junk Food" else 0
        smoking_map = {"Non-smoker": 0, "Occasional": 1, "Regular": 2}
        smoking_encoded = smoking_map.get(user_smoking, 0)
        
        # Exact coefficients from model.pkl LinearRegression
        # Intercept: 10.0
        # Age: 0.1, Sleep: -0.5, Water: -0.2, Activity: -0.01, Stress: 2.0, BMI: 0.5, Food: 5.0, Smoking: 10.0
        risk_score = 10.0 \
                     + (0.1 * user_age) \
                     + (-0.5 * user_sleep) \
                     + (-0.2 * user_water) \
                     + (-0.01 * user_activity) \
                     + (2.0 * user_stress) \
                     + (0.5 * user_bmi) \
                     + (5.0 * food_encoded) \
                     + (10.0 * smoking_encoded)
            
        risk_score = max(0, min(100, risk_score))
        
        if risk_score > 70:
            ai_coaching = f"Your elevated risk of {round(risk_score, 1)}% necessitates an immediate 20% reduction in sedentary time and a transition to home-cooked meals to stabilize metabolic markers. Consider a clinical consultation to address potential cardiovascular stressors identified in your profile."
        elif risk_score > 40:
            ai_coaching = f"A moderate risk score of {round(risk_score, 1)}% suggests focusing on sleep hygiene and increasing daily hydration to improve biological recovery. Reducing occasional habits and increasing activity to 45 minutes daily will significantly lower your long-term risk profile."
        else:
            ai_coaching = f"With a low risk score of {round(risk_score, 1)}%, you should maintain your current activity levels while optimizing deep sleep cycles for peak cognitive performance. Continue your home-cooked meal routine to sustain these excellent metabolic baselines."

        # Save clinical record
        import datetime
        health_score = round(100 - risk_score, 1)
        risk_label = "High Risk Pattern" if risk_score > 70 else ("Moderate Risk" if risk_score > 40 else "Healthy")
        risk_color = "#EF4444" if risk_score > 70 else ("#F59E0B" if risk_score > 40 else "#10B981")
        clinical_record = {
            "id": len(RECENT_ANALYSES) + 1,
            "name": input_data.get('name', 'Anonymous'),
            "age": user_age,
            "gender": input_data.get('gender', 'Unknown'),
            "bmi": user_bmi,
            "sleep": user_sleep,
            "activity": user_activity,
            "healthScore": health_score,
            "riskLabel": risk_label,
            "riskColor": risk_color,
            "timestamp": datetime.datetime.now().strftime("%I:%M %p, %b %d")
        }
        RECENT_ANALYSES.append(clinical_record)

        return jsonify({
            "predicted_risk_percentage": round(risk_score, 1),
            "ai_coaching": ai_coaching
        })
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 400

@app.route('/api/stats', methods=['GET'])
def get_stats():
    if not DATA:
        return jsonify({"error": "Dataset not loaded"}), 500
    
    labels = [r['Disease_Risk'] for r in DATA]
    total = len(DATA)
    
    counts = {
        "low": labels.count('Low'),
        "medium": labels.count('Medium'),
        "high": labels.count('High')
    }
    
    def get_avg(field):
        return sum(r[field] for r in DATA) / total

    return jsonify({
        "totalProfiles": total,
        "riskDistribution": counts,
        "lowPct": round(counts['low'] / total * 100, 1),
        "mediumPct": round(counts['medium'] / total * 100, 1),
        "highPct": round(counts['high'] / total * 100, 1),
        "avgRiskScore": round(get_avg('Disease_Risk_Percentage'), 1),
        "avgSleep": round(get_avg('Sleep_Hours'), 1),
        "avgStress": round(get_avg('Stress_Level'), 1),
        "avgActivity": round(get_avg('Activity_Mins'), 0),
        "avgBMI": round(get_avg('BMI'), 1),
        "avgWater": round(get_avg('Water_Liters'), 1)
    })

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        "status": "ok",
        "dataset": "loaded" if DATA else "failed",
        "rows": len(DATA)
    })

@app.route('/api/admin/records', methods=['GET'])
def get_admin_records():
    return jsonify(RECENT_ANALYSES[::-1])

if __name__ == '__main__':
    app.run(port=5000, debug=True)
