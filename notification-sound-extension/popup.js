document.addEventListener('DOMContentLoaded', function () {
    const soundSelect = document.getElementById('sound-select');
    const customSoundGroup = document.getElementById('custom-sound-group');
    const soundUpload = document.getElementById('sound-upload');
    const saveBtn = document.getElementById('save-btn');
    const testBtn = document.getElementById('test-btn');
    const currentSoundDisplay = document.getElementById('current-sound');

    // Загрузка сохраненных настроек
    chrome.storage.local.get(['soundSettings'], function (result) {
        const settings = result.soundSettings || {
            soundType: 'sound1',
            customSoundUrl: null
        };

        soundSelect.value = settings.soundType;
        updateUI(settings);

        if (settings.soundType === 'custom') {
            customSoundGroup.style.display = 'block';
        }
    });

    // Обработчик выбора типа звука
    soundSelect.addEventListener('change', function () {
        if (this.value === 'custom') {
            customSoundGroup.style.display = 'block';
        } else {
            customSoundGroup.style.display = 'none';
            saveSettings({
                soundType: this.value,
                customSoundUrl: null
            });
        }
    });

    // Сохранение настроек
    saveBtn.addEventListener('click', async function () {
        const soundType = soundSelect.value;

        if (soundType === 'custom' && soundUpload.files[0]) {
            try {
                const file = soundUpload.files[0];
                if (file.size > 2 * 1024 * 1024) { // 2MB limit
                    alert('Файл слишком большой! Максимум 2MB');
                    return;
                }

                // Читаем файл как Data URL
                const reader = new FileReader();
                reader.onload = function(e) {
                    saveSettings({
                        soundType: 'custom',
                        customSoundUrl: e.target.result,
                        customSoundType: file.type
                    });
                };
                reader.readAsDataURL(file);
            } catch (error) {
                console.error('Ошибка загрузки звука:', error);
                alert('Ошибка при загрузке звука');
            }
        } else if (soundType !== 'custom') {
            saveSettings({
                soundType: soundType,
                customSoundUrl: null,
                customSoundType: null
            });
        } else {
            alert('Выберите файл для пользовательского звука');
        }
    });

    // Функция сохранения настроек
    function saveSettings(settings) {
        chrome.storage.local.set({ soundSettings: settings }, function () {
            updateUI(settings);
            alert('Настройки сохранены!');
        });
    }

    // Обновление интерфейса
    function updateUI(settings) {
        let soundName;
        switch (settings.soundType) {
            case 'sound1': soundName = 'Звук 1 (по умолчанию)'; break;
            case 'sound2': soundName = 'Звук 2'; break;
            case 'sound3': soundName = 'Звук 3'; break;
            case 'sound4': soundName = 'Звук 4'; break;
            case 'sound5': soundName = 'Звук 5'; break;
            case 'sound6': soundName = 'Звук 6'; break;
            case 'sound7': soundName = 'Звук 7'; break;
            case 'custom': soundName = 'Пользовательский звук'; break;
            default: soundName = 'Звук 1 (по умолчанию)';
        }
        currentSoundDisplay.textContent = `Текущий звук: ${soundName}`;
    }

    // Кнопка тестирования
    testBtn.addEventListener('click', function () {
        chrome.storage.local.get(['soundSettings'], function (result) {
            const settings = result.soundSettings || {
                soundType: 'sound1',
                customSoundUrl: null,
                customSoundType: null
            };

            let sound;
            if (settings.soundType === 'custom' && settings.customSoundUrl) {
                sound = new Audio(settings.customSoundUrl);
            } else {
                const soundFile = settings.soundType || 'sound1';
                sound = new Audio(chrome.runtime.getURL(`${soundFile}.mp3`));
            }

            sound.currentTime = 0;
            sound.play().catch(e => {
                console.error('Ошибка воспроизведения:', e);
                alert('Ошибка воспроизведения звука');
            });
        });
    });
});