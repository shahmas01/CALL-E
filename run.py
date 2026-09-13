import joblib
import pandas as pd

model = joblib.load('readmission_model.joblib')
model_features = joblib.load('model_features.joblib') # Fast, offline feature loading

new_patient_raw = pd.DataFrame([{
    'time_in_hospital': 4, 'n_lab_procedures': 45, 'n_procedures': 1,
    'n_medications': 12, 'n_outpatient': 0, 'n_inpatient': 2, 'n_emergency': 1,
    'primary_diagnosis': 'Circulatory', 'sec_diagnosis': 'Other',
    'additional_sec_diag': 'Other', 'glucose_test': 'high',
    'HbA1ctest': 'normal', 'med_change': 'yes', 'diabetes_med': 'yes',
    'age_cat': 'senior-old age'
}])

encoded = pd.get_dummies(new_patient_raw)
final_input = encoded.reindex(columns=model_features, fill_value=0).values

prediction = model.predict(final_input)
probability = model.predict_proba(final_input)[:, 1]

print(f"Readmission Risk Score: {probability[0]:.2%}")
