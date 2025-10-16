# FocusBubble - React Popup UI

Modern, animated popup interface for the FocusBubble browser extension.

## 🎨 Design Features

- **Cloud/Bubble Theme**: Light blue and white color palette with floating bubble decorations
- **Glassmorphism**: Frosted glass effects with backdrop blur
- **Smooth Animations**: Powered by Framer Motion
- **Responsive**: Optimized for 380×520px popup window
- **Accessible**: ARIA labels, keyboard navigation, reduced motion support

## 🛠️ Tech Stack

- **React 18** - UI framework (via CDN)
- **Tailwind CSS 3** - Utility-first styling (via CDN)
- **Framer Motion 11** - Animation library (via CDN)
- **Babel Standalone** - JSX transformation in browser

## 📁 File Structure

```
popup/
├── index.html          # Main HTML shell with CDN links
├── popup.jsx           # React app with all components
├── popup-backup.css    # Backup CSS (optional, most styling via Tailwind)
└── README.md          # This file
```

## 🚀 Quick Start

### Option 1: Using Current Setup (CDN-based)

The popup is ready to use! Just load the extension:

1. Open Chrome/Edge: `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `chrome` folder
5. Click the extension icon

### Option 2: Build Setup (Production)

For production, compile React for better performance:

```bash
# Install dependencies
npm install react react-dom framer-motion
npm install -D @babel/core @babel/preset-react webpack webpack-cli

# Build
npm run build
```

## 🎯 Components

### Main App Component
Central component managing state and layout.

### TimerDisplay
- Circular progress indicator
- Large time display
- Control buttons (Start/Pause/Resume/Stop)
- Smooth animations

### DurationPresets
- Quick duration buttons (15m, 25m, 45m, 60m)
- Highlighted selection
- Disabled during active timer

### SessionStats
- 4-stat grid layout
- Today's sessions
- Total focus time
- Current streak
- Completed sessions

### AIInsight
- AI-generated motivational message
- Loading state
- Timestamp
- Glassmorphism card design

## 🎨 Tailwind Configuration

Custom color palette:

```javascript
colors: {
  bubble: {
    50: '#f0f4ff',   // Lightest
    100: '#e0eaff',
    200: '#c7d9ff',
    300: '#a5c0ff',
    400: '#7e9eff',
    500: '#667eea',  // Primary
    600: '#5568d3',
    700: '#4553b8',
    800: '#3a4694',
    900: '#323b76',  // Darkest
  }
}
```

Custom shadows:

```javascript
boxShadow: {
  'bubble': '0 10px 40px rgba(102, 126, 234, 0.15)',
  'bubble-lg': '0 20px 60px rgba(102, 126, 234, 0.25)',
}
```

Custom animations:

```javascript
animation: {
  'float': 'float 3s ease-in-out infinite',
  'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
}
```

## 🔌 API Integration

The popup communicates with the background script using Chrome's messaging API:

```javascript
// Send message
const response = await sendMessage({ 
  type: 'START_TIMER', 
  duration: 25 
});

// Listen for updates
api.runtime.onMessage.addListener((message) => {
  if (message.type === 'TIMER_TICK') {
    updateTimerDisplay(message.timeRemaining);
  }
});
```

## 🎭 Animations

### Entry Animations
- Fade in with scale
- Staggered stat cards
- Floating bubbles in background

### Interactive Animations
- Hover effects (scale 1.05)
- Tap effects (scale 0.95)
- Progress ring transitions

### Exit Animations
- Fade out
- Slide up

## 🎨 Styling Approach

### Tailwind Classes (Primary)
Most styling is done inline with Tailwind utility classes:

```jsx
<button className="px-8 py-3 bg-white text-bubble-600 rounded-full font-semibold shadow-bubble hover:shadow-bubble-lg">
  Start
</button>
```

### Custom CSS (Minimal)
Only used for:
- Base resets
- Animation keyframes
- Browser-specific fixes
- Scrollbar styling

### Framer Motion (Animations)
All animations use Framer Motion props:

```jsx
<motion.div
  initial={{ scale: 0.9, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ duration: 0.3 }}
>
  {/* Content */}
</motion.div>
```

## 📱 Responsive Design

Optimized for standard popup size (380×520px):
- Compact layout
- Readable typography
- Touch-friendly buttons (min 44×44px)
- Scrollable content with custom scrollbar

## ♿ Accessibility

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus indicators
- Reduced motion support
- High contrast mode support

## 🔧 Configuration

### Change Timer Presets

Edit the `presets` array in `DurationPresets` component:

```javascript
const presets = [
  { label: '15m', value: 15 },
  { label: '25m', value: 25 },
  { label: '45m', value: 45 },
  { label: '60m', value: 60 },
];
```

### Customize Colors

Edit Tailwind config in `index.html`:

```javascript
tailwind.config = {
  theme: {
    extend: {
      colors: {
        bubble: {
          // Your custom colors
        }
      }
    }
  }
}
```

### Adjust Animations

Edit animation config in `index.html`:

```javascript
animation: {
  'float': 'float 3s ease-in-out infinite',
  // Add more animations
}
```

## 🐛 Troubleshooting

### React/Framer Motion not loading
- Check CDN links in `index.html`
- Ensure internet connection
- Try local builds instead

### Styles not applying
- Clear browser cache
- Check Tailwind CDN link
- Verify `popup-backup.css` is loaded (if used)

### Timer not updating
- Check background script is running
- Verify message passing works
- Check console for errors

### Babel transformation errors
- Ensure `type="text/babel"` on script tag
- Check JSX syntax
- Update Babel Standalone version

## 🚀 Performance Tips

1. **Use Production React**: Replace development CDN with production
2. **Optimize Images**: Use WebP format for icons
3. **Lazy Load**: Split components for faster initial load
4. **Memoize**: Use React.memo for static components
5. **Build Process**: Use webpack/vite for production builds

## 📦 Production Build

For optimal performance, build React app:

```bash
# Install build tools
npm install -D vite @vitejs/plugin-react

# Create vite.config.js
# Build
npm run build
```

Update manifest to use built files instead of CDN.

## 🎨 Design System

### Colors
- Primary: `#667eea` (bubble-500)
- Background: Linear gradient from bubble-500 to purple-600
- Text: White with various opacities (90%, 70%, 60%, 50%)
- Cards: White with 10% opacity + backdrop blur

### Typography
- System font stack
- Sizes: xs (12px), sm (14px), base (16px), lg (18px), xl (20px)
- Weights: normal (400), medium (500), semibold (600), bold (700)

### Spacing
- Base unit: 4px
- Common: 8px, 12px, 16px, 24px, 32px
- Padding: p-4 (16px), p-6 (24px)
- Gap: gap-2 (8px), gap-3 (12px), gap-4 (16px)

### Shadows
- bubble: Soft glow effect
- bubble-lg: Enhanced glow on hover

## 📝 Notes

- CDN approach prioritizes ease of setup over performance
- For production, consider building React app locally
- All state management is local (no Redux needed)
- Background script handles persistent state
- Popup re-renders on open to sync state

## 🤝 Contributing

To modify the popup:

1. Edit `popup.jsx` for logic changes
2. Update Tailwind classes for styling
3. Modify `index.html` for CDN versions or config
4. Test in Chrome, Firefox, Edge

## 📄 License

Part of the FocusBubble extension by Krubles Team.

---

Built with ❤️ using React, Tailwind CSS, and Framer Motion
