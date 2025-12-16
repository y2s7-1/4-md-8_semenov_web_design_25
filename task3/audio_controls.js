// Функция для управления звуком
function toggleSound() {
    if (window.game) {
        window.game.audioEnabled = !window.game.audioEnabled;
        const btn = event.target;
        btn.textContent = `ЗВУК: ${window.game.audioEnabled ? 'ВКЛ' : 'ВЫКЛ'}`;
        
        if (!window.game.audioEnabled) {
            // Остановить фоновую музыку
            if (window.game.sounds.music) {
                window.game.sounds.music.pause();
            }
        } else {
            // Возобновить фоновую музыку
            if (window.game.gameState === 'playing' && window.game.sounds.music) {
                window.game.sounds.music.play().catch(e => console.log('Ошибка воспроизведения музыки:', e));
            }
        }
    }
}