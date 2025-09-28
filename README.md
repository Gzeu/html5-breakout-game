# 🔮 NEO BREAKOUT - Cyberpunk Edition

> **A futuristic HTML5 Breakout game powered by Groq AI with stunning cyberpunk visuals, neural network gameplay, and real-time AI decision making.**

[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel)](https://html5-breakout-game.vercel.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-cyan.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Groq AI](https://img.shields.io/badge/Powered%20by-Groq%20AI-ff6b6b?style=for-the-badge)](https://groq.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES2024-yellow.svg?style=for-the-badge&logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

## 🎮 [**PLAY NOW**](https://html5-breakout-game.vercel.app/)

*Experience the future of gaming with AI-powered gameplay, cyberpunk aesthetics, and neural network decision making.*

---

## ✨ Features

### 🌌 **Cyberpunk Visual Experience**
- **Neon-lit interface** with glowing effects and animations
- **Grid-based background** with animated particles
- **Scan lines and screen overlay** for authentic retro-futuristic feel
- **Dynamic color palette** with cyan, pink, and green neon accents
- **Smooth animations** and transitions throughout
- **Responsive design** optimized for all devices

### 🤖 **Groq AI Integration**
- **Real-time AI decision making** using Groq's LLM models
- **Advanced trajectory prediction** with strategic positioning
- **Multiple difficulty levels** for AI behavior
- **Live metrics display** showing confidence and strategy
- **Fallback local AI** when API is unavailable
- **Sub-100ms response times** for fluid gameplay
- **AI toggle** - Switch between human and AI control instantly

### 🎯 **Enhanced Gameplay**
- **Multiple control schemes**: Keyboard, mouse, and touch
- **Power-up systems**: Multi-ball, paddle enhancement, time dilation
- **Advanced physics** with realistic ball behavior
- **Progressive difficulty** scaling
- **High score tracking** with local storage
- **Pause/resume functionality**

### 🎨 **Modern UI/UX**
- **Orbitron & Rajdhani fonts** for cyberpunk typography
- **Interactive control panels** with hover effects
- **Real-time status indicators** for all game systems
- **Accessibility features** including high contrast mode
- **Performance optimizations** for smooth 60fps gameplay

---

## 🚀 Quick Start

### **Play Online**
```bash
# Just visit the live demo
https://html5-breakout-game.vercel.app/
```

### **Local Development**
```bash
# Clone the repository
git clone https://github.com/Gzeu/html5-breakout-game.git
cd html5-breakout-game

# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

### **Deploy to Vercel**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables
vercel env add GROQ_API_KEY
```

---

## 🧠 Groq AI Setup

### **Environment Configuration**

1. **Get Groq API Key**:
   - Visit [Groq Console](https://console.groq.com/)
   - Create an account and generate an API key
   - Copy your API key

2. **Vercel Environment Variables**:
   ```bash
   # Add to Vercel dashboard or CLI
   GROQ_API_KEY=your_groq_api_key_here
   ```

3. **Local Development**:
   ```bash
   # Create .env.local file
   echo "GROQ_API_KEY=your_api_key_here" > .env.local
   ```

### **AI Configuration Options**

```javascript
// Difficulty levels
const difficulties = {
  'easy': 'Predictable movement, basic strategy',
  'medium': 'Balanced gameplay with smart positioning',  
  'hard': 'Advanced prediction and optimal play',
  'expert': 'Near-perfect gameplay with complex strategies'
};

// Customize AI behavior
groqAI.setDifficulty('medium');
```

---

## 🎮 Controls & Gameplay

### **Control Schemes**
| Input | Action |
|-------|--------|
| `←` `→` | Move paddle left/right |
| `A` `D` | Alternative movement |
| `I` | Toggle AI mode |
| `Space` | Pause/Resume game |
| **Mouse** | Move paddle (follows cursor) |
| **Touch** | Mobile-friendly touch controls |

### **Power-ups**
| Icon | Name | Effect |
|------|------|--------|
| 🔴 **M** | Multi-Core | Splits ball into multiple balls |
| 🟢 **L** | Amplifier | Increases paddle size |
| 🔵 **S** | Time-Dilation | Slows down ball movement |

### **AI Modes**
- **Manual Mode**: Human player control
- **AI Mode**: Groq AI takes control with real-time decision making
- **Hybrid Mode**: AI assistance with human override capability

---

## 🔧 Technical Architecture

### **Frontend Stack**
```
├── HTML5 Canvas        # Game rendering engine
├── Vanilla JavaScript  # Game logic and physics
├── CSS3 Animations     # Cyberpunk visual effects
├── Web APIs           # Local storage, audio, etc.
└── Responsive Design   # Mobile-first approach
```

### **Backend Integration**
```
├── Vercel Functions    # Serverless AI endpoints
├── Groq SDK          # AI model integration
├── CORS Headers       # Cross-origin support
└── Error Handling     # Graceful fallbacks
```

### **AI Pipeline**
```
Game State → Groq API → Decision Analysis → Paddle Control
     ↓           ↓              ↓              ↓
Real-time   LLM Processing   Strategy Logic   Smooth Movement
```

---

## 🎨 Customization

### **Visual Themes**
```css
/* Customize neon colors */
:root {
  --neon-cyan: #00ffff;
  --neon-pink: #ff00ff;
  --neon-green: #00ff41;
  --neon-orange: #ff8800;
}
```

### **AI Behavior**
```javascript
// Modify AI decision-making
class CustomAI extends GroqAIClient {
  getLocalDecision(gameState) {
    // Your custom AI logic here
    return {
      paddleX: targetX,
      strategy: 'CUSTOM',
      confidence: 95,
      reasoning: 'Custom strategy applied'
    };
  }
}
```

### **Game Physics**
```javascript
// Adjust game parameters
const gameConfig = {
  ballSpeed: 4,
  paddleSpeed: 8,
  brickRows: 5,
  brickColumns: 10,
  powerUpChance: 0.1
};
```

---

## 📊 API Reference

### **Game API**
```javascript
// Core game control
gameAPI.enableAIControl(true/false)
gameAPI.setAIPaddleX(position)
gameAPI.getGameState()
gameAPI.predictBallHitPaddle()
gameAPI.startGameByAI()
gameAPI.resetGameByAI()
```

### **AI Client API**
```javascript
// Groq AI control
groqAI.toggleAI()              // Enable/disable AI
groqAI.setDifficulty(level)    // Set AI difficulty
groqAI.getMetrics()            // Get performance metrics
groqAI.makeDecision(gameState) // Manual decision trigger
```

### **Groq API Endpoint**
```http
POST /api/groq-ai
Content-Type: application/json

{
  "gameState": {
    "ball": { "x": 240, "y": 160, "dx": 2, "dy": -2 },
    "paddle": { "x": 200, "y": 300, "width": 80 },
    "canvas": { "width": 480, "height": 320 },
    "score": 1250,
    "lives": 2,
    "bricksRemaining": 15
  },
  "difficulty": "medium"
}
```

**Response:**
```json
{
  "success": true,
  "aiDecision": {
    "paddleX": 180,
    "strategy": "INTERCEPT",
    "confidence": 87,
    "reasoning": "Positioning for optimal ball intercept"
  },
  "timestamp": "2025-09-28T20:45:00.000Z"
}
```

---

## 🧪 Advanced Features

### **Performance Monitoring**
```javascript
// Monitor AI performance
const metrics = groqAI.getMetrics();
console.log({
  responseTime: metrics.responseTime + 'ms',
  confidence: metrics.confidence + '%',
  strategy: metrics.strategy,
  accuracy: metrics.successRate + '%'
});
```

### **Custom Training Data**
```javascript
// Log gameplay data for analysis
const gameplayData = {
  timestamp: Date.now(),
  ballPosition: gameState.ball,
  aiDecision: decision,
  outcome: 'success|miss',
  score: gameState.score
};
```

### **A/B Testing**
```javascript
// Compare different AI strategies
const aiStrategies = ['conservative', 'aggressive', 'predictive'];
const currentStrategy = aiStrategies[Math.floor(Math.random() * 3)];
groqAI.setStrategy(currentStrategy);
```

---

## 🏗️ Project Structure

```
neo-breakout/
├── index.html              # Main game interface with AI integration
├── game.js                 # Core game engine
├── groq-ai-client.js       # AI integration layer
├── style.css               # Cyberpunk theme
├── api/
│   └── groq-ai.js          # Serverless AI endpoint
├── assets/
│   ├── sounds/             # Game audio (future)
│   └── images/             # UI graphics (future)
└── docs/
    ├── API.md              # Detailed API docs
    ├── DEPLOYMENT.md       # Deployment guide
    └── CONTRIBUTING.md     # Contribution guide
```

---

## 🔮 Roadmap

### **Version 2.1 - Enhanced AI**
- [ ] Multiple AI personalities
- [ ] Machine learning training data collection
- [ ] Advanced strategy selection
- [ ] Real-time difficulty adjustment

### **Version 2.2 - Multiplayer**
- [ ] AI vs AI tournaments
- [ ] Human vs AI competitions
- [ ] Leaderboard integration
- [ ] WebSocket real-time play

### **Version 2.3 - Extended Features**
- [ ] Level editor
- [ ] Custom brick patterns
- [ ] Achievement system
- [ ] Audio/music integration

### **Version 3.0 - Next Gen**
- [ ] 3D graphics with WebGL
- [ ] VR/AR support
- [ ] Neural network visualization
- [ ] Advanced physics engine

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### **Development Guidelines**
- Follow ES2024 standards
- Use semantic commit messages
- Add JSDoc comments for functions
- Test on multiple browsers/devices
- Maintain cyberpunk aesthetic

---

## 📈 Performance

### **Benchmarks**
- **Frame Rate**: 60 FPS on modern devices
- **AI Response**: <100ms average
- **Memory Usage**: <50MB
- **Bundle Size**: <500KB total
- **Lighthouse Score**: 95+ on all metrics

### **Browser Support**
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers

---

## 🐛 Troubleshooting

### **Common Issues**

**AI not working?**
```bash
# Check environment variables
echo $GROQ_API_KEY

# Test API endpoint
curl -X POST https://your-domain.vercel.app/api/groq-ai
```

**Performance issues?**
```javascript
// Enable performance monitoring
performance.mark('game-start');
// ... game code ...
performance.mark('game-end');
performance.measure('game-duration', 'game-start', 'game-end');
```

**Visual glitches?**
- Enable hardware acceleration in browser
- Check CSS animations preference
- Verify canvas support

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **[Groq](https://groq.com/)** - For providing lightning-fast AI inference
- **[Vercel](https://vercel.com/)** - For seamless deployment platform
- **[Google Fonts](https://fonts.google.com/)** - For Orbitron & Rajdhani fonts
- **HTML5 Canvas Community** - For inspiration and resources
- **Cyberpunk Genre** - For aesthetic inspiration

---

## 📞 Contact

**George Pricop** ([@Gzeu](https://github.com/Gzeu))
- 🌐 **Website**: [georgepricop.ro](https://georgepricop.ro)
- 📧 **Email**: contact@georgepricop.ro
- 🐦 **Twitter**: [@GeorgePricop](https://twitter.com/GeorgePricop)
- 💼 **LinkedIn**: [george-pricop](https://linkedin.com/in/george-pricop)

---

<div align="center">

### **🎮 Ready to Experience the Future of Gaming?**

[![Play Now](https://img.shields.io/badge/🎮%20PLAY%20NOW-00ffff?style=for-the-badge&labelColor=000000)](https://html5-breakout-game.vercel.app/)
[![Star Repository](https://img.shields.io/badge/⭐%20STAR%20REPO-ff00ff?style=for-the-badge&labelColor=000000)](https://github.com/Gzeu/html5-breakout-game)
[![Fork Project](https://img.shields.io/badge/🔱%20FORK-00ff41?style=for-the-badge&labelColor=000000)](https://github.com/Gzeu/html5-breakout-game/fork)

**Built with ❤️ in the Cyberpunk Era • Powered by Neural Networks**

</div>