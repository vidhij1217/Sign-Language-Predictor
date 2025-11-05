from flask import Flask, Response, request, jsonify
from flask_cors import CORS
from keras.models import model_from_json
import cv2
import numpy as np
import os
import base64
import threading

# Base path = backend folder
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Load model architecture - model files are in the backend folder
model_json_path = os.path.join(BASE_DIR, "signlanguagedetectionmodel128x128.json")
model_weights_path = os.path.join(BASE_DIR, "signlanguagedetectionmodel128x128.h5")

with open(model_json_path, "r") as json_file:
    model_json = json_file.read()
model = model_from_json(model_json)

# Load model weights
model.load_weights(model_weights_path)

# Labels (24 total classes)
labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
          'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
          'U', 'W', 'X', 'Y', 'Z', 'blank']

# Feature extraction function
def extract_features(image):
    feature = np.array(image)
    feature = feature.reshape(1, 128, 128, 1)
    return feature / 255.0

# Flask app setup
app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Global camera variable (one camera instance per thread)
camera = None
camera_lock = threading.Lock()

def get_camera():
    """Get or create camera instance"""
    global camera
    with camera_lock:
        if camera is None or not camera.isOpened():
            camera = cv2.VideoCapture(0)
            camera.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
            camera.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
        return camera

def generate_frames():
    """Generate video frames with predictions"""
    cam = get_camera()
    while True:
        success, frame = cam.read()
        if not success:
            break

        # Draw ROI rectangle
        cv2.rectangle(frame, (0, 40), (300, 300), (0, 165, 255), 1)

        # Crop & preprocess
        cropframe = frame[40:300, 0:300]
        cropframe = cv2.cvtColor(cropframe, cv2.COLOR_BGR2GRAY)
        cropframe = cv2.resize(cropframe, (128, 128))
        cropframe = extract_features(cropframe)

        # Prediction
        pred = model.predict(cropframe, verbose=0)
        idx = np.argmax(pred)

        # Safe prediction
        if idx < len(labels):
            prediction = labels[idx]
        else:
            prediction = "Unknown"

        # Display prediction
        cv2.rectangle(frame, (0, 0), (300, 40), (0, 165, 255), -1)
        accu = "{:.2f}".format(np.max(pred) * 100)
        cv2.putText(frame, f'{prediction} {accu}%', (10, 30),
            cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)

        # Encode for Flask stream
        ret, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/api/video')
def video():
    """Video streaming route for React frontend"""
    return Response(generate_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/api/predict', methods=['POST'])
def predict():
    """API endpoint for single frame prediction"""
    try:
        data = request.json
        if 'image' not in data:
            return jsonify({'error': 'No image data provided'}), 400
        
        # Decode base64 image
        image_data = data['image'].split(',')[1] if ',' in data['image'] else data['image']
        image_bytes = base64.b64decode(image_data)
        nparr = np.frombuffer(image_bytes, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if frame is None:
            return jsonify({'error': 'Failed to decode image'}), 400
        
        # Crop & preprocess
        cropframe = frame[40:300, 0:300] if frame.shape[0] > 300 else frame
        cropframe = cv2.cvtColor(cropframe, cv2.COLOR_BGR2GRAY)
        cropframe = cv2.resize(cropframe, (128, 128))
        cropframe = extract_features(cropframe)
        
        # Prediction
        pred = model.predict(cropframe, verbose=0)
        idx = np.argmax(pred)
        
        # Safe prediction
        if idx < len(labels):
            prediction = labels[idx]
        else:
            prediction = "Unknown"
        
        confidence = float(np.max(pred) * 100)
        
        return jsonify({
            'prediction': prediction,
            'confidence': round(confidence, 2),
            'all_predictions': {labels[i]: float(pred[0][i] * 100) for i in range(len(labels))}
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health')
def health():
    """Health check endpoint"""
    return jsonify({'status': 'ok', 'model_loaded': model is not None})

if __name__ == "__main__":
    # Run on a different port than React (which runs on 3000)
    app.run(debug=True, port=5000, host='127.0.0.1')

