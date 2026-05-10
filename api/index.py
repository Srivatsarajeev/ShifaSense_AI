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
        user_age      = float(input_data.get('Age', 30))
        user_sleep    = float(input_data.get('Sleep_Hours', 7))
        user_water    = float(input_data.get('Water_Liters', 2))   # already in liters
        user_activity = float(input_data.get('Activity_Mins', 30))
        user_stress   = float(input_data.get('Stress_Level', 5))
        user_bmi      = float(input_data.get('BMI', 24))
        user_smoking  = input_data.get('Smoking_Habit', 'Non-smoker')
        user_food     = input_data.get('Food_Habits', 'Mostly Home Cooked')

        # ── If dataset is loaded, use real KNN prediction ──
        if DATA and STATS:
            user_vec = {
                'Age':          normalize(user_age,      'Age'),
                'Sleep_Hours':  normalize(user_sleep,    'Sleep_Hours'),
                'Water_Liters': normalize(user_water,    'Water_Liters'),
                'Activity_Mins':normalize(user_activity, 'Activity_Mins'),
                'Stress_Level': normalize(user_stress,   'Stress_Level'),
                'BMI':          normalize(user_bmi,      'BMI'),
            }
            weights = {
                'Age': 0.08, 'Sleep_Hours': 0.28, 'Water_Liters': 0.14,
                'Activity_Mins': 0.20, 'Stress_Level': 0.25, 'BMI': 0.05
            }
            distances = []
            for i, row in enumerate(DATA):
                dist_sq = sum(
                    weights[f] * (user_vec[f] - normalize(row[f], f)) ** 2
                    for f in FEATURES
                )
                distances.append((math.sqrt(dist_sq), i))
            distances.sort(key=lambda x: x[0])
            neighbors = [DATA[idx] for _, idx in distances[:20]]

            risk_scores = [n['Disease_Risk_Percentage'] for n in neighbors]
            risk_score  = sum(risk_scores) / len(risk_scores)

            # Lifestyle penalty (not in CSV features)
            if user_smoking == 'Regular':   risk_score = min(100, risk_score + 8)
            elif user_smoking == 'Occasional': risk_score = min(100, risk_score + 4)
            if user_food == 'Mostly Junk Food': risk_score = min(100, risk_score + 5)
        else:
            # Fallback formula if CSV not loaded
            food_enc    = 1 if user_food == "Mostly Junk Food" else 0
            smoke_enc   = {"Non-smoker": 0, "Occasional": 1, "Regular": 2}.get(user_smoking, 0)
            risk_score  = max(0, min(100,
                10.0
                + 0.10 * user_age
                - 0.50 * user_sleep
                - 0.20 * user_water
                - 0.01 * user_activity
                + 2.00 * user_stress
                + 0.50 * user_bmi
                + 5.00 * food_enc
                + 10.0 * smoke_enc
            ))

        risk_score   = round(max(0, min(100, risk_score)), 1)
        health_score = round(100 - risk_score, 1)

        risk_label = ("High Risk Pattern" if risk_score > 70
                      else "Moderate Risk" if risk_score > 40
                      else "Healthy")
        risk_color = ("#EF4444" if risk_score > 70
                      else "#F59E0B" if risk_score > 40
                      else "#10B981")

        # ── Real personalised coaching from actual numbers ──
        lines = []

        # Sleep
        if user_sleep < 5:
            lines.append(f"Critical: Your sleep of {user_sleep}h is severely below the 7-8h target — this alone raises your disease risk significantly. Make sleep your #1 priority tonight.")
        elif user_sleep < 7:
            lines.append(f"Your sleep of {user_sleep}h is below the recommended 7-8h. Try going to bed 30 minutes earlier each night to build a healthier sleep cycle.")
        else:
            lines.append(f"Great job on {user_sleep}h of sleep — you are within the healthy 7-8h target. Maintain a consistent bedtime to lock in this habit.")

        # Stress
        if user_stress >= 8:
            lines.append(f"Your stress level of {user_stress}/10 is very high. Practice 10 minutes of deep breathing or a short walk daily to bring it below 6.")
        elif user_stress >= 6:
            lines.append(f"Stress at {user_stress}/10 is elevated. Consider short mindfulness breaks or reducing screen time in the evening.")
        else:
            lines.append(f"Stress is well-managed at {user_stress}/10. Keep using your current coping strategies.")

        # Hydration (water_liters)
        water_glasses = round(user_water / 0.25)
        if user_water < 1.5:
            lines.append(f"Hydration is critically low at {water_glasses} glasses. Aim for at least 8 glasses (2L) per day — dehydration directly worsens your risk score.")
        elif user_water < 2.0:
            lines.append(f"At {water_glasses} glasses per day, you are under-hydrated. Carry a 1L bottle and refill it twice to hit your daily target.")

        # Activity
        if user_activity < 15:
            lines.append(f"Physical activity of {int(user_activity)} mins/day is very low. Even a 20-minute walk 5 days a week will meaningfully lower your risk score.")
        elif user_activity < 30:
            lines.append(f"Activity of {int(user_activity)} mins/day is below the 30-min guideline. Add a short workout or brisk walk to your daily routine.")

        # Summary sentence
        summary = " ".join(lines) if lines else (
            f"Your health score is {health_score}/100 (risk: {risk_score}%). "
            f"Your key inputs — sleep {user_sleep}h, stress {user_stress}/10, "
            f"activity {int(user_activity)} mins, water {water_glasses} glasses — "
            f"show {'concerning patterns that need attention' if risk_score > 50 else 'mostly healthy trends. Keep it up'}."
        )

        import datetime
        RECENT_ANALYSES.append({
            "id":          len(RECENT_ANALYSES) + 1,
            "age":         user_age,
            "sleep":       user_sleep,
            "activity":    user_activity,
            "healthScore": health_score,
            "riskLabel":   risk_label,
            "riskColor":   risk_color,
            "timestamp":   datetime.datetime.now().strftime("%I:%M %p, %b %d")
        })

        return jsonify({
            "predicted_risk_percentage": risk_score,
            "score":       health_score,
            "risk_level":  risk_label,
            "ai_coaching": summary,
            "status":      "success"
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
