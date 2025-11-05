import React, { useEffect, useRef, useState } from 'react';
import './VideoConference.css';

function VideoConference() {
  const localVideoRef = useRef(null);
  const [localStream, setLocalStream] = useState(null);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [callActive, setCallActive] = useState(false);
  const [cameras, setCameras] = useState([]);
  const [cameraId, setCameraId] = useState('');
  const [messages, setMessages] = useState([]);
  const [chatText, setChatText] = useState('');

  const addMsg = (text, type) => {
    setMessages(prev => [{ id: Date.now(), ts: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }), text, type }, ...prev]);
  };

  const getLocalMedia = async (deviceId) => {
    if (localStream) localStream.getTracks().forEach(t => t.stop());
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: deviceId ? { deviceId: { exact: deviceId } } : true });
      setLocalStream(stream);
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      setMicOn(true); setCamOn(true);
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cams = devices.filter(d => d.kind === 'videoinput');
      setCameras(cams);
      const activeTrack = stream.getVideoTracks()[0];
      if (activeTrack && activeTrack.getSettings().deviceId) setCameraId(activeTrack.getSettings().deviceId);
    } catch (e) {
      console.error('Camera access error', e);
      setLocalStream(null);
    }
  };

  useEffect(() => { getLocalMedia(); return () => { if (localStream) localStream.getTracks().forEach(t => t.stop()); }; /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  const toggleMic = () => {
    if (!localStream) return;
    localStream.getAudioTracks().forEach(t => { t.enabled = !t.enabled; setMicOn(t.enabled); });
  };
  const toggleCam = () => {
    if (!localStream) return;
    localStream.getVideoTracks().forEach(t => { t.enabled = !t.enabled; setCamOn(t.enabled); });
  };
  const startCall = () => {
    if (callActive) return; setCallActive(true); addMsg('Call started (simulated)!', 'outgoing');
  };
  const endCall = () => {
    if (!callActive) return; setCallActive(false); addMsg('Call ended (simulated).', 'incoming'); getLocalMedia(cameraId);
  };
  const sendChat = () => {
    const t = chatText.trim(); if (!t) return; addMsg(t, 'outgoing'); setChatText(''); setTimeout(() => addMsg(`Echo: ${t}`, 'incoming'), 800);
  };
  return (
    <main id="main-content">
      {/* Hero */}
      <section id="video-hero" className="section-padded text-center">
        <div className="container">
          <h1 className="display-6 fw-semibold mb-3">Live Video Calls with Translation</h1>
          <p className="lead text-muted">Connect with anyone, anywhere. Our real-time translation makes every conversation accessible.</p>
        </div>
      </section>

      {/* Interface */}
      <section id="video-interface" className="section-padded bg-light">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-7">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h2 className="h4 card-title mb-3">Local Camera</h2>
                  <div className="ratio ratio-4x3 bg-dark rounded mb-3">
                    <video ref={localVideoRef} autoPlay playsInline muted className="w-100" />
                  </div>
                  <div className="d-flex gap-2 flex-wrap align-items-center">
                    <button className="btn btn-primary" onClick={toggleMic} disabled={!localStream}>
                      <img src="/assets/images/icon_mic.svg" alt="Mic" className="me-2"/>{micOn ? 'Mute' : 'Unmute'}
                    </button>
                    <button className="btn btn-primary" onClick={toggleCam} disabled={!localStream}>
                      <img src="/assets/images/icon_cam.svg" alt="Cam" className="me-2"/>{camOn ? 'Stop Video' : 'Start Video'}
                    </button>
                    {!callActive ? (
                      <button className="btn btn-success" onClick={startCall} disabled={!localStream}>Start Call</button>
                    ) : (
                      <button className="btn btn-danger" onClick={endCall}>End Call</button>
                    )}
                    <select className="form-select w-auto" value={cameraId} onChange={(e)=>{ if(!callActive) setCameraId(e.target.value); getLocalMedia(e.target.value); }} disabled={callActive || cameras.length===0}>
                      {cameras.map((c, i) => (
                        <option key={c.deviceId} value={c.deviceId}>{c.label || `Camera ${i+1}`}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h2 className="h4 card-title mb-3">Remote Participant(s)</h2>
                  <div className="row g-2 mb-3">
                    <div className="col-6"><div className="ratio ratio-4x3 bg-body-secondary rounded"></div></div>
                    <div className="col-6"><div className="ratio ratio-4x3 bg-body-secondary rounded"></div></div>
                  </div>
                  <div className="mb-2">
                    <div className="d-flex gap-2">
                      <input className="form-control" value={chatText} onChange={(e)=>setChatText(e.target.value)} placeholder="Type a message" onKeyDown={(e)=> e.key==='Enter' && sendChat()} />
                      <button className="btn btn-outline-primary" onClick={sendChat}>Send</button>
                    </div>
                  </div>
                  <div className="mt-3" style={{maxHeight: 240, overflowY: 'auto'}}>
                    <div className="vstack gap-2 flex-column-reverse">
                      {messages.map(m => (
                        <div key={m.id} className={`p-2 rounded ${m.type==='outgoing' ? 'bg-primary text-white' : 'bg-light'}`}>
                          <small className="d-block text-muted">{m.ts}</small>
                          <div>{m.text}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default VideoConference;
