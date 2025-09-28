// Groq AI Client Integration for Neo Breakout
class GroqAIClient {
    constructor() {
        this.isEnabled = false;
        this.isConnected = false;
        this.lastDecision = null;
        this.responseTime = 0;
        this.confidence = 0;
        this.strategy = 'STANDBY';
        this.reasoning = 'Awaiting initialization...';
        this.difficulty = 'medium';
        this.decisionInterval = null;
        this.apiEndpoint = '/api/groq-ai';
        
        this.initializeUI();
        this.bindEvents();
    }
    
    initializeUI() {
        // Get UI elements
        this.elements = {
            aiToggle: document.getElementById('aiToggle'),
            aiStatus: document.getElementById('aiStatus'),
            aiBtn: document.getElementById('aiBtn'),
            statusPanel: document.getElementById('aiStatusPanel'),
            connectionStatus: document.getElementById('connectionStatus'),
            aiConfidence: document.getElementById('aiConfidence'),
            aiStrategy: document.getElementById('aiStrategy'),
            responseTime: document.getElementById('responseTime'),
            aiReasoning: document.getElementById('aiReasoning'),
            startBtn: document.getElementById('startBtn'),
            pauseBtn: document.getElementById('pauseBtn')
        };
        
        // Update initial UI state
        this.updateUI();
    }
    
    bindEvents() {
        // AI Toggle button
        if (this.elements.aiToggle) {
            this.elements.aiToggle.addEventListener('click', () => this.toggleAI());
        }
        
        // AI Control button
        if (this.elements.aiBtn) {
            this.elements.aiBtn.addEventListener('click', () => this.toggleAI());
        }
        
        // Start button
        if (this.elements.startBtn) {
            this.elements.startBtn.addEventListener('click', () => this.startGame());
        }
        
        // Pause button
        if (this.elements.pauseBtn) {
            this.elements.pauseBtn.addEventListener('click', () => this.pauseGame());
        }
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'i' || e.key === 'I') {
                this.toggleAI();
            }
        });
    }
    
    async toggleAI() {
        this.isEnabled = !this.isEnabled;
        
        if (this.isEnabled) {
            await this.enableAI();
        } else {
            this.disableAI();
        }
        
        this.updateUI();
        
        // Notify game engine if available
        if (typeof gameAPI !== 'undefined') {
            gameAPI.enableAIControl(this.isEnabled);
            if (this.isEnabled) {
                gameAPI.setAIDecisionCallback((gameState) => this.makeDecision(gameState));
            } else {
                gameAPI.setAIDecisionCallback(null);
            }
        }
    }
    
    async enableAI() {
        this.showStatus('Initializing neural network...');
        
        try {
            // Test connection
            const testResponse = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    gameState: this.getDummyGameState(),
                    difficulty: this.difficulty
                })
            });
            
            if (testResponse.ok) {
                this.isConnected = true;
                this.showStatus('Neural network online');
                this.startDecisionLoop();
            } else {
                throw new Error('Connection failed');
            }
        } catch (error) {
            console.error('Groq AI connection failed:', error);
            this.isConnected = false;
            this.showStatus('Connection failed - Using local AI');
            // Fall back to local AI logic
            this.startDecisionLoop();
        }
    }
    
    disableAI() {
        this.isConnected = false;
        this.clearDecisionLoop();
        this.resetMetrics();
        this.showStatus('AI disabled');
    }
    
    startDecisionLoop() {
        if (this.decisionInterval) {
            clearInterval(this.decisionInterval);
        }
        
        // Make decisions every 100ms when AI is enabled
        this.decisionInterval = setInterval(() => {
            if (this.isEnabled && typeof gameAPI !== 'undefined') {
                const gameState = gameAPI.getGameState();
                if (gameState && gameState.gameRunning) {
                    this.makeDecision(gameState);
                }
            }
        }, 100);
    }
    
    clearDecisionLoop() {
        if (this.decisionInterval) {
            clearInterval(this.decisionInterval);
            this.decisionInterval = null;
        }
    }
    
    async makeDecision(gameState) {
        if (!this.isEnabled) return;
        
        const startTime = Date.now();
        let decision;
        
        try {
            if (this.isConnected) {
                // Use Groq AI
                decision = await this.getGroqDecision(gameState);
            } else {
                // Use local AI fallback
                decision = this.getLocalDecision(gameState);
            }
            
            this.responseTime = Date.now() - startTime;
            this.applyDecision(decision, gameState);
            this.updateMetrics(decision);
            
        } catch (error) {
            console.error('AI Decision Error:', error);
            // Fallback to basic tracking
            decision = this.getBasicDecision(gameState);
            this.applyDecision(decision, gameState);
            this.responseTime = Date.now() - startTime;
        }
    }
    
    async getGroqDecision(gameState) {
        const response = await fetch(this.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                gameState: gameState,
                difficulty: this.difficulty
            })
        });
        
        if (!response.ok) {
            throw new Error(`Groq API error: ${response.status}`);
        }
        
        const data = await response.json();
        return data.aiDecision;
    }
    
    getLocalDecision(gameState) {
        // Advanced local AI logic
        const prediction = gameAPI.predictBallHitPaddle();
        const ball = gameState.ball;
        const paddle = gameState.paddle;
        const canvas = gameState.canvas;
        
        let targetX;
        let strategy;
        let reasoning;
        
        if (prediction.willHit && prediction.timeToHit > 0) {
            // Calculate optimal position with strategy
            const speedFactor = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy) / 5;
            const adjustment = (ball.dx > 0 ? 15 : -15) * speedFactor;
            targetX = prediction.predictedX + adjustment - paddle.width / 2;
            strategy = 'INTERCEPT';
            reasoning = `Intercepting ball at predicted position ${Math.round(prediction.predictedX)} with speed adjustment ${Math.round(adjustment)}`;
        } else {
            // Defensive positioning with ball influence
            const centerX = canvas.width / 2 - paddle.width / 2;
            const ballInfluence = (ball.x - canvas.width / 2) * 0.4;
            targetX = centerX + ballInfluence;
            strategy = 'DEFENSIVE';
            reasoning = 'Maintaining defensive center position with ball tracking';
        }
        
        // Clamp to bounds
        targetX = Math.max(0, Math.min(canvas.width - paddle.width, targetX));
        
        return {
            paddleX: targetX,
            strategy: strategy,
            confidence: prediction.willHit ? 85 : 60,
            reasoning: reasoning
        };
    }
    
    getBasicDecision(gameState) {
        // Simplest AI: follow ball
        const targetX = gameState.ball.x - gameState.paddle.width / 2;
        const clampedX = Math.max(0, Math.min(
            gameState.canvas.width - gameState.paddle.width,
            targetX
        ));
        
        return {
            paddleX: clampedX,
            strategy: 'FOLLOW',
            confidence: 50,
            reasoning: 'Basic ball tracking mode'
        };
    }
    
    applyDecision(decision, gameState) {
        if (typeof gameAPI !== 'undefined') {
            gameAPI.setAIPaddleX(decision.paddleX);
        }
        
        this.lastDecision = decision;
    }
    
    updateMetrics(decision) {
        this.confidence = decision.confidence || 0;
        this.strategy = decision.strategy || 'UNKNOWN';
        this.reasoning = decision.reasoning || 'No reasoning provided';
        
        // Update UI
        this.updateUI();
    }
    
    resetMetrics() {
        this.confidence = 0;
        this.strategy = 'STANDBY';
        this.reasoning = 'AI disabled';
        this.responseTime = 0;
    }
    
    updateUI() {
        // Update AI status
        if (this.elements.aiStatus) {
            this.elements.aiStatus.textContent = this.isEnabled ? 'ON' : 'OFF';
            this.elements.aiStatus.style.color = this.isEnabled ? 'var(--neon-green)' : 'var(--neon-cyan)';
        }
        
        // Update toggle button
        if (this.elements.aiToggle) {
            if (this.isEnabled) {
                this.elements.aiToggle.classList.add('active');
            } else {
                this.elements.aiToggle.classList.remove('active');
            }
        }
        
        // Update AI button
        if (this.elements.aiBtn) {
            this.elements.aiBtn.querySelector('.btn-text').textContent = 
                this.isEnabled ? 'DISABLE AI' : 'GROQ AI';
        }
        
        // Update status panel
        if (this.elements.statusPanel) {
            if (this.isEnabled) {
                this.elements.statusPanel.classList.add('active');
            } else {
                this.elements.statusPanel.classList.remove('active');
            }
        }
        
        // Update connection status
        if (this.elements.connectionStatus) {
            const statusDot = this.elements.connectionStatus.querySelector('.status-dot');
            const statusText = this.elements.connectionStatus.querySelector('.status-text');
            
            if (this.isEnabled && this.isConnected) {
                statusDot.classList.add('online');
                statusText.textContent = 'ONLINE';
            } else if (this.isEnabled) {
                statusDot.classList.remove('online');
                statusText.textContent = 'LOCAL';
            } else {
                statusDot.classList.remove('online');
                statusText.textContent = 'OFFLINE';
            }
        }
        
        // Update metrics
        if (this.elements.aiConfidence) {
            this.elements.aiConfidence.textContent = this.confidence + '%';
        }
        
        if (this.elements.aiStrategy) {
            this.elements.aiStrategy.textContent = this.strategy;
        }
        
        if (this.elements.responseTime) {
            this.elements.responseTime.textContent = this.responseTime + 'ms';
        }
        
        if (this.elements.aiReasoning) {
            const reasoningText = this.elements.aiReasoning.querySelector('.reasoning-text');
            if (reasoningText) {
                reasoningText.textContent = this.reasoning;
            }
        }
    }
    
    showStatus(message) {
        console.log('Groq AI:', message);
        // You could also show this in a toast notification
    }
    
    startGame() {
        if (typeof gameAPI !== 'undefined') {
            if (this.isEnabled) {
                gameAPI.startGameByAI();
            } else {
                // Start normal game
                if (typeof game !== 'undefined' && game.startGame) {
                    game.startGame();
                }
            }
        }
    }
    
    pauseGame() {
        if (typeof gameAPI !== 'undefined') {
            // Toggle pause state
            const gameState = gameAPI.getGameState();
            if (gameState.gameRunning) {
                // Implement pause logic
                console.log('Pause game');
            } else {
                // Resume game
                console.log('Resume game');
            }
        }
    }
    
    getDummyGameState() {
        return {
            ball: { x: 240, y: 160, dx: 2, dy: -2 },
            paddle: { x: 200, y: 300, width: 80 },
            canvas: { width: 480, height: 320 },
            score: 0,
            lives: 3,
            gameRunning: false,
            bricksRemaining: 20,
            powerUps: []
        };
    }
    
    // Public API methods
    setDifficulty(level) {
        this.difficulty = level;
        this.showStatus(`Difficulty set to ${level}`);
    }
    
    getMetrics() {
        return {
            confidence: this.confidence,
            strategy: this.strategy,
            responseTime: this.responseTime,
            isEnabled: this.isEnabled,
            isConnected: this.isConnected
        };
    }
    
    destroy() {
        this.disableAI();
        this.clearDecisionLoop();
    }
}

// Initialize Groq AI Client when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait for game to initialize
    setTimeout(() => {
        window.groqAI = new GroqAIClient();
        console.log('Groq AI Client initialized');
    }, 1000);
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.groqAI) {
        window.groqAI.destroy();
    }
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GroqAIClient;
}