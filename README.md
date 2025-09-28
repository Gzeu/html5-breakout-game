# HTML5 Breakout Game 🎮

A modern implementation of the classic Breakout game built with HTML5 Canvas, CSS3, and JavaScript. Features responsive design, smooth animations, and engaging visual effects.

## 🎬 Live Preview

![HTML5 Breakout Game Preview](https://html5-breakout-game.vercel.app/preview-screenshot.png)

**[🎮 Play Now on Vercel](https://html5-breakout-game.vercel.app/)**

## 🎯 Features

- **Pure HTML5 Canvas**: No external libraries or frameworks required
- **Responsive Design**: Plays perfectly on desktop, tablet, and mobile devices
- **Modern UI**: Glassmorphism design with gradient backgrounds and smooth animations
- **Multiple Controls**: Arrow keys, WASD, or touch controls
- **Visual Effects**: Gradient colors, shadows, and smooth ball physics
- **Score System**: Track your progress as you break through brick layers
- **Game States**: Start screen, game over, and win conditions
- **Accessibility**: Keyboard navigation and screen reader friendly

## 🎮 How to Play

1. **Start the Game**: Click anywhere on the canvas or press any key
2. **Move the Paddle**: Use arrow keys (←/→) or A/D keys
3. **Break the Bricks**: Bounce the ball off your paddle to hit the colorful bricks
4. **Win Condition**: Destroy all bricks to win the game
5. **Game Over**: Don't let the ball fall below your paddle!

## 🚀 Getting Started

### Option 1: Play Online

Simply open index.html in any modern web browser, or visit the live demo.

### Option 2: Local Development

```bash
# Clone the repository
git clone https://github.com/Gzeu/html5-breakout-game.git

# Navigate to project directory
cd html5-breakout-game

# Open in browser
open index.html
# or
python -m http.server 8000  # For local server
```

## 📁 Project Structure

```
html5-breakout-game/
│
├── index.html          # Main HTML file with game structure
├── style.css           # Modern CSS with glassmorphism design
├── game.js             # Complete game logic and physics
└── README.md           # This documentation
```

## 🛠 Technical Details

### Technologies Used

- **HTML5**: Semantic structure and Canvas API
- **CSS3**: Modern styling with flexbox, gradients, and backdrop filters
- **JavaScript ES6+**: Game logic, physics, and DOM manipulation

### Key Features Implementation

#### Game Physics
- Ball velocity and collision detection
- Paddle-ball interaction with angle calculations
- Brick destruction with score tracking
- Boundary collision handling

#### Visual Design
- CSS Grid and Flexbox for responsive layout
- Glassmorphism effects with backdrop-filter
- Canvas gradients for game objects
- Smooth animations with requestAnimationFrame

## 🎨 Customization

The game is designed to be easily customizable:

### Modify Game Parameters

```javascript
// In game.js, adjust these variables:
const brickRowCount = 4;        // Number of brick rows
const brickColumnCount = 6;     // Number of brick columns
const ball = {
    speed: 3,                   // Ball speed
    radius: 8                   // Ball size
};
```

## 📱 Browser Compatibility

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers

## 🤝 Contributing

Contributions are welcome! Ideas for improvements:

- [ ] Add sound effects and background music
- [ ] Implement power-ups (multi-ball, larger paddle, etc.)
- [ ] Create multiple levels with different layouts
- [ ] Add particle effects for brick destruction
- [ ] Implement local high score storage

## 📄 License

This project is open source and available under the MIT License.

---

**Built with ❤️ using HTML5 Canvas API**

*Perfect for learning game development concepts and JavaScript physics.*
