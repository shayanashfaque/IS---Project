from fastapi import FastAPI
import joblib

app = FastAPI()
model = joblib.load("login_model.pkl")

@app.post("/predict")
def predict(features: dict):
    X = [[
        features["hour"],
        features["new_ip"],
        features["new_device"],
        features["failed_attempts"],
        features["rapid_attempts"]
    ]]

    probability = model.predict_proba(X)[0][1]
    return { "risk_score": float(probability) }
