# 🎮 HTML5 Breakout Game with AI Control

Un joc Breakout modern implementat în HTML5 Canvas cu funcționalitate avansată de control AI. Jocul poate fi controlat manual de utilizator sau automat de către un asistent AI.

## ✨ Caracteristici

### 🎮 Joc Standard
- **Control intuitiv**: Tastatură (săgeți/A,D), mouse și touch
- **Efecte vizuale**: Gradient-uri, particule și animații
- **Power-ups**: Minge multiplă, paletă mare, minge încetinită
- **Sistem de scoruri**: Local storage pentru high score
- **Design responsive**: Funcționează pe desktop și mobile

### 🤖 Control AI Avansat
- **API complet**: Funcții pentru control programatic
- **Predicție traiectorie**: Algoritm de prezicere a poziției mingii
- **Control vizual**: Indicatori pentru modul AI activ
- **Callback sistem**: Integrare cu sisteme AI externe
- **Strategii multiple**: Exemple de AI simplu și avansat

## 🚀 Demonstrație Live

- **Joc principal**: [https://html5-breakout-game.vercel.app/](https://html5-breakout-game.vercel.app/)
- **Demo AI**: [https://html5-breakout-game.vercel.app/ai-example.html](https://html5-breakout-game.vercel.app/ai-example.html)

## 🔧 API pentru Control AI

### Funcții de Control de Bază

```javascript
// Activează/dezactivează controlul AI
gameAPI.enableAIControl(true);  // Enable AI
gameAPI.enableAIControl(false); // Enable human control

// Controlează poziția paletei
gameAPI.setAIPaddleX(200);        // Set exact position
gameAPI.moveAIPaddleLeft(50);     // Move left by 50px
gameAPI.moveAIPaddleRight(50);    // Move right by 50px

// Control joc
gameAPI.startGameByAI();          // Start game with AI
gameAPI.resetGameByAI();          // Reset game
```

### Funcții de Informații

```javascript
// Obține starea completă a jocului
const gameState = gameAPI.getGameState();
console.log(gameState);
// Returns: { ball: {...}, paddle: {...}, score, lives, gameRunning, ... }

// Prezice unde va lovi mingea
const prediction = gameAPI.predictBallHitPaddle();
if (prediction.willHit) {
    console.log('Ball will hit at X:', prediction.predictedX);
    console.log('Optimal paddle X:', prediction.optimalPaddleX);
    console.log('Time to hit:', prediction.timeToHit);
}
```

### AI Decision Callback

```javascript
// Set callback pentru decizii AI in timp real
gameAPI.setAIDecisionCallback((gameState) => {
    // Logica ta AI aici
    const prediction = gameAPI.predictBallHitPaddle();
    if (prediction.willHit) {
        gameAPI.setAIPaddleX(prediction.optimalPaddleX);
    }
});
```

## 🧠 Exemple de Strategii AI

### AI Simplu - Urmărește Mingea
```javascript
function simpleAI(gameState) {
    const targetX = gameState.ball.x - gameState.paddle.width / 2;
    const clampedX = Math.max(0, Math.min(
        gameState.canvas.width - gameState.paddle.width,
        targetX
    ));
    gameAPI.setAIPaddleX(clampedX);
}

gameAPI.setAIDecisionCallback(simpleAI);
```

### AI Avansat - Predicție și Strategie
```javascript
function advancedAI(gameState) {
    const prediction = gameAPI.predictBallHitPaddle();
    const ball = gameState.ball;
    
    if (prediction.willHit && prediction.timeToHit > 0) {
        // Calculează poziția optimă cu ajustări pentru viteză
        const speedFactor = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy) / 5;
        const adjustment = (ball.dx > 0 ? 10 : -10) * speedFactor;
        let targetX = prediction.predictedX + adjustment;
        
        // Centrează paleta pe poziția prezisă
        const optimalX = targetX - gameState.paddle.width / 2;
        gameAPI.setAIPaddleX(optimalX);
    } else {
        // Poziționare defensivă în centru
        const centerX = gameState.canvas.width / 2 - gameState.paddle.width / 2;
        const ballInfluence = (ball.x - gameState.canvas.width / 2) * 0.3;
        gameAPI.setAIPaddleX(centerX + ballInfluence);
    }
}

gameAPI.setAIDecisionCallback(advancedAI);
```

## 🎲 Cum să Folosești

### Control Manual
1. Deschide [jocul](https://html5-breakout-game.vercel.app/)
2. Folosește săgețile ←→, A/D sau mouse/touch pentru a mișca paleta
3. Apasă `I` pentru a comuta între control uman și AI

### Control AI Programatic
1. Deschide [demo-ul AI](https://html5-breakout-game.vercel.app/ai-example.html)
2. Folosește butoanele pentru control rapid
3. Deschide consola browserului pentru comenzi avansate
4. Încearcă: `advancedAI.start()` pentru AI avansat

### Integrare în Propriul Proiect
```html
<!DOCTYPE html>
<html>
<head>
    <title>My AI Breakout</title>
</head>
<body>
    <canvas id="gameCanvas" width="480" height="320"></canvas>
    <div id="score">0</div>
    <div id="lives">3</div>
    
    <script src="game.js"></script>
    <script>
        // Activează AI și începe jocul
        gameAPI.enableAIControl(true);
        gameAPI.startGameByAI();
        
        // Implementează strategia ta AI
        gameAPI.setAIDecisionCallback((gameState) => {
            // Logica ta personalizată aici
        });
    </script>
</body>
</html>
```

## 📱 Funcționalități AI

### Starea Jocului Disponibilă
```javascript
const gameState = gameAPI.getGameState();
// Conține:
// - ball: {x, y, dx, dy} - Poziție și viteză minge
// - paddle: {x, y, width} - Poziție și dimensiuni paletă
// - score, lives - Scor și vieți
// - gameRunning, gameStarted - Stare joc
// - canvas: {width, height} - Dimensiuni canvas
// - bricksRemaining - Numărul de cărămizi rămase
// - powerUps: [{x, y, effect}] - Power-ups active
```

### Predicție Traiectorie
```javascript
const prediction = gameAPI.predictBallHitPaddle();
// Returnează:
// - willHit: boolean - Dacă mingea va lovi paleta
// - predictedX: number - Poziția X unde va lovi
// - timeToHit: number - Timpul până la impact
// - optimalPaddleX: number - Poziția optimă pentru paletă
```

### Indicatori Vizuali
- **Paletă colorată**: Roz pentru AI, Albastru pentru human
- **Text "AI"**: Afișat pe paletă când AI este activ
- **Mesaje console**: Logging pentru debug și monitorizare

## 🔧 Dezvoltare Locală

```bash
# Clone repository
git clone https://github.com/Gzeu/html5-breakout-game.git
cd html5-breakout-game

# Deschide în browser
# Fișierul principal: index.html
# Demo AI: ai-example.html
```

## 📚 Structura Proiectului

```
html5-breakout-game/
├── index.html          # Joc principal
├── game.js             # Engine joc cu AI API
├── ai-example.html     # Demo AI cu interfață
├── style.css           # Stiluri pentru joc
└── README.md           # Documentație
```

## 🌟 Cazuri de Utilizare

### Pentru Dezvoltatori
- **Testare automată**: AI poate testa mechanicile jocului
- **Demo interactiv**: Prezentare automată a jocului
- **Benchmark performance**: Testare consistentă

### Pentru Educație
- **Învățarea AI**: Exemple practice de algoritmi
- **Programare jocuri**: Demonstrație API design
- **Fizică interactivă**: Algoritmi de predicție

### Pentru Cercetare
- **Machine Learning**: Antrenare agenți RL
- **Algoritmi genetici**: Evoluție strategii
- **Computer Vision**: Integrare cu recunoaștere imagine

## 🐛 Debugging și Tips

### Console Commands
```javascript
// Verifică dacă AI este activ
console.log('AI enabled:', gameAPI.aiEnabled);

// Vezi starea completă
console.table(gameAPI.getGameState());

// Test manual poziționare
gameAPI.enableAIControl(true);
gameAPI.setAIPaddleX(240); // Center position

// Test predicție
setInterval(() => {
    const pred = gameAPI.predictBallHitPaddle();
    if (pred.willHit) console.log('Ball will hit at:', pred.predictedX);
}, 1000);
```

### Probleme Comune
1. **AI nu răspunde**: Verifică `gameAPI.aiEnabled` și `gameRunning`
2. **Mișcare bruscă**: Ajustează `aiSpeed` în cod
3. **Predicții greșite**: Verifică că mingea se mișcă în jos (`ball.dy > 0`)

## 🚀 Planuri Viitoare

- [ ] **Multi-ball AI**: Gestionarea mai multor mingi simultan
- [ ] **Difficulty levels**: AI cu niveluri diferite de abilitate
- [ ] **WebSocket API**: Control extern prin websocket
- [ ] **Machine Learning**: Integrare cu TensorFlow.js
- [ ] **Tournament mode**: AI vs AI competiții

## 📜 Licență

Acest proiect este open source și disponibil sub licența MIT.

## 🤝 Contribuții

Contribuțiile sunt binevenite! Poți contribui prin:
- Îmbunătățirea algoritmilor AI
- Adăugarea de noi funcționalități
- Optimizarea performanțelor
- Documentația și exemple

---

**Creat de [Gzeu](https://github.com/Gzeu)** - Un joc Breakout modern cu capabilități AI avansate! 🎆