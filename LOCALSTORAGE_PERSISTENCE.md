# 💾 localStorage Persistence Guide

## Overview

FocusBubble automatically saves all your focus sessions to your browser's **localStorage**. This means your data persists across browser sessions without requiring a backend server or database.

---

## 🔑 Key Features

### ✅ What Gets Saved

Each completed focus session stores:

1. **Duration** - Total time focused (in seconds)
2. **Date** - ISO timestamp of when the session was completed
3. **Distractions** - Number of times you switched tabs/minimized the window
4. **Unique ID** - Auto-generated timestamp-based identifier

### 📦 Data Structure

```javascript
{
  id: 1728936420000,
  date: "2025-10-14T10:27:00.000Z",
  duration: 1500,  // 25 minutes in seconds
  distractions: 2
}
```

---

## 🎯 How It Works

### 1. **Session Tracking**

Both timer interfaces (FocusBubble & Traditional Timer) automatically track sessions:

**Timer.jsx:**
```javascript
const { addSession } = useFocusStats();
const sessionStartTimeRef = useRef(null);
const sessionDistractionsRef = useRef(0);

// Save session when timer completes
useEffect(() => {
  if (time === 0 && sessionStartTimeRef.current !== null) {
    const sessionDuration = duration;
    const sessionDistractions = sessionDistractionsRef.current;
    
    // Save the session
    addSession(sessionDuration, sessionDistractions);
  }
}, [time, duration, addSession]);
```

**FocusBubble.jsx:**
```javascript
useEffect(() => {
  if (time === 0 && sessionStarted) {
    // Session completed!
    addSession(duration, distractionCount);
    setSessionStarted(false);
    setCompletionCelebration(true);
  }
}, [time, isRunning, sessionStarted, duration, distractionCount, addSession]);
```

### 2. **Custom Hooks**

#### **useLocalStorage.js**

Basic localStorage wrapper with JSON parsing:

```javascript
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
}
```

#### **useFocusStats.js**

Manages sessions and calculates statistics:

```javascript
export function useFocusStats() {
  const [sessions, setSessions] = useLocalStorage('focusSessions', []);
  const [stats, setStats] = useState({
    totalFocusTime: 0,
    totalSessions: 0,
    totalDistractions: 0,
    averageSessionLength: 0,
    last7Days: []
  });

  // Calculate statistics from sessions
  useEffect(() => {
    // ... calculates stats from last 7 days
  }, [sessions]);

  const addSession = useCallback((duration, distractions) => {
    const newSession = {
      id: Date.now(),
      date: new Date().toISOString(),
      duration,
      distractions
    };
    setSessions(prev => [...prev, newSession]);
  }, [setSessions]);

  return { stats, sessions, addSession, clearSessions };
}
```

### 3. **Dashboard Display**

The Dashboard component automatically loads and displays sessions:

```javascript
export default function Dashboard() {
  const { stats } = useFocusStats(); // Automatically loads from localStorage
  
  return (
    // Display stats.totalFocusTime, stats.totalSessions, etc.
    // Render charts using stats.last7Days data
  );
}
```

---

## 📊 Data Flow Diagram

```
┌─────────────────────┐
│   User Completes    │
│   Focus Session     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Timer Component    │
│  calls addSession() │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  useFocusStats()    │
│  creates session    │
│  object with data   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ useLocalStorage()   │
│ saves to browser    │
│ localStorage        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Browser Storage    │
│  key: focusSessions │
│  value: JSON array  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Dashboard Reads    │
│  from localStorage  │
│  on page load       │
└─────────────────────┘
```

---

## 🔍 Viewing Stored Data

### Browser DevTools

1. Open **Chrome/Edge DevTools** (F12)
2. Go to **Application** tab
3. Expand **Local Storage**
4. Click on your domain (e.g., `http://localhost:3000`)
5. Find key: `focusSessions`
6. View the JSON array of all sessions

### Console Command

```javascript
// View all sessions
JSON.parse(localStorage.getItem('focusSessions'))

// Count sessions
JSON.parse(localStorage.getItem('focusSessions')).length

// View latest session
const sessions = JSON.parse(localStorage.getItem('focusSessions'));
sessions[sessions.length - 1];
```

---

## 🧪 Testing localStorage Persistence

### Test 1: Complete a Session

1. Start the app: `npm start`
2. Navigate to **Focus Bubble** or **Focus Timer**
3. Select **25 minutes** (or use shorter duration for testing)
4. Click **Start**
5. Wait for timer to complete (or manually adjust for testing)
6. Go to **Dashboard** tab
7. ✅ Verify session appears in statistics

### Test 2: Refresh Browser

1. Complete a session as above
2. **Refresh the page** (Cmd+R / Ctrl+R)
3. Navigate to **Dashboard**
4. ✅ Verify data persists after refresh

### Test 3: Close and Reopen

1. Complete a session
2. **Close the browser tab/window**
3. Reopen `http://localhost:3000`
4. Navigate to **Dashboard**
5. ✅ Verify data persists after closing

### Test 4: Multiple Sessions

1. Complete 3-5 different sessions
2. Go to **Dashboard**
3. ✅ Verify all sessions are tracked
4. ✅ Check charts update with multiple data points

---

## 🎨 Dashboard Features

The Dashboard automatically displays:

### 📈 Metric Cards

1. **Total Focus Time** - Sum of all session durations (last 7 days)
2. **Total Sessions** - Count of completed sessions
3. **Average Session** - Mean duration per session
4. **Total Distractions** - Sum of all distraction counts

### 📊 Visualizations

1. **Area Chart** - Daily focus time trend
2. **Bar Chart** - Sessions completed per day
3. **Line Chart** - Distraction patterns over time

All data is automatically filtered to show **last 7 days only**.

---

## 🔧 Advanced Usage

### Programmatically Add Sessions

```javascript
import { useFocusStats } from './hooks/useFocusStats';

function MyComponent() {
  const { addSession } = useFocusStats();
  
  const addTestSession = () => {
    addSession(1500, 2); // 25 min session with 2 distractions
  };
  
  return <button onClick={addTestSession}>Add Session</button>;
}
```

### Clear All Sessions

```javascript
const { clearSessions } = useFocusStats();

// Remove all stored sessions
clearSessions();
```

### Filter Sessions by Date Range

```javascript
const { sessions } = useFocusStats();

// Get sessions from specific date
const todaySessions = sessions.filter(session => {
  const sessionDate = new Date(session.date).toDateString();
  const today = new Date().toDateString();
  return sessionDate === today;
});

// Get sessions longer than 30 minutes
const longSessions = sessions.filter(s => s.duration >= 1800);

// Get sessions with no distractions
const perfectSessions = sessions.filter(s => s.distractions === 0);
```

---

## 🛠️ Developer Tools

Use the built-in **Dev Tools** tab to test with sample data:

1. Navigate to **Dev Tools** tab (if available)
2. Click **Generate Sample Data**
3. View automatically generated sessions in Dashboard
4. Click **Clear All Data** to reset

---

## 🚨 Important Notes

### ⚠️ Data Persistence

- **localStorage is per-domain** - Data only available on the same domain/port
- **Data is per-browser** - Different browsers have separate storage
- **Incognito mode** - Data clears when incognito session ends
- **Storage limit** - ~5-10MB per domain (thousands of sessions)

### 🔒 Privacy

- All data stored **locally in your browser**
- **No server uploads** - Your data never leaves your device
- **No tracking** - No analytics or external services
- Clear data anytime via **Dev Tools** or browser settings

### 🗑️ Clearing Data

**Option 1: Via App**
```javascript
const { clearSessions } = useFocusStats();
clearSessions();
```

**Option 2: Via Console**
```javascript
localStorage.removeItem('focusSessions');
```

**Option 3: Browser Settings**
- Chrome: Settings → Privacy → Clear browsing data → Cookies and site data
- Firefox: Settings → Privacy → Clear Data → Cookies and Site Data

---

## 📝 Example Session Data

```javascript
[
  {
    "id": 1728936420000,
    "date": "2025-10-14T10:27:00.000Z",
    "duration": 1500,
    "distractions": 0
  },
  {
    "id": 1728937320000,
    "date": "2025-10-14T10:42:00.000Z",
    "duration": 3000,
    "distractions": 1
  },
  {
    "id": 1728938220000,
    "date": "2025-10-14T10:57:00.000Z",
    "duration": 5400,
    "distractions": 3
  }
]
```

---

## 🎯 Summary

✅ **Automatic** - Sessions save without user action  
✅ **Persistent** - Data survives browser restarts  
✅ **Private** - All data stays on your device  
✅ **Fast** - Instant read/write operations  
✅ **Simple** - No configuration required  
✅ **Reliable** - Uses browser's native storage API  

**Start focusing, and your progress will be tracked automatically! 🚀**

---

## 🔗 Related Files

- `/src/hooks/useLocalStorage.js` - localStorage wrapper
- `/src/hooks/useFocusStats.js` - Session management & stats
- `/src/components/Timer.jsx` - Traditional timer with persistence
- `/src/components/FocusBubble.jsx` - Minimal timer with persistence
- `/src/components/Dashboard.jsx` - Data visualization

---

**Last Updated:** October 14, 2025  
**Version:** 1.0.0
