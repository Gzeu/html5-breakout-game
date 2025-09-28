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

// ====== AI CONTROL VARIABLES ======
let aiControl = false;
let aiTargetX = 0;
let aiSpeed = 5; // Speed of AI paddle movement
let aiEnabled = false;
let aiDecisionCallback = null;

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
        powerUps: powerUps.map(p => ({ x: p.x, y: p.y, effect: p.effect }))
    };
}

function predictBallHitPaddle() {
    if (ball.dy > 0) { // Ball is moving down
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
    // Control functions
    enableAIControl,
    setAIPaddlePosition,
    setAIPaddleX,
    moveAIPaddleLeft,
    moveAIPaddleRight,
    startGameByAI,
    resetGameByAI,
    
    // Information functions
    getGameState,
    predictBallHitPaddle,
    setAIDecisionCallback,
    
    // Game state
    get aiEnabled() { return aiEnabled; },
    get canvas() { return canvas; },
    get gameRunning() { return gameRunning; },
    get gameStarted() { return gameStarted; }
};

// Ball properties
const ball = {
    x: canvas.width / 2,
    y: canvas.height - 30,
    dx: 3,
    dy: -3,
    radius: 8,
    speed: 3
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

// Brick colors for different rows
const brickColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];

// Power-ups
const powerUps = [];
const powerUpTypes = {
    MULTI_BALL: { color: '#FF6B6B', effect: 'multiBall' },
    LARGER_PADDLE: { color: '#4ECDC4', effect: 'largerPaddle' },
    SLOW_BALL: { color: '#45B7D1', effect: 'slowBall' }
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

// Prevent scrolling on touch devices
canvas.addEventListener('touchstart', e => e.preventDefault());
canvas.addEventListener('touchmove', e => e.preventDefault());

// Make canvas focusable for accessibility
canvas.setAttribute('tabindex', '0');
canvas.focus();

// Input handlers
function keyDownHandler(e) {
    if (aiControl) return; // Ignore human input when AI is controlling
    
    if (e.key === 'Right' || e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        rightPressed = true;
        usingMouse = false;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        leftPressed = true;
        usingMouse = false;
    }
    
    // AI toggle for testing (press 'i' to toggle AI)
    if (e.key === 'i' || e.key === 'I') {
        enableAIControl(!aiControl);
        if (aiControl) {
            aiTargetX = paddle.x;
        }
    }
}

function keyUpHandler(e) {
    if (aiControl) return; // Ignore human input when AI is controlling
    
    if (e.key === 'Right' || e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        rightPressed = false;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
    if (aiControl) return; // Ignore human input when AI is controlling
    
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    usingMouse = true;
}

function touchStartHandler(e) {
    if (aiControl) return; // Ignore human input when AI is controlling
    
    if (!gameStarted) {
        startGame();
    }
    const rect = canvas.getBoundingClientRect();
    touchX = e.touches[0].clientX - rect.left;
    usingMouse = true;
}

function touchMoveHandler(e) {
    if (aiControl) return; // Ignore human input when AI is controlling
    
    const rect = canvas.getBoundingClientRect();
    touchX = e.touches[0].clientX - rect.left;
    usingMouse = true;
}

function touchEndHandler(e) {
    if (aiControl) return; // Ignore human input when AI is controlling
    // Keep using mouse/touch position
}

function startGame(e) {
    if (!gameStarted) {
        gameStarted = true;
        gameRunning = true;
        draw();
    }
}

// Particle system
function createParticles(x, y, color) {
    for (let i = 0; i < 8; i++) {
        particles.push({
            x: x,
            y: y,
            dx: (Math.random() - 0.5) * 6,
            dy: (Math.random() - 0.5) * 6,
            color: color,
            life: 30,
            maxLife: 30
        });
    }
}

function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        particle.x += particle.dx;
        particle.y += particle.dy;
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
        ctx.fillRect(particle.x, particle.y, 3, 3);
        ctx.restore();
    });
}

// Drawing functions
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    
    // Create gradient for ball
    const gradient = ctx.createRadialGradient(ball.x - 3, ball.y - 3, 0, ball.x, ball.y, ball.radius);
    gradient.addColorStop(0, '#FFE082');
    gradient.addColorStop(1, '#FF8F00');
    
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.closePath();
    
    // Add ball outline
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.strokeStyle = '#FF6F00';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.closePath();
}

function drawPaddle() {
    // Draw paddle with gradient
    const gradient = ctx.createLinearGradient(paddle.x, canvas.height - paddle.height, paddle.x, canvas.height);
    
    // Different color when AI is controlling
    if (aiControl) {
        gradient.addColorStop(0, '#E91E63'); // Pink for AI
        gradient.addColorStop(1, '#AD1457');
    } else {
        gradient.addColorStop(0, '#42A5F5'); // Blue for human
        gradient.addColorStop(1, '#1E88E5');
    }
    
    ctx.fillStyle = gradient;
    ctx.fillRect(paddle.x, canvas.height - paddle.height, paddle.width, paddle.height);
    
    // Add paddle outline
    ctx.strokeStyle = aiControl ? '#880E4F' : '#1565C0';
    ctx.lineWidth = 2;
    ctx.strokeRect(paddle.x, canvas.height - paddle.height, paddle.width, paddle.height);
    
    // Add AI indicator
    if (aiControl) {
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '8px Arial';
        ctx.textAlign = 'center';
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
                
                // Draw brick with gradient effect
                const gradient = ctx.createLinearGradient(brickX, brickY, brickX, brickY + brickHeight);
                const baseColor = bricks[c][r].color;
                gradient.addColorStop(0, baseColor);
                gradient.addColorStop(1, darkenColor(baseColor, 20));
                
                ctx.fillStyle = gradient;
                ctx.fillRect(brickX, brickY, brickWidth, brickHeight);
                
                // Add brick outline
                ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
                ctx.lineWidth = 1;
                ctx.strokeRect(brickX, brickY, brickWidth, brickHeight);
            }
        }
    }
}

function drawPowerUps() {
    powerUps.forEach(powerUp => {
        ctx.fillStyle = powerUp.color;
        ctx.fillRect(powerUp.x, powerUp.y, 20, 20);
        ctx.strokeStyle = '#FFF';
        ctx.lineWidth = 2;
        ctx.strokeRect(powerUp.x, powerUp.y, 20, 20);
        
        // Draw power-up symbol
        ctx.fillStyle = '#FFF';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(powerUp.symbol, powerUp.x + 10, powerUp.y + 14);
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
        ctx.fillText('BREAKOUT GAME', canvas.width / 2, canvas.height / 2 - 60);
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '16px Arial';
        ctx.fillText('Click, tap, or press any key to start', canvas.width / 2, canvas.height / 2 - 20);
        
        ctx.fillStyle = '#BBBBBB';
        ctx.font = '12px Arial';
        ctx.fillText('Use ← → arrows, A/D keys, or mouse/touch to move', canvas.width / 2, canvas.height / 2 + 10);
        ctx.fillText('Press I to toggle AI control', canvas.width / 2, canvas.height / 2 + 25);
        
        if (highScore > 0) {
            ctx.fillStyle = '#FFE082';
            ctx.font = '14px Arial';
            ctx.fillText(`High Score: ${highScore}`, canvas.width / 2, canvas.height / 2 + 50);
        }
        
        // AI Control indicator
        if (aiControl) {
            ctx.fillStyle = '#E91E63';
            ctx.font = '14px Arial';
            ctx.fillText('🤖 AI CONTROL ENABLED', canvas.width / 2, canvas.height / 2 + 75);
        }
    }
}

// Utility functions
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

// Collision detection
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
                    
                    // Create particle effect
                    createParticles(b.x + brickWidth/2, b.y + brickHeight/2, b.color);
                    
                    // Chance to spawn power-up
                    if (Math.random() < 0.15) {
                        const powerUpType = Object.values(powerUpTypes)[Math.floor(Math.random() * Object.values(powerUpTypes).length)];
                        powerUps.push({
                            x: b.x + brickWidth/2 - 10,
                            y: b.y + brickHeight,
                            color: powerUpType.color,
                            effect: powerUpType.effect,
                            symbol: powerUpType.effect === 'multiBall' ? 'M' : powerUpType.effect === 'largerPaddle' ? 'L' : 'S',
                            dy: 2
                        });
                    }
                    
                    drawScore();
                    
                    // Check if all bricks are destroyed
                    if (score === brickRowCount * brickColumnCount * 10) {
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
            powerUps.splice(i, 1);
        }
        // Remove if off screen
        else if (powerUp.y > canvas.height) {
            powerUps.splice(i, 1);
        }
    }
}

function activatePowerUp(effect) {
    switch(effect) {
        case 'multiBall':
            // Add two more balls (simplified implementation)
            ball.dx *= 1.2;
            ball.dy *= 1.2;
            break;
        case 'largerPaddle':
            paddle.width = Math.min(paddle.width + 20, canvas.width * 0.3);
            setTimeout(() => {
                paddle.width = 80;
            }, 10000);
            break;
        case 'slowBall':
            ball.dx *= 0.7;
            ball.dy *= 0.7;
            setTimeout(() => {
                ball.dx = ball.dx < 0 ? -ball.speed : ball.speed;
                ball.dy = ball.dy < 0 ? -ball.speed : ball.speed;
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
    ctx.fillText(message, canvas.width / 2, canvas.height / 2 - 20);
    
    if (message === 'GAME OVER' && score > highScore) {
        ctx.fillStyle = '#FFD700';
        ctx.font = '16px Arial';
        ctx.fillText('NEW HIGH SCORE!', canvas.width / 2, canvas.height / 2 + 10);
    }
    
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '16px Arial';
    ctx.fillText('Click, tap, or press any key to play again', canvas.width / 2, canvas.height / 2 + 40);
}

function resetGame() {
    // Reset ball position
    ball.x = canvas.width / 2;
    ball.y = canvas.height - 30;
    ball.dx = 3;
    ball.dy = -3;
    
    // Reset paddle position
    paddle.x = (canvas.width - paddle.width) / 2;
    paddle.width = 80;
    
    // Reset AI target
    if (aiControl) {
        aiTargetX = paddle.x;
    }
    
    // Reset bricks
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            bricks[c][r].status = 1;
        }
    }
    
    // Clear power-ups and particles
    powerUps.length = 0;
    particles.length = 0;
    
    // Reset game state
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('breakoutHighScore', highScore);
    }
    score = 0;
    lives = 3;
    gameRunning = false;
    gameStarted = false;
    drawScore();
}

// Main game loop
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (!gameStarted) {
        drawBricks();
        drawBall();
        drawPaddle();
        drawStartScreen();
        requestAnimationFrame(draw);
        return;
    }
    
    if (!gameRunning) {
        return;
    }
    
    // Call AI decision callback if set
    if (aiControl && aiDecisionCallback && typeof aiDecisionCallback === 'function') {
        try {
            aiDecisionCallback(getGameState());
        } catch (error) {
            console.error('AI Decision Callback error:', error);
        }
    }
    
    // Update particles
    updateParticles();
    updatePowerUps();
    
    // Draw game objects
    drawBricks();
    drawBall();
    drawPaddle();
    drawPowerUps();
    drawParticles();
    collisionDetection();
    
    // Ball physics - wall bouncing
    if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
        ball.dx = -ball.dx;
    }
    if (ball.y + ball.dy < ball.radius) {
        ball.dy = -ball.dy;
    } else if (ball.y + ball.dy > canvas.height - ball.radius) {
        // Check paddle collision
        if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
            // Add some angle based on where the ball hits the paddle
            const hitPos = (ball.x - paddle.x) / paddle.width;
            const maxAngle = Math.PI / 3; // 60 degrees max
            const angle = (hitPos - 0.5) * maxAngle;
            
            ball.dx = ball.speed * Math.sin(angle);
            ball.dy = -ball.speed * Math.cos(angle);
        } else {
            lives--;
            if (lives <= 0) {
                // Game over
                if (score > highScore) {
                    highScore = score;
                    localStorage.setItem('breakoutHighScore', highScore);
                }
                showGameMessage('GAME OVER', '#F44336');
                setTimeout(() => resetGame(), 2000);
                return;
            } else {
                // Reset ball position
                ball.x = canvas.width / 2;
                ball.y = canvas.height - 30;
                ball.dx = 3;
                ball.dy = -3;
                drawScore();
            }
        }
    }
    
    // Paddle movement logic
    if (aiControl) {
        // AI movement - smooth towards target
        const distanceToTarget = aiTargetX - paddle.x;
        if (Math.abs(distanceToTarget) > aiSpeed) {
            paddle.x += distanceToTarget > 0 ? aiSpeed : -aiSpeed;
        } else {
            paddle.x = aiTargetX;
        }
        // Ensure paddle stays within bounds
        paddle.x = Math.max(0, Math.min(canvas.width - paddle.width, paddle.x));
    } else if (usingMouse) {
        // Human mouse/touch control
        const targetX = (touchX || mouseX) - paddle.width / 2;
        paddle.x = Math.max(0, Math.min(canvas.width - paddle.width, targetX));
    } else {
        // Human keyboard control
        if (rightPressed && paddle.x < canvas.width - paddle.width) {
            paddle.x += paddle.speed;
        } else if (leftPressed && paddle.x > 0) {
            paddle.x -= paddle.speed;
        }
    }
    
    // Update ball position
    ball.x += ball.dx;
    ball.y += ball.dy;
    
    requestAnimationFrame(draw);
}

// Initialize game
draw();

// Log available API for developers
console.log('🎮 Breakout Game loaded with AI Control API');
console.log('Available functions:', Object.keys(window.gameAPI));
console.log('Example usage:');
console.log('  gameAPI.enableAIControl(true);');
console.log('  gameAPI.startGameByAI();');
console.log('  gameAPI.setAIPaddleX(200);');
console.log('  gameAPI.getGameState();');
console.log('Press "I" key to toggle AI control manually');