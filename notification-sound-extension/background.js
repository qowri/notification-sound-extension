// Обработчик уведомлений
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "showNotification") {
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icon48.png',
            title: request.title,
            message: request.message
        });
    }
});