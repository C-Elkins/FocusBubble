# 📊 FocusBubble Dashboard

A beautiful, standalone analytics dashboard for the FocusBubble extension that visualizes your productivity data with interactive charts and insights.

## ✨ Features

### 📈 Interactive Charts
- **Daily Focus Time** - Bar chart showing focus time for the last 7 days
- **Distraction Trend** - Line chart tracking distractions over time
- **Session Types** - Pie chart showing distribution of focus, break, and long break sessions

### 📊 Statistics Cards
- **Total Sessions** - Count of all sessions with completion status
- **Total Focus Time** - Cumulative focus time across all sessions
- **Current Streak** - Days of consecutive productivity
- **Completion Rate** - Percentage of completed vs. started sessions

### 🔥 Streak Calendar
- Visual representation of your focus streak
- Last 28 days mini-calendar showing active days
- Current streak, longest streak, and total active days

### 🤖 AI Insights Panel
- Latest 5 AI-generated insights from your sessions
- Chronological display with timestamps
- Motivational messages and productivity tips

## 🎨 Design

- **Theme**: Cloud/bubble with glassmorphism effects
- **Colors**: Gradient from `#667eea` to `#764ba2`
- **Animations**: Floating bubbles, smooth transitions, chart animations
- **Responsive**: Works on desktop and mobile

## 🛠️ Tech Stack

- **React 18** - UI framework (via CDN)
- **Recharts 2.12** - Chart library for data visualization
- **Framer Motion 11** - Animation library
- **Tailwind CSS 3** - Utility-first styling
- **Babel Standalone** - In-browser JSX transformation

## 📁 Files

```
dashboard/
├── dashboard.html    # HTML shell with CDN links
├── dashboard.js      # React dashboard application
└── README.md         # This file
```

## 🚀 Usage

### Opening the Dashboard

**Option 1: From Extension Popup**
- Click the FocusBubble extension icon
- Click "Dashboard" link in footer
- Dashboard opens in new tab

**Option 2: Direct Access**
- Navigate to: `chrome-extension://[extension-id]/dashboard/dashboard.html`
- Or right-click extension icon → "Options" (if configured in manifest)

**Option 3: Create Shortcut**
Add to `manifest.json`:
```json
{
  "chrome_url_overrides": {
    "newtab": "dashboard/dashboard.html"
  }
}
```

### Data Sources

Dashboard reads from `chrome.storage.local`:
- `stats` - Overall statistics object
- `sessionHistory` - Array of completed sessions
- `aiInsights` - Array of AI-generated insights

## 📊 Data Structure

### Stats Object
```javascript
{
  totalSessions: 42,
  completedSessions: 38,
  totalFocusTime: 63000, // seconds
  currentStreak: 5,
  longestStreak: 12
}
```

### Session History
```javascript
[
  {
    startTime: 1697385600000,
    endTime: 1697387100000,
    duration: 1500, // seconds
    mode: 'focus', // 'focus' | 'break' | 'longBreak'
    distractions: 3,
    completed: true
  }
]
```

### AI Insights
```javascript
[
  {
    message: "Great focus session! You stayed on task for 25 minutes.",
    timestamp: 1697387100000
  }
]
```

## 🎯 Components

### Dashboard (Main)
Main container component that:
- Loads data from chrome.storage
- Processes chart data
- Manages loading state
- Renders all child components

### StatCard
Displays individual statistics with:
- Icon and label
- Large value display
- Optional subtext
- Optional trend indicator
- Hover animations

### FocusTimeChart
Bar chart showing:
- Last 7 days of focus time
- Daily aggregation
- Formatted tooltips
- Animated bars

### DistractionChart
Line chart displaying:
- Distraction count trends
- Smooth line animation
- Interactive data points
- Custom tooltips

### SessionModeChart
Pie chart visualizing:
- Distribution of session types
- Percentage labels
- Color-coded segments
- Interactive tooltips

### StreakCalendar
Streak visualization with:
- Current and longest streak
- Total active days
- 28-day mini calendar
- Color-coded active days

### AIInsightsPanel
Latest insights display:
- Up to 5 recent insights
- Chronological order
- Formatted timestamps
- Staggered animations

## 🎨 Customization

### Change Colors
Edit Tailwind config in `dashboard.html`:
```javascript
tailwind.config = {
  theme: {
    extend: {
      colors: {
        bubble: {
          500: '#YOUR_COLOR'
        }
      }
    }
  }
}
```

### Modify Chart Colors
Edit in `dashboard.js`:
```javascript
// Bar chart
<Bar dataKey="focusTime" fill="#667eea" />

// Line chart
<Line dataKey="distractions" stroke="#f87171" />

// Pie chart
const COLORS = {
  focus: '#667eea',
  break: '#48bb78',
  longBreak: '#ed8936'
};
```

### Change Chart Duration
Modify in `processChartData()`:
```javascript
// Show last 14 days instead of 7
for (let i = 13; i >= 0; i--) {
  // ...
}
```

### Adjust Animations
Edit keyframes in `dashboard.html`:
```css
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}
```

## 📱 Responsive Design

- **Desktop**: Full 3-column layout with large charts
- **Tablet**: 2-column layout
- **Mobile**: Single column stacked layout
- **Charts**: Automatically resize with ResponsiveContainer

## ♿ Accessibility

- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- High contrast mode support
- Screen reader friendly tooltips

## 🐛 Troubleshooting

### Charts not rendering?
- Check browser console for CDN errors
- Verify Recharts loaded: `window.Recharts`
- Clear cache and reload

### No data showing?
- Open extension popup to generate data
- Complete at least one session
- Check chrome.storage: `chrome.storage.local.get(console.log)`

### Styling issues?
- Ensure Tailwind CDN loaded
- Check network tab for failed requests
- Try clearing browser cache

### Animations not working?
- Verify Framer Motion CDN loaded
- Check `window.Motion` exists
- Disable browser motion preferences

## 🚀 Performance

### Current Setup (CDN)
- Load time: ~2-3 seconds
- Bundle size: ~500KB (from CDN)
- Pros: Zero build, easy development
- Cons: Network dependent, larger bundle

### Production Build (Optional)
Install dependencies:
```bash
npm install react react-dom recharts framer-motion
npm install -D vite @vitejs/plugin-react
```

Build for production:
```bash
npm run build
```

Benefits:
- Smaller bundle (~150KB gzipped)
- Faster load time (~500ms)
- Offline support

## 📊 Chart Types Available

### Bar Chart
- Best for: Comparing values across categories
- Current use: Daily focus time comparison

### Line Chart
- Best for: Showing trends over time
- Current use: Distraction tracking

### Pie Chart
- Best for: Showing proportions of a whole
- Current use: Session type distribution

### Area Chart (Not used, but available)
```javascript
const { AreaChart, Area } = Recharts;
<AreaChart data={data}>
  <Area type="monotone" dataKey="value" fill="#667eea" />
</AreaChart>
```

## 🎯 Future Enhancements

- [ ] Export data as CSV/JSON
- [ ] Custom date range selector
- [ ] Weekly/Monthly views
- [ ] Goal setting and tracking
- [ ] Productivity score calculation
- [ ] Focus session heatmap
- [ ] Category-based analytics
- [ ] Comparison with previous periods
- [ ] Dark/light theme toggle
- [ ] Customizable dashboard layout

## 💡 Tips

- **Reload data**: Close and reopen dashboard
- **Best practices**: Complete sessions for accurate stats
- **Insights**: AI insights improve with more data
- **Streaks**: Focus daily to maintain streaks
- **Charts**: Hover over data points for details

## 🔌 Integration with Background Script

Dashboard automatically syncs with background.js:
- Reads `stats` object
- Processes `sessionHistory` array
- Displays `aiInsights` messages
- No manual refresh needed

## 📚 Resources

- [Recharts Documentation](https://recharts.org/)
- [React Documentation](https://react.dev/)
- [Framer Motion](https://www.framer.com/motion/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Chrome Extensions](https://developer.chrome.com/docs/extensions/)

## 🎉 You're All Set!

The dashboard is ready to visualize your productivity data. Open it from your extension popup and start tracking your focus journey! 📊🚀

---

**Questions?** Check the troubleshooting section  
**Issues?** Verify data in chrome.storage  
**Customize?** Edit colors and chart configs  
