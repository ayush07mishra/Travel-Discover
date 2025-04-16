import pickle
from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

# Load model and encoders
with open('model.pkl', 'rb') as f:
    data = pickle.load(f)
    model = data['model']
    best_time_encoder = data['best_time_encoder']
    people_travel_with_encoder = data['people_travel_with_encoder']
    days_to_travel_encoder = data['days_to_travel_encoder']

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        best_time = data['season']
        people = data['people']
        days = data['days']

        # Encode the inputs
        best_time_encoded = best_time_encoder.transform([best_time])[0]
        people_encoded = people_travel_with_encoder.transform([people])[0]
        days_encoded = days_to_travel_encoder.transform([days])[0]

        # Predict using the model
        prediction = model.predict([[best_time_encoded, people_encoded, days_encoded]])
        
        return jsonify({'recommendation': str(prediction[0])})
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)
