# 🚀 Dashboard Quick Start

## What You Got

✅ **dashboard.html** - HTML shell with Recharts + React + Framer Motion (CDN)  
✅ **dashboard.js** - Complete React analytics dashboard (550+ lines)  
✅ **README.md** - Full documentation  

## 📊 Features

### Interactive Charts
- 📈 **Bar Chart** - Daily focus time (last 7 days)
- 📉 **Line Chart** - Distraction trends over time
- 🥧 **Pie Chart** - Session type distribution

### Statistics
- 🎯 Total sessions with completion rate
- ⏱️ Total focus time formatted
- 🔥 Current and longest streak
- ✅ Completion percentage

### Visualizations
- 📅 28-day streak calendar
- 🤖 Latest AI insights panel
- 🎨 Animated stat cards
- ✨ Floating bubble decorations

## 🎯 Open Dashboard

### From Extension Popup
1. Click FocusBubble extension icon 🫧
2. Click "📊 Dashboard" in footer
3. Dashboard opens in new tab

### Direct URL
```
chrome-extension://[your-extension-id]/dashboard/dashboard.html
```

## 📊 Charts Breakdown

### 1. Focus Time Bar Chart
- Shows last 7 days
- Aggregates all sessions per day
- Hover for exact time
- Animated bars on load

### 2. Distraction Line Chart
- Tracks distractions over time
- Smooth animated line
- Interactive data points
- Color-coded red

### 3. Session Mode Pie Chart
- Focus vs Break vs Long Break
- Percentage labels
- Color-coded segments
- Interactive tooltips

### 4. Streak Calendar
- Current streak counter
- Longest streak record
- 28-day mini calendar
- Active days highlighted

## 🎨 Design Highlights

- **Glassmorphism**: Frosted glass effect cards
- **Gradient Background**: #667eea → #764ba2
- **Floating Bubbles**: 3 animated decorations
- **Smooth Animations**: Framer Motion powered
- **Responsive**: Desktop + tablet + mobile

## 🔌 Data Source

Dashboard reads from `chrome.storage.local`:

```javascript
{
  stats: {
    totalSessions: 42,
    completedSessions: 38,
    totalFocusTime: 63000, // seconds
    currentStreak: 5,
    longestStreak: 12
  },
  sessionHistory: [
    {
      startTime: 1697385600000,
      endTime: 1697387100000,
      duration: 1500,
      mode: 'focus',
      distractions: 3,
      completed: true
    }
  ],
  aiInsights: [
    {
      message: "Great session!",
      timestamp: 1697387100000
    }
  ]
}
```

## 🛠️ Tech Stack

```
React 18 + Recharts 2.12 + Framer Motion 11 + Tailwind CSS 3
All via CDN - Zero build required!
```

## 🎨 Customize

### Change Chart Colors
Edit `dashboard.js`:
```javascript
// Bar chart (line ~90)
<Bar dataKey="focusTime" fill="#YOUR_COLOR" />

// Line chart (line ~135)
<Line dataKey="distractions" stroke="#YOUR_COLOR" />

// Pie chart (line ~170)
const COLORS = {
  focus: '#YOUR_COLOR',
  break: '#YOUR_COLOR',
  longBreak: '#YOUR_COLOR'
};
```

### Change Time Range
Edit `processChartData()` in `dashboard.js`:
```javascript
// Show last 14 days instead of 7
for (let i = 13; i >= 0; i--) {
  // ...
}
```

### Modify Background Gradient
Edit `dashboard.html`:
```css
background: linear-gradient(135deg, #YOUR_COLOR1 0%, #YOUR_COLOR2 100%);
```

## 📱 Components

| Component | Purpose | Lines |
|-----------|---------|-------|
| Dashboard | Main container + data loading | 150 |
| StatCard | Individual stat display | 30 |
| FocusTimeChart | Bar chart for focus time | 50 |
| DistractionChart | Line chart for distractions | 50 |
| SessionModeChart | Pie chart for session types | 60 |
| StreakCalendar | Streak visualization | 80 |
| AIInsightsPanel | Latest insights display | 50 |

## 🐛 Troubleshooting

**Charts not showing?**
- Check chrome.storage has data
- Complete at least one session
- Open console: F12 → Check for errors

**Styling broken?**
- Verify Tailwind CDN loaded
- Check network tab for 404s
- Clear browser cache

**No data displaying?**
- Open popup to initialize storage
- Complete a session
- Verify: `chrome.storage.local.get(console.log)`

**Animations not working?**
- Check Framer Motion CDN loaded
- Verify `window.Motion` exists
- Disable browser motion preferences

## 📊 Data Processing

Dashboard automatically:
- ✅ Aggregates sessions by day
- ✅ Calculates total focus time
- ✅ Tracks streak progression
- ✅ Counts session types
- ✅ Formats timestamps
- ✅ Processes distraction counts

## 🚀 Performance

### Current (CDN)
- Load time: ~2-3 seconds
- Bundle: ~500KB from CDN
- Pros: Zero build, easy dev
- Cons: Network dependent

### Production Build
```bash
npm install react react-dom recharts framer-motion
npm run build
```
- Load time: ~500ms
- Bundle: ~150KB gzipped
- Pros: Faster, offline
- Cons: Build step required

## 💡 Tips

- **Complete sessions** for accurate data
- **Daily focus** to maintain streaks
- **Hover charts** for detailed tooltips
- **Check insights** for motivation
- **Export data** (coming soon)

## 🎯 Next Steps

1. ✅ Open dashboard from popup
2. ✅ Complete a few sessions
3. ✅ Watch data populate
4. ✅ Customize colors if desired
5. ✅ Build for production (optional)

## 📚 Resources

- [Recharts Docs](https://recharts.org/)
- [React Docs](https://react.dev/)
- [Framer Motion](https://www.framer.com/motion/)
- [Tailwind CSS](https://tailwindcss.com/)

## 🎉 You're Ready!

Your analytics dashboard is fully functional! Click the dashboard button in your popup to see your productivity data visualized beautifully. 📊🚀

---

**Questions?** Check README.md for details  
**Issues?** Verify data in chrome.storage  
**Customize?** Edit colors and configs  
