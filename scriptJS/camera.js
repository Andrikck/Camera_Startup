const video = document.getElementById('video');
const cameraSelect = document.getElementById('camera-select');

// Функція для отримання доступу до відео-пристроїв
async function getCameras() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    
    // Оновлюємо список камер у селекті
    cameraSelect.innerHTML = '';
    videoDevices.forEach((device, index) => {
        const option = document.createElement('option');
        option.value = device.deviceId;
        option.textContent = device.label || `Камера ${index + 1}`;
        cameraSelect.appendChild(option);
    });
}

// Функція для підключення до вибраної камери
async function startCamera(deviceId) {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: deviceId }
        });
        video.srcObject = stream;
    } catch (error) {
        console.error('Помилка доступу до камери:', error);
    }
}

// Спочатку отримуємо доступ до камер
getCameras();

// Перемикання між камерами при виборі у списку
cameraSelect.addEventListener('change', (event) => {
    const deviceId = event.target.value;
    startCamera(deviceId);
});

// Спочатку підключаємо основну камеру (по замовчуванню)
startCamera(cameraSelect.value);
