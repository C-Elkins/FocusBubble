# Quick Start Guide

## Installation

```bash
npm install recharts
```

## Usage

### Option 1: Use the Complete App (Recommended)

```jsx
// src/App.jsx
import FocusApp from './pages/FocusApp';

function App() {
  return <FocusApp />;
}

export default App;
```

This gives you:
- ✅ Focus Timer with distraction detection
- ✅ Dashboard with 7-day analytics
- ✅ Dev Tools for testing

### Option 2: Use Components Individually

```jsx
// Just the Timer
import Timer from './components/Timer';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Timer />
    </div>
  );
}
```

```jsx
// Just the Dashboard
import Dashboard from './components/Dashboard';

function App() {
  return <Dashboard />;
}
```

## Testing with Sample Data

1. Run the app: `npm start`
2. Navigate to "Dev Tools" tab
3. Click "Generate Sample Data"
4. Switch to "Dashboard" tab to see charts
5. Use "Focus Timer" to add real sessions

## How Sessions Are Saved

Sessions automatically save when:
1. Timer counts down to 0:00
2. Session includes:
   - Duration (total time)
   - Distraction count
   - Timestamp

Sessions do NOT save if you:
- Click Reset before completion
- Change preset duration mid-session
- Refresh the page while timer is running

## Key Files Created

```
✅ src/components/Timer.jsx              - Focus timer component
✅ src/components/Dashboard.jsx          - Analytics dashboard
✅ src/components/SampleDataGenerator.jsx - Testing tool
✅ src/hooks/useTimer.js                 - Timer logic with visibility detection
✅ src/hooks/useFocusStats.js            - Statistics management
✅ src/pages/FocusApp.jsx                - Complete app with navigation
```

## Features at a Glance

### Timer
- 25, 50, 90 minute presets
- Start, Pause, Reset controls
- Progress bar
- Auto-pause on tab switch
- Distraction warnings

### Dashboard
- Total focus time (7 days)
- Session count
- Average session length
- Distraction tracking
- 3 interactive charts

### Dev Tools
- Generate sample data
- Clear all sessions
- Session counter

## Tips

💡 **Complete full sessions** for accurate stats
💡 **Let timer reach 0:00** to save session
💡 **Check Dashboard weekly** to track progress
💡 **Monitor distractions** to improve focus

## Need Help?

See `DASHBOARD_README.md` for detailed documentation
See `IMPLEMENTATION_SUMMARY.md` for technical details

---

**Ready to focus? Start the timer and boost your productivity! 🚀**
