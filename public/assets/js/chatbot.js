// assets/js/chatbot.js

document.addEventListener('DOMContentLoaded', () => {
    const webcamFeed = document.getElementById('webcamFeed');
    const startStopBtn = document.getElementById('startStopBtn');
    const toggleCameraBtn = document.getElementById('toggleCameraBtn');
    const cameraSelect = document.getElementById('cameraSelect');
    const noCameraMessage = document.getElementById('noCameraMessage');
    const retryCameraBtn = document.getElementById('retryCamera');

    const currentTranslation = document.getElementById('currentTranslation');
    const messageHistory = document.getElementById('messageHistory');
    const copyTextBtn = document.getElementById('copyTextBtn');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');

    let stream = null;
    let isTranslating = false;
    let availableCameras = [];
    let currentCameraIndex = 0;

    // Function to get user media (webcam access)
    async function getMedia(deviceId) {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        try {
            const constraints = {
                video: { deviceId: deviceId ? { exact: deviceId } : undefined }
            };
            stream = await navigator.mediaDevices.getUserMedia(constraints);
            webcamFeed.srcObject = stream;
            webcamFeed.style.display = 'block';
            noCameraMessage.classList.add('hidden');
            startStopBtn.disabled = false; // Enable start button once camera is ready
            console.log('Camera started successfully.');

            // If this is the initial setup, enumerate devices
            if (availableCameras.length === 0) {
                await enumerateDevicesAndPopulateSelect();
            }

        } catch (err) {
            console.error('Error accessing camera: ', err);
            webcamFeed.style.display = 'none';
            noCameraMessage.classList.remove('hidden');
            startStopBtn.disabled = true; // Disable start button if camera access fails
            toggleCameraBtn.style.display = 'none';
            cameraSelect.style.display = 'none';
        }
    }

    // Function to enumerate available media devices (cameras)
    async function enumerateDevicesAndPopulateSelect() {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            availableCameras = devices.filter(device => device.kind === 'videoinput');

            if (availableCameras.length > 1) {
                toggleCameraBtn.style.display = 'inline-flex';
                cameraSelect.style.display = 'inline-flex';

                cameraSelect.innerHTML = ''; // Clear previous options
                availableCameras.forEach((device, index) => {
                    const option = document.createElement('option');
                    option.value = device.deviceId;
                    option.textContent = device.label || `Camera ${index + 1}`;
                    cameraSelect.appendChild(option);
                });
                // Set the select to the currently active camera if possible
                if (stream) {
                    const currentVideoTrack = stream.getVideoTracks()[0];
                    const currentDeviceId = currentVideoTrack ? currentVideoTrack.getSettings().deviceId : null;
                    if (currentDeviceId) {
                        cameraSelect.value = currentDeviceId;
                        currentCameraIndex = availableCameras.findIndex(d => d.deviceId === currentDeviceId);
                    }
                }
            } else {
                toggleCameraBtn.style.display = 'none';
                cameraSelect.style.display = 'none';
            }
        } catch (err) {
            console.error('Error enumerating devices: ', err);
        }
    }

    // Initial camera access request when page loads
    getMedia();

    // Event Listeners
    startStopBtn.addEventListener('click', () => {
        if (isTranslating) {
            stopTranslation();
        } else {
            startTranslation();
        }
    });

    toggleCameraBtn.addEventListener('click', () => {
        if (availableCameras.length > 1) {
            currentCameraIndex = (currentCameraIndex + 1) % availableCameras.length;
            const nextDeviceId = availableCameras[currentCameraIndex].deviceId;
            cameraSelect.value = nextDeviceId; // Update select dropdown
            getMedia(nextDeviceId);
        }
    });

    cameraSelect.addEventListener('change', (event) => {
        const selectedDeviceId = event.target.value;
        currentCameraIndex = availableCameras.findIndex(d => d.deviceId === selectedDeviceId);
        getMedia(selectedDeviceId);
    });

    retryCameraBtn.addEventListener('click', () => {
        getMedia(); // Attempt to get camera access again
    });

    copyTextBtn.addEventListener('click', () => {
        const textToCopy = currentTranslation.textContent;
        if (textToCopy && textToCopy !== "Waiting for signs...") {
            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    alert('Translation copied to clipboard!');
                })
                .catch(err => {
                    console.error('Failed to copy: ', err);
                });
        }
    });

    clearHistoryBtn.addEventListener('click', () => {
        messageHistory.innerHTML = ''; // Clears all messages
        currentTranslation.textContent = "Waiting for signs...";
        // Add initial welcome message back if desired
        const welcomeMessage = `
            <div class="message incoming">
                <span class="timestamp">${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                <p>Welcome to SignBridge Chatbot! Point your camera to translate signs.</p>
            </div>
        `;
        messageHistory.insertAdjacentHTML('beforeend', welcomeMessage);
    });

    // --- Placeholder Translation Logic ---
    function startTranslation() {
        if (!stream) {
            alert("No camera feed available. Please ensure camera is connected and access is granted.");
            return;
        }

        isTranslating = true;
        startStopBtn.textContent = 'Stop Translation';
        startStopBtn.classList.remove('btn-primary');
        startStopBtn.classList.add('btn-secondary'); // Change style to indicate active
        console.log('Translation started (placeholder)');

        // Simulate real-time translation for demo purposes
        let simulatedCount = 0;
        const simulatedWords = ["Hello", "World", "Sign", "Language", "Bridge", "Communication", "Awesome"];
        
        // This interval would be replaced by actual AI/ML model inference
        // For now, it just cycles through words
        this.translationInterval = setInterval(() => {
            const word = simulatedWords[simulatedCount % simulatedWords.length];
            currentTranslation.textContent = word;
            
            // Simulate adding to history every few words
            if (simulatedCount % 3 === 0 && simulatedCount > 0) {
                addMessageToHistory(word);
            }
            simulatedCount++;
        }, 2000); // Update every 2 seconds
    }

    function stopTranslation() {
        isTranslating = false;
        startStopBtn.textContent = 'Start Translation';
        startStopBtn.classList.remove('btn-secondary');
        startStopBtn.classList.add('btn-primary'); // Change style back
        currentTranslation.textContent = "Waiting for signs...";
        console.log('Translation stopped (placeholder)');
        clearInterval(this.translationInterval); // Stop the simulation
    }

    function addMessageToHistory(text) {
        const timestamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.innerHTML = `
            <span class="timestamp">${timestamp}</span>
            <p>${text}</p>
        `;
        messageHistory.prepend(messageDiv); // Add to top for reverse-column
        // Keep scroll position at the bottom if new message is added there
        // For column-reverse, new messages are effectively at the 'bottom' of the displayed area
        // messageHistory.scrollTop = messageHistory.scrollHeight; // If using normal column flow
    }

    // This part is crucial for active navigation link highlighting across static pages
    // It's already in main.js, but re-emphasizing its role here for clarity
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-list .nav-link');

    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');

        // Remove active class from all links first to ensure only one is active
        link.classList.remove('active');

        // Special handling for the root path '/'
        if (currentPath === '/' && linkHref === '/') {
            link.classList.add('active');
        }
        // General case: Check if current path matches the link's path (e.g., /chatbot.html)
        // This works for exact page matches
        else if (linkHref && currentPath.endsWith(linkHref)) {
            link.classList.add('active');
        }
    });
});