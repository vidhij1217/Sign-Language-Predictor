# Quick Start: Backend Implementation Example

## Option 1: Python/FastAPI Backend (Recommended for ML Integration)

### Project Structure
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI app
│   ├── models/
│   │   ├── sign_language.py    # ML model wrapper
│   │   └── user.py            # User models
│   ├── api/
│   │   ├── translate.py       # Translation endpoints
│   │   ├── auth.py            # Authentication
│   │   ├── signs.py           # Sign library
│   │   └── practice.py        # Practice evaluation
│   ├── services/
│   │   ├── video_processor.py # Video frame processing
│   │   ├── ml_inference.py    # ML model inference
│   │   └── websocket.py       # WebSocket handler
│   └── database/
│       ├── models.py          # Database models
│       └── connection.py      # DB connection
├── requirements.txt
├── Dockerfile
└── README.md
```

### Basic FastAPI Setup

**requirements.txt**:
```txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
python-multipart==0.0.6
opencv-python==4.8.1.78
mediapipe==0.10.8
numpy==1.24.3
tensorflow==2.14.0
sqlalchemy==2.0.23
psycopg2-binary==2.9.9
redis==5.0.1
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-dotenv==1.0.0
websockets==12.0
```

**app/main.py**:
```python
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from app.api import translate, auth, signs, practice

app = FastAPI(title="SignBridge API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Your React app
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(translate.router, prefix="/api/v1/translate", tags=["translate"])
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(signs.router, prefix="/api/v1/signs", tags=["signs"])
app.include_router(practice.router, prefix="/api/v1/practice", tags=["practice"])

@app.get("/")
async def root():
    return {"message": "SignBridge API", "status": "running"}

@app.get("/health")
async def health():
    return {"status": "healthy"}
```

**app/api/translate.py**:
```python
from fastapi import APIRouter, HTTPException, UploadFile, File
from app.services.video_processor import VideoProcessor
from app.services.ml_inference import MLInference
import base64
import cv2
import numpy as np

router = APIRouter()
video_processor = VideoProcessor()
ml_model = MLInference()

@router.post("/stream")
async def translate_stream(frame_data: dict):
    """
    Real-time sign language translation from video frame
    """
    try:
        # Decode base64 frame
        frame_base64 = frame_data.get("frame")
        if not frame_base64:
            raise HTTPException(status_code=400, detail="Frame data required")
        
        # Decode image
        frame_bytes = base64.b64decode(frame_base64)
        nparr = np.frombuffer(frame_bytes, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        # Process frame
        processed_frame = video_processor.preprocess(frame)
        
        # Run ML inference
        result = ml_model.predict(processed_frame)
        
        return {
            "translation": result["text"],
            "confidence": result["confidence"],
            "timestamp": frame_data.get("timestamp"),
            "keypoints": result.get("keypoints", [])
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/batch")
async def translate_batch(frames: list):
    """
    Batch processing of multiple frames
    """
    results = []
    for frame_data in frames:
        try:
            result = await translate_stream(frame_data)
            results.append(result)
        except Exception as e:
            results.append({"error": str(e)})
    return {"results": results}
```

**app/services/ml_inference.py**:
```python
import mediapipe as mp
import numpy as np
import cv2

class MLInference:
    def __init__(self):
        self.mp_hands = mp.solutions.hands
        self.hands = self.mp_hands.Hands(
            static_image_mode=False,
            max_num_hands=2,
            min_detection_confidence=0.7
        )
        # Load your trained model here
        # self.model = tf.keras.models.load_model('path/to/model')
    
    def predict(self, frame):
        """
        Predict sign language from frame
        """
        # Convert BGR to RGB
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        
        # Detect hands
        results = self.hands.process(rgb_frame)
        
        if not results.multi_hand_landmarks:
            return {
                "text": "",
                "confidence": 0.0,
                "keypoints": []
            }
        
        # Extract keypoints
        keypoints = []
        for hand_landmarks in results.multi_hand_landmarks:
            hand_points = []
            for landmark in hand_landmarks.landmark:
                hand_points.append([landmark.x, landmark.y, landmark.z])
            keypoints.append(hand_points)
        
        # TODO: Feed keypoints to trained model
        # prediction = self.model.predict(keypoints)
        
        # Placeholder response
        return {
            "text": "Hello",  # Replace with actual model prediction
            "confidence": 0.85,
            "keypoints": keypoints
        }
```

**app/services/video_processor.py**:
```python
import cv2
import numpy as np

class VideoProcessor:
    def preprocess(self, frame):
        """
        Preprocess video frame for ML model
        """
        # Resize to standard size
        frame = cv2.resize(frame, (640, 480))
        
        # Normalize
        frame = frame.astype(np.float32) / 255.0
        
        return frame
    
    def extract_frames(self, video_path, fps=30):
        """
        Extract frames from video at specified FPS
        """
        cap = cv2.VideoCapture(video_path)
        frames = []
        frame_count = 0
        
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
            
            if frame_count % (30 // fps) == 0:
                frames.append(self.preprocess(frame))
            
            frame_count += 1
        
        cap.release()
        return frames
```

---

## Option 2: Node.js/Express Backend

### Project Structure
```
backend/
├── src/
│   ├── index.js              # Express app
│   ├── routes/
│   │   ├── translate.js
│   │   ├── auth.js
│   │   └── signs.js
│   ├── services/
│   │   ├── mlService.js      # Calls Python ML service
│   │   └── videoService.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   └── config/
│       └── database.js
├── package.json
└── Dockerfile
```

**package.json**:
```json
{
  "name": "signbridge-backend",
  "version": "1.0.0",
  "dependencies": {
    "express": "^4.18.2",
    "socket.io": "^4.6.1",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "multer": "^1.4.5-lts.1",
    "axios": "^1.6.2",
    "pg": "^8.11.3",
    "redis": "^4.6.11"
  }
}
```

**src/index.js**:
```javascript
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const translateRoutes = require('./routes/translate');
const authRoutes = require('./routes/auth');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1/translate', translateRoutes);
app.use('/api/v1/auth', authRoutes);

// WebSocket for real-time translation
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('translate-stream', async (data) => {
    // Process frame and send translation
    const translation = await processTranslation(data.frame);
    socket.emit('translation-result', translation);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

## Getting Started

### 1. Python/FastAPI Setup
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run server
uvicorn app.main:app --reload --port 8000
```

### 2. Node.js Setup
```bash
npm install
npm start
```

### 3. Frontend Integration
Update your React components to call these APIs:

```javascript
// In Chatbot.js
const translateFrame = async (videoElement) => {
  const canvas = document.createElement('canvas');
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;
  canvas.getContext('2d').drawImage(videoElement, 0, 0);
  const frameBase64 = canvas.toDataURL('image/jpeg').split(',')[1];
  
  const response = await fetch('http://localhost:8000/api/v1/translate/stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      frame: frameBase64,
      timestamp: Date.now()
    })
  });
  
  const data = await response.json();
  setCurrentTranslation(data.translation);
};
```

---

## Next Steps

1. **Set up MediaPipe**: Start with hand tracking
2. **Collect Training Data**: Create dataset for your target signs
3. **Train Model**: Use TensorFlow/PyTorch to train recognition model
4. **Deploy**: Set up production infrastructure
5. **Iterate**: Improve accuracy based on user feedback


