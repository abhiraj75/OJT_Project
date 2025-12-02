// --- DOM Elements ---
const gameArea = document.getElementById('gameArea');
const player = document.getElementById('player');
const scoreDisplay = document.getElementById("score");
const levelDisplay = document.getElementById("level");
const highScoreDisplay = document.getElementById("high-score");
const highScoreNameDisplay = document.getElementById("high-score-name"); 
const playerNameDisplay = document.getElementById("player-name-display"); 
const nameInput = document.getElementById("name-input");

// Game Over Elements
const finalPlayerName = document.getElementById("final-player-name");
const finalHighScoreName = document.getElementById("final-high-score-name");
const finalScoreDisplay = document.getElementById("final-score");
const finalHighScoreDisplay = document.getElementById("final-high-score");

// Screens
const startScreen = document.getElementById("start-screen");
const gameOverScreen = document.getElementById("game-over-screen");
const levelUpMsg = document.getElementById("level-up-msg");

// --- Game Variables ---
let areaWidth = gameArea.clientWidth;
let areaHeight = gameArea.clientHeight;
let playerX = areaWidth / 2 - 20; 
let playerSpeed = 6;
let moveDirection = 0;

let gameRunning = false;
let score = 0;
let level = 1;
let currentPlayerName = "GUEST";
let spawnRate = 800;

let animationFrameId;
let blockIntervalId;
let blocks = [];

// High Score Retrieval
let highScore = localStorage.getItem("cyberDodgeHighScore") || 0;
let highScoreName = localStorage.getItem("cyberDodgeHighScoreName") || "CPU";

// Set Initial High Score Display
highScoreDisplay.textContent = highScore;
if(highScoreNameDisplay) highScoreNameDisplay.textContent = `(${highScoreName})`;

// --- 1. Movement Logic (Day 1) ---
function updatePlayerPos() {
    player.style.left = playerX + 'px';
}
updatePlayerPos();

window.addEventListener('resize', () => {
    areaWidth = gameArea.clientWidth;
    areaHeight = gameArea.clientHeight; // Also update height on resize
    if (playerX > areaWidth - 40) {
        playerX = areaWidth - 40;
        updatePlayerPos();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') moveDirection = -1;
    if (e.key === 'ArrowRight') moveDirection = 1;
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' && moveDirection === -1) moveDirection = 0;
    if (e.key === 'ArrowRight' && moveDirection === 1) moveDirection = 0;
});

function updateGame() {
    // Note: We don't check gameRunning here so player can move on menu (optional)
    // But to freeze player on Game Over, add: if(!gameRunning) return;
    
    if (moveDirection !== 0) {
        playerX += moveDirection * playerSpeed;
        const maxLeft = areaWidth - 40; 
        if (playerX < 0) playerX = 0;
        if (playerX > maxLeft) playerX = maxLeft;
        updatePlayerPos();
    }
    requestAnimationFrame(updateGame);
}
requestAnimationFrame(updateGame);


// --- 2. Game Logic ---

// Touch controls
function handleTouchStart(direction, btn) {
    if (!gameRunning) return;
    moveDirection = direction;
    if (btn) btn.classList.add("active");
}

function handleTouchEnd(btn) {
    moveDirection = 0;
    if (btn) btn.classList.remove("active");
}

// Start Game
function startGame() {
    // 1. Get Name Input
    if (nameInput) {
        const rawName = nameInput.value.trim();
        currentPlayerName = rawName !== "" ? rawName : "PILOT";
    }
    
    if (playerNameDisplay) playerNameDisplay.textContent = currentPlayerName;
    
    startScreen.classList.add("hidden");
    gameOverScreen.classList.add("hidden");

    score = 0;
    level = 1; 
    spawnRate = 800; 
    
    scoreDisplay.textContent = score;
    levelDisplay.textContent = level;
    gameRunning = true;

    // Clear existing blocks
    blocks.forEach(b => b.element.remove());
    blocks = [];

    // Reset Player
    areaWidth = gameArea.clientWidth;
    areaHeight = gameArea.clientHeight;
    playerX = (areaWidth / 2) - 20;
    updatePlayerPos();
    moveDirection = 0;

    // Reset Timers
    cancelAnimationFrame(animationFrameId);
    clearInterval(blockIntervalId);

    // Start Loops
    animationFrameId = requestAnimationFrame(gameLoop);
    startBlockSpawning();
}