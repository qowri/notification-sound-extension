// Конфигурация
const NOTIFICATION_SELECTOR = '.notification-bg-icon';
const CHECK_INTERVAL = 1000;

// Состояние
let lastNotificationState = false;
let currentSound = new Audio(chrome.runtime.getURL('sound1.mp3'));

// Загрузка настроек звука
function loadSoundSettings() {
    chrome.storage.local.get(['soundSettings'], function (result) {
        const settings = result.soundSettings || {
            soundType: 'sound1',
            customSoundUrl: null,
            customSoundType: null
        };

        if (settings.soundType === 'custom' && settings.customSoundUrl) {
            currentSound = new Audio(settings.customSoundUrl);
        } else {
            const soundFile = settings.soundType || 'sound1';
            currentSound = new Audio(chrome.runtime.getURL(`${soundFile}.mp3`));
        }
    });
}

// Инициализация
loadSoundSettings();

// Обновление звука при изменении настроек
chrome.storage.onChanged.addListener(function (changes) {
    if (changes.soundSettings) {
        loadSoundSettings();
    }
});

// Функция проверки уведомлений
function checkForNotifications() {
    const notificationElement = document.querySelector(NOTIFICATION_SELECTOR);
    const isVisible = notificationElement &&
        getComputedStyle(notificationElement).display !== 'none';

    if (isVisible && !lastNotificationState) {
        playNotificationSound();
    }

    lastNotificationState = isVisible;
}

// Воспроизведение звука
function playNotificationSound() {
    const sound = currentSound.cloneNode();
    sound.currentTime = 0;
    sound.play().catch(e => console.error('Не удалось воспроизвести звук:', e));
}

// Наблюдатель за изменениями DOM
const observer = new MutationObserver(() => checkForNotifications());
observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style', 'class']
});