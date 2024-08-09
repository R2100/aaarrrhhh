// main.js

// Inicializar el juego
const game = new TowerDefenseGame();
game.drawGame();
// Función para manejar el redimensionamiento de la ventana
function handleResize() {
    const gameBoard = document.getElementById('game-board');
    game.canvas.width = gameBoard.clientWidth;
    game.canvas.height = gameBoard.clientHeight;
    game.drawGame(); // Redibujar el juego después de cambiar el tamaño
}

// Agregar evento de redimensionamiento
window.addEventListener('resize', handleResize);

// Iniciar el juego cuando se presiona el botón de play
document.getElementById('play-pause').addEventListener('click', () => {
    if (game.isPaused) {
        game.togglePlayPause();
    }
});

// Función para actualizar el FPS
let frameCount = 0;
let lastTime = performance.now();
let fps = 0;

function updateFPS() {
    frameCount++;
    const currentTime = performance.now();
    if (currentTime - lastTime >= 1000) {
        fps = frameCount;
        frameCount = 0;
        lastTime = currentTime;
        document.getElementById('fps').textContent = fps;
    }
}

// Bucle principal del juego
function gameLoop(currentTime) {
    game.updateGame(currentTime);
    game.drawGame();
    updateFPS();
    requestAnimationFrame(gameLoop);
}

// Iniciar el bucle del juego
requestAnimationFrame(gameLoop);
/*
// Asegurarse de que el botón de play/pause esté conectado correctamente
document.getElementById('play-pause').addEventListener('click', () => {
    game.togglePlayPause();
});*/