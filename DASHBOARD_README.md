# Focus Bubble Dashboard

A comprehensive React dashboard that visualizes focus sessions with productivity metrics and charts using Recharts.

## 📊 Features

### Dashboard Metrics (Last 7 Days)
- **Total Focus Time**: Sum of all completed focus sessions
- **Total Sessions**: Number of completed focus sessions
- **Average Session**: Average duration per session
- **Distractions**: Total number of tab switches/window minimizations

### Interactive Charts
1. **Daily Focus Time** (Area Chart)
   - Shows focus time in minutes per day
   - Beautiful gradient fill visualization
   - Hover to see exact values

2. **Daily Sessions** (Bar Chart)
   - Number of completed sessions each day
   - Easy-to-read vertical bars
   - Color-coded for quick scanning

3. **Distraction Trends** (Line Chart)
   - Tracks distractions over the week
   - Helps identify problem days
   - Shows focus improvement over time

## 🎯 How It Works

### Data Collection
The dashboard automatically collects data when:
1. A focus timer completes (reaches 0:00)
2. Session data includes:
   - Duration (in seconds)
   - Number of distractions (tab switches)
   - Timestamp

### Data Storage
- Uses `localStorage` to persist session data
- Data survives page refreshes
- Calculates 7-day rolling window automatically

### Integration with Timer
The Timer component automatically:
- Tracks session start time
- Monitors distraction count during session
- Saves completed sessions to localStorage
- Dashboard updates in real-time

## 🚀 Usage

### Import and Use the Dashboard

```jsx
import Dashboard from './components/Dashboard';

function App() {
  return <Dashboard />;
}
```

### Use with Focus Timer

```jsx
import FocusApp from './pages/FocusApp';

// Complete app with tabs for Timer and Dashboard
function App() {
  return <FocusApp />;
}
```

## 📦 Dependencies

```bash
npm install recharts
```

## 🎨 Customization

### Modify Chart Colors
Edit the gradient colors in `Dashboard.jsx`:

```jsx
// Area Chart
<linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
</linearGradient>

// Bar Chart
<Bar dataKey="sessions" fill="#10b981" />

// Line Chart
<Line dataKey="distractions" stroke="#f59e0b" />
```

### Change Time Window
Modify the date range in `useFocusStats.js`:

```javascript
// Change from 7 days to 14 days
const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
```

## 🧪 Testing with Sample Data

To test the dashboard, you can manually add sample sessions:

```javascript
import { useFocusStats } from './hooks/useFocusStats';

function TestComponent() {
  const { addSession } = useFocusStats();
  
  const addSampleData = () => {
    // Add a 25-minute session with 2 distractions
    addSession(25 * 60, 2);
  };
  
  return <button onClick={addSampleData}>Add Sample Session</button>;
}
```

## 📱 Responsive Design

The dashboard is fully responsive:
- **Desktop**: 4-column stats grid, side-by-side charts
- **Tablet**: 2-column stats grid, stacked charts
- **Mobile**: Single column layout

## 🎯 Key Components

### `useFocusStats` Hook
- Manages session data storage
- Calculates aggregated statistics
- Groups data by day for charts
- Provides `addSession()` and `clearSessions()` methods

### `Dashboard` Component
- Displays 4 metric cards
- Renders 3 Recharts visualizations
- Shows empty state for new users
- Auto-updates when new sessions complete

### `Timer` Integration
- Auto-saves sessions on completion
- Tracks distractions during session
- Resets tracking on manual reset
- Works seamlessly with dashboard

## 🎨 Styling

Uses TailwindCSS for:
- Gradient backgrounds
- Responsive grid layouts
- Hover effects and transitions
- Shadow and border styling
- Color-coded metric cards

## 📈 Future Enhancements

Potential additions:
- Weekly/Monthly/Yearly views
- Export data to CSV
- Goal setting and tracking
- Productivity score calculation
- Focus streak tracking
- Comparison with previous periods
