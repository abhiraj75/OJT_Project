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
    if (!gameRunning) return;
    if (e.key === 'ArrowLeft') moveDirection = -1;
    if (e.key === 'ArrowRight') moveDirection = 1;
});

document.addEventListener('keyup', (e) => {
    if (!gameRunning) return;
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

function startBlockSpawning() {
    clearInterval(blockIntervalId);
    blockIntervalId = setInterval(createBlock, spawnRate);
}

function createBlock() {
    if (!gameRunning) return;

    const block = document.createElement("div");
    block.classList.add("block");

    const maxLeft = areaWidth - 35;
    const randomLeft = Math.floor(Math.random() * maxLeft);

    block.style.left = randomLeft + "px";
    block.style.top = "-40px";

    gameArea.appendChild(block);

    blocks.push({
        element: block,
        top: -40,
        speed: 3 + level + (score / 20)
    });
}

function checkLevelUp() {
    let newLevel = level;

    if (score >= 100) newLevel = 5;
    else if (score >= 50) newLevel = 4;
    else if (score >= 25) newLevel = 3;
    else if (score >= 10) newLevel = 2;

    if (newLevel > level) {
        level = newLevel;
        levelDisplay.textContent = level;
        
        // Show Level Up Message
        levelUpMsg.classList.remove("hidden");
        setTimeout(() => levelUpMsg.classList.add("hidden"), 1500);

        // Increase Difficulty
        if (level === 2) spawnRate = 700;
        if (level === 3) spawnRate = 600;
        if (level === 4) spawnRate = 500;
        if (level === 5) spawnRate = 400;

        startBlockSpawning();
    }
}

function gameLoop() {
    if (!gameRunning) return;

    // Visual Player Tilt
    if (moveDirection !== 0) {
        player.style.transform = `skewX(${moveDirection * -10}deg)`;
    } else {
        player.style.transform = "skewX(0deg)";
    }

    // Block movement
    for (let i = blocks.length - 1; i >= 0; i--) {
        let b = blocks[i];

        b.top += b.speed;
        b.element.style.top = b.top + "px";
        b.element.style.transform = `rotate(${45 + b.top}deg)`;

        // Collision check
        if (checkCollision(player, b.element)) {
            createExplosion(playerX);
            endGame();
            return;
        }

        // Block passed bottom
        if (b.top > areaHeight) {
            b.element.remove();
            blocks.splice(i, 1);

            score++;
            scoreDisplay.textContent = score;
            checkLevelUp();
        }
    }

    animationFrameId = requestAnimationFrame(gameLoop);
}

function checkCollision(playerEl, blockEl) {
    const pRect = playerEl.getBoundingClientRect();
    const bRect = blockEl.getBoundingClientRect();
    const pad = 8;

    return !(
        pRect.top + pad > bRect.bottom - pad ||
        pRect.bottom - pad < bRect.top + pad ||
        pRect.right - pad < bRect.left + pad ||
        pRect.left + pad > bRect.right - pad
    );
}

// function createExplosion(x) {
//     const boom = document.createElement("div");
//     boom.classList.add("explosion");
//     boom.style.left = x + "px";
//     boom.style.bottom = "20px";
//     gameArea.appendChild(boom);

//     setTimeout(() => boom.remove(), 500);
// }

// --- End Game Logic ---
function endGame() {
    gameRunning = false;

    cancelAnimationFrame(animationFrameId);
    clearInterval(blockIntervalId);

    // Update High Score
    if (score > highScore) {
        highScore = score;
        highScoreName = currentPlayerName;
        
        localStorage.setItem("cyberDodgeHighScore", highScore);
        localStorage.setItem("cyberDodgeHighScoreName", highScoreName);
        
        highScoreDisplay.textContent = highScore;
        if(highScoreNameDisplay) highScoreNameDisplay.textContent = `(${highScoreName})`;
    }
    
    // SAFE UPDATES: We check if element exists before setting text
    if(finalPlayerName) finalPlayerName.textContent = currentPlayerName;
    if(finalScoreDisplay) finalScoreDisplay.textContent = score;
    if(finalHighScoreDisplay) finalHighScoreDisplay.textContent = highScore;
    if(finalHighScoreName) finalHighScoreName.textContent = highScoreName;

    // Show Game Over Screen
    if(gameOverScreen) gameOverScreen.classList.remove("hidden");

    // Screen Shake
    document.body.classList.add("shake");
    setTimeout(() => {
        document.body.classList.remove("shake");
    }, 500);
}

function resetGame() {
    // Go back to Start Screen to allow name change
    startScreen.classList.remove("hidden");
    gameOverScreen.classList.add("hidden");
}

// REGISTER SERVICE WORKER

if ("serviceWorker" in navigator) {
  // Browser supports Service Workers

  window.addEventListener("load", () => {
    // Wait until page fully loads

    navigator.serviceWorker
      .register("service-worker.js")  // path to the SW file
      .then((reg) => {
        console.log("Service Worker registered:", reg.scope);
      })
      .catch((err) => {
        console.log("Service Worker registration failed:", err);
      });
  });
}
