# FocusBubble AI Coding Prompts Collection

**Complete set of AI prompts for building FocusBubble browser extension**
Use with Claude, GPT-4, GitHub Copilot, or any AI coding assistant

---

## 📋 Table of Contents

1. [Project Setup](#project-setup)
2. [Timer Components](#timer-components)
3. [Distraction Detection](#distraction-detection)
4. [Floating Bubble Overlay](#floating-bubble-overlay)
5. [Analytics Dashboard](#analytics-dashboard)
6. [AI Insights](#ai-insights)
7. [Cross-Browser Compatibility](#cross-browser-compatibility)
8. [Background Service Worker](#background-service-worker)
9. [Storage & Persistence](#storage-persistence)
10. [UI/UX Components](#uiux-components)
11. [Testing & Debugging](#testing-debugging)
12. [Logo & Branding](#logo-branding)
13. [Marketing & Documentation](#marketing-documentation)
14. [Optimization & Performance](#optimization-performance)
15. [Gamification Features](#gamification-features)

---

## 🏗️ Project Setup

### Prompt 1.1: Extension Boilerplate

```
Generate a complete browser extension boilerplate for "FocusBubble" with these requirements:

- Manifest V3 configuration
- React 18 + Tailwind CSS for popup UI
- Background service worker for timer persistence
- Content script for floating overlay
- Cross-browser compatibility (Chrome, Firefox, Edge)
- Modular folder structure:
  - background/ (service worker)
  - popup/ (React UI)
  - content/ (overlay scripts)
  - shared/ (utilities, API wrappers)
  - components/ (reusable React components)
  - hooks/ (custom React hooks)
  - utils/ (helper functions)

Include detailed comments explaining each file's purpose and a README with setup instructions.
```

### Prompt 1.2: Build Configuration

```
Create a webpack/vite build configuration for a React browser extension that:

- Builds popup.html, popup.js (React entry point)
- Compiles service-worker.js with proper ES6 imports
- Bundles content scripts separately
- Processes Tailwind CSS
- Generates production-ready manifest.json
- Creates separate builds for Chrome, Firefox, and Edge
- Includes development mode with hot reload for popup
- Outputs to /dist folder with proper structure

Add npm scripts for:
- npm run dev (development)
- npm run build (production)
- npm run build:chrome
- npm run build:firefox
- npm run watch
```

---

## ⏱️ Timer Components

### Prompt 2.1: Pomodoro Timer Component

```
Create a React component for a Pomodoro-style focus timer with:

Features:
- Display: MM:SS countdown with large, readable font
- Buttons: Start, Pause, Resume, Reset
- Preset durations: 25 min, 50 min, 90 min (custom input optional)
- Visual progress ring or circular progress bar
- Smooth animations using Framer Motion
- Gradient bubble-themed styling (soft blues/purples)
- Communicates with background script via chrome.runtime.sendMessage

State management:
- Syncs with background service worker for persistence
- Listens for state updates via chrome.runtime.onMessage
- Displays current time remaining even when popup closes/reopens

Styling:
- Tailwind CSS classes
- Responsive (popup is 400x600px)
- Bubble aesthetic: rounded corners, soft shadows, gradients
- Accessibility: ARIA labels, keyboard navigation

Include TypeScript types and prop documentation.
```

### Prompt 2.2: Timer State Hook

```
Create a custom React hook `useTimerState` that:

1. Connects to background service worker timer state
2. Provides real-time updates via chrome.runtime.onMessage
3. Exposes methods:
   - startTimer(duration)
   - pauseTimer()
   - resumeTimer()
   - resetTimer()
   - getTimerState()

4. Returns state object:
   {
     timeRemaining: number,
     isRunning: boolean,
     duration: number,
     distractionCount: number,
     currentSession: { start: Date, end: Date | null }
   }

5. Handles:
   - Initial state fetch on mount
   - Cleanup on unmount
   - Error handling for failed message passing
   - Automatic reconnection if background worker restarts

Include full JSDoc comments and usage examples.
```

### Prompt 2.3: Timer Controls UI

```
Design a beautiful, minimal timer control panel component with:

Layout:
- Circular timer display in center (500px diameter bubble)
- Time shown in large font (72px)
- Subtle breathing animation when paused
- Pulsing glow when running
- Floating preset duration pills below timer
- Start/Pause/Reset buttons with icons

Interactions:
- Hover effects on all buttons (scale 1.05, shadow increase)
- Click animations (scale 0.95)
- Disabled states for inappropriate actions
- Loading spinner during transitions
- Success confetti animation on completion

Accessibility:
- Keyboard shortcuts (Space = start/pause, R = reset)
- Screen reader announcements
- High contrast mode support
- Focus visible indicators

Use Tailwind + Framer Motion. Provide component code + Storybook story.
```

---

## 🚨 Distraction Detection

### Prompt 3.1: Page Visibility Detection

```
Implement distraction detection using the Page Visibility API:

Features:
- Detect when user switches tabs
- Detect when window is minimized
- Detect when browser loses focus
- Auto-pause timer on distraction
- Increment distraction counter
- Show "Focus Interrupted" warning bubble
- Provide "Resume" button to continue

Implementation:
- Add event listener for 'visibilitychange'
- Track document.hidden state
- Send message to background worker to pause
- Display non-intrusive warning in popup/overlay
- Log distraction event with timestamp
- Calculate distraction duration if resumed

Cross-browser compatibility:
- Handle vendor prefixes (webkit, moz)
- Fallback for older browsers
- Test on Chrome, Firefox, Edge, Safari

Include unit tests using Jest.
```

### Prompt 3.2: Tab Switch Tracker

```
Create a background script module that tracks tab switches:

Track:
- When user switches away from "productive" tab
- Time spent on each tab
- Pattern detection (frequent switchers vs focused users)
- Categorize tabs by domain (social media, work, etc.)

Data structure:
{
  sessionId: string,
  switches: [
    {
      timestamp: Date,
      fromTab: { url, title },
      toTab: { url, title },
      duration: number
    }
  ],
  totalSwitches: number,
  averageTimePerTab: number
}

Features:
- Whitelist domains that don't count as distractions
- Configurable sensitivity (how often = distraction)
- Privacy mode: only track count, not URLs
- Export data for analytics dashboard

Use chrome.tabs API. Include privacy considerations in comments.
```

### Prompt 3.3: Distraction Warning UI

```
Design a distraction warning component that appears when focus is broken:

Visual:
- Amber/orange color scheme
- Warning icon (⚠️) with shake animation
- Message: "Focus interrupted - You switched tabs"
- Distraction count badge
- "Resume Focus" button (prominent, green)
- "Take a Break" button (secondary, gray)

Behavior:
- Fade in from top with bounce animation
- Auto-dismiss after 10 seconds if no action
- Play subtle notification sound (optional)
- Don't block content (position: fixed, non-modal)
- Click outside to dismiss
- Remember if user dismissed multiple times (reduce frequency)

Responsive:
- Works in popup (400px wide)
- Works as content script overlay (any screen size)
- Mobile-friendly touch targets

Accessibility:
- Announce to screen readers
- Keyboard dismissal (Esc key)
- Doesn't trap focus

Code in React + Tailwind + Framer Motion.
```

---

## 🎈 Floating Bubble Overlay

### Prompt 4.1: Draggable Floating Timer

```
Create a content script that injects a draggable floating timer bubble:

Visual Design:
- Size: 120px diameter circle
- Position: Top-right corner (20px from edges)
- Background: Gradient (indigo to purple)
- Text: White, 24px, shows MM:SS
- Shadow: Soft, elevated (0 8px 32px rgba)
- Semi-transparent when not hovered (opacity: 0.8)
- Fully opaque on hover

Functionality:
- Draggable to any screen position
- Remembers position across page reloads
- Click to expand/collapse (show controls)
- Double-click to open full popup
- Syncs with background timer state in real-time
- Shows pause icon when paused
- Minimal performance impact

Interactions:
- Drag: mouse cursor becomes 'move'
- Dragging: scale 0.95
- Hover: scale 1.05, opacity 1
- Click: ripple animation
- Stays within viewport bounds (doesn't go off-screen)

Implementation:
- Pure JavaScript or React (render with ReactDOM)
- Doesn't interfere with page content
- High z-index (999999)
- Works on all websites (even complex SPAs)
- Avoids CSP violations

Include positioning logic that snaps to corners if near edge.
```

### Prompt 4.2: Minimal Overlay Mode

```
Implement a "minimal mode" for the floating bubble:

Three states:
1. Full (120px): Shows time + icon
2. Compact (60px): Shows only time, no icon
3. Hidden (0px): Invisible, edge indicator only

Transitions:
- Auto-minimize after 5 seconds of no hover
- Expand on hover
- Toggle via click
- Remember user preference in storage

Visual:
- Smooth size transitions (300ms ease-in-out)
- Fade in/out text
- Maintain draggability in all states
- Pulse animation every 5 seconds when hidden

Settings:
- User can choose default state
- Auto-hide option (hide completely when not focused)
- Only show on work-related sites (domain whitelist)

Code in TypeScript with clear type definitions.
```

### Prompt 4.3: Bubble Click Actions

```
Create an action menu that appears when floating bubble is clicked:

Menu Layout:
- Appears directly below/above bubble (smart positioning)
- 200px wide, rounded corners
- Blur background (glassmorphism)
- 4-6 quick actions

Actions:
1. ▶️ Start/Pause (toggle, green/orange)
2. 🔄 Reset (red, confirm dialog)
3. ⚙️ Settings (opens full popup)
4. 📊 Stats (opens dashboard tab)
5. 🎯 Change Duration (quick picker: 25/50/90)
6. 👁️ Hide Bubble (minimize)

Behavior:
- Click outside to close
- Esc key to close
- Smooth fade in/out (200ms)
- Icons + text labels
- Hover highlights (subtle background change)
- Click provides haptic feedback (scale animation)

Responsive:
- Adapts if near screen edge
- Touch-friendly on tablets
- Keyboard accessible (arrow keys navigate)

Implement with Tailwind and Framer Motion.
```

---

## 📊 Analytics Dashboard

### Prompt 5.1: Stats Dashboard Component

```
Create a comprehensive analytics dashboard component:

Metrics to Display:
1. Total focus time (today, this week, all time)
2. Sessions completed
3. Average session duration
4. Distraction count & frequency
5. Best time of day for focus
6. Focus streak (consecutive days)
7. Daily/weekly trends

Visualizations (using Recharts):
1. Area chart: Daily focus time (last 7 days)
2. Bar chart: Sessions per day
3. Line chart: Distraction trends
4. Pie chart: Time by task category
5. Heatmap: Focus time by hour of day

Layout:
- Grid: 3 columns on desktop, 1 on mobile
- Stat cards at top (4 cards: time, sessions, streak, avg)
- Charts in rows below
- Time range selector (day/week/month/year)
- Export data button (CSV/JSON)

Styling:
- Card-based design with shadows
- Gradient backgrounds for stat cards
- Animated number counters on load
- Smooth chart animations
- Loading skeletons while fetching data

Data:
- Fetch from chrome.storage.local
- Calculate derived metrics client-side
- Cache results for performance
- Real-time updates when new session completes

Include responsive breakpoints and dark mode support.
```

### Prompt 5.2: Session History List

```
Build a session history component showing past focus sessions:

Display Format:
- Chronological list (newest first)
- Each item shows:
  - Date & time started
  - Duration (MM:SS or HH:MM)
  - Distractions count
  - Completion status (✓ completed, ⏸ paused, ✗ abandoned)
  - Notes (optional user annotation)
  - Task/project tag (optional categorization)

Features:
- Infinite scroll or pagination (50 per page)
- Search/filter by date range
- Filter by completion status
- Sort by duration/distractions/date
- Delete individual sessions
- Bulk select & delete
- Export selected sessions

Visual:
- Timeline-style layout with connecting line
- Color-coded by performance (green = good, yellow = ok, red = many distractions)
- Hover to see full details
- Click to expand with insights

Interactions:
- Swipe to delete (mobile)
- Right-click context menu (desktop)
- Keyboard navigation (up/down arrows)
- Bulk actions toolbar when items selected

Use Recharts timeline component or custom CSS grid.
```

### Prompt 5.3: Data Export & Import

```
Implement data export and import functionality:

Export Formats:
1. JSON (full data, for backup)
2. CSV (for Excel/Google Sheets)
3. PDF (pretty report with charts)
4. ICS (calendar events for each session)

Export Options:
- Date range selection
- Include/exclude certain data types
- Aggregate vs detailed
- Include personal notes or not (privacy)

Import:
- Upload JSON file to restore from backup
- Validate data structure before importing
- Merge with existing data (ask user to resolve conflicts)
- Import from other apps (RescueTime, Toggl format)

UI:
- Modal dialog for export/import
- Progress bar for large exports
- Preview before import
- Success/error notifications

Privacy:
- Encrypt exported data (optional password)
- Warning if exporting sensitive info
- Clear indication what's being exported

Implement with file download/upload APIs and Papa Parse for CSV.
```

---

## 🤖 AI Insights

### Prompt 6.1: Integrate Existing AI Insights

```
Integrate the existing FocusBubble AI Insights module into the extension:

Requirements:
1. Import from utils/aiInsightsEnhanced.js
2. Create React component for displaying insights
3. Add settings for AI provider (local/OpenAI/Anthropic)
4. Secure API key storage in chrome.storage.sync
5. Generate insights:
   - After each session completes
   - On dashboard page load
   - On manual refresh button click
6. Cache insights to avoid redundant API calls

Component Features:
- Card layout with gradient background
- Insight text in quote format
- Tone badge (motivational, analytical, etc.)
- Refresh button
- Share button (copy to clipboard)
- "Tell me more" expands with additional tips

Settings Panel:
- AI provider dropdown (local/OpenAI/Anthropic)
- API key input (masked, with "test connection" button)
- Tone preference selector
- Auto-generate toggle
- Frequency selector (after every session / daily / weekly)

Handle:
- API errors gracefully (fallback to local)
- Rate limiting (don't spam API)
- Loading states
- Empty states (no sessions yet)

Reuse existing hooks/functions from src/hooks/useAIInsights.js
```

### Prompt 6.2: Contextual Insights

```
Create a system for contextual AI insights based on user patterns:

Insight Types:
1. Performance insights: "Your afternoon sessions are 30% longer"
2. Distraction patterns: "You're most distracted on Monday mornings"
3. Improvement suggestions: "Try 45-min sessions instead of 25"
4. Streak motivation: "3 more days for a 30-day streak!"
5. Comparative: "This week: +15% focus time vs last week"
6. Predictive: "Based on trends, you'll hit 20 hours this month"

Implementation:
- Analyze session data locally
- Identify patterns using simple statistics
- Generate templated insights if no AI available
- Enhance with AI for personalized tone
- Show 1 insight per day (rotate categories)

Data Required:
- Session history (minimum 7 days for trends)
- Time-of-day breakdown
- Distraction frequency
- Week-over-week comparison

Prompt Template:
"Analyze this focus data: {stats}. Generate 1 actionable insight about {focus_area} in {tone} tone. Max 2 sentences."

Return:
- Insight text
- Category tag
- Confidence score (how much data supports this)
- Suggested action

Code in TypeScript with zod for data validation.
```

### Prompt 6.3: AI Coaching Chat

```
Build a mini AI coaching chatbot for productivity advice:

Interface:
- Chat window (300px wide, 400px tall)
- Message bubbles (user vs AI)
- Text input at bottom
- Send button + Enter key
- Typing indicator when AI responds

Features:
- Ask questions about focus data
  - "Why am I distracted on Mondays?"
  - "How can I improve my focus?"
  - "What's my best time to work?"
- AI analyzes user's session history
- Provides personalized advice
- Suggests experiments: "Try 50-min sessions tomorrow"
- Follow-up questions for clarity

AI Integration:
- Use OpenAI/Anthropic with conversation history
- System prompt: "You are a productivity coach..."
- Include user's stats in context
- Keep responses to 2-3 sentences (concise)
- Suggest actionable next steps

Privacy:
- All processing client-side or via user's API key
- Don't send identifiable info to servers
- Option to clear chat history
- Opt-in feature (not enabled by default)

Implementation:
- React component with chat UI
- Message state array
- API call on send
- Streaming responses (show word-by-word)
- Markdown formatting in responses

Include prompt engineering examples for good coach responses.
```

---

## 🌐 Cross-Browser Compatibility

### Prompt 7.1: Universal API Wrapper

```
Create a comprehensive cross-browser API compatibility layer:

APIs to Wrap:
1. Storage (chrome.storage / browser.storage)
2. Tabs (chrome.tabs / browser.tabs)
3. Runtime (chrome.runtime / browser.runtime)
4. Notifications (chrome.notifications / browser.notifications)
5. Alarms (chrome.alarms / browser.alarms)
6. Contextmenus (chrome.contextMenus / browser.menus)

Implementation:
- Detect available API (chrome vs browser)
- Promisify callback-based Chrome APIs
- Normalize API differences (e.g., browser.menus vs chrome.contextMenus)
- Type safety with TypeScript
- Runtime feature detection
- Polyfills for missing features

File Structure:
/shared/api-bridge.js
  - storage.js (storage wrapper)
  - tabs.js (tabs wrapper)
  - runtime.js (runtime wrapper)
  - notifications.js (notifications wrapper)
  - alarms.js (alarms wrapper)
  - index.js (exports all)

Include:
- JSDoc comments for each function
- Usage examples
- Error handling
- Browser compatibility matrix in README

Target browsers: Chrome 90+, Firefox 88+, Edge 90+, Safari 14+
```

### Prompt 7.2: Browser-Specific Build

```
Create separate build configurations for each browser:

Chrome/Edge Build:
- Use chrome.* APIs
- Manifest V3 (service worker)
- Include all features

Firefox Build:
- Replace chrome.* with browser.*
- Manifest V2 or V3 (background script/service worker)
- Exclude unsupported features (if any)
- Test addon compliance

Safari Build:
- Convert to Safari App Extension
- Use safari.* APIs where different
- Xcode project setup
- Code signing configuration

Build Scripts:
- npm run build:chrome → dist/chrome/
- npm run build:firefox → dist/firefox/
- npm run build:edge → dist/edge/
- npm run build:safari → dist/safari/
- npm run build:all → builds all

Differences to Handle:
- Manifest version (V2 vs V3)
- Background context (page vs service worker)
- Storage limits
- API availability
- CSP policies

Use webpack or esbuild with environment-specific configs.
Include browser detection in code for feature flagging.
```

### Prompt 7.3: Testing Matrix

```
Create automated testing setup for cross-browser compatibility:

Test Environments:
1. Chrome 120+ (latest stable)
2. Firefox 120+ (latest stable)
3. Edge 120+ (latest stable)
4. Safari 17+ (if possible)

Test Categories:
- Unit tests (Jest) for business logic
- Integration tests for API wrappers
- E2E tests (Playwright) for user flows
- Visual regression (Percy/Chromatic) for UI

E2E Test Scenarios:
1. Install extension
2. Start timer → wait → complete
3. Pause/resume timer
4. Detect tab switch (distraction)
5. Save session to storage
6. View dashboard
7. Generate AI insight
8. Export data
9. Import data
10. Uninstall extension

Playwright Config:
- Launch browsers with extension loaded
- Test on different window sizes
- Screenshot on failure
- Video recording
- Test on Windows, Mac, Linux

CI/CD:
- GitHub Actions workflow
- Run tests on every PR
- Matrix build (all browsers × all OSes)
- Automated screenshots
- Publish to stores on tag

Provide full test files + GitHub Actions YAML.
```

---

## 🔧 Background Service Worker

### Prompt 8.1: Service Worker Timer Logic

```
Implement a robust timer in the background service worker:

Requirements:
- Persist across browser restarts
- Survives service worker sleep/wake
- Accurate to the second (no drift)
- Uses chrome.alarms API (not setInterval)
- Syncs state to storage every 10 seconds

Timer State:
{
  isRunning: boolean,
  timeRemaining: number, // seconds
  duration: number, // total duration
  startTime: number | null, // timestamp
  pausedAt: number | null,
  sessionId: string,
  distractionCount: number
}

Functions:
- startTimer(duration)
- pauseTimer()
- resumeTimer()
- resetTimer()
- getTimeRemaining() // calculates from startTime
- handleTimerComplete()

Alarm Handling:
- Create alarm when timer starts
- Clear alarm on pause
- Recreate alarm on resume
- Fire completion notification when alarm triggers

Edge Cases:
- Browser closed mid-session
- Service worker terminated mid-session
- Clock changed (time zone, daylight saving)
- Multiple tabs trying to control timer
- Rapid start/stop clicks

Include comprehensive error handling and state recovery logic.
```

### Prompt 8.2: Message Passing System

```
Design a message passing system between service worker, popup, and content scripts:

Message Types:
1. Commands (popup/content → background):
   - START_TIMER { duration }
   - PAUSE_TIMER
   - RESUME_TIMER
   - RESET_TIMER
   - GET_STATE
   - RECORD_DISTRACTION

2. Responses (background → popup/content):
   - TIMER_STATE_UPDATE { state }
   - SESSION_COMPLETE { session }
   - ERROR { message }

3. Broadcasts (background → all):
   - STATE_SYNC { state } (every 10s)

Implementation:
- Use chrome.runtime.sendMessage for one-off
- Use chrome.runtime.onMessage for listening
- Port connections for long-lived channels (if needed)
- Type-safe message handlers (TypeScript)
- Request/response pattern with promises

Helpers:
- sendCommand(command, data) → Promise<response>
- onCommand(command, handler)
- broadcastState(state)
- withRetry(messageFn, maxRetries = 3)

Error Handling:
- Timeout if no response in 5 seconds
- Retry failed messages
- Queue messages if background not ready
- Graceful degradation if messaging fails

Include TypeScript types for all message shapes.
```

### Prompt 8.3: State Persistence

```
Implement comprehensive state persistence for extension:

What to Persist:
1. Timer state (current session)
2. Session history (last 90 days)
3. User settings (preferences)
4. AI insights cache
5. Distraction log
6. Streak data
7. Statistics aggregates

Storage Strategy:
- chrome.storage.local for large data (unlimited)
- chrome.storage.sync for settings (syncs across devices, 100KB limit)
- IndexedDB for heavy data (session details, 50MB+)
- In-memory cache for frequently accessed data

Data Structure:
{
  // chrome.storage.sync (syncs across devices)
  settings: {
    defaultDuration: 25,
    tone: 'motivational',
    apiKey: 'encrypted',
    theme: 'light'
  },

  // chrome.storage.local
  currentSession: { /* timer state */ },
  sessions: [ /* last 1000 sessions */ ],
  insights: [ /* cached insights */ ],
  distractions: [ /* last 500 distractions */ ]
}

Functions:
- saveState(key, value)
- loadState(key)
- clearOldData(daysToKeep = 90)
- migrate(fromVersion, toVersion)
- backup() → JSON string
- restore(jsonString)

Optimization:
- Debounce writes (don't save on every change)
- Batch multiple writes
- Compress large objects
- Limit array sizes (keep last N items)

Migration:
- Version tracking
- Schema migration on version bump
- Backward compatibility

Include quota management to stay under limits.
```

---

## 💾 Storage & Persistence

### Prompt 9.1: Data Schema Design

```
Design a robust data schema for focus session storage:

Session Object:
{
  id: string, // UUID
  startTime: Date,
  endTime: Date | null,
  duration: number, // seconds
  timeElapsed: number, // actual time focused
  distractionCount: number,
  distractions: [
    {
      timestamp: Date,
      type: 'tab_switch' | 'window_blur' | 'manual_pause',
      duration: number // how long distracted
    }
  ],
  completed: boolean,
  abandoned: boolean,
  tags: string[], // ['work', 'coding']
  notes: string,
  taskName: string,
  mood: 'focused' | 'distracted' | 'stressed' | null
}

Aggregate Stats:
{
  totalTime: number,
  totalSessions: number,
  completedSessions: number,
  averageDuration: number,
  totalDistractions: number,
  streak: number,
  bestStreak: number,
  lastSessionDate: Date,
  byDay: {
    [date: string]: {
      time: number,
      sessions: number,
      distractions: number
    }
  },
  byHour: {
    [hour: number]: {
      sessions: number,
      avgDuration: number
    }
  }
}

Storage Keys:
- 'sessions' → Session[]
- 'stats' → AggregateStats
- 'currentSession' → Session
- 'settings' → UserSettings

Include:
- TypeScript interfaces
- Zod schemas for validation
- Migration functions for schema changes
- Indexing strategy for fast queries
```

### Prompt 9.2: Efficient Data Queries

```
Implement efficient query functions for session data:

Queries Needed:
1. Get sessions for date range
2. Get sessions by tag
3. Get top N longest sessions
4. Get sessions with fewest distractions
5. Calculate stats for time period (day/week/month)
6. Find focus patterns (best time of day)
7. Track streak (consecutive days)

Implementation:
- Use in-memory indexing for fast lookups
- Precompute aggregates to avoid recalculating
- Lazy load old sessions (only when needed)
- Cache query results with invalidation

Example Functions:
```javascript
async function getSessionsByDateRange(startDate, endDate) { }
async function calculateWeeklyStats(weekStart) { }
async function findBestFocusTime() { }
async function getCurrentStreak() { }
async function getSessionsByTag(tag) { }
```

Optimization:
- Binary search for date ranges
- Hash maps for tag lookups
- Incremental aggregate updates
- Background computation for heavy queries

Include benchmarks showing query performance (<50ms for most operations).
```

### Prompt 9.3: Data Cleanup & Maintenance

```
Create automated data cleanup and maintenance system:

Tasks:
1. Delete sessions older than 90 days (configurable)
2. Remove duplicate sessions
3. Compress session details (remove verbose fields)
4. Recalculate aggregate stats if corrupted
5. Validate data integrity
6. Optimize storage usage

Scheduled Jobs:
- Daily: cleanup old data
- Weekly: validate integrity
- Monthly: compress old sessions

Cleanup Logic:
```javascript
async function cleanupOldSessions(daysToKeep = 90) {
  // Keep recent sessions in full detail
  // Compress old sessions (remove distractions array, keep summary)
  // Delete very old sessions (>1 year)
}

async function validateDataIntegrity() {
  // Check for corrupted sessions
  // Verify stats match session data
  // Fix any inconsistencies
}

async function optimizeStorage() {
  // Remove redundant data
  // Compress JSON
  // Report storage usage
}
```

Settings:
- User configurable retention period
- Option to export before cleanup
- Manual cleanup trigger
- Show storage usage in settings

Background execution using chrome.alarms (run at 3 AM daily).
```

---

## 🎨 UI/UX Components

### Prompt 10.1: Settings Page

```
Create a comprehensive settings page for the extension:

Sections:
1. Timer Settings
   - Default duration (slider: 5-120 min)
   - Auto-start next session
   - Notification sound (on/off + sound picker)
   - Notification text customization

2. Distraction Detection
   - Sensitivity (low/medium/high)
   - Auto-pause on tab switch (on/off)
   - Whitelisted domains (don't count as distractions)
   - Pause after N seconds of inactivity

3. Floating Bubble
   - Show/hide bubble
   - Default position (corner selector)
   - Size (small/medium/large)
   - Transparency (slider)
   - Minimize behavior

4. AI Insights
   - Provider (local/OpenAI/Anthropic)
   - API key (secure input)
   - Default tone
   - Auto-generate (on/off)
   - Frequency

5. Data & Privacy
   - Export data (JSON/CSV)
   - Import data
   - Clear all data (confirm dialog)
   - Data retention period
   - Analytics opt-in

6. Appearance
   - Theme (light/dark/auto)
   - Accent color picker
   - Font size (small/medium/large)

UI:
- Tab-based navigation
- Save button (or auto-save)
- Reset to defaults button
- Search settings
- Visual preview of changes

Validation:
- API key testing before save
- Numeric input validation
- Domain whitelist format check

Implementation in React + Tailwind with form library (react-hook-form).
```

### Prompt 10.2: Notification System

```
Design a beautiful notification system for the extension:

Notification Types:
1. Session Complete
   - "Great work! You focused for 25 minutes."
   - Celebration icon
   - Quick actions: Start Another | View Stats

2. Focus Interrupted
   - "Oops! You switched tabs."
   - Warning icon
   - Quick action: Resume

3. Streak Milestone
   - "🎉 5-day streak! Keep it up!"
   - Trophy icon
   - Share achievement button

4. Reminder
   - "Time for a focus session?"
   - Clock icon
   - Start Timer button

5. Insight Ready
   - "New insight about your focus patterns"
   - Lightbulb icon
   - View Insight button

Implementation:
- Use chrome.notifications API
- Rich notifications with actions
- Click to open popup/dashboard
- Auto-dismiss after 10 seconds
- Sound effects (optional)
- Desktop native notifications

Custom In-App Toasts:
- For popup/dashboard when extension is open
- Slide in from top-right
- Stack multiple toasts
- Dismiss button
- Auto-dismiss with progress bar

Preferences:
- Enable/disable each type
- Sound on/off
- Do not disturb mode
- Quiet hours

Use react-hot-toast for in-app, chrome.notifications for desktop.
```

### Prompt 10.3: Onboarding Flow

```
Create a welcoming onboarding experience for new users:

Steps:
1. Welcome Screen
   - Logo animation
   - "Welcome to FocusBubble!"
   - Brief description
   - "Get Started" button

2. Feature Tour (carousel)
   - Slide 1: Timer ("Set your focus duration")
   - Slide 2: Distraction tracking ("We detect when you drift")
   - Slide 3: Analytics ("See your progress")
   - Slide 4: AI insights ("Get personalized tips")
   - Progress dots at bottom

3. Quick Setup
   - Choose default duration (25/50/90)
   - Enable notifications? (toggle)
   - Show floating bubble? (toggle)
   - "Start My First Session" button

4. Optional: AI Setup
   - "Want AI-powered insights?" (Yes/Skip)
   - If yes: provider + API key
   - Test connection
   - Choose tone

5. Tutorial Session
   - Start a 2-minute demo session
   - Tooltips pointing to features
   - "Try switching tabs to see distraction detection"
   - Completion celebration

UI Design:
- Full-screen modal (covers popup)
- Smooth transitions between steps
- Back/Next buttons
- Skip button (goes straight to app)
- Can't be shown again (checkbox)

Implementation:
- Store 'hasCompletedOnboarding' in settings
- Show only on first install
- Framer Motion for animations
- Progress indicator (Step 1 of 5)

Include analytics events to track completion rate.
```

---

## 🧪 Testing & Debugging

### Prompt 11.1: Unit Tests

```
Write comprehensive unit tests for FocusBubble core functions:

Test Coverage:
1. Timer logic (start/pause/resume/reset)
2. Session data calculations (stats aggregation)
3. Distraction detection (visibility API)
4. Storage operations (save/load/delete)
5. AI insight generation (local fallback)
6. Cross-browser API wrappers
7. Data validation & migration

Framework: Jest + React Testing Library

Example Test Structure:
```javascript
describe('Timer State Machine', () => {
  test('should start timer with correct duration', () => {})
  test('should pause and calculate remaining time', () => {})
  test('should handle resume after pause', () => {})
  test('should reset to initial state', () => {})
  test('should handle timer completion', () => {})
  test('should persist state across restarts', () => {})
})

describe('Session Analytics', () => {
  test('should calculate total focus time', () => {})
  test('should compute average session duration', () => {})
  test('should track current streak', () => {})
  test('should find best focus time of day', () => {})
})

describe('AI Insights', () => {
  test('should generate local insight when no API', () => {})
  test('should fallback to local on API error', () => {})
  test('should format stats correctly for prompt', () => {})
  test('should cache insights to avoid duplicates', () => {})
})
```

Mocking:
- Mock chrome API calls
- Mock fetch for AI API requests
- Mock Date.now() for time-based tests
- Mock localStorage/chrome.storage

Coverage Target: >80% for core logic

Include setup files and npm test script.
```

### Prompt 11.2: E2E Tests with Playwright

```
Create end-to-end tests using Playwright for Chrome extensions:

Setup:
- Install Playwright
- Configure to load unpacked extension
- Launch browser with extension enabled
- Access extension popup and content scripts

Test Scenarios:

1. Install & First Launch
```javascript
test('should show onboarding on first install', async ({ page }) => {
  // Open extension popup
  // Verify onboarding appears
  // Complete onboarding steps
  // Verify redirect to timer screen
})
```

2. Timer Full Flow
```javascript
test('should complete full timer cycle', async ({ page }) => {
  // Set 1-minute timer
  // Click start
  // Verify timer counting down
  // Wait for completion
  // Verify notification appears
  // Verify session saved to history
})
```

3. Distraction Detection
```javascript
test('should detect tab switch as distraction', async ({ page, context }) => {
  // Start timer
  // Open new tab
  // Switch to new tab
  // Verify timer paused
  // Verify distraction recorded
  // Return to original tab
  // Resume timer
})
```

4. Dashboard & Analytics
```javascript
test('should display session stats correctly', async ({ page }) => {
  // Complete 3 sessions
  // Navigate to dashboard
  // Verify stats match expected values
  // Verify charts render
})
```

5. Settings Persistence
```javascript
test('should save and restore settings', async ({ page }) => {
  // Change default duration
  // Close popup
  // Reopen popup
  // Verify setting persisted
})
```

Visual Testing:
- Take screenshots of key screens
- Compare against baseline
- Detect visual regressions

Cross-Browser:
- Run same tests on Chrome, Firefox, Edge

Provide full Playwright config and test files.
```

### Prompt 11.3: Debug Tools

```
Build developer debugging tools for the extension:

Debug Panel Features:
1. State Inspector
   - View current timer state (real-time)
   - View storage contents (formatted JSON)
   - View all active alarms
   - View message logs (sent/received)

2. Controls
   - Force complete session
   - Inject test sessions (100 sessions)
   - Clear all data
   - Reset to factory settings
   - Export logs

3. Performance Metrics
   - Service worker memory usage
   - Storage quota used
   - Message passing latency
   - Render performance (FPS)

4. API Tester
   - Test AI insight generation
   - Test notification sending
   - Test storage operations
   - Show request/response

5. Error Log
   - All errors with timestamps
   - Stack traces
   - Clear log button
   - Export log as file

Implementation:
- Separate debug page (chrome-extension://[id]/debug.html)
- Only accessible in development mode
- Use chrome.devtools API if needed
- Real-time updates via messaging
- Styled with Tailwind

Keyboard Shortcuts:
- Ctrl+Shift+D: Open debug panel
- Ctrl+Shift+C: Clear all data (confirm first)
- Ctrl+Shift+L: Export logs

Include feature flag to enable in production for power users.
```

---

## 🎨 Logo & Branding

### Prompt 12.1: Logo Design (Midjourney/DALL-E)

```
Design prompt for AI image generators:

Primary Logo:
"Minimalist logo for 'FocusBubble' productivity app. Central element: soft, floating bubble with subtle gradient from light blue (#E0F2FE) to indigo (#6366F1). Inside bubble: small clock face or timer icon. Clean sans-serif text 'FocusBubble' below. Modern, friendly, professional aesthetic. Transparent background. High resolution 2048x2048px."

Icon Only (for extension):
"App icon for browser extension: single bubble with timer inside. Gradient blue to purple. Perfectly circular. Optimized for 128x128px, 48x48px, and 16x16px favicon. Maintains clarity at all sizes. No text. Soft glow effect."

Variations:
1. "Same bubble logo but with brain pattern inside instead of clock"
2. "Multiple overlapping bubbles forming a target/focus pattern"
3. "Bubble with light rays emanating, representing concentration"
4. "Minimal line art version of bubble timer, single color"

Style Keywords:
- Soft gradients
- Rounded corners
- Friendly but professional
- Pastel color palette
- Glassmorphism aesthetic
- Subtle depth/shadow
- Clean, modern, minimal

Color Palette:
Primary: #6366F1 (Indigo)
Secondary: #818CF8 (Light Indigo)
Accent: #A5B4FC (Pale Indigo)
Background: #E0F2FE (Sky Blue)
Text: #1E293B (Dark Slate)

Deliverables:
- Logo with text (horizontal and vertical layouts)
- Icon only (square, various sizes)
- Favicon (16x16, 32x32)
- Social media banner (1200x628)
```

### Prompt 12.2: Brand Guidelines

```
Create a comprehensive brand guide document:

Contents:

1. Logo Usage
   - Primary logo (when to use)
   - Icon only (when to use)
   - Minimum size requirements
   - Clear space requirements
   - Incorrect usage examples

2. Color Palette
   - Primary colors (with hex codes)
   - Secondary colors
   - Gradients (CSS code)
   - Accessibility (contrast ratios)
   - Dark mode alternatives

3. Typography
   - Primary font: Inter (headings)
   - Secondary font: System font stack (body)
   - Font sizes (scale: 12/14/16/20/24/32/48px)
   - Line heights
   - Font weights (400/500/600/700)

4. UI Components
   - Button styles (primary/secondary/ghost)
   - Input fields
   - Cards
   - Modals
   - Notifications
   - Icons (Heroicons recommended)

5. Tone of Voice
   - Friendly but professional
   - Encouraging, not preachy
   - Clear and concise
   - Use "you" (conversational)
   - Examples of good/bad copy

6. Illustrations
   - Bubble theme consistent
   - Soft, rounded shapes
   - Minimal detail
   - 2D flat style with subtle shadows

7. Animation Principles
   - Smooth, gentle transitions (200-300ms)
   - Easing: ease-in-out
   - Subtle hover effects
   - No jarring movements
   - Purpose-driven (not decorative)

Format: PDF + Figma file
Include real examples from the extension UI.
```

### Prompt 12.3: Marketing Assets

```
Generate marketing assets for various platforms:

1. Chrome Web Store Listing
   - Hero image (1400x560px)
   - Screenshot 1: Timer in action
   - Screenshot 2: Dashboard with stats
   - Screenshot 3: AI insights
   - Screenshot 4: Floating bubble
   - Screenshot 5: Settings
   - Promo tile (440x280px)

2. Website Landing Page
   - Hero section (with demo GIF)
   - Features grid (6 features with icons)
   - Testimonials section (3 cards)
   - Pricing table (Free / Pro)
   - FAQ section
   - Footer with links

3. Social Media
   - Twitter card (1200x675px)
   - Facebook cover (820x312px)
   - LinkedIn banner (1584x396px)
   - Instagram post template (1080x1080px)

4. Product Hunt Launch
   - Thumbnail (240x240px)
   - Gallery images (1270x760px) - 5 images
   - GIF demo (600x400px, <5MB)

5. Email Templates
   - Welcome email
   - Weekly stats report
   - Milestone celebration
   - Feature announcement

6. Video Script
   - 60-second demo video outline
   - Highlight key features
   - Call-to-action at end

Design Requirements:
- Consistent with brand guidelines
- Use actual screenshots (not mockups)
- Clear, readable text
- Professional but approachable
- Mobile-friendly dimensions

Provide Figma templates for each asset type.
```

---

## 📈 Marketing & Documentation

### Prompt 13.1: Chrome Web Store Description

```
Write compelling Chrome Web Store listing copy:

Title (45 chars max):
"FocusBubble: AI Focus Timer & Distraction Blocker"

Subtitle (132 chars):
"Boost productivity with smart focus sessions, automatic distraction detection, and AI-powered insights about your work patterns."

Description (Detailed):

[Opening Hook]
"Struggling to stay focused? FocusBubble turns your browser into a productivity powerhouse."

[Key Features]
🎯 Smart Focus Timer
- Pomodoro-style sessions (25/50/90 min)
- Beautiful, distraction-free UI
- Automatic pause when you switch tabs

📊 Distraction Analytics
- See when and why you lose focus
- Track patterns over time
- Improve with actionable data

🤖 AI-Powered Insights
- Personalized productivity tips
- Pattern recognition
- Motivational coaching (optional)

🎈 Floating Timer Bubble
- Always visible, never intrusive
- Drag anywhere on screen
- Quick controls at your fingertips

📈 Beautiful Dashboard
- Weekly/monthly trends
- Focus streaks
- Export data anytime

[Use Cases]
Perfect for:
- Remote workers fighting distractions
- Students studying for exams
- Developers in deep work
- Writers maintaining flow
- Anyone wanting to focus better

[Privacy]
- Your data never leaves your device
- Optional AI uses your own API key
- No tracking, no ads, no BS

[Call to Action]
"Install now and start your first focus session in 30 seconds."

[Footer]
Made with ❤️ by Chase Elkins
Open source on GitHub: [link]
Questions? hello@focusbubble.app

---

Keywords (for SEO):
focus timer, pomodoro, productivity, concentration, distraction blocker, time tracking, work timer, study timer, deep work
```

### Prompt 13.2: README for GitHub

```
Write an engaging README.md for the FocusBubble GitHub repository:

Structure:

# 🎈 FocusBubble

> A distraction-aware focus timer with AI-powered insights

[Badges: Stars, Forks, License, Chrome Web Store, Version]

![Demo GIF](./assets/demo.gif)

## ✨ Features

- 🎯 **Smart Focus Timer** - Pomodoro sessions that pause when you get distracted
- 📊 **Analytics Dashboard** - Beautiful charts showing your focus patterns
- 🤖 **AI Insights** - Personalized tips powered by Claude or GPT-4
- 🎈 **Floating Bubble** - Always-visible, draggable timer
- 📱 **Cross-Browser** - Works on Chrome, Firefox, Edge, and Safari
- 🔒 **Privacy-First** - Your data stays on your device

## 🚀 Quick Start

### For Users
1. [Install from Chrome Web Store](link)
2. Click the FocusBubble icon
3. Start your first focus session!

### For Developers
```bash
git clone https://github.com/you/focusbubble
cd focusbubble
npm install
npm run dev
```

Load unpacked extension from `dist/` folder.

## 🏗️ Tech Stack

- **Frontend**: React 18, Tailwind CSS, Framer Motion
- **Charts**: Recharts
- **AI**: Anthropic Claude API, OpenAI API
- **Build**: Webpack 5
- **Testing**: Jest, Playwright

## 📖 Documentation

- [Installation Guide](docs/install.md)
- [User Guide](docs/user-guide.md)
- [Developer Docs](docs/developer.md)
- [API Reference](docs/api.md)
- [Contributing](CONTRIBUTING.md)

## 🎨 Screenshots

[Grid of 4 screenshots]

## 🤝 Contributing

Contributions welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) first.

1. Fork the repo
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

MIT © Chase Elkins

## 🙏 Acknowledgments

- Icons by [Heroicons](https://heroicons.com)
- Inspired by the Pomodoro Technique
- Built with love and caffeine ☕

## ⭐ Star History

[Star history chart]

---

**Like FocusBubble? Give it a star ⭐ and share with friends!**
```

### Prompt 13.3: Social Media Launch Plan

```
Create a social media launch strategy for FocusBubble:

Platforms:
1. Twitter
2. Product Hunt
3. Reddit (r/productivity, r/SideProject)
4. Hacker News
5. LinkedIn
6. Instagram

Pre-Launch (1 week before):

Twitter:
- Day -7: Teaser: "Building something for people who can't focus... 👀"
- Day -5: Feature reveal: "Sneak peek: AI-powered focus insights"
- Day -3: Problem tweet: "You switch tabs 47 times/day. That's a problem."
- Day -2: Countdown: "FocusBubble launches tomorrow!"
- Day -1: Final teaser with demo GIF

Product Hunt:
- Schedule launch for Tuesday/Wednesday (best days)
- Prepare 5 gallery images
- Write engaging tagline
- Line up 5-10 friends to upvote at launch
- Prepare answers to common questions
- Plan to be active in comments all day

Reddit:
- Draft post for r/productivity
  - Title: "I built a focus timer that detects when you get distracted [Chrome Extension]"
  - Body: Problem → Solution → Link
  - Include demo GIF
  - Be ready to answer questions

Launch Day:

Twitter Thread:
"I spent 3 months building FocusBubble 🎈 - a focus timer that actually knows when you're distracted.

Here's what makes it different: 🧵

[1/10] Most timers just count down. FocusBubble pauses when you switch tabs and shows you exactly when/why you lost focus.

[2/10] It generates AI insights about your patterns...

[Continue with features]

[10/10] Try it free: [link]"

Product Hunt:
- Post at 12:01 AM PST
- Respond to every comment within 1 hour
- Share link in relevant Slack/Discord communities
- Ask for feedback, not just upvotes

Post-Launch (Next week):

- Share user testimonials
- Post weekly stats/milestones (100 users, 1000 sessions, etc.)
- Behind-the-scenes content (how it works)
- Tips & tricks for power users
- Comparison with other tools (positioning)

Content Calendar:
Monday: Feature spotlight
Tuesday: User story/testimonial
Wednesday: Productivity tip
Thursday: Behind-the-scenes
Friday: Weekly wins
Saturday: Fun/meme related to productivity
Sunday: Reflection/question to audience

Hashtags:
#productivity #focus #pomodoro #chrome #deepwork #buildinpublic #indiehacker

Include templates for each post type.
```

---

## ⚡ Optimization & Performance

### Prompt 14.1: Performance Optimization

```
Optimize FocusBubble extension for performance:

Areas to Optimize:

1. Service Worker
   - Minimize wake-ups (batch operations)
   - Use alarms instead of setInterval
   - Lazy load modules
   - Optimize message passing (debounce state updates)
   - Profile memory usage (avoid leaks)

2. Popup UI
   - Code splitting (load dashboard on demand)
   - Lazy load charts (Recharts is heavy)
   - Virtualize long lists (session history)
   - Optimize re-renders (React.memo, useMemo)
   - Image optimization (compress icons, use SVG)

3. Content Script
   - Inject only when needed
   - Minimize DOM manipulation
   - Use CSS transforms (not top/left)
   - Debounce drag events
   - Remove event listeners on cleanup

4. Storage
   - Compress session data (JSON.stringify is verbose)
   - Batch writes (don't save on every tick)
   - Use IndexedDB for large data (>5MB)
   - Implement LRU cache for frequent reads

5. Network
   - Cache AI insights (same input = same output)
   - Retry failed requests with exponential backoff
   - Cancel in-flight requests on unmount
   - Use request deduplication

Techniques:
- Bundle splitting
- Tree shaking
- Minification
- Compression
- Lazy loading
- Memoization
- Debouncing
- Throttling

Metrics to Track:
- Service worker memory usage (<10 MB)
- Popup load time (<500ms)
- Storage operations (<50ms)
- Message latency (<10ms)
- Content script injection time (<100ms)

Provide before/after performance benchmarks.
```

### Prompt 14.2: Bundle Size Optimization

```
Reduce extension bundle size:

Current Size (estimate):
- Popup bundle: ~500 KB
- Content script: ~150 KB
- Service worker: ~50 KB
- Total: ~700 KB

Target Size:
- Popup: <300 KB
- Content: <80 KB
- Service worker: <30 KB
- Total: <410 KB

Strategies:

1. Dependencies
   - Replace Recharts with lighter alternative (Chart.js?)
   - Use Preact instead of React (3KB vs 40KB)
   - Replace Framer Motion with CSS animations
   - Remove unused lodash functions (use native)
   - Tree-shake Tailwind (purge unused classes)

2. Code Splitting
   - Separate dashboard into lazy-loaded chunk
   - Load AI module only when needed
   - Async import heavy dependencies

3. Compression
   - Enable gzip in build
   - Use brotli for static assets
   - Minify JSON data

4. Assets
   - Use SVG instead of PNG (where possible)
   - Compress images with imagemin
   - Inline small icons (<2KB) as data URIs
   - Use icon font instead of individual SVGs

5. Build Config
```javascript
// webpack.config.js
optimization: {
  minimize: true,
  splitChunks: {
    chunks: 'all',
    maxSize: 200000
  },
  usedExports: true // tree shaking
}
```

6. Analyze Bundle
   - Use webpack-bundle-analyzer
   - Identify large dependencies
   - Find duplicate code

Report:
- Bundle size before/after
- Load time improvement
- List removed dependencies
- Alternative lighter libraries

Provide complete webpack config.
```

### Prompt 14.3: Memory Management

```
Implement robust memory management to prevent leaks:

Common Leak Sources:
1. Event listeners not removed
2. Timers not cleared
3. Large arrays growing indefinitely
4. Cached data not garbage collected
5. Closures holding references
6. React state holding old data

Solutions:

1. React Cleanup
```javascript
useEffect(() => {
  const listener = () => { /* ... */ };
  chrome.runtime.onMessage.addListener(listener);

  return () => {
    // CLEANUP
    chrome.runtime.onMessage.removeListener(listener);
  };
}, []);
```

2. Storage Limits
```javascript
// Keep only last 1000 sessions
async function pruneOldSessions() {
  const sessions = await getSessionHistory();
  if (sessions.length > 1000) {
    const keep = sessions.slice(-1000);
    await saveSessionHistory(keep);
  }
}
```

3. Cache Invalidation
```javascript
// LRU cache with size limit
class LRUCache {
  constructor(maxSize = 100) { /* ... */ }
  get(key) { /* ... */ }
  set(key, value) {
    if (this.size >= this.maxSize) {
      this.delete(this.oldestKey);
    }
    // ...
  }
}
```

4. Service Worker Lifecycle
- Handle terminate event
- Persist state before shutdown
- Restore state on wake
- Clear temporary data

5. Memory Profiling
- Use Chrome DevTools Memory Profiler
- Take heap snapshots before/after actions
- Identify retained objects
- Fix leaks

Monitoring:
```javascript
// Log memory usage periodically
if (performance.memory) {
  console.log({
    used: performance.memory.usedJSHeapSize / 1024 / 1024,
    total: performance.memory.totalJSHeapSize / 1024 / 1024,
    limit: performance.memory.jsHeapSizeLimit / 1024 / 1024
  });
}
```

Provide memory leak test scenarios and fixes.
```

---

## 🎮 Gamification Features

### Prompt 15.1: Streak System

```
Implement a focus streak tracking system:

Streak Types:
1. Daily Streak - Consecutive days with ≥1 session
2. Weekly Streak - Consecutive weeks with ≥5 sessions
3. Perfect Streak - Days with no distractions

Streak Data:
{
  current: number,
  longest: number,
  startDate: Date,
  lastSessionDate: Date,
  perfectDays: number,
  streakType: 'daily' | 'weekly' | 'perfect'
}

Milestones:
- 🔥 3 days: "Getting warmed up!"
- 🔥🔥 7 days: "One week strong!"
- 🔥🔥🔥 30 days: "Month master!"
- 🔥🔥🔥🔥 100 days: "Century club!"
- 🔥🔥🔥🔥🔥 365 days: "Year champion!"

Features:
- Show current streak in dashboard
- Flame emoji count based on streak
- "Don't break the chain" reminder if at risk
- Streak recovery grace period (1 day)
- Streak freeze (use once per week to save streak)
- Share streak on social media

Notifications:
- Daily: "Keep your streak alive! Start a session."
- Milestone: "🎉 You've hit a 30-day streak!"
- At Risk: "⚠️ Your 15-day streak ends in 2 hours"
- Broken: "Streak ended at 25 days. Start fresh today!"

UI Components:
- Streak counter with flame animation
- Progress bar to next milestone
- Calendar heatmap (GitHub-style)
- Longest streak badge

Motivation:
- Quotes about consistency
- Comparison to community average
- Personal best tracking
- Streak leaderboard (optional, opt-in)

Implement in TypeScript with streak calculation functions.
```

### Prompt 15.2: Achievement Badges

```
Design an achievement/badge system:

Badge Categories:

1. Session Milestones
   - 🏁 First Timer: Complete 1 session
   - 🎖️ Dedicated: Complete 10 sessions
   - 🏆 Century: Complete 100 sessions
   - 💎 Thousand: Complete 1000 sessions

2. Focus Duration
   - ⏱️ Quick Focus: Complete 25-min session
   - ⌛ Deep Dive: Complete 90-min session
   - 🚀 Marathon: 3 hours in one day
   - 🌟 Ultra: 6 hours in one day

3. Distraction Control
   - 🎯 Laser Focused: 0 distractions in session
   - 🛡️ Fortress: 5 sessions with 0 distractions
   - 🧘 Zen Master: 30 days, <1 distraction/session avg

4. Consistency
   - 📅 Daily Driver: Session every day for 7 days
   - 📆 Weekly Warrior: Session every day for 30 days
   - 🗓️ Annual Achiever: Session every day for 365 days

5. Time-Based
   - 🌅 Early Bird: Session before 8 AM
   - 🌙 Night Owl: Session after 10 PM
   - ⏰ Consistency: Sessions at same time 7 days

6. Special
   - 🎂 Birthday: Session on your birthday
   - 🎉 New Year: Session on Jan 1
   - 🚀 Launch Day: Installed extension on launch day

Badge Structure:
{
  id: string,
  name: string,
  description: string,
  icon: string, // emoji or SVG
  rarity: 'common' | 'rare' | 'epic' | 'legendary',
  unlockedAt: Date | null,
  progress: number, // 0-100
  total: number, // e.g., "100 sessions"
}

UI:
- Badge showcase grid
- Lock icon for unearned badges
- Progress bar on locked badges
- Shine animation when earned
- Badge detail modal
- Share badge on social media
- Badge count in profile

Notifications:
- "🏆 Badge Unlocked: [badge name]!"
- Show badge in popup with celebration animation
- Sound effect (optional)

Implement with React components and badge calculation logic.
```

### Prompt 15.3: Leaderboard & Social

```
Add social/competitive features (optional, opt-in):

Leaderboard Types:
1. Daily Focus Time (today)
2. Weekly Focus Time (this week)
3. Monthly Total (this month)
4. All-Time Hours
5. Current Streak
6. Most Sessions (one day)

Privacy Options:
- Anonymous (show as "User #1234")
- Username only
- Full profile (name + avatar)
- Friends only
- Public

Data Shared:
- Focus time (rounded to nearest hour)
- Number of sessions
- Current streak
- Badges earned
- NO personal data (websites visited, etc.)

Features:
- See global top 100
- Filter by friends
- Filter by region/country
- Compare with similar users (±10% your usage)
- Challenge friends (who can focus more this week)

Social:
- Add friends by username
- See friend activity (with permission)
- Send encouragement messages
- Share achievements
- Group challenges

Implementation:
- Backend: Simple REST API (Firebase/Supabase)
- Anonymous authentication (UUID)
- End-to-end encryption for personal data
- GDPR compliant (delete data on request)
- Opt-out anytime

UI:
- Leaderboard tab in dashboard
- Your rank prominently displayed
- Weekly reset notification
- Friend request system
- Privacy settings panel

Security:
- Rate limiting (prevent spam)
- Validation (can't submit fake data)
- Reporting system (flag cheaters)

Provide backend API spec and React components.
```

---

## 🎯 Quick Reference: Best Prompts for Each Task

### Want to... Use Prompt...
- Generate boilerplate → 1.1
- Build timer UI → 2.1, 2.3
- Add distraction detection → 3.1, 3.2
- Create floating bubble → 4.1, 4.2
- Build analytics dashboard → 5.1, 5.2
- Integrate AI insights → 6.1
- Make cross-browser compatible → 7.1, 7.2
- Implement service worker → 8.1, 8.2
- Design storage system → 9.1, 9.2
- Build settings page → 10.1
- Add notifications → 10.2
- Write tests → 11.1, 11.2
- Design logo → 12.1
- Write store listing → 13.1
- Optimize performance → 14.1, 14.2
- Add gamification → 15.1, 15.2

---

## 💡 Pro Tips for Using These Prompts

1. **Be Specific**: Add your tech stack preferences
2. **Iterate**: Start with base prompt, then refine
3. **Combine**: Mix prompts for complex features
4. **Context**: Include relevant files/code in prompt
5. **Verify**: Always test AI-generated code
6. **Customize**: Adapt prompts to your style

---

**Happy building! 🚀**

These prompts will give you 90% of the code. The last 10% is your creativity!
