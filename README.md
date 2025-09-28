# HTML5 Breakout Game 🎮

A modern, enhanced implementation of the classic Breakout game built with HTML5 Canvas, CSS3, and JavaScript. Features responsive design, smooth animations, engaging visual effects, and exciting gameplay mechanics including power-ups and particle systems.

## 🎬 Live Preview

![HTML5 Breakout Game Preview](https://html5-breakout-game.vercel.app/preview-screenshot.png)

**[🎮 Play Now on Vercel](https://html5-breakout-game.vercel.app/)**

## ✨ Enhanced Features

### 🎯 Core Gameplay
- **Pure HTML5 Canvas**: No external libraries or frameworks required
- **Multiple Control Options**: Arrow keys, WASD, mouse, or touch controls
- **Lives System**: 3 lives to complete the game
- **High Score Tracking**: Persistent local storage of your best scores
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### 🚀 New Enhanced Features (v2.0)
- **🎮 Touch & Mouse Controls**: Full support for mobile devices and mouse input
- **⚡ Power-up System**: Collect power-ups for special abilities:
  - **Multi-Ball (M)**: Increases ball speed for faster gameplay
  - **Larger Paddle (L)**: Temporarily increases paddle size
  - **Slow Ball (S)**: Reduces ball speed for easier control
- **💥 Particle Effects**: Beautiful particle explosions when bricks are destroyed
- **🎨 Enhanced Visuals**: Improved gradients, shadows, and animations
- **📱 Mobile Optimized**: Better touch controls and responsive layout
- **♿ Accessibility**: Screen reader support and keyboard navigation
- **🏆 High Score System**: Local storage saves your personal best

## 🎮 How to Play

1. **Start the Game**: Click anywhere on the canvas, tap, or press any key
2. **Control the Paddle**: 
   - **Keyboard**: Use arrow keys (←/→) or A/D keys
   - **Mouse**: Move mouse left/right over the game area
   - **Touch**: Touch and drag on mobile devices
3. **Break the Bricks**: Bounce the ball off your paddle to hit the colorful bricks
4. **Collect Power-ups**: Catch falling power-ups with your paddle for special abilities
5. **Win Condition**: Destroy all bricks to win the game
6. **Lives**: You have 3 lives - don't let the ball fall below your paddle!

## 🚀 Getting Started

### Option 1: Play Online

Simply visit the [live demo](https://html5-breakout-game.vercel.app/) or open `index.html` in any modern web browser.

### Option 2: Local Development

```bash
# Clone the repository
git clone https://github.com/Gzeu/html5-breakout-game.git

# Navigate to project directory
cd html5-breakout-game

# Open in browser
open index.html
# or serve with a local server
python -m http.server 8000  # Python 3
# Then visit http://localhost:8000
```

## 📁 Project Structure

```
html5-breakout-game/
│
├── index.html          # Main HTML file with enhanced structure
├── style.css           # Modern CSS with responsive design & accessibility
├── game.js             # Enhanced game logic with power-ups & effects
└── README.md           # This comprehensive documentation
```

## 🛠 Technical Details

### Technologies Used

- **HTML5**: Semantic structure, Canvas API, and accessibility features
- **CSS3**: Modern styling with flexbox, CSS Grid, gradients, and backdrop filters
- **JavaScript ES6+**: Object-oriented game logic, physics, DOM manipulation, and local storage

### Key Features Implementation

#### Enhanced Game Physics
- Advanced ball velocity and collision detection
- Improved paddle-ball interaction with realistic angle calculations
- Particle system for visual effects
- Power-up collision detection and effects

#### Modern Visual Design
- Glassmorphism effects with backdrop-filter
- CSS Grid and Flexbox for responsive layouts
- Canvas gradients and shadows for game objects
- Smooth animations with requestAnimationFrame
- Mobile-first responsive design

#### Accessibility & UX
- ARIA labels and keyboard navigation
- High contrast mode support
- Reduced motion preferences
- Touch-friendly controls
- Screen reader compatibility

## 🎨 Customization

The game is designed to be easily customizable. Here are some key parameters you can modify:

### Modify Game Parameters

```javascript
// In game.js, adjust these variables:
const brickRowCount = 4;        // Number of brick rows
const brickColumnCount = 6;     // Number of brick columns
const ball = {
    speed: 3,                   // Ball speed
    radius: 8                   // Ball size
};
const paddle = {
    width: 80,                  // Paddle width
    speed: 8                    // Paddle movement speed
};
```

### Add New Power-ups

```javascript
// Add to powerUpTypes object in game.js:
const powerUpTypes = {
    // Existing power-ups...
    NEW_POWERUP: { 
        color: '#YOUR_COLOR', 
        effect: 'yourEffectName' 
    }
};
```

## 📱 Browser Compatibility

- ✅ Chrome 60+ (Full support)
- ✅ Firefox 55+ (Full support)
- ✅ Safari 12+ (Full support)
- ✅ Edge 79+ (Full support)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)
- ✅ Progressive Web App ready

## 🤝 Contributing

Contributions are welcome! Here are some ideas for improvements:

### Planned Features
- [ ] Sound effects and background music
- [ ] Multiple levels with different brick layouts
- [ ] Online leaderboard system
- [ ] More power-up types (multi-ball, laser paddle, etc.)
- [ ] Animated backgrounds
- [ ] Achievement system
- [ ] Game replay system
- [ ] Progressive Web App features

### Contributing Guidelines
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🎯 Performance Notes

- Optimized for 60 FPS gameplay
- Efficient particle system with automatic cleanup
- Minimal DOM manipulation for better performance
- Canvas-based rendering for smooth animations

---

**Built with ❤️ using HTML5 Canvas API**

*Perfect for learning game development concepts, JavaScript physics, and modern web technologies.*

### 🔗 Links
- [Live Demo](https://html5-breakout-game.vercel.app/)
- [GitHub Repository](https://github.com/Gzeu/html5-breakout-game)
- [Report Issues](https://github.com/Gzeu/html5-breakout-game/issues)
- [Request Features](https://github.com/Gzeu/html5-breakout-game/issues/new)

### 📊 Stats
- **Lines of Code**: ~500 (JavaScript), ~200 (CSS), ~80 (HTML)
- **File Size**: < 50KB total
- **Load Time**: < 1 second
- **Mobile Friendly**: Yes
- **PWA Ready**: Yes