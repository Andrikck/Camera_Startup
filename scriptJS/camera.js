// Отримуємо елемент <video>
const video = document.querySelector('.camera__video');

// Функція для запуску камери
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream; // Підключаємо потік відео до елемента
  })
  .catch(error => {
    console.error('Помилка доступу до камери:', error);
  });
