# Sign Language Predictor - Complete Project

A full-stack Sign Language Detection application with React frontend and Flask backend, powered by Deep Learning CNN models.

## 🎯 Project Overview

This project detects **hand signs for alphabets** from real-time video input using a **Convolutional Neural Network (CNN)** model. It's built to assist in **communication for hearing and speech-impaired communities**.

The application consists of:

- **React Frontend**: Modern, responsive UI built with React
- **Flask Backend**: Python API server with TensorFlow/Keras model
- **Deep Learning Model**: CNN-based sign language detection (24 alphabet classes: A-Z, blank)

## ✨ Features

✅ Real-time **Sign Language Gesture Detection** using webcam  
✅ Deep Learning Model with CNN architecture  
✅ Modern React-based web interface  
✅ Real-time translation with confidence scores  
✅ Message history tracking  
✅ Responsive design for all devices  
✅ Easy to extend for full word and sentence-level translation

## 🛠️ Tech Stack

| Category            | Technologies Used                   |
| ------------------- | ----------------------------------- |
| **Frontend**        | React 19, React Router, Bootstrap 5 |
| **Backend**         | Flask, Flask-CORS                   |
| **Deep Learning**   | TensorFlow 2.20, Keras              |
| **Computer Vision** | OpenCV                              |
| **Programming**     | Python 3.11+, JavaScript (ES6+)     |

## 📂 Project Structure

```
sign-language-react-app/
├── backend/
│   ├── app.py                              # Flask API server
│   ├── requirements.txt                    # Python dependencies
│   ├── signlanguagedetectionmodel128x128.json  # Model architecture
│   └── signlanguagedetectionmodel128x128.h5    # Model weights
├── public/                                 # Static assets
├── src/
│   ├── components/                         # React components
│   │   ├── Header.js                       # Navigation header
│   │   └── Footer.js                       # Footer component
│   ├── pages/                              # Page components
│   │   ├── Home.js                         # Home page
│   │   ├── Chatbot.js                      # Main translation interface
│   │   ├── LearnSigns.js                   # Learning resources
│   │   └── ...
│   ├── App.js                              # Main app component
│   └── index.js                            # Entry point
├── package.json                            # Node.js dependencies
└── README.md                               # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher) and npm
- **Python** (3.11 or higher)
- **Webcam** for real-time detection

### Installation & Setup

#### 1. Install Frontend Dependencies

```bash
cd sign-language-react-app
npm install
```

#### 2. Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

**Note**: If you encounter issues with TensorFlow installation, you may need to use a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 🎯 Running the Project (Easy Way!)

**You have 3 options to run the project:**

#### Option 1: One-Click Startup (Recommended for Windows) ⭐

Simply double-click `start-all.bat` in the `sign-language-react-app` folder. This will automatically start both servers!

#### Option 2: Using npm Script (Requires concurrently)

```bash
cd sign-language-react-app
npm install  # Install concurrently if not already installed
npm run start:all
```

#### Option 3: Manual Startup (Two Separate Terminals)

**Terminal 1 - Backend:**

```bash
cd sign-language-react-app/backend
python app.py  # Or use venv: ..\..\venv\Scripts\activate && python app.py
```

**Terminal 2 - Frontend:**

```bash
cd sign-language-react-app
npm start
```

The backend server will start on `http://127.0.0.1:5000`  
The React app will start on `http://localhost:3000` and automatically open in your browser.

## 🎮 Usage

1. **Start Both Servers**: Make sure both the Flask backend and React frontend are running
2. **Navigate to Chatbot**: Click on "Chatbot" in the navigation menu
3. **Allow Camera Access**: Grant camera permissions when prompted
4. **Start Translation**: Click "Start Translation" button
5. **Show Signs**: Position your hand in the camera view (the app will detect signs in real-time)
6. **View Results**: See the detected alphabet and confidence score in real-time
7. **Message History**: Detected signs with high confidence (>70%) are automatically added to the message history

## 🔧 Configuration

### Backend API URL

If your backend runs on a different port, update the API URL in `src/pages/Chatbot.js`:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:5000";
```

Or set an environment variable:

```bash
export REACT_APP_API_URL=http://your-backend-url:port
```

### Model Configuration

The model detects 24 classes:

- **Alphabets**: A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, U, W, X, Y, Z
- **Special**: blank (no sign detected)

## 📡 API Endpoints

### `GET /api/health`

Health check endpoint to verify backend is running.

**Response:**

```json
{
  "status": "ok",
  "model_loaded": true
}
```

### `GET /api/video`

Video streaming endpoint (MJPEG stream) with real-time predictions overlaid.

### `POST /api/predict`

Predict sign language from a single image frame.

**Request:**

```json
{
  "image": "data:image/jpeg;base64,..."
}
```

**Response:**

```json
{
  "prediction": "A",
  "confidence": 95.5,
  "all_predictions": {
    "A": 95.5,
    "B": 2.1,
    ...
  }
}
```

## 🐛 Troubleshooting

### Backend Issues

- **ModuleNotFoundError**: Make sure all dependencies are installed: `pip install -r requirements.txt`
- **Camera not accessible**: Check if another application is using the camera
- **Model file not found**: Ensure model files are in the `backend/` directory

### Frontend Issues

- **Backend not connected**: Check that Flask server is running on port 5000
- **Camera permission denied**: Allow camera access in browser settings
- **CORS errors**: Ensure Flask-CORS is installed and CORS is enabled in `app.py`

### Performance Issues

- **Slow predictions**: Reduce prediction frequency in `Chatbot.js` (currently 500ms)
- **High CPU usage**: The model runs on CPU by default. For better performance, ensure TensorFlow can use GPU if available

## 🎯 Future Improvements

🔹 Train model for **sentence-level predictions**  
🔹 Improve accuracy with **larger datasets**  
🔹 Add **gesture-to-speech output**  
🔹 Deploy on **cloud platforms**  
🔹 Add **user authentication**  
🔹 Implement **session history saving**  
🔹 Add **multiple sign language support**

## 📝 Notes

- The model is trained on 128x128 grayscale images
- Detection works best with good lighting and clear hand visibility
- The ROI (Region of Interest) is set to coordinates (0, 40) to (300, 300) - position your hand in this area
- Confidence threshold for adding to message history is set to 70%

## ❓ FAQ

### Do I need to run both servers separately every time?

**No!** You have easier options:

1. **Windows**: Double-click `start-all.bat` - it starts both servers automatically
2. **Use npm script**: Run `npm run start:all` (concurrently is already installed)
3. **Manual**: Yes, you can run them separately if you prefer more control

The startup scripts handle everything for you!

### React vs HTML/CSS/JS - Which is better for this project?

**React is better for this project** because:

✅ **State Management**: React's state management makes it easier to handle real-time predictions, camera feed, and message history

✅ **Component Reusability**: The UI components (Header, Footer, Chatbot) are reusable and maintainable

✅ **Real-time Updates**: React's efficient re-rendering is perfect for continuously updating predictions and confidence scores

✅ **API Integration**: Easier to integrate with the Flask backend API using fetch/axios

✅ **Modern Development**: Hot reload, better debugging tools, and component-based architecture

✅ **Scalability**: If you want to add features like user authentication, real-time chat, or advanced UI interactions, React makes it much easier

**However**, if you want a **simpler, lighter-weight** solution:

- HTML/CSS/JS would work fine for a basic implementation
- But you'd lose the benefits above and need to manage everything manually
- For a production-ready app with multiple features, React is the better choice

## 📜 License

This project is licensed under the **MIT License** – feel free to use and modify.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

⭐ **If you like this project, don't forget to star this repo!** ⭐
