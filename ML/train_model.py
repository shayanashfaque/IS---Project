import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib

data = pd.read_csv("login_dataset.csv")

X = data.drop("label", axis=1)
y = data["label"]

model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)
model.fit(X, y)

joblib.dump(model, "login_model.pkl")
print("Model trained and saved")
