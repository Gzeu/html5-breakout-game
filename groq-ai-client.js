// Groq AI Client Integration for Neo Breakout - Enhanced with AI Personalities
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
        
        // Enhanced AI Personalities System
        this.personality = 'balanced'; // default personality
        this.personalities = {
            'aggressive': {
                name: 'Aggressive',
                description: 'Fast, risky moves prioritizing quick ball interception',
                prompt: 'Take high-risk, high-reward positions. Move quickly to intercept the ball. Prioritize offensive play over safety.',
                speedMultiplier: 1.4,
                riskTolerance: 0.8,
                predictionWeight: 0.7
            },
            'defensive': {
                name: 'Defensive',
                description: 'Conservative positioning, focus on ball control and safety',
                prompt: 'Focus on safe positioning. Minimize risk of missing the ball. Prioritize defensive play and ball control.',
                speedMultiplier: 0.8,
                riskTolerance: 0.3,
                predictionWeight: 0.9
            },
            'predictive': {
                name: 'Predictive',
                description: 'Advanced trajectory calculation with strategic positioning',
                prompt: 'Use advanced calculations and perfect trajectory prediction. Anticipate ball movement with mathematical precision.',
                speedMultiplier: 1.0,
                riskTolerance: 0.6,
                predictionWeight: 1.2
            },
            'adaptive': {
                name: 'Adaptive',
                description: 'Dynamic strategy switching based on game state',
                prompt: 'Switch strategies based on current game situation. Adapt behavior dynamically to game conditions.',
                speedMultiplier: 1.1,
                riskTolerance: 0.5,
                predictionWeight: 1.0
            },
            'balanced': {
                name: 'Balanced',
                description: 'Well-rounded AI behavior with moderate risk-taking',
                prompt: 'Maintain balanced gameplay with moderate risk-taking and strategic positioning.',
                speedMultiplier: 1.0,
                riskTolerance: 0.5,
                predictionWeight: 0.8
            }
        };
        
        // Personality performance metrics
        this.personalityStats = {};
        this.loadPersonalityStats();
        
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
            pauseBtn: document.getElementById('pauseBtn'),
            // New personality UI elements
            personalitySelector: document.getElementById('personalitySelector'),
            personalityName: document.getElementById('personalityName'),
            personalityDescription: document.getElementById('personalityDescription')
        };
        
        // Update initial UI state
        this.updateUI();
        this.initializePersonalityUI();
    }
    
    initializePersonalityUI() {
        // Create personality selector if it doesn't exist
        if (!this.elements.personalitySelector) {
            this.createPersonalitySelector();
        } else {
            this.populatePersonalitySelector();
        }
        
        this.updatePersonalityDisplay();
    }
    
    createPersonalitySelector() {
        // This method would be called if UI elements don't exist
        // In practice, these should be added to the HTML file
        console.log('Personality selector UI elements not found in DOM');
    }
    
    populatePersonalitySelector() {
        if (this.elements.personalitySelector) {
            // Clear existing options
            this.elements.personalitySelector.innerHTML = '';
            
            // Add personality options
            Object.keys(this.personalities).forEach(key => {
                const option = document.createElement('option');
                option.value = key;
                option.textContent = this.personalities[key].name;
                if (key === this.personality) {
                    option.selected = true;
                }
                this.elements.personalitySelector.appendChild(option);
            });
        }
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
        
        // Personality selector
        if (this.elements.personalitySelector) {
            this.elements.personalitySelector.addEventListener('change', (e) => {
                this.setPersonality(e.target.value);
            });
        }
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'i' || e.key === 'I') {
                this.toggleAI();
            } else if (e.key === 'p' || e.key === 'P') {
                this.cyclePersonality();
            }
        });
    }
    
    // Enhanced AI Personality Methods
    setPersonality(personality) {
        if (this.personalities[personality]) {
            const oldPersonality = this.personality;
            this.personality = personality;
            
            this.updatePersonalityDisplay();
            this.savePersonalityPreference();
            
            console.log(`AI Personality changed from ${oldPersonality} to ${personality}`);
            
            // Update reasoning to reflect personality change
            this.reasoning = `Switched to ${this.personalities[personality].name} mode`;
            this.updateUI();
        }
    }
    
    cyclePersonality() {
        const personalities = Object.keys(this.personalities);
        const currentIndex = personalities.indexOf(this.personality);
        const nextIndex = (currentIndex + 1) % personalities.length;
        this.setPersonality(personalities[nextIndex]);
    }
    
    getCurrentPersonality() {
        return {
            key: this.personality,
            ...this.personalities[this.personality]
        };
    }
    
    updatePersonalityDisplay() {
        const current = this.personalities[this.personality];
        
        if (this.elements.personalityName) {
            this.elements.personalityName.textContent = current.name;
        }
        
        if (this.elements.personalityDescription) {
            this.elements.personalityDescription.textContent = current.description;
        }
        
        if (this.elements.personalitySelector) {
            this.elements.personalitySelector.value = this.personality;
        }
    }
    
    savePersonalityPreference() {
        try {
            localStorage.setItem('groq-ai-personality', this.personality);
        } catch (error) {
            console.warn('Could not save personality preference:', error);
        }
    }
    
    loadPersonalityPreference() {
        try {
            const saved = localStorage.getItem('groq-ai-personality');
            if (saved && this.personalities[saved]) {
                this.personality = saved;
            }
        } catch (error) {
            console.warn('Could not load personality preference:', error);
        }
    }
    
    loadPersonalityStats() {
        try {
            const saved = localStorage.getItem('groq-ai-personality-stats');
            this.personalityStats = saved ? JSON.parse(saved) : {};
            
            // Initialize stats for all personalities
            Object.keys(this.personalities).forEach(key => {
                if (!this.personalityStats[key]) {
                    this.personalityStats[key] = {
                        gamesPlayed: 0,
                        wins: 0,
                        averageScore: 0,
                        averageResponseTime: 0,
                        successfulHits: 0,
                        totalHits: 0
                    };
                }
            });
        } catch (error) {
            console.warn('Could not load personality stats:', error);
            this.personalityStats = {};
        }
    }
    
    savePersonalityStats() {
        try {
            localStorage.setItem('groq-ai-personality-stats', JSON.stringify(this.personalityStats));
        } catch (error) {
            console.warn('Could not save personality stats:', error);
        }
    }
    
    updatePersonalityStats(gameResult) {
        if (!this.personalityStats[this.personality]) return;
        
        const stats = this.personalityStats[this.personality];
        stats.gamesPlayed++;
        
        if (gameResult.won) {
            stats.wins++;
        }
        
        stats.averageScore = ((stats.averageScore * (stats.gamesPlayed - 1)) + gameResult.score) / stats.gamesPlayed;
        stats.averageResponseTime = ((stats.averageResponseTime * (stats.gamesPlayed - 1)) + this.responseTime) / stats.gamesPlayed;
        
        if (gameResult.hit !== undefined) {
            stats.totalHits++;
            if (gameResult.hit) {
                stats.successfulHits++;
            }
        }
        
        this.savePersonalityStats();
    }
    
    getPersonalityStats(personality = null) {
        const target = personality || this.personality;
        return this.personalityStats[target] || null;
    }
    
    async toggleAI() {
        this.isEnabled = !this.isEnabled;
        
        if (this.isEnabled) {
            this.loadPersonalityPreference(); // Load saved personality
            await this.enableAI();
        } else {
            this.disableAI();
        }
        
        this.updateUI();
        this.updatePersonalityDisplay();
        
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
        this.showStatus(`Initializing ${this.personalities[this.personality].name} neural network...`);
        
        try {
            // Test connection
            const testResponse = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    gameState: this.getDummyGameState(),
                    difficulty: this.difficulty,
                    personality: this.personality
                })
            });
            
            if (testResponse.ok) {
                this.isConnected = true;
                this.showStatus(`${this.personalities[this.personality].name} neural network online`);
                this.startDecisionLoop();
            } else {
                throw new Error('Connection failed');
            }
        } catch (error) {
            console.error('Groq AI connection failed:', error);
            this.isConnected = false;
            this.showStatus(`Connection failed - Using local ${this.personalities[this.personality].name} AI`);
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
                // Use Groq AI with personality
                decision = await this.getGroqDecision(gameState);
            } else {
                // Use local AI fallback with personality
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
        const currentPersonality = this.personalities[this.personality];
        
        const response = await fetch(this.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                gameState: gameState,
                difficulty: this.difficulty,
                personality: this.personality,
                personalityPrompt: currentPersonality.prompt
            })
        });
        
        if (!response.ok) {
            throw new Error(`Groq API error: ${response.status}`);
        }
        
        const data = await response.json();
        return data.aiDecision;
    }
    
    getLocalDecision(gameState) {
        // Enhanced local AI logic with personality-aware behavior
        const currentPersonality = this.personalities[this.personality];
        const prediction = gameAPI.predictBallHitPaddle();
        const ball = gameState.ball;
        const paddle = gameState.paddle;
        const canvas = gameState.canvas;
        
        let targetX;
        let strategy;
        let reasoning;
        let confidence;
        
        // Personality-based decision making
        switch (this.personality) {
            case 'aggressive':
                targetX = this.getAggressivePosition(gameState, prediction, currentPersonality);
                strategy = 'AGGRESSIVE';
                reasoning = 'Taking aggressive position for maximum ball control';
                confidence = prediction.willHit ? 90 : 70;
                break;
                
            case 'defensive':
                targetX = this.getDefensivePosition(gameState, prediction, currentPersonality);
                strategy = 'DEFENSIVE';
                reasoning = 'Maintaining safe defensive position';
                confidence = prediction.willHit ? 95 : 85;
                break;
                
            case 'predictive':
                targetX = this.getPredictivePosition(gameState, prediction, currentPersonality);
                strategy = 'PREDICTIVE';
                reasoning = 'Using advanced trajectory prediction';
                confidence = prediction.willHit ? 92 : 75;
                break;
                
            case 'adaptive':
                targetX = this.getAdaptivePosition(gameState, prediction, currentPersonality);
                strategy = 'ADAPTIVE';
                reasoning = 'Adapting strategy based on game state';
                confidence = prediction.willHit ? 88 : 72;
                break;
                
            default: // balanced
                targetX = this.getBalancedPosition(gameState, prediction, currentPersonality);
                strategy = 'BALANCED';
                reasoning = 'Balanced positioning with moderate risk';
                confidence = prediction.willHit ? 85 : 65;
                break;
        }
        
        // Apply personality speed multiplier
        const speedMultiplier = currentPersonality.speedMultiplier || 1.0;
        
        // Clamp to bounds
        targetX = Math.max(0, Math.min(canvas.width - paddle.width, targetX));
        
        return {
            paddleX: targetX,
            strategy: strategy,
            confidence: confidence,
            reasoning: `[${currentPersonality.name}] ${reasoning}`,
            personality: this.personality,
            speedMultiplier: speedMultiplier
        };
    }
    
    getAggressivePosition(gameState, prediction, personality) {
        const ball = gameState.ball;
        const paddle = gameState.paddle;
        const canvas = gameState.canvas;
        
        if (prediction.willHit && prediction.timeToHit > 0) {
            // Aggressive: Move quickly to intercept with high-risk positioning
            const speedFactor = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy) / 3; // More aggressive speed factor
            const riskAdjustment = (ball.dx > 0 ? 25 : -25) * speedFactor * personality.riskTolerance;
            return prediction.predictedX + riskAdjustment - paddle.width / 2;
        } else {
            // Aggressive center positioning with ball influence
            const centerX = canvas.width / 2 - paddle.width / 2;
            const ballInfluence = (ball.x - canvas.width / 2) * 0.6; // Higher influence
            return centerX + ballInfluence;
        }
    }
    
    getDefensivePosition(gameState, prediction, personality) {
        const ball = gameState.ball;
        const paddle = gameState.paddle;
        const canvas = gameState.canvas;
        
        if (prediction.willHit && prediction.timeToHit > 0) {
            // Defensive: Safe positioning with minimal risk
            const safetyMargin = paddle.width * 0.2;
            return prediction.predictedX - paddle.width / 2;
        } else {
            // Strong center bias with minimal ball influence
            const centerX = canvas.width / 2 - paddle.width / 2;
            const ballInfluence = (ball.x - canvas.width / 2) * 0.2; // Lower influence
            return centerX + ballInfluence;
        }
    }
    
    getPredictivePosition(gameState, prediction, personality) {
        const ball = gameState.ball;
        const paddle = gameState.paddle;
        const canvas = gameState.canvas;
        
        if (prediction.willHit && prediction.timeToHit > 0) {
            // Predictive: Advanced calculation with trajectory optimization
            const futureSteps = Math.min(10, prediction.timeToHit);
            let futureX = ball.x;
            let futureDx = ball.dx;
            
            // Simulate future ball position
            for (let i = 0; i < futureSteps; i++) {
                futureX += futureDx;
                if (futureX <= 0 || futureX >= canvas.width) {
                    futureDx = -futureDx;
                }
            }
            
            return futureX - paddle.width / 2;
        } else {
            // Predictive positioning based on ball trajectory
            const centerX = canvas.width / 2 - paddle.width / 2;
            const trajectoryFactor = ball.dx * 3; // Predict where ball is heading
            return centerX + trajectoryFactor;
        }
    }
    
    getAdaptivePosition(gameState, prediction, personality) {
        const ball = gameState.ball;
        const paddle = gameState.paddle;
        const canvas = gameState.canvas;
        const score = gameState.score || 0;
        const lives = gameState.lives || 3;
        
        // Adapt strategy based on game state
        let adaptiveStrategy;
        
        if (lives <= 1) {
            // Low lives: Be defensive
            adaptiveStrategy = 'defensive';
        } else if (score > 1000) {
            // High score: Be aggressive
            adaptiveStrategy = 'aggressive';
        } else {
            // Medium state: Use predictive
            adaptiveStrategy = 'predictive';
        }
        
        // Use the adapted strategy
        switch (adaptiveStrategy) {
            case 'aggressive':
                return this.getAggressivePosition(gameState, prediction, this.personalities.aggressive);
            case 'defensive':
                return this.getDefensivePosition(gameState, prediction, this.personalities.defensive);
            case 'predictive':
                return this.getPredictivePosition(gameState, prediction, this.personalities.predictive);
            default:
                return this.getBalancedPosition(gameState, prediction, personality);
        }
    }
    
    getBalancedPosition(gameState, prediction, personality) {
        const ball = gameState.ball;
        const paddle = gameState.paddle;
        const canvas = gameState.canvas;
        
        if (prediction.willHit && prediction.timeToHit > 0) {
            // Balanced: Moderate risk with good positioning
            const speedFactor = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy) / 5;
            const adjustment = (ball.dx > 0 ? 15 : -15) * speedFactor;
            return prediction.predictedX + adjustment - paddle.width / 2;
        } else {
            // Balanced defensive positioning with moderate ball influence
            const centerX = canvas.width / 2 - paddle.width / 2;
            const ballInfluence = (ball.x - canvas.width / 2) * 0.4;
            return centerX + ballInfluence;
        }
    }
    
    getBasicDecision(gameState) {
        // Simplest AI: follow ball with personality modifier
        const currentPersonality = this.personalities[this.personality];
        const targetX = gameState.ball.x - gameState.paddle.width / 2;
        const clampedX = Math.max(0, Math.min(
            gameState.canvas.width - gameState.paddle.width,
            targetX
        ));
        
        return {
            paddleX: clampedX,
            strategy: 'FOLLOW',
            confidence: 50,
            reasoning: `[${currentPersonality.name}] Basic ball tracking mode`,
            personality: this.personality,
            speedMultiplier: currentPersonality.speedMultiplier
        };
    }
    
    applyDecision(decision, gameState) {
        if (typeof gameAPI !== 'undefined') {
            gameAPI.setAIPaddleX(decision.paddleX);
            
            // Apply speed multiplier if supported
            if (decision.speedMultiplier && gameAPI.setAISpeedMultiplier) {
                gameAPI.setAISpeedMultiplier(decision.speedMultiplier);
            }
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
            const btnText = this.elements.aiBtn.querySelector('.btn-text');
            if (btnText) {
                btnText.textContent = this.isEnabled ? 'DISABLE AI' : `${this.personalities[this.personality].name.toUpperCase()} AI`;
            }
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
    
    // Enhanced Public API methods
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
            isConnected: this.isConnected,
            personality: this.personality,
            personalityStats: this.getPersonalityStats()
        };
    }
    
    getAllPersonalities() {
        return Object.keys(this.personalities).map(key => ({
            key: key,
            ...this.personalities[key]
        }));
    }
    
    getAllPersonalityStats() {
        return this.personalityStats;
    }
    
    resetPersonalityStats(personality = null) {
        if (personality && this.personalityStats[personality]) {
            this.personalityStats[personality] = {
                gamesPlayed: 0,
                wins: 0,
                averageScore: 0,
                averageResponseTime: 0,
                successfulHits: 0,
                totalHits: 0
            };
        } else if (!personality) {
            // Reset all stats
            Object.keys(this.personalities).forEach(key => {
                this.personalityStats[key] = {
                    gamesPlayed: 0,
                    wins: 0,
                    averageScore: 0,
                    averageResponseTime: 0,
                    successfulHits: 0,
                    totalHits: 0
                };
            });
        }
        this.savePersonalityStats();
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
        console.log('Groq AI Client with Enhanced Personalities initialized');
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