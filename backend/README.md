# Backend API Server

Flask backend server for Sign Language Detection using TensorFlow/Keras CNN model.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Ensure model files are present:
   - `signlanguagedetectionmodel128x128.json`
   - `signlanguagedetectionmodel128x128.h5`

3. Run the server:
```bash
python app.py
```

The server will start on `http://127.0.0.1:5000`

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/video` - Video stream with predictions
- `POST /api/predict` - Predict from image data

## Notes

- The server uses CORS to allow requests from the React frontend
- Camera access is required for video streaming
- Model loads on server startup


