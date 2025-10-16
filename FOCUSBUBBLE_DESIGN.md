# FocusBubble - Minimal Distraction-Free Interface

## ✨ Overview

FocusBubble is a beautifully minimal, distraction-free focus timer with:
- **Large centered timer** - Easy to read from any distance
- **Soft gradients** - Calming purple, indigo, and pink tones
- **Smooth animations** - Powered by Framer Motion
- **Auto-hide controls** - Fade away during focus sessions
- **Breathing effects** - Gentle bubble animation when idle
- **Pulse animations** - Visual feedback during active sessions

## 🎨 Design Philosophy

### Minimalism
- **Single focus point**: Giant timer in the center
- **Clean interface**: No clutter or distractions
- **Soft colors**: Gentle gradients that don't strain eyes
- **Ample whitespace**: Nothing competing for attention

### Motion Design
- **Breathing animation**: Bubble gently scales in/out when idle
- **Pulse effect**: Glowing shadow during active sessions
- **Floating orbs**: Ambient background movement
- **Smooth transitions**: All state changes animated
- **Celebration confetti**: Burst of color on completion

### User Experience
- **Auto-hide controls**: Fade out after 3 seconds during focus
- **Mouse reveal**: Move mouse to show controls again
- **Minimal interruptions**: Subtle notifications
- **Progress visualization**: Circular progress ring

## 🎯 Features

### Visual Design
✅ 500px diameter bubble timer
✅ Gradient text display (96px font)
✅ Circular progress ring
✅ Animated background gradient
✅ Floating orb elements
✅ Glassmorphism effects (frosted glass)
✅ Soft drop shadows

### Animations (Framer Motion)
✅ Breathing bubble (4s loop)
✅ Pulse glow (2s loop when active)
✅ Floating orbs (15-18s loops)
✅ Background gradient shift (20s)
✅ Control fade in/out
✅ Button hover effects
✅ Completion confetti (20 particles)
✅ Number flip animations

### Interactions
✅ 3 preset durations (25, 50, 90 min)
✅ Start/Pause toggle
✅ Reset button with rotate animation
✅ Auto-hide controls during focus
✅ Mouse movement reveals controls
✅ Distraction detection warning
✅ Session completion celebration

### Technical
✅ Session tracking for statistics
✅ Distraction counting
✅ Auto-save to localStorage
✅ Browser visibility detection
✅ Resume after interruption

## 🚀 Usage

### Import and Use

```jsx
import FocusBubble from './components/FocusBubble';

function App() {
  return <FocusBubble />;
}
```

### In FocusApp (Multi-View)

The FocusBubble is now the default view when you open the app:
- **Focus Bubble** tab - Minimal distraction-free interface
- **Focus Timer** tab - Full-featured timer with all controls visible
- **Dashboard** tab - Analytics and insights
- **AI Insights** tab - Test AI-generated feedback
- **Dev Tools** tab - Generate sample data

## 🎨 Visual Breakdown

### Main Components

#### 1. Background Layer
```
- Animated gradient (indigo → purple → pink)
- Two floating orbs (blur-3xl)
- Smooth looping animations
- Subtle, non-distracting movement
```

#### 2. Timer Bubble
```
- 500x500px circular container
- White/60 opacity with backdrop blur
- Glassmorphism effect
- Shadow that pulses when active
```

#### 3. Progress Ring
```
- SVG circle (480px diameter)
- Light gray track
- Gradient stroke (indigo → purple → pink)
- Animated from 0 to 100%
- Smooth easing
```

#### 4. Timer Display
```
- Two 9xl (96px) numbers
- Gradient text color
- Tabular numbers for alignment
- Blinking colon separator
- Scale-in animation on change
```

#### 5. Control Area
```
- Preset pills (3 circular buttons)
- Start/Pause main button
- Reset icon button
- Fade in/out based on activity
- Staggered entrance animations
```

### Color Palette

**Primary Gradients:**
- Indigo: `#6366f1` to `#4f46e5`
- Purple: `#a855f7` to `#9333ea`
- Pink: `#ec4899` to `#db2777`

**Background Tints:**
- `indigo-50`, `purple-50`, `pink-50`
- Orb colors at 30% opacity

**Text Colors:**
- Active: Gradient (indigo → purple → pink)
- Status: `gray-500`
- Disabled: 50% opacity

**Glassmorphism:**
- `bg-white/60` with `backdrop-blur-xl`
- `bg-white/80` for notifications

## ⚙️ Customization

### Change Timer Size

```jsx
// In FocusBubble.jsx, find:
<div className="relative w-[500px] h-[500px] ...">

// Change to:
<div className="relative w-[600px] h-[600px] ...">

// Also update SVG viewBox:
<svg className="..." viewBox="0 0 600 600">
<circle cx="300" cy="300" r="290" .../>
```

### Adjust Colors

```jsx
// Background gradient
<div className="... bg-gradient-to-br from-blue-50 via-teal-50 to-green-50">

// Timer text gradient  
<div className="... bg-gradient-to-br from-blue-600 via-teal-600 to-green-600">

// Progress ring gradient
<linearGradient id="gradient">
  <stop offset="0%" stopColor="#3b82f6" />
  <stop offset="50%" stopColor="#14b8a6" />
  <stop offset="100%" stopColor="#10b981" />
</linearGradient>
```

### Change Animation Speed

```jsx
// Breathing animation
transition: {
  duration: 6, // Slower (was 4)
  repeat: Infinity,
  ease: "easeInOut"
}

// Pulse animation
transition: {
  duration: 3, // Slower (was 2)
  repeat: Infinity
}

// Background gradient
transition: {
  duration: 30, // Slower (was 20)
  repeat: Infinity
}
```

### Modify Auto-Hide Delay

```jsx
// In useEffect for controls
const timer = setTimeout(() => setShowControls(false), 5000); // 5 seconds (was 3)
```

### Add Sound Effects

```jsx
// At component start
const startSound = new Audio('/sounds/start.mp3');
const completeSound = new Audio('/sounds/complete.mp3');

// In handlers
const handleStart = () => {
  startSound.play();
  start();
};

// On completion
if (time === 0 && sessionStarted) {
  completeSound.play();
  // ... rest of completion code
}
```

## 🎭 Animation Details

### Breathing Effect
- Scale: 1 → 1.05 → 1
- Duration: 4 seconds
- Easing: easeInOut
- Applies when: Timer is paused/idle

### Pulse Effect
- Box shadow: 40px → 80px → 40px blur
- Color: Indigo with varying opacity
- Duration: 2 seconds  
- Applies when: Timer is running

### Floating Orbs
- Two orbs in corners
- Move in figure-8 pattern
- Different speeds (15s, 18s)
- Blur: 3xl (96px)
- Opacity: 30%

### Background Gradient
- Shifts through 200% space
- Linear animation
- 20 second duration
- Reverse repeat

### Control Animations
- Fade in: opacity 0 → 1, y: 20 → 0
- Fade out: opacity 1 → 0, y: 0 → 20
- Duration: 0.3 seconds
- Preset buttons: stagger by 0.1s

### Confetti (Completion)
- 20 colored particles
- Random hue values
- Radial explosion pattern
- Scale: 0 → 1 → 0
- Distance: up to 800px
- Duration: 2 seconds

## 💡 Tips for Deep Focus

### Optimal Use
1. **Choose duration** - Pick 25, 50, or 90 minutes
2. **Click Start Focus** - Timer begins, controls fade
3. **Full screen** - Press F11 for immersive experience
4. **Minimize distractions** - Close other tabs
5. **Let it fade** - Don't move mouse, let controls disappear
6. **Just focus** - The large timer is all you need to see

### When to Use
- **Deep work sessions** - Writing, coding, studying
- **Meditation** - Focus on breathing with the bubble
- **Pomodoro technique** - 25-minute focused intervals
- **Creative work** - Design, art, music production
- **Reading/learning** - Distraction-free study time

### Best Practices
- ✅ Start with 25 minutes if new to focus work
- ✅ Place timer at eye level on external monitor
- ✅ Use with ambient music or white noise
- ✅ Close notifications before starting
- ✅ Set clear goal for the session
- ✅ Take breaks between sessions

## 🔧 Technical Stack

**Dependencies:**
- React 18+
- Framer Motion 10+
- TailwindCSS 3+
- Custom hooks (useTimer, useFocusStats)

**Browser Compatibility:**
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Requires CSS backdrop-filter support

**Performance:**
- 60 FPS animations
- GPU-accelerated transforms
- Efficient re-renders with useCallback
- Optimized SVG rendering

## 📊 Accessibility

**Keyboard Navigation:**
- Tab through controls
- Enter/Space to activate buttons
- Focus visible on all interactive elements

**Screen Readers:**
- Semantic HTML structure
- ARIA labels on icon buttons
- Status announcements

**Motion Preferences:**
- Respects `prefers-reduced-motion`
- Can disable animations in settings

## 🎨 Design Inspiration

- **Apple Timer** - Clean, minimal interface
- **Forest App** - Nature-inspired focus
- **Calm App** - Meditation aesthetics
- **Glassmorphism** - Modern UI trend
- **Neumorphism** - Soft 3D effects

## 🚀 Future Enhancements

Potential additions:
- ⭐ Custom color themes
- ⭐ Different bubble shapes (square, hexagon)
- ⭐ Sound ambient options
- ⭐ Multiple timers
- ⭐ Keyboard shortcuts
- ⭐ Full screen API integration
- ⭐ Daily goals overlay
- ⭐ Zen quotes during break
- ⭐ Custom backgrounds
- ⭐ Export as screensaver

---

**Experience the most beautiful, distraction-free focus timer. Just you, the bubble, and deep work. 🫧✨**
