// Get canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');

// Game variables
let score = 0;
let lives = 3;
let gameRunning = false;
let gameStarted = false;
let rightPressed = false;
let leftPressed = false;
let mouseX = 0;
let touchX = 0;
let usingMouse = false;
let highScore = localStorage.getItem('breakoutHighScore') || 0;

// ====== ENHANCED FEATURES ======
let combo = 0;
let comboTimer = 0;
let screenShake = 0;
let ballTrail = [];

// ====== AI CONTROL VARIABLES ======
let aiControl = false;
let aiTargetX = 0;
let aiSpeed = 5;
let aiEnabled = false;
let aiDecisionCallback = null;

// ====== LASER SYSTEM ======
let laserMode = false;
let lasers = [];
let laserCooldown = 0;

// ====== AI HELPER FUNCTIONS ======
function enableAIControl(enable = true) {
    aiControl = enable;
    aiEnabled = enable;
    if (enable) {
        aiTargetX = paddle.x;
        console.log('🤖 AI Control ENABLED');
    } else {
        console.log('👤 Human Control ENABLED');
    }
}

function setAIPaddlePosition(x) {
    if (!aiControl) {
        console.warn('AI Control is not enabled. Call enableAIControl(true) first.');
        return false;
    }
    aiTargetX = Math.max(0, Math.min(canvas.width - paddle.width, x));
    return true;
}

function setAIPaddleX(x) {
    return setAIPaddlePosition(x);
}

function moveAIPaddleLeft(distance = 50) {
    if (!aiControl) return false;
    return setAIPaddlePosition(paddle.x - distance);
}

function moveAIPaddleRight(distance = 50) {
    if (!aiControl) return false;
    return setAIPaddlePosition(paddle.x + distance);
}

function startGameByAI() {
    if (!gameStarted) {
        enableAIControl(true);
        gameStarted = true;
        gameRunning = true;
        console.log('🎮 Game started by AI');
        return true;
    }
    return false;
}

function resetGameByAI() {
    resetGame();
    console.log('🔄 Game reset by AI');
    return true;
}

// Advanced AI functions
function getGameState() {
    return {
        ball: { x: ball.x, y: ball.y, dx: ball.dx, dy: ball.dy },
        paddle: { x: paddle.x, y: canvas.height - paddle.height, width: paddle.width },
        score: score,
        lives: lives,
        gameRunning: gameRunning,
        gameStarted: gameStarted,
        aiControl: aiControl,
        canvas: { width: canvas.width, height: canvas.height },
        bricksRemaining: bricks.flat().filter(brick => brick.status === 1).length,
        powerUps: powerUps.map(p => ({ x: p.x, y: p.y, effect: p.effect })),
        combo: combo,
        laserMode: laserMode
    };
}

function predictBallHitPaddle() {
    if (ball.dy > 0) {
        const timeToHit = (canvas.height - ball.radius - ball.y) / ball.dy;
        const predictedX = ball.x + (ball.dx * timeToHit);
        return {
            willHit: true,
            predictedX: predictedX,
            timeToHit: timeToHit,
            optimalPaddleX: predictedX - paddle.width / 2
        };
    }
    return { willHit: false };
}

function setAIDecisionCallback(callback) {
    aiDecisionCallback = callback;
    console.log('🧠 AI Decision Callback set');
}

// Make functions globally available
window.gameAPI = {
    enableAIControl,
    setAIPaddlePosition,
    setAIPaddleX,
    moveAIPaddleLeft,
    moveAIPaddleRight,
    startGameByAI,
    resetGameByAI,
    getGameState,
    predictBallHitPaddle,
    setAIDecisionCallback,
    
    get aiEnabled() { return aiEnabled; },
    get canvas() { return canvas; },
    get gameRunning() { return gameRunning; },
    get gameStarted() { return gameStarted; }
};

// Ball properties
const ball = {
    x: canvas.width / 2,
    y: canvas.height - 30,
    dx: 3.5, // Slightly faster
    dy: -3.5,
    radius: 8,
    speed: 3.5
};

// Paddle properties
const paddle = {
    height: 12,
    width: 80,
    x: (canvas.width - 80) / 2,
    speed: 8
};

// Brick properties
const brickRowCount = 4;
const brickColumnCount = 6;
const brickWidth = 70;
const brickHeight = 18;
const brickPadding = 8;
const brickOffsetTop = 50;
const brickOffsetLeft = 15;

// Enhanced brick colors
const brickColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];

// Enhanced power-ups
const powerUps = [];
const powerUpTypes = {
    MULTI_BALL: { color: '#FF6B6B', effect: 'multiBall', symbol: 'M' },
    LARGER_PADDLE: { color: '#4ECDC4', effect: 'largerPaddle', symbol: 'L' },
    SLOW_BALL: { color: '#45B7D1', effect: 'slowBall', symbol: 'S' },
    LASER_PADDLE: { color: '#FF8800', effect: 'laserPaddle', symbol: '⚡' },
    SHIELD: { color: '#9C27B0', effect: 'shield', symbol: '🛡' },
    MAGNETIC_BALL: { color: '#00E676', effect: 'magneticBall', symbol: '🧲' }
};

// Particles for effects
const particles = [];

// Create bricks array
const bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = {
            x: 0,
            y: 0,
            status: 1,
            color: brickColors[r] || brickColors[0]
        };
    }
}

// Event listeners
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);
document.addEventListener('keypress', startGame);
canvas.addEventListener('click', startGame);
canvas.addEventListener('mousemove', mouseMoveHandler);
canvas.addEventListener('touchstart', touchStartHandler);
canvas.addEventListener('touchmove', touchMoveHandler);
canvas.addEventListener('touchend', touchEndHandler);

canvas.addEventListener('touchstart', e => e.preventDefault());
canvas.addEventListener('touchmove', e => e.preventDefault());

canvas.setAttribute('tabindex', '0');
canvas.focus();

// Enhanced input handlers
function keyDownHandler(e) {
    if (aiControl) return;
    
    if (e.key === 'Right' || e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        rightPressed = true;
        usingMouse = false;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        leftPressed = true;
        usingMouse = false;
    }
    
    // Laser shooting
    if ((e.key === ' ' || e.key === 'Spacebar') && laserMode && laserCooldown <= 0) {
        shootLaser();
        e.preventDefault();
    }
    
    // AI toggle
    if (e.key === 'i' || e.key === 'I') {
        enableAIControl(!aiControl);
        if (aiControl) {
            aiTargetX = paddle.x;
        }
    }
}

function keyUpHandler(e) {
    if (aiControl) return;
    
    if (e.key === 'Right' || e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        rightPressed = false;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
    if (aiControl) return;
    
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    usingMouse = true;
}

function touchStartHandler(e) {
    if (aiControl) return;
    
    if (!gameStarted) {
        startGame();
    }
    const rect = canvas.getBoundingClientRect();
    touchX = e.touches[0].clientX - rect.left;
    usingMouse = true;
    
    // Touch to shoot laser
    if (laserMode && laserCooldown <= 0) {
        shootLaser();
    }
}

function touchMoveHandler(e) {
    if (aiControl) return;
    
    const rect = canvas.getBoundingClientRect();
    touchX = e.touches[0].clientX - rect.left;
    usingMouse = true;
}

function touchEndHandler(e) {
    if (aiControl) return;
}

// ====== LASER SYSTEM ======
function shootLaser() {
    if (laserCooldown > 0) return;
    
    lasers.push({
        x: paddle.x + paddle.width / 2 - 2,
        y: canvas.height - paddle.height - 5,
        width: 4,
        height: 15,
        speed: 8
    });
    
    laserCooldown = 10; // Cooldown frames
    
    // Create muzzle flash effect
    createParticles(paddle.x + paddle.width / 2, canvas.height - paddle.height, '#FFFF00');
}

function updateLasers() {
    // Update laser cooldown
    if (laserCooldown > 0) laserCooldown--;
    
    // Update laser positions
    for (let i = lasers.length - 1; i >= 0; i--) {
        const laser = lasers[i];
        laser.y -= laser.speed;
        
        // Remove lasers that are off screen
        if (laser.y < 0) {
            lasers.splice(i, 1);
            continue;
        }
        
        // Check collision with bricks
        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                const brick = bricks[c][r];
                if (brick.status === 1) {
                    if (laser.x < brick.x + brickWidth &&
                        laser.x + laser.width > brick.x &&
                        laser.y < brick.y + brickHeight &&
                        laser.y + laser.height > brick.y) {
                        
                        // Destroy brick
                        brick.status = 0;
                        score += 15; // Bonus points for laser
                        addCombo();
                        
                        // Create explosion effect
                        createParticles(brick.x + brickWidth/2, brick.y + brickHeight/2, brick.color);
                        
                        // Remove laser
                        lasers.splice(i, 1);
                        break;
                    }
                }
            }
        }
    }
}

function drawLasers() {
    ctx.fillStyle = '#FFFF00';
    ctx.shadowColor = '#FFFF00';
    ctx.shadowBlur = 10;
    
    lasers.forEach(laser => {
        ctx.fillRect(laser.x, laser.y, laser.width, laser.height);
    });
    
    ctx.shadowBlur = 0;
}

// ====== COMBO SYSTEM ======
function addCombo() {
    combo++;
    comboTimer = 120; // 2 seconds at 60fps
    
    if (combo >= 3) {
        score += combo * 2; // Bonus points for combo
    }
}

function updateCombo() {
    if (comboTimer > 0) {
        comboTimer--;
    } else {
        combo = 0;
    }
}

function drawCombo() {
    if (combo >= 3) {
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`COMBO x${combo}!`, canvas.width / 2, 30);
        
        // Glow effect
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 5;
        ctx.fillText(`COMBO x${combo}!`, canvas.width / 2, 30);
        ctx.shadowBlur = 0;
    }
}

// ====== BALL TRAIL EFFECT ======
function updateBallTrail() {
    // Add current ball position to trail
    ballTrail.push({ x: ball.x, y: ball.y, alpha: 1.0 });
    
    // Limit trail length
    if (ballTrail.length > 8) {
        ballTrail.shift();
    }
    
    // Fade trail
    ballTrail.forEach((point, index) => {
        point.alpha = (index + 1) / ballTrail.length * 0.5;
    });
}

function drawBallTrail() {
    ballTrail.forEach((point, index) => {
        ctx.save();
        ctx.globalAlpha = point.alpha;
        ctx.beginPath();
        ctx.arc(point.x, point.y, ball.radius * (point.alpha + 0.3), 0, Math.PI * 2);
        ctx.fillStyle = '#00FFFF';
        ctx.fill();
        ctx.restore();
    });
}

// ====== SCREEN SHAKE EFFECT ======
function addScreenShake(intensity = 5) {
    screenShake = intensity;
}

function updateScreenShake() {
    if (screenShake > 0) {
        screenShake *= 0.9;
        if (screenShake < 0.1) screenShake = 0;
    }
}

function applyScreenShake() {
    if (screenShake > 0) {
        const shakeX = (Math.random() - 0.5) * screenShake;
        const shakeY = (Math.random() - 0.5) * screenShake;
        ctx.translate(shakeX, shakeY);
    }
}

function startGame(e) {
    if (!gameStarted) {
        gameStarted = true;
        gameRunning = true;
        draw();
    }
}

// Enhanced particle system
function createParticles(x, y, color, count = 8) {
    for (let i = 0; i < count; i++) {
        particles.push({
            x: x,
            y: y,
            dx: (Math.random() - 0.5) * 8,
            dy: (Math.random() - 0.5) * 8,
            color: color,
            life: 40,
            maxLife: 40,
            size: Math.random() * 4 + 2
        });
    }
}

function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        particle.x += particle.dx;
        particle.y += particle.dy;
        particle.dx *= 0.98; // Friction
        particle.dy *= 0.98;
        particle.life--;
        
        if (particle.life <= 0) {
            particles.splice(i, 1);
        }
    }
}

function drawParticles() {
    particles.forEach(particle => {
        const alpha = particle.life / particle.maxLife;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = particle.color;
        ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
        ctx.restore();
    });
}

// Enhanced drawing functions
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    
    const gradient = ctx.createRadialGradient(ball.x - 3, ball.y - 3, 0, ball.x, ball.y, ball.radius);
    gradient.addColorStop(0, '#FFE082');
    gradient.addColorStop(1, '#FF8F00');
    
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.closePath();
    
    // Enhanced glow effect
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.strokeStyle = '#FF6F00';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#FFE082';
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.closePath();
}

function drawPaddle() {
    const gradient = ctx.createLinearGradient(paddle.x, canvas.height - paddle.height, paddle.x, canvas.height);
    
    if (laserMode) {
        gradient.addColorStop(0, '#FF8800'); // Orange for laser mode
        gradient.addColorStop(1, '#FF6600');
    } else if (aiControl) {
        gradient.addColorStop(0, '#E91E63'); // Pink for AI
        gradient.addColorStop(1, '#AD1457');
    } else {
        gradient.addColorStop(0, '#42A5F5'); // Blue for human
        gradient.addColorStop(1, '#1E88E5');
    }
    
    ctx.fillStyle = gradient;
    ctx.fillRect(paddle.x, canvas.height - paddle.height, paddle.width, paddle.height);
    
    // Enhanced outline
    ctx.strokeStyle = laserMode ? '#FF4400' : aiControl ? '#880E4F' : '#1565C0';
    ctx.lineWidth = 2;
    ctx.strokeRect(paddle.x, canvas.height - paddle.height, paddle.width, paddle.height);
    
    // Status indicators
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '8px Arial';
    ctx.textAlign = 'center';
    
    if (laserMode) {
        ctx.fillText('⚡', paddle.x + paddle.width/2, canvas.height - paddle.height/2 + 2);
    } else if (aiControl) {
        ctx.fillText('AI', paddle.x + paddle.width/2, canvas.height - paddle.height/2 + 2);
    }
}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                const brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                const brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                
                const gradient = ctx.createLinearGradient(brickX, brickY, brickX, brickY + brickHeight);
                const baseColor = bricks[c][r].color;
                gradient.addColorStop(0, baseColor);
                gradient.addColorStop(1, darkenColor(baseColor, 20));
                
                ctx.fillStyle = gradient;
                ctx.fillRect(brickX, brickY, brickWidth, brickHeight);
                
                // Enhanced outline with glow
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.lineWidth = 1;
                ctx.strokeRect(brickX, brickY, brickWidth, brickHeight);
            }
        }
    }
}

function drawPowerUps() {
    powerUps.forEach(powerUp => {
        // Animated power-up with rotation
        ctx.save();
        ctx.translate(powerUp.x + 10, powerUp.y + 10);
        ctx.rotate(Date.now() * 0.005);
        
        ctx.fillStyle = powerUp.color;
        ctx.fillRect(-10, -10, 20, 20);
        
        ctx.strokeStyle = '#FFF';
        ctx.lineWidth = 2;
        ctx.strokeRect(-10, -10, 20, 20);
        
        // Glow effect
        ctx.shadowColor = powerUp.color;
        ctx.shadowBlur = 10;
        ctx.fillStyle = '#FFF';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(powerUp.symbol, 0, 4);
        
        ctx.restore();
    });
}

function drawScore() {
    scoreElement.textContent = score;
    if (livesElement) {
        livesElement.textContent = lives;
    }
}

function drawStartScreen() {
    if (!gameStarted) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#FFE082';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('ENHANCED BREAKOUT', canvas.width / 2, canvas.height / 2 - 60);
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '16px Arial';
        ctx.fillText('Click, tap, or press any key to start', canvas.width / 2, canvas.height / 2 - 20);
        
        ctx.fillStyle = '#BBBBBB';
        ctx.font = '12px Arial';
        ctx.fillText('Use ← → arrows, A/D keys, or mouse/touch to move', canvas.width / 2, canvas.height / 2 + 10);
        ctx.fillText('Press I to toggle AI control', canvas.width / 2, canvas.height / 2 + 25);
        ctx.fillText('Space/Tap to shoot when laser mode is active', canvas.width / 2, canvas.height / 2 + 40);
        
        if (highScore > 0) {
            ctx.fillStyle = '#FFE082';
            ctx.font = '14px Arial';
            ctx.fillText(`High Score: ${highScore}`, canvas.width / 2, canvas.height / 2 + 65);
        }
        
        if (aiControl) {
            ctx.fillStyle = '#E91E63';
            ctx.font = '14px Arial';
            ctx.fillText('🤖 AI CONTROL ENABLED', canvas.width / 2, canvas.height / 2 + 85);
        }
    }
}

function darkenColor(color, percent) {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}

// Enhanced collision detection
function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];
            if (b.status === 1) {
                if (ball.x > b.x && ball.x < b.x + brickWidth && 
                    ball.y > b.y && ball.y < b.y + brickHeight) {
                    ball.dy = -ball.dy;
                    b.status = 0;
                    score += 10;
                    addCombo();
                    addScreenShake(3);
                    
                    // Enhanced particle effect
                    createParticles(b.x + brickWidth/2, b.y + brickHeight/2, b.color, 12);
                    
                    // Enhanced power-up spawn chance
                    if (Math.random() < 0.2) {
                        const powerUpTypes_array = Object.values(powerUpTypes);
                        const powerUpType = powerUpTypes_array[Math.floor(Math.random() * powerUpTypes_array.length)];
                        powerUps.push({
                            x: b.x + brickWidth/2 - 10,
                            y: b.y + brickHeight,
                            color: powerUpType.color,
                            effect: powerUpType.effect,
                            symbol: powerUpType.symbol,
                            dy: 2
                        });
                    }
                    
                    drawScore();
                    
                    // Check win condition
                    if (score >= brickRowCount * brickColumnCount * 10) {
                        if (score > highScore) {
                            highScore = score;
                            localStorage.setItem('breakoutHighScore', highScore);
                        }
                        showGameMessage('YOU WIN!', '#4CAF50');
                        setTimeout(() => resetGame(), 2000);
                    }
                }
            }
        }
    }
}

function updatePowerUps() {
    for (let i = powerUps.length - 1; i >= 0; i--) {
        const powerUp = powerUps[i];
        powerUp.y += powerUp.dy;
        
        // Check collision with paddle
        if (powerUp.y + 20 > canvas.height - paddle.height &&
            powerUp.x + 20 > paddle.x && powerUp.x < paddle.x + paddle.width) {
            activatePowerUp(powerUp.effect);
            createParticles(powerUp.x + 10, powerUp.y + 10, powerUp.color, 6);
            powerUps.splice(i, 1);
        }
        // Remove if off screen
        else if (powerUp.y > canvas.height) {
            powerUps.splice(i, 1);
        }
    }
}

// Enhanced power-up system
function activatePowerUp(effect) {
    switch(effect) {
        case 'multiBall':
            ball.dx *= 1.3;
            ball.dy *= 1.3;
            addScreenShake(8);
            break;
            
        case 'largerPaddle':
            paddle.width = Math.min(paddle.width + 25, canvas.width * 0.4);
            setTimeout(() => {
                paddle.width = 80;
            }, 12000);
            break;
            
        case 'slowBall':
            ball.dx *= 0.6;
            ball.dy *= 0.6;
            setTimeout(() => {
                ball.dx = ball.dx < 0 ? -ball.speed : ball.speed;
                ball.dy = ball.dy < 0 ? -ball.speed : ball.speed;
            }, 10000);
            break;
            
        case 'laserPaddle':
            laserMode = true;
            setTimeout(() => {
                laserMode = false;
            }, 15000);
            break;
            
        case 'shield':
            lives = Math.min(lives + 1, 5);
            drawScore();
            break;
            
        case 'magneticBall':
            // Simplified magnetic effect - ball follows paddle slightly
            const originalUpdate = ball.dx;
            const magneticInterval = setInterval(() => {
                if (ball.y > canvas.height / 2) {
                    const paddleCenter = paddle.x + paddle.width / 2;
                    const attraction = (paddleCenter - ball.x) * 0.002;
                    ball.dx += attraction;
                }
            }, 16);
            
            setTimeout(() => {
                clearInterval(magneticInterval);
            }, 8000);
            break;
    }
}

function showGameMessage(message, color) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = color;
    ctx.font = '28px Arial';
    ctx.textAlign = 'center';
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
    ctx.fillText(message, canvas.width / 2, canvas.height / 2 - 20);
    
    if (message === 'GAME OVER' && score > highScore) {
        ctx.fillStyle = '#FFD700';
        ctx.font = '16px Arial';
        ctx.fillText('NEW HIGH SCORE!', canvas.width / 2, canvas.height / 2 + 10);
    }
    
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '16px Arial';
    ctx.fillText('Click, tap, or press any key to play again', canvas.width / 2, canvas.height / 2 + 40);
}

function resetGame() {
    // Reset ball
    ball.x = canvas.width / 2;
    ball.y = canvas.height - 30;
    ball.dx = 3.5;
    ball.dy = -3.5;
    
    // Reset paddle
    paddle.x = (canvas.width - paddle.width) / 2;
    paddle.width = 80;
    
    // Reset AI
    if (aiControl) {
        aiTargetX = paddle.x;
    }
    
    // Reset bricks
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            bricks[c][r].status = 1;
        }
    }
    
    // Clear all effects
    powerUps.length = 0;
    particles.length = 0;
    lasers.length = 0;
    ballTrail.length = 0;
    
    // Reset game state
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('breakoutHighScore', highScore);
    }
    
    score = 0;
    lives = 3;
    combo = 0;
    comboTimer = 0;
    screenShake = 0;
    laserMode = false;
    laserCooldown = 0;
    gameRunning = false;
    gameStarted = false;
    
    drawScore();
}

// Enhanced main game loop
function draw() {
    ctx.save();
    applyScreenShake();
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (!gameStarted) {
        drawBricks();
        drawBall();
        drawPaddle();
        drawStartScreen();
        ctx.restore();
        requestAnimationFrame(draw);
        return;
    }
    
    if (!gameRunning) {
        ctx.restore();
        return;
    }
    
    // AI decision callback
    if (aiControl && aiDecisionCallback && typeof aiDecisionCallback === 'function') {
        try {
            aiDecisionCallback(getGameState());
        } catch (error) {
            console.error('AI Decision Callback error:', error);
        }
    }
    
    // Update systems
    updateParticles();
    updatePowerUps();
    updateLasers();
    updateCombo();
    updateScreenShake();
    updateBallTrail();
    
    // Draw everything
    drawBallTrail();
    drawBricks();
    drawBall();
    drawPaddle();
    drawPowerUps();
    drawLasers();
    drawParticles();
    drawCombo();
    
    collisionDetection();
    
    // Ball physics
    if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
        ball.dx = -ball.dx;
        addScreenShake(2);
    }
    if (ball.y + ball.dy < ball.radius) {
        ball.dy = -ball.dy;
        addScreenShake(2);
    } else if (ball.y + ball.dy > canvas.height - ball.radius) {
        // Enhanced paddle collision
        if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
            const hitPos = (ball.x - paddle.x) / paddle.width;
            const maxAngle = Math.PI / 3;
            const angle = (hitPos - 0.5) * maxAngle;
            
            const speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
            ball.dx = speed * Math.sin(angle);
            ball.dy = -Math.abs(speed * Math.cos(angle));
            
            addScreenShake(4);
            createParticles(ball.x, canvas.height - paddle.height, '#FFE082');
        } else {
            lives--;
            combo = 0; // Reset combo on life loss
            
            if (lives <= 0) {
                if (score > highScore) {
                    highScore = score;
                    localStorage.setItem('breakoutHighScore', highScore);
                }
                showGameMessage('GAME OVER', '#F44336');
                setTimeout(() => resetGame(), 2000);
                ctx.restore();
                return;
            } else {
                ball.x = canvas.width / 2;
                ball.y = canvas.height - 30;
                ball.dx = 3.5;
                ball.dy = -3.5;
                addScreenShake(8);
                drawScore();
            }
        }
    }
    
    // Enhanced paddle movement
    if (aiControl) {
        const distanceToTarget = aiTargetX - paddle.x;
        if (Math.abs(distanceToTarget) > aiSpeed) {
            paddle.x += distanceToTarget > 0 ? aiSpeed : -aiSpeed;
        } else {
            paddle.x = aiTargetX;
        }
        paddle.x = Math.max(0, Math.min(canvas.width - paddle.width, paddle.x));
    } else if (usingMouse) {
        const targetX = (touchX || mouseX) - paddle.width / 2;
        paddle.x = Math.max(0, Math.min(canvas.width - paddle.width, targetX));
    } else {
        if (rightPressed && paddle.x < canvas.width - paddle.width) {
            paddle.x += paddle.speed;
        } else if (leftPressed && paddle.x > 0) {
            paddle.x -= paddle.speed;
        }
    }
    
    // Update ball position
    ball.x += ball.dx;
    ball.y += ball.dy;
    
    ctx.restore();
    requestAnimationFrame(draw);
}

// Initialize game
draw();

// Enhanced console logging
console.log('🎮 Enhanced Breakout Game loaded!');
console.log('New Features: Laser Paddle, Screen Shake, Ball Trail, Combo System');
console.log('Available functions:', Object.keys(window.gameAPI));
console.log('Press "I" to toggle AI control, Space/Tap to shoot lasers when active');