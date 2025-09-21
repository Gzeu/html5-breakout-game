// Get canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

// Game variables
let score = 0;
let lives = 3;
let gameRunning = false;
let gameStarted = false;
let rightPressed = false;
let leftPressed = false;

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

// Make canvas focusable for accessibility
canvas.setAttribute('tabindex', '0');
canvas.focus();

function keyDownHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        rightPressed = true;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        rightPressed = false;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        leftPressed = false;
    }
}

function startGame(e) {
    if (!gameStarted) {
        gameStarted = true;
        gameRunning = true;
        draw();
    }
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
    gradient.addColorStop(0, '#42A5F5');
    gradient.addColorStop(1, '#1E88E5');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(paddle.x, canvas.height - paddle.height, paddle.width, paddle.height);
    
    // Add paddle outline
    ctx.strokeStyle = '#1565C0';
    ctx.lineWidth = 2;
    ctx.strokeRect(paddle.x, canvas.height - paddle.height, paddle.width, paddle.height);
}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                const brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                const brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                
                // Draw brick with rounded corners effect
                ctx.fillStyle = bricks[c][r].color;
                ctx.fillRect(brickX, brickY, brickWidth, brickHeight);
                
                // Add brick outline
                ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
                ctx.lineWidth = 1;
                ctx.strokeRect(brickX, brickY, brickWidth, brickHeight);
            }
        }
    }
}

function drawScore() {
    scoreElement.textContent = score;
}

function drawStartScreen() {
    if (!gameStarted) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#FFE082';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('BREAKOUT GAME', canvas.width / 2, canvas.height / 2 - 40);
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '16px Arial';
        ctx.fillText('Click or press any key to start', canvas.width / 2, canvas.height / 2 + 10);
        
        ctx.fillStyle = '#BBBBBB';
        ctx.font = '12px Arial';
        ctx.fillText('Use ← → arrows or A/D keys to move', canvas.width / 2, canvas.height / 2 + 40);
    }
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
                    drawScore();
                    
                    // Check if all bricks are destroyed
                    if (score === brickRowCount * brickColumnCount * 10) {
                        showGameMessage('YOU WIN!', '#4CAF50');
                        resetGame();
                    }
                }
            }
        }
    }
}

function showGameMessage(message, color) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = color;
    ctx.font = '28px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(message, canvas.width / 2, canvas.height / 2 - 20);
    
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '16px Arial';
    ctx.fillText('Click or press any key to play again', canvas.width / 2, canvas.height / 2 + 20);
}

function resetGame() {
    // Reset ball position
    ball.x = canvas.width / 2;
    ball.y = canvas.height - 30;
    ball.dx = 3;
    ball.dy = -3;
    
    // Reset paddle position
    paddle.x = (canvas.width - paddle.width) / 2;
    
    // Reset bricks
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            bricks[c][r].status = 1;
        }
    }
    
    // Reset game state
    score = 0;
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
    
    // Draw game objects
    drawBricks();
    drawBall();
    drawPaddle();
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
            ball.dx = ball.speed * (hitPos - 0.5) * 2;
            ball.dy = -Math.abs(ball.dy);
        } else {
            // Game over
            showGameMessage('GAME OVER', '#F44336');
            resetGame();
            return;
        }
    }
    
    // Paddle movement
    if (rightPressed && paddle.x < canvas.width - paddle.width) {
        paddle.x += paddle.speed;
    } else if (leftPressed && paddle.x > 0) {
        paddle.x -= paddle.speed;
    }
    
    // Update ball position
    ball.x += ball.dx;
    ball.y += ball.dy;
    
    requestAnimationFrame(draw);
}

// Initialize game
draw();