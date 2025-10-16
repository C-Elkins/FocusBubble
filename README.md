# 🫧 FocusBubble — Distraction-Aware Focus Timer with AI Insights

<div align="center">

**FocusBubble helps you track your deep work, visualize your focus habits, and get AI-generated feedback on how to improve your productivity.**

[![Built with React](https://img.shields.io/badge/React-18.2.0-61dafb?logo=react&logoColor=white)](https://reactjs.org/)
[![Styled with TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.1-06b6d4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Powered by Framer Motion](https://img.shields.io/badge/Framer_Motion-10+-ff0055?logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![OpenAI Integration](https://img.shields.io/badge/OpenAI-API-412991?logo=openai&logoColor=white)](https://openai.com/)
[![Anthropic Claude](https://img.shields.io/badge/Claude-3.5-8b5cf6?logo=anthropic&logoColor=white)](https://www.anthropic.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**⭐ Star if you lose focus easily — let's build better habits together! ⭐**

[Live Demo](https://focusbubble.vercel.app) · [Report Bug](https://github.com/C-Elkins/focusbubble/issues) · [Request Feature](https://github.com/C-Elkins/focusbubble/issues)

*Made with focus by the **Krubles Team** 🫧*

</div>

---

## 📸 Screenshots

<div align="center">

### 🫧 Minimal Focus Bubble Interface
*Beautiful, distraction-free timer with breathing animations and auto-hiding controls*

![Focus Bubble Interface](./screenshots/focus-bubble.png)

### ⏱️ Traditional Timer View
*Full-featured timer with all controls visible for quick access*

![Traditional Timer](./screenshots/traditional-timer.png)

### 📊 Analytics Dashboard
*7-day focus statistics with beautiful Recharts visualizations*

![Analytics Dashboard](./screenshots/dashboard.png)

### 🤖 AI Insights
*Personalized productivity tips powered by OpenAI GPT-4 & Claude 3.5*

![AI Insights](./screenshots/ai-insights.png)

### 💡 Motivational Tips
*Context-aware motivation based on your performance*

![Motivational Tips](./screenshots/motivational-tips.png)

</div>

---

## 🚀 Features

### ⏱️ **Dual Timer Interfaces**

#### 🫧 Focus Bubble (Minimal Mode)
- **500x500px centered bubble** with glassmorphism design
- **Breathing animations** (4-second cycle) for meditation-like focus
- **Pulsing glow effect** when timer is active
- **Auto-hiding controls** (fade after 3 seconds)
- **Floating ambient orbs** with figure-8 motion
- **Confetti celebration** when sessions complete
- **Zero distractions** — just you and the timer

#### ⏱️ Traditional Timer (Full-Featured)
- All controls always visible
- Quick access to 25/50/90 minute presets
- Start/Pause/Reset buttons with icons
- Linear progress bar
- Perfect for quick pomodoros

### 👁️ **Distraction Detection**

- **Page Visibility API** integration
- Automatically pauses when you switch tabs
- Tracks distraction count per session
- Warning banner with resume button
- Helps build awareness of focus breaks

### 📊 **Analytics Dashboard**

- **7-day rolling statistics**
- **4 metric cards:**
  - Total Focus Time
  - Total Sessions
  - Average Session Length
  - Total Distractions
- **3 interactive charts:**
  - Area Chart: Daily focus time trends
  - Bar Chart: Sessions per day
  - Line Chart: Distraction patterns

### 🤖 **AI-Powered Insights**

- **3 AI providers:**
  - 🆓 **Local Analysis** — Rule-based, instant, free
  - 🧠 **OpenAI GPT-4** — Advanced pattern recognition
  - 🎯 **Anthropic Claude 3.5 Sonnet** — Deep analysis
- **Performance tiers:** Excellent, Good, Needs Improvement
- **Pattern detection:** Improving, Declining, Consistent
- **Personalized suggestions** based on your data
- **Regenerate anytime** for fresh perspectives

### 💡 **Motivational Tips**

- **50+ unique tips** across 8 categories
- **Smart algorithm** adapts to your performance
- **Context-aware messaging:**
  - Celebrate achievements
  - Encourage improvement
  - Provide actionable advice
- **Inspirational quotes** for variety

### 💾 **Data Persistence**

- **localStorage** — All data stays on your device
- **100% private** — No server uploads
- **Automatic saving** — Sessions saved on completion
- **Survives refreshes** — Data persists across sessions

### 🎨 **Beautiful Design**

- **Soft gradients** (indigo → purple → pink)
- **Smooth animations** with Framer Motion
- **Glassmorphism effects** for modern UI
- **Responsive layout** — Works on all screen sizes
- **Dark mode ready** — Easy to customize

---

## 🧩 Tech Stack

### Frontend Framework
- **React 18.2.0** — Modern hooks and functional components
- **React Router** — (Optional) Multi-page navigation

### Styling & Animation
- **TailwindCSS 3.4.1** — Utility-first CSS framework
- **Framer Motion 10+** — Production-ready animation library
- **Custom CSS** — Glassmorphism and gradient effects

### Data Visualization
- **Recharts 2.x** — Beautiful, composable charts
- **Custom SVG** — Circular progress rings

### State Management
- **Custom Hooks:**
  - `useTimer` — Core timer logic with distraction detection
  - `useFocusStats` — Session tracking and statistics
  - `useLocalStorage` — Data persistence wrapper

### AI Integration
- **OpenAI API** — GPT-4 for advanced insights (optional)
- **Anthropic API** — Claude 3.5 Sonnet (optional)
- **Local Analysis** — Rule-based fallback (free)

### Browser APIs
- **Page Visibility API** — Tab/window focus detection
- **localStorage API** — Client-side data persistence
- **Web Animations API** — Enhanced animation performance

### Development Tools
- **Create React App** — Zero-config setup
- **PostCSS** — CSS processing
- **ESLint** — Code quality
- **npm** — Package management

---

## 🧠 How AI Works

### 1. Local Analysis (Free, Instant)

The **rule-based local analyzer** evaluates your focus data using predefined criteria:

```javascript
// Example: Performance tier calculation
if (completionRate > 80 && avgDistractions < 2) {
  tier = "Excellent"; // 🌟
} else if (completionRate > 60 && avgDistractions < 4) {
  tier = "Good"; // 👍
} else {
  tier = "Needs Improvement"; // 💪
}
```

**Pattern Detection:**
- Compares recent vs. previous sessions
- Identifies improving/declining trends
- Provides specific, actionable feedback

**No API Key Required!**

---

### 2. OpenAI GPT-4 Integration

When configured, FocusBubble sends your session statistics to OpenAI's GPT-4 model:

**Request Format:**
```json
{
  "model": "gpt-4",
  "messages": [
    {
      "role": "system",
      "content": "You are a productivity coach..."
    },
    {
      "role": "user",
      "content": "Sessions: 12, Total time: 3.2h, Avg distractions: 2.5..."
    }
  ],
  "max_tokens": 150,
  "temperature": 0.7
}
```

**Response Example:**
> "You're making solid progress with 12 sessions completed! Your distraction count of 2.5 per session is good, but there's room for improvement. Try using website blockers during your focus time and schedule specific times to check messages. Your consistency is building a strong habit—keep it up!"

---

### 3. Anthropic Claude 3.5 Sonnet

Claude provides **deeper analysis** with nuanced understanding:

**Request Format:**
```json
{
  "model": "claude-3-5-sonnet-20241022",
  "messages": [
    {
      "role": "user",
      "content": "Analyze focus data: [statistics]..."
    }
  ],
  "max_tokens": 200
}
```

**Response Example:**
> "Your 12 sessions over 3.2 hours show commendable consistency. The 2.5 average distractions suggest you're building focus stamina, though there's potential to reduce interruptions further. Consider the 'two-minute rule': if a distraction takes less than 2 minutes, handle it immediately; otherwise, note it for later. This reduces mental load while maintaining flow."

---

### Privacy & Security

✅ **Your data never leaves your device** unless you explicitly enable AI features  
✅ **API keys stored locally** in browser (not on servers)  
✅ **You control** when to send data to AI providers  
✅ **No tracking** — We don't collect analytics  
✅ **Open source** — Review the code yourself  

---

## 📦 Setup & Run

### Prerequisites

- **Node.js** 16+ ([Download](https://nodejs.org/))
- **npm** or **yarn**
- **Git** ([Download](https://git-scm.com/))

### Quick Start (5 minutes)

```bash
# 1. Clone the repository
git clone https://github.com/C-Elkins/focusbubble.git
cd focusbubble

# 2. Install dependencies
npm install

# 3. Start the development server
npm start

# 4. Open in browser
# App will automatically open at http://localhost:3000
```

### Optional: Enable AI Features

#### OpenAI Setup

1. Get an API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Open FocusBubble → Dashboard → AI Insights
3. Click the settings icon
4. Select "OpenAI" provider
5. Paste your API key
6. Generate insights!

#### Anthropic Claude Setup

1. Get an API key from [Anthropic Console](https://console.anthropic.com/)
2. Open FocusBubble → Dashboard → AI Insights
3. Click the settings icon
4. Select "Claude" provider
5. Paste your API key
6. Generate insights!

**Note:** Local analysis works without any API keys!

---

## 🎯 Usage Guide

### Step 1: Start a Focus Session

**Option A: Minimal Bubble (Recommended)**
1. Click **"Focus Bubble"** tab
2. Select duration (25, 50, or 90 minutes)
3. Click **Start**
4. Stay still — controls auto-hide after 3 seconds
5. **Focus deeply** 🧘

**Option B: Traditional Timer**
1. Click **"Focus Timer"** tab
2. Select duration
3. Click **Start**
4. All controls remain visible

### Step 2: Complete Sessions

- Timer runs in background
- Switching tabs = distraction detected ⚠️
- Resume anytime with the banner button
- Completion = confetti celebration! 🎉

### Step 3: View Analytics

1. Click **"Dashboard"** tab
2. See your statistics:
   - 📊 7-day trends
   - ⏱️ Total focus time
   - 🎯 Session count
   - 👁️ Distractions tracked

### Step 4: Get AI Insights

1. In Dashboard, scroll to **AI Insights Card**
2. Choose provider (Local, OpenAI, or Claude)
3. Click **"Generate Insight"**
4. Read personalized feedback
5. Regenerate anytime for fresh perspectives

### Step 5: Stay Motivated

- **Motivational tips** appear automatically in Dashboard
- Tips adapt to your performance
- Click refresh icon for variety
- Celebrate wins, learn from setbacks

---

## 🗂️ Project Structure

```
focusbubble/
├── public/
│   ├── index.html              # Main HTML
│   ├── favicon.ico             # App icon
│   └── logo.svg                # FocusBubble logo
│
├── src/
│   ├── components/
│   │   ├── FocusBubble.jsx     # ⭐ Minimal timer interface
│   │   ├── Timer.jsx           # Traditional timer
│   │   ├── Dashboard.jsx       # Analytics dashboard
│   │   ├── AIInsightsCard.jsx  # AI insights widget
│   │   ├── MotivationalTip.jsx # Motivational tips display
│   │   └── ...
│   │
│   ├── hooks/
│   │   ├── useTimer.js         # Timer logic + visibility API
│   │   ├── useFocusStats.js    # Statistics management
│   │   └── useLocalStorage.js  # Data persistence
│   │
│   ├── utils/
│   │   ├── aiInsights.js       # AI integration (285 lines)
│   │   ├── motivationalTips.js # Tip generation (285 lines)
│   │   └── formatTime.js       # Time formatting
│   │
│   ├── pages/
│   │   └── FocusApp.jsx        # Main app with navigation
│   │
│   ├── App.jsx                 # Root component
│   ├── index.js                # React entry point
│   └── index.css               # Global styles + Tailwind
│
├── documentation/
│   ├── FOCUSBUBBLE_DESIGN.md         # Design philosophy
│   ├── INTERFACE_COMPARISON.md       # Timer comparison
│   ├── AI_INSIGHTS_GUIDE.md          # AI setup (450+ lines)
│   ├── MOTIVATIONAL_TIPS_GUIDE.md    # Tips system
│   ├── LOCALSTORAGE_PERSISTENCE.md   # Data persistence
│   └── PROJECT_COMPLETE.md           # Project summary
│
├── package.json                # Dependencies
├── tailwind.config.js          # Tailwind configuration
├── postcss.config.js           # PostCSS setup
└── README.md                   # You are here!
```

---

## 🎨 Customization

### Change Colors

Edit `src/components/FocusBubble.jsx`:

```jsx
// Current gradient: indigo → purple → pink
className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"

// Change to: blue → teal → green
className="bg-gradient-to-br from-blue-50 via-teal-50 to-green-50"
```

### Adjust Timer Presets

Edit `src/components/Timer.jsx`:

```javascript
const presetDurations = [
  { label: '15 min', minutes: 15 },  // Short sprints
  { label: '25 min', minutes: 25 },  // Classic pomodoro
  { label: '45 min', minutes: 45 },  // Deep work
  { label: '90 min', minutes: 90 },  // Flow state
];
```

### Add New Motivational Tips

Edit `src/utils/motivationalTips.js`:

```javascript
if (totalHours >= 20) {
  tips.push({
    category: 'hours',
    message: "🚀 20+ hours! You're a productivity machine!",
    weight: 10
  });
}
```

### Modify Animation Speed

Edit `src/components/FocusBubble.jsx`:

```javascript
// Breathing animation (current: 4 seconds)
breathe: {
  scale: [1, 1.05, 1],
  transition: {
    duration: 4,  // Change to 6 for slower
    repeat: Infinity,
    ease: "easeInOut"
  }
}
```

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy
vercel

# 3. Follow prompts
# Your app will be live at: https://focusbubble.vercel.app
```

### Deploy to Netlify

```bash
# 1. Build the app
npm run build

# 2. Deploy the 'build' folder
# Drag & drop to Netlify or use CLI
netlify deploy --prod --dir=build
```

### Deploy to GitHub Pages

```bash
# 1. Install gh-pages
npm install --save-dev gh-pages

# 2. Add to package.json
"homepage": "https://C-Elkins.github.io/focusbubble",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}

# 3. Deploy
npm run deploy
```

---

## 🤝 Contributing

We love contributions! Whether it's:

- 🐛 **Bug fixes**
- ✨ **New features**
- 📚 **Documentation improvements**
- 🎨 **Design enhancements**
- 🌍 **Translations**

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Commit with descriptive messages**
   ```bash
   git commit -m "Add: Amazing new feature"
   ```
5. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Contribution Ideas

- [ ] Add sound effects (timer complete, distraction alert)
- [ ] Implement keyboard shortcuts (Space = pause/play)
- [ ] Create dark mode toggle
- [ ] Add export to CSV feature
- [ ] Build mobile app (React Native)
- [ ] Integrate with Notion/Todoist
- [ ] Add team/social features
- [ ] Create browser extension
- [ ] Support for custom backgrounds
- [ ] Pomodoro break reminders

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

You're free to:
- ✅ Use commercially
- ✅ Modify
- ✅ Distribute
- ✅ Private use

Just include the original license!

---

## 🙏 Acknowledgments

### Inspiration
- **Cal Newport's** "Deep Work"
- **Pomodoro Technique** by Francesco Cirillo
- **Be Focused** app design principles
- **Flow State** research

### Libraries & Tools
- [React](https://reactjs.org/) — UI library
- [TailwindCSS](https://tailwindcss.com/) — Styling
- [Framer Motion](https://www.framer.com/motion/) — Animations
- [Recharts](https://recharts.org/) — Data visualization
- [OpenAI](https://openai.com/) — AI insights
- [Anthropic](https://www.anthropic.com/) — Claude AI

### Icons & Graphics
- Emoji icons from Unicode Consortium
- SVG icons custom-designed

---

## 📞 Contact & Support

### Found a Bug? 🐛
[Open an issue](https://github.com/C-Elkins/focusbubble/issues/new?template=bug_report.md)

### Want a Feature? ✨
[Request a feature](https://github.com/C-Elkins/focusbubble/issues/new?template=feature_request.md)

### Have Questions? 💬
- **GitHub:** [@C-Elkins](https://github.com/C-Elkins)
- **Team:** Krubles Team
- **Email:** Contact info coming soon
- **Social:** Links will be updated

---

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/C-Elkins/focusbubble?style=social)
![GitHub forks](https://img.shields.io/github/forks/C-Elkins/focusbubble?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/C-Elkins/focusbubble?style=social)
![GitHub issues](https://img.shields.io/github/issues/C-Elkins/focusbubble)
![GitHub pull requests](https://img.shields.io/github/issues-pr/C-Elkins/focusbubble)
![GitHub last commit](https://img.shields.io/github/last-commit/C-Elkins/focusbubble)

---

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=C-Elkins/focusbubble&type=Date)](https://star-history.com/#C-Elkins/focusbubble&Date)

---

<div align="center">

## 💪 Built with Focus, Designed for Focus

**If FocusBubble helps you stay productive, give it a ⭐ and share it with friends!**

Made with ❤️ by the **Krubles Team** · [C-Elkins](https://github.com/C-Elkins)

**Happy Focusing! 🫧⏱️🧠**

</div>

---

## 📝 Changelog

### Version 1.0.0 (October 2025)

**Initial Release**

✨ **Features:**
- Dual timer interfaces (Bubble + Traditional)
- Page Visibility API distraction detection
- 7-day analytics dashboard
- AI insights (Local, OpenAI, Claude)
- Motivational tips system
- localStorage persistence
- Beautiful animations with Framer Motion

📚 **Documentation:**
- Complete setup guide
- AI integration tutorial
- Customization examples
- Contribution guidelines

🎨 **Design:**
- Glassmorphism UI
- Soft gradients
- Responsive layout
- Smooth animations

---

### Coming Soon (v1.1.0)

- [ ] Sound effects
- [ ] Keyboard shortcuts
- [ ] Dark mode
- [ ] Export data
- [ ] Custom themes
- [ ] Break reminders

---

<div align="center">

**[⬆ Back to Top](#-focusbubble--distraction-aware-focus-timer-with-ai-insights)**

</div>
