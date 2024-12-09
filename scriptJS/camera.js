const video = document.getElementById('video');
const toggleCameraButton = document.getElementById('toggleCamera');
let currentStream;
let currentDeviceId = null;
let isFrontCamera = true; // Для дзеркального відображення фронтальної камери

// Функція для запуску відео з камери
const startCamera = (deviceId = null) => {
    const constraints = {
        video: {
            facingMode: deviceId ? undefined : (isFrontCamera ? 'user' : 'environment'), // Вибір фронтальної або основної камери
            deviceId: deviceId ? { exact: deviceId } : undefined
        }
    };

    navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
            if (currentStream) {
                currentStream.getTracks().forEach(track => track.stop()); // Зупиняємо попереднє відео
            }
            currentStream = stream;
            video.srcObject = stream;

            // Якщо фронтальна камера, застосовуємо дзеркальне відображення
            video.style.transform = isFrontCamera ? 'scaleX(-1)' : 'none';
        })
        .catch(error => {
            console.error('Помилка доступу до камери:', error);
        });
};

// Отримуємо доступні камери
const getCameras = () => {
    navigator.mediaDevices.enumerateDevices()
        .then(devices => {
            const cameras = devices.filter(device => device.kind === 'videoinput');
            if (cameras.length > 1) {
                toggleCameraButton.style.display = 'block'; // Показуємо кнопку для перемикання камери
            }
        })
        .catch(error => console.error('Помилка при отриманні списку камер:', error));
};

// Обробка перемикання камери
toggleCameraButton.addEventListener('click', () => {
    navigator.mediaDevices.enumerateDevices()
        .then(devices => {
            const cameras = devices.filter(device => device.kind === 'videoinput');
            if (cameras.length > 1) {
                // Перемикаємо камеру
                isFrontCamera = !isFrontCamera;
                startCamera();
            }
        })
        .catch(error => console.error('Помилка при перемиканні камери:', error));
});

// Спочатку запускаємо першу камеру
startCamera();
getCameras();