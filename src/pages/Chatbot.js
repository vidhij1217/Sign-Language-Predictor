import React, { useState, useEffect, useRef } from 'react';
import './Chatbot.css';

// Backend API URL - adjust this if your backend runs on a different port
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';

function Chatbot() {
  const webcamFeedRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [availableCameras, setAvailableCameras] = useState([]);
  const [currentCameraIndex, setCurrentCameraIndex] = useState(0);
  const [currentTranslation, setCurrentTranslation] = useState('Waiting for signs...');
  const [currentConfidence, setCurrentConfidence] = useState('');
  const [messageHistory, setMessageHistory] = useState([
    {
      id: 1,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      text: 'Welcome to SignBridge Chatbot! Point your camera to translate signs.',
    },
  ]);
  const [showNoCamera, setShowNoCamera] = useState(false);
  const [startButtonDisabled, setStartButtonDisabled] = useState(false);
  const [backendConnected, setBackendConnected] = useState(false);
  const translationIntervalRef = useRef(null);
  const predictionIntervalRef = useRef(null);
  const canvasRef = useRef(null);

  // Get camera access
  const getMedia = async (deviceId) => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    try {
      const constraints = {
        video: { deviceId: deviceId ? { exact: deviceId } : undefined },
      };
      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(newStream);
      if (webcamFeedRef.current) {
        webcamFeedRef.current.srcObject = newStream;
      }
      setShowNoCamera(false);
      setStartButtonDisabled(false);

      if (availableCameras.length === 0) {
        enumerateDevices();
      }
    } catch (err) {
      console.error('Error accessing camera: ', err);
      setShowNoCamera(true);
      setStartButtonDisabled(true);
    }
  };

  // Enumerate available cameras
  const enumerateDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter((device) => device.kind === 'videoinput');
      setAvailableCameras(cameras);
    } catch (err) {
      console.error('Error enumerating devices: ', err);
    }
  };

  // Check backend connection
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/health`);
        if (response.ok) {
          setBackendConnected(true);
        } else {
          setBackendConnected(false);
        }
      } catch (error) {
        console.error('Backend not available:', error);
        setBackendConnected(false);
      }
    };
    checkBackend();
    const interval = setInterval(checkBackend, 5000); // Check every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // Initial camera access
  useEffect(() => {
    getMedia();
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (translationIntervalRef.current) {
        clearInterval(translationIntervalRef.current);
      }
      if (predictionIntervalRef.current) {
        clearInterval(predictionIntervalRef.current);
      }
    };
  }, []);

  // Capture frame and get prediction from backend
  const captureFrameAndPredict = async () => {
    if (!webcamFeedRef.current || !canvasRef.current) return;

    try {
      const video = webcamFeedRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      // Set canvas size to match video
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      // Draw current video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert canvas to base64
      const imageData = canvas.toDataURL('image/jpeg', 0.8);

      // Send to backend for prediction
      const response = await fetch(`${API_BASE_URL}/api/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageData }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.prediction && data.prediction !== 'blank') {
          const predictionText = data.prediction;
          const confidence = data.confidence || 0;
          
          setCurrentTranslation(predictionText);
          setCurrentConfidence(`${confidence.toFixed(1)}%`);

          // Add to history if confidence is high enough and it's different from last message
          if (confidence > 70 && messageHistory[0]?.text !== predictionText) {
            addMessageToHistory(predictionText);
          }
        } else {
          setCurrentTranslation('Waiting for signs...');
          setCurrentConfidence('');
        }
      }
    } catch (error) {
      console.error('Error getting prediction:', error);
    }
  };

  // Start translation
  const startTranslation = () => {
    if (!backendConnected) {
      alert('Backend server is not available. Please make sure the Flask backend is running on port 5000.');
      return;
    }

    if (!stream) {
      alert('No camera feed available. Please ensure camera is connected and access is granted.');
      return;
    }

    setIsTranslating(true);
    console.log('Translation started - connecting to backend');

    // Get predictions every 500ms
    predictionIntervalRef.current = setInterval(captureFrameAndPredict, 500);
  };

  // Stop translation
  const stopTranslation = () => {
    setIsTranslating(false);
    setCurrentTranslation('Waiting for signs...');
    setCurrentConfidence('');
    console.log('Translation stopped');
    if (translationIntervalRef.current) {
      clearInterval(translationIntervalRef.current);
    }
    if (predictionIntervalRef.current) {
      clearInterval(predictionIntervalRef.current);
    }
  };

  // Toggle start/stop
  const handleStartStop = () => {
    if (isTranslating) {
      stopTranslation();
    } else {
      startTranslation();
    }
  };

  // Add message to history
  const addMessageToHistory = (text) => {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const newMessage = {
      id: Date.now(),
      timestamp,
      text,
    };
    setMessageHistory((prev) => [newMessage, ...prev]);
  };

  // Toggle camera
  const handleToggleCamera = () => {
    if (availableCameras.length > 1) {
      const nextIndex = (currentCameraIndex + 1) % availableCameras.length;
      setCurrentCameraIndex(nextIndex);
      getMedia(availableCameras[nextIndex].deviceId);
    }
  };

  // Handle camera select change
  const handleCameraSelectChange = (e) => {
    const selectedDeviceId = e.target.value;
    const selectedIndex = availableCameras.findIndex((d) => d.deviceId === selectedDeviceId);
    setCurrentCameraIndex(selectedIndex);
    getMedia(selectedDeviceId);
  };

  // Copy text to clipboard
  const handleCopyText = () => {
    if (currentTranslation && currentTranslation !== 'Waiting for signs...') {
      navigator.clipboard
        .writeText(currentTranslation)
        .then(() => {
          alert('Translation copied to clipboard!');
        })
        .catch((err) => {
          console.error('Failed to copy: ', err);
        });
    }
  };

  // Clear history
  const handleClearHistory = () => {
    setMessageHistory([
      {
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        text: 'Welcome to SignBridge Chatbot! Point your camera to translate signs.',
      },
    ]);
    setCurrentTranslation('Waiting for signs...');
  };

  return (
    <main id="main-content">
      <section id="chatbot-hero" className="chatbot-hero section-padded flow">
        <div className="container">
          <h1 className="section-title">Real-time Sign Language Chatbot</h1>
          <p className="section-description">
            Translate sign language into text or speech instantly using your webcam. Start communicating
            effortlessly.
          </p>
        </div>
      </section>

      <section id="chatbot-interface" className="chatbot-interface section-padded bg-light flow">
        <div className="container chatbot-layout">
          <div className="camera-feed-card card">
            <h2 className="card-title">Your Camera Feed</h2>
            {!backendConnected && (
              <div style={{ padding: '1rem', background: '#fff3cd', borderRadius: '4px', marginBottom: '1rem' }}>
                <strong>Warning:</strong> Backend server is not connected. Please start the Flask backend server.
                <br />
                <small>Run: <code>cd backend && python app.py</code></small>
              </div>
            )}
            <div className="video-container">
              <video
                ref={webcamFeedRef}
                autoPlay
                playsInline
                style={{ display: showNoCamera ? 'none' : 'block' }}
              ></video>
              <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
              {showNoCamera && (
                <div id="noCameraMessage">
                  <p>
                    Webcam access denied or no camera found. Please allow camera access to use the chatbot.
                  </p>
                  <button className="btn btn-primary" onClick={() => getMedia()}>
                    Retry Camera
                  </button>
                </div>
              )}
            </div>
            <div className="camera-controls">
              <button
                id="startStopBtn"
                className={`btn ${isTranslating ? 'btn-secondary' : 'btn-primary'}`}
                onClick={handleStartStop}
                disabled={startButtonDisabled || !backendConnected}
              >
                {isTranslating ? 'Stop Translation' : 'Start Translation'}
              </button>
              {availableCameras.length > 1 && (
                <>
                  <button
                    id="toggleCameraBtn"
                    className="btn btn-secondary"
                    onClick={handleToggleCamera}
                  >
                    Toggle Camera
                  </button>
                  <select id="cameraSelect" value={availableCameras[currentCameraIndex]?.deviceId || ''} onChange={handleCameraSelectChange}>
                    {availableCameras.map((device, index) => (
                      <option key={device.deviceId} value={device.deviceId}>
                        {device.label || `Camera ${index + 1}`}
                      </option>
                    ))}
                  </select>
                </>
              )}
            </div>
          </div>

          <div className="translation-output-card card">
            <h2 className="card-title">Translated Output</h2>
            <div className="output-display flow">
              <p className="current-translation" id="currentTranslation">
                {currentTranslation}
                {currentConfidence && <span style={{ marginLeft: '10px', fontSize: '0.8em', color: '#666' }}>{currentConfidence}</span>}
              </p>
              <div className="message-history flow" id="messageHistory">
                {messageHistory.map((message) => (
                  <div key={message.id} className="message incoming">
                    <span className="timestamp">{message.timestamp}</span>
                    <p>{message.text}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="output-actions">
              <button id="copyTextBtn" className="btn btn-tertiary" onClick={handleCopyText}>
                Copy Text
              </button>
              <button id="clearHistoryBtn" className="btn btn-tertiary" onClick={handleClearHistory}>
                Clear History
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Chatbot;
