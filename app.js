const video = document.getElementById('video');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');

let mediaRecorder;
let recordedChunks = [];

async function startCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    video.srcObject = stream;

    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = function(event) {
        if (event.data.size > 0) {
            recordedChunks.push(event.data);
        }
    };

    mediaRecorder.onstop = function() {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        downloadVideo(url);
        recordedChunks = [];
    };

    startBtn.disabled = true;
    stopBtn.disabled = false;
    mediaRecorder.start();
}

function stopCamera() {
    mediaRecorder.stop();
    startBtn.disabled = false;
    stopBtn.disabled = true;
}

function downloadVideo(url) {
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'bodycam-video.webm';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
}

startBtn.addEventListener('click', startCamera);
stopBtn.addEventListener('click', stopCamera);
