const video = document.getElementById('video');
        const toggleCameraButton = document.getElementById('toggleCamera');
        let currentStream;
        let currentDeviceId = null;

        // Функція для запуску відео з камери
        const startCamera = (deviceId = null) => {
            const constraints = {
                video: {
                    facingMode: deviceId ? undefined : 'user', // Якщо deviceId передано, то вибираємо конкретну камеру
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
                        const nextDeviceId = currentDeviceId === cameras[0].deviceId ? cameras[1].deviceId : cameras[0].deviceId;
                        currentDeviceId = nextDeviceId;
                        startCamera(currentDeviceId);
                    }
                })
                .catch(error => console.error('Помилка при перемиканні камери:', error));
        });

        // Спочатку запускаємо першу камеру
        startCamera();
        getCameras();