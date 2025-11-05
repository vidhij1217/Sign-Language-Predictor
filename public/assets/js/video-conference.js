// assets/js/video-conference.js

document.addEventListener('DOMContentLoaded', () => {
    const localVideo = document.getElementById('localVideo');
    const toggleMicBtn = document.getElementById('toggleMicBtn');
    const toggleCamBtn = document.getElementById('toggleCamBtn');
    const startCallBtn = document.getElementById('startCallBtn');
    const endCallBtn = document.getElementById('endCallBtn');
    const cameraSelect = document.getElementById('cameraSelect');
    const noCameraMessage = document.getElementById('noCameraMessage');
    const retryCameraBtn = document.getElementById('retryCamera');

    const remoteVideosGrid = document.getElementById('remoteVideosGrid');
    const callMessageHistory = document.getElementById('callMessageHistory');
    const chatInput = document.getElementById('chatInput');
    const sendChatBtn = document.getElementById('sendChatBtn');

    let localStream = null;
    let microphoneEnabled = true;
    let cameraEnabled = true;
    let callActive = false;
    let availableCameras = [];
    let currentCameraId = null;

    // --- Webcam and Device Management ---

    async function getLocalMedia(deviceId) {
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop()); // Stop existing tracks
        }
        try {
            const constraints = {
                audio: true,
                video: { deviceId: deviceId ? { exact: deviceId } : undefined }
            };
            localStream = await navigator.mediaDevices.getUserMedia(constraints);
            localVideo.srcObject = localStream;
            localVideo.style.display = 'block';
            noCameraMessage.classList.add('hidden');
            startCallBtn.disabled = false; // Enable call button once camera is ready
            console.log('Local camera and microphone started successfully.');

            // Initial state for buttons
            toggleMicBtn.innerHTML = '<img src="/assets/images/icon_mic.svg" alt="Mic On"> Mute';
            toggleCamBtn.innerHTML = '<img src="/assets/images/icon_cam.svg" alt="Cam On"> Stop Video';
            microphoneEnabled = true;
            cameraEnabled = true;

            // Enumerate devices if not already done
            if (availableCameras.length === 0) {
                await enumerateDevicesAndPopulateSelect();
            }
            if (localStream.getVideoTracks().length > 0) {
                 currentCameraId = localStream.getVideoTracks()[0].getSettings().deviceId;
                 cameraSelect.value = currentCameraId;
            }


        } catch (err) {
            console.error('Error accessing local media: ', err);
            localVideo.style.display = 'none';
            noCameraMessage.classList.remove('hidden');
            startCallBtn.disabled = true; // Disable call button if camera access fails
            toggleMicBtn.disabled = true;
            toggleCamBtn.disabled = true;
            cameraSelect.style.display = 'none';
        }
    }

    async function enumerateDevicesAndPopulateSelect() {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            availableCameras = devices.filter(device => device.kind === 'videoinput');

            if (availableCameras.length > 0) {
                cameraSelect.style.display = 'inline-flex';
                cameraSelect.innerHTML = ''; // Clear previous options
                availableCameras.forEach((device, index) => {
                    const option = document.createElement('option');
                    option.value = device.deviceId;
                    option.textContent = device.label || `Camera ${index + 1}`;
                    cameraSelect.appendChild(option);
                });
                if (currentCameraId) { // Set dropdown to currently active camera
                    cameraSelect.value = currentCameraId;
                }
            } else {
                cameraSelect.style.display = 'none';
            }
        } catch (err) {
            console.error('Error enumerating devices: ', err);
        }
    }

    // Initial media access when the page loads
    getLocalMedia();

    // --- Control Button Event Listeners ---

    toggleMicBtn.addEventListener('click', () => {
        if (localStream) {
            localStream.getAudioTracks().forEach(track => {
                track.enabled = !track.enabled;
                microphoneEnabled = track.enabled;
                toggleMicBtn.innerHTML = microphoneEnabled ?
                    '<img src="/assets/images/icon_mic.svg" alt="Mic On"> Mute' :
                    '<img src="/assets/images/icon_mic_off.svg" alt="Mic Off"> Unmute'; // Assuming you have an icon_mic_off.svg
            });
            console.log(`Microphone ${microphoneEnabled ? 'enabled' : 'disabled'}`);
        }
    });

    toggleCamBtn.addEventListener('click', () => {
        if (localStream) {
            localStream.getVideoTracks().forEach(track => {
                track.enabled = !track.enabled;
                cameraEnabled = track.enabled;
                toggleCamBtn.innerHTML = cameraEnabled ?
                    '<img src="/assets/images/icon_cam.svg" alt="Cam On"> Stop Video' :
                    '<img src="/assets/images/icon_cam_off.svg" alt="Cam Off"> Start Video'; // Assuming you have an icon_cam_off.svg
                localVideo.classList.toggle('hidden', !cameraEnabled); // Hide video if camera stopped
            });
            console.log(`Camera ${cameraEnabled ? 'enabled' : 'disabled'}`);
        }
    });

    startCallBtn.addEventListener('click', () => {
        if (callActive) return; // Prevent multiple calls

        // --- Placeholder for WebRTC call initiation ---
        console.log('Initiating call (placeholder)...');
        addCallMessageToHistory('Call started (simulated)!', 'outgoing');
        
        // Simulate remote video for demo
        simulateRemoteVideo(); 

        callActive = true;
        startCallBtn.classList.add('hidden');
        endCallBtn.classList.remove('hidden');
        toggleMicBtn.disabled = false;
        toggleCamBtn.disabled = false;
        cameraSelect.disabled = true; // Disable camera selection during active call
    });

    endCallBtn.addEventListener('click', () => {
        if (!callActive) return;

        // --- Placeholder for WebRTC call termination ---
        console.log('Ending call (placeholder)...');
        addCallMessageToHistory('Call ended (simulated).', 'incoming');

        // Stop local media tracks
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
            localVideo.srcObject = null;
        }

        // Clear simulated remote videos
        remoteVideosGrid.innerHTML = `
            <div class="video-placeholder">
                <p>Waiting for participants...</p>
                <img src="/assets/images/icon_video_call.svg" alt="Video Placeholder" class="placeholder-icon">
            </div>
        `;

        callActive = false;
        startCallBtn.classList.remove('hidden');
        endCallBtn.classList.add('hidden');
        toggleMicBtn.disabled = true; // Disable controls after call ends until new one starts
        toggleCamBtn.disabled = true;
        cameraSelect.disabled = false; // Re-enable camera selection
        getLocalMedia(currentCameraId); // Re-initialize local camera after call ends
    });

    cameraSelect.addEventListener('change', (event) => {
        if (!callActive) { // Only allow changing camera if not in an active call
            const selectedDeviceId = event.target.value;
            getLocalMedia(selectedDeviceId);
        }
    });

    retryCameraBtn.addEventListener('click', () => {
        getLocalMedia(); // Attempt to get camera access again
    });

    // --- Chat Functionality ---

    sendChatBtn.addEventListener('click', () => {
        sendMessage();
    });

    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
        const messageText = chatInput.value.trim();
        if (messageText) {
            addCallMessageToHistory(messageText, 'outgoing');
            chatInput.value = ''; // Clear input
            // In a real app, send this message via WebRTC data channel
            console.log('Sent chat message:', messageText);

            // Simulate a response from a "remote" user
            setTimeout(() => {
                addCallMessageToHistory(`Echo: ${messageText}`, 'incoming');
            }, 1000);
        }
    }

    function addCallMessageToHistory(text, type) {
        const timestamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', type);
        messageDiv.innerHTML = `
            <span class="timestamp">${timestamp}</span>
            <p>${text}</p>
        `;
        callMessageHistory.prepend(messageDiv); // Add to top for reverse-column
    }

    // --- Simulation for Demo (Remove in real WebRTC app) ---
    function simulateRemoteVideo() {
        remoteVideosGrid.innerHTML = ''; // Clear placeholder
        
        const remoteVideoDiv = document.createElement('div');
        remoteVideoDiv.classList.add('remote-video');
        remoteVideoDiv.innerHTML = `
            <video autoplay playsinline muted></video>
            <p>Remote User 1</p>
        `;
        const simulatedVideo = remoteVideoDiv.querySelector('video');
        
        // This is a dummy stream or a placeholder. In a real app, this would be a PeerConnection's remote stream
        // For now, we'll just show the local stream on remote for visual demo
        if (localStream) {
             simulatedVideo.srcObject = localStream.clone(); // Use a cloned stream for "remote" video
        } else {
             // Fallback if local stream isn't available
             simulatedVideo.style.backgroundColor = 'gray';
             simulatedVideo.style.display = 'none'; // Hide video element if no stream
             remoteVideoDiv.querySelector('p').textContent = 'Remote User 1 (no stream)';
        }

        remoteVideosGrid.appendChild(remoteVideoDiv);
    }

    // Add dummy icons for mute/unmute if you don't have actual SVG files yet
    // This is a temporary measure to prevent broken image icons
    if (!document.querySelector('img[src="/assets/images/icon_mic_off.svg"]')) {
        const style = document.createElement('style');
        style.innerHTML = `
            .btn img[src="/assets/images/icon_mic_off.svg"] { content: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.2 3c-.1-.34-.21-.67-.34-1H11v4c-5.07-.56-9-4.7-9-9.8C2 5.5 5.5 2 9.8 2H11v2H9.8c-2.43 0-4.4 1.97-4.4 4.4S7.37 14.8 9.8 14.8H11v2h1c.14 0 .28-.01.42-.03-.27.42-.58.8-.93 1.13L16 22l1.4-1.4-3.59-3.59z"/></svg>'); }
            .btn img[src="/assets/images/icon_cam_off.svg"] { content: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM16 16H4V8h12v8z"/></svg>'); }
        `;
        document.head.appendChild(style);
    }
});