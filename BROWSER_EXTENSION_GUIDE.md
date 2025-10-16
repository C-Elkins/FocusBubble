# FocusBubble Browser Extension - Implementation Guide

**Transform FocusBubble from a web app into a powerful cross-browser extension**

---

## 🎯 Extension Architecture Overview

```
FocusBubble Extension/
├── manifest.json              # Extension config (V3)
├── background/
│   └── service-worker.js      # Timer persistence, state management
├── popup/
│   ├── popup.html             # Extension popup UI
│   ├── popup.js               # React app entry
│   └── components/            # Reuse existing Timer, Dashboard components
├── content/
│   ├── content.js             # Inject floating bubble
│   └── FloatingBubble.jsx     # Draggable timer overlay
├── shared/
│   ├── storage.js             # Cross-browser storage wrapper
│   ├── api-bridge.js          # chrome/browser API compatibility
│   └── timer-sync.js          # Background ↔ UI sync
└── utils/
    └── aiInsights.js          # Your existing AI module!
```

---

## 🚀 Quick Start: Extension Setup

### Step 1: Create Extension Structure

```bash
# From your focusbubble directory
mkdir -p extension/{background,popup,content,shared}
cp -r src/components extension/popup/
cp -r src/hooks extension/popup/
cp -r src/utils extension/shared/
```

### Step 2: Create Manifest V3 File

Create `extension/manifest.json`:

```json
{
  "manifest_version": 3,
  "name": "FocusBubble",
  "version": "1.0.0",
  "description": "Distraction-aware focus timer with AI-powered insights",
  "author": "Chase Elkins",

  "icons": {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  },

  "action": {
    "default_popup": "popup/popup.html",
    "default_icon": {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png"
    },
    "default_title": "FocusBubble - Focus Timer"
  },

  "background": {
    "service_worker": "background/service-worker.js"
  },

  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content/content.js"],
      "css": ["content/floating-bubble.css"],
      "run_at": "document_idle"
    }
  ],

  "permissions": [
    "storage",
    "notifications",
    "alarms",
    "tabs"
  ],

  "host_permissions": [
    "https://api.anthropic.com/*",
    "https://api.openai.com/*"
  ],

  "web_accessible_resources": [
    {
      "resources": ["icons/*", "popup/*"],
      "matches": ["<all_urls>"]
    }
  ]
}
```

---

## 🔧 Core Components

### 1. Cross-Browser API Wrapper

**File:** `extension/shared/api-bridge.js`

```javascript
/**
 * Cross-Browser API Compatibility Layer
 * Handles chrome.* vs browser.* differences
 */

// Detect API availability
const browserAPI = (() => {
  if (typeof chrome !== 'undefined' && chrome.storage) {
    return chrome;
  }
  if (typeof browser !== 'undefined' && browser.storage) {
    return browser;
  }
  throw new Error('Browser extension API not available');
})();

/**
 * Universal Storage API
 */
export const storage = {
  // Get data from storage
  get: (keys) => {
    return new Promise((resolve, reject) => {
      browserAPI.storage.local.get(keys, (result) => {
        if (browserAPI.runtime.lastError) {
          reject(browserAPI.runtime.lastError);
        } else {
          resolve(result);
        }
      });
    });
  },

  // Set data in storage
  set: (items) => {
    return new Promise((resolve, reject) => {
      browserAPI.storage.local.set(items, () => {
        if (browserAPI.runtime.lastError) {
          reject(browserAPI.runtime.lastError);
        } else {
          resolve();
        }
      });
    });
  },

  // Remove items
  remove: (keys) => {
    return new Promise((resolve, reject) => {
      browserAPI.storage.local.remove(keys, () => {
        if (browserAPI.runtime.lastError) {
          reject(browserAPI.runtime.lastError);
        } else {
          resolve();
        }
      });
    });
  },

  // Clear all data
  clear: () => {
    return new Promise((resolve, reject) => {
      browserAPI.storage.local.clear(() => {
        if (browserAPI.runtime.lastError) {
          reject(browserAPI.runtime.lastError);
        } else {
          resolve();
        }
      });
    });
  },

  // Listen for changes
  onChanged: {
    addListener: (callback) => {
      browserAPI.storage.onChanged.addListener((changes, areaName) => {
        if (areaName === 'local') {
          callback(changes);
        }
      });
    }
  }
};

/**
 * Universal Tabs API
 */
export const tabs = {
  query: (queryInfo) => {
    return new Promise((resolve) => {
      browserAPI.tabs.query(queryInfo, resolve);
    });
  },

  getCurrent: () => {
    return new Promise((resolve) => {
      browserAPI.tabs.getCurrent(resolve);
    });
  },

  sendMessage: (tabId, message) => {
    return new Promise((resolve) => {
      browserAPI.tabs.sendMessage(tabId, message, resolve);
    });
  },

  onActivated: browserAPI.tabs.onActivated,
  onRemoved: browserAPI.tabs.onRemoved
};

/**
 * Universal Notifications API
 */
export const notifications = {
  create: (notificationId, options) => {
    return new Promise((resolve) => {
      browserAPI.notifications.create(notificationId, options, resolve);
    });
  },

  clear: (notificationId) => {
    return new Promise((resolve) => {
      browserAPI.notifications.clear(notificationId, resolve);
    });
  }
};

/**
 * Universal Alarms API (for timer persistence)
 */
export const alarms = {
  create: (name, alarmInfo) => {
    browserAPI.alarms.create(name, alarmInfo);
  },

  clear: (name) => {
    return new Promise((resolve) => {
      browserAPI.alarms.clear(name, resolve);
    });
  },

  onAlarm: browserAPI.alarms.onAlarm
};

/**
 * Universal Runtime API
 */
export const runtime = {
  sendMessage: (message) => {
    return new Promise((resolve) => {
      browserAPI.runtime.sendMessage(message, resolve);
    });
  },

  onMessage: browserAPI.runtime.onMessage,

  getURL: (path) => {
    return browserAPI.runtime.getURL(path);
  }
};

export default {
  storage,
  tabs,
  notifications,
  alarms,
  runtime
};
```

### 2. Background Service Worker

**File:** `extension/background/service-worker.js`

```javascript
/**
 * FocusBubble Background Service Worker
 * Manages timer state, persistence, and notifications
 */

import { storage, notifications, alarms, runtime, tabs } from '../shared/api-bridge.js';

// Timer state
let timerState = {
  isRunning: false,
  timeRemaining: 0,
  duration: 25 * 60, // 25 minutes default
  startTime: null,
  distractionCount: 0,
  currentSessionStart: null
};

// Initialize on install
self.addEventListener('install', () => {
  console.log('FocusBubble service worker installed');
  self.skipWaiting();
});

// Load saved state on activation
self.addEventListener('activate', async () => {
  console.log('FocusBubble service worker activated');
  await loadTimerState();
  self.clients.claim();
});

/**
 * Load timer state from storage
 */
async function loadTimerState() {
  try {
    const data = await storage.get(['timerState']);
    if (data.timerState) {
      timerState = { ...timerState, ...data.timerState };

      // Resume timer if it was running
      if (timerState.isRunning && timerState.startTime) {
        const elapsed = Math.floor((Date.now() - timerState.startTime) / 1000);
        timerState.timeRemaining = Math.max(0, timerState.timeRemaining - elapsed);

        if (timerState.timeRemaining > 0) {
          startTimerAlarm();
        } else {
          await handleTimerComplete();
        }
      }
    }
  } catch (error) {
    console.error('Failed to load timer state:', error);
  }
}

/**
 * Save timer state to storage
 */
async function saveTimerState() {
  try {
    await storage.set({ timerState });
  } catch (error) {
    console.error('Failed to save timer state:', error);
  }
}

/**
 * Start timer
 */
async function startTimer(duration) {
  timerState = {
    isRunning: true,
    timeRemaining: duration,
    duration,
    startTime: Date.now(),
    distractionCount: 0,
    currentSessionStart: Date.now()
  };

  await saveTimerState();
  startTimerAlarm();
  broadcastStateUpdate();
}

/**
 * Pause timer
 */
async function pauseTimer() {
  if (!timerState.isRunning) return;

  // Calculate remaining time
  const elapsed = Math.floor((Date.now() - timerState.startTime) / 1000);
  timerState.timeRemaining = Math.max(0, timerState.timeRemaining - elapsed);
  timerState.isRunning = false;
  timerState.startTime = null;

  await alarms.clear('focusBubbleTimer');
  await saveTimerState();
  broadcastStateUpdate();
}

/**
 * Resume timer
 */
async function resumeTimer() {
  if (timerState.timeRemaining <= 0) return;

  timerState.isRunning = true;
  timerState.startTime = Date.now();

  await saveTimerState();
  startTimerAlarm();
  broadcastStateUpdate();
}

/**
 * Reset timer
 */
async function resetTimer() {
  timerState = {
    isRunning: false,
    timeRemaining: timerState.duration,
    duration: timerState.duration,
    startTime: null,
    distractionCount: 0,
    currentSessionStart: null
  };

  await alarms.clear('focusBubbleTimer');
  await saveTimerState();
  broadcastStateUpdate();
}

/**
 * Start alarm for timer completion
 */
function startTimerAlarm() {
  const delayInMinutes = timerState.timeRemaining / 60;
  alarms.create('focusBubbleTimer', {
    delayInMinutes
  });
}

/**
 * Handle timer completion
 */
async function handleTimerComplete() {
  timerState.isRunning = false;
  timerState.timeRemaining = 0;

  // Save session to stats
  await saveSession();

  // Show notification
  await notifications.create('focusComplete', {
    type: 'basic',
    iconUrl: runtime.getURL('icons/icon128.png'),
    title: 'Focus Session Complete!',
    message: 'Great work! Take a break and recharge.',
    priority: 2
  });

  await saveTimerState();
  broadcastStateUpdate();
}

/**
 * Save completed session
 */
async function saveSession() {
  try {
    const data = await storage.get(['sessions']);
    const sessions = data.sessions || [];

    sessions.push({
      date: new Date().toISOString(),
      duration: timerState.duration,
      distractions: timerState.distractionCount,
      completed: true
    });

    await storage.set({ sessions });
  } catch (error) {
    console.error('Failed to save session:', error);
  }
}

/**
 * Record distraction
 */
async function recordDistraction() {
  timerState.distractionCount++;
  await saveTimerState();
  broadcastStateUpdate();
}

/**
 * Broadcast state to all connected clients
 */
function broadcastStateUpdate() {
  // Send to popup
  runtime.sendMessage({
    type: 'TIMER_STATE_UPDATE',
    state: timerState
  }).catch(() => {
    // Popup might not be open
  });

  // Send to all content scripts
  tabs.query({}).then(tabs => {
    tabs.forEach(tab => {
      tabs.sendMessage(tab.id, {
        type: 'TIMER_STATE_UPDATE',
        state: timerState
      }).catch(() => {
        // Tab might not have content script
      });
    });
  });
}

/**
 * Listen for messages from popup and content scripts
 */
runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'START_TIMER':
      startTimer(message.duration);
      sendResponse({ success: true });
      break;

    case 'PAUSE_TIMER':
      pauseTimer();
      sendResponse({ success: true });
      break;

    case 'RESUME_TIMER':
      resumeTimer();
      sendResponse({ success: true });
      break;

    case 'RESET_TIMER':
      resetTimer();
      sendResponse({ success: true });
      break;

    case 'GET_TIMER_STATE':
      sendResponse({ state: timerState });
      break;

    case 'RECORD_DISTRACTION':
      recordDistraction();
      sendResponse({ success: true });
      break;

    default:
      sendResponse({ error: 'Unknown message type' });
  }

  return true; // Keep channel open for async response
});

/**
 * Listen for alarm (timer completion)
 */
alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'focusBubbleTimer') {
    handleTimerComplete();
  }
});

/**
 * Detect tab switches (potential distractions)
 */
tabs.onActivated.addListener(async (activeInfo) => {
  if (timerState.isRunning) {
    await recordDistraction();
    await pauseTimer();

    // Show gentle reminder
    await notifications.create('focusInterrupted', {
      type: 'basic',
      iconUrl: runtime.getURL('icons/icon48.png'),
      title: 'Focus Interrupted',
      message: 'You switched tabs. Resume when ready!',
      priority: 1
    });
  }
});

console.log('FocusBubble service worker ready');
```

---

## 📱 Popup UI Integration

### File: `extension/popup/popup.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FocusBubble</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div id="root"></div>
  <script type="module" src="popup.js"></script>
</body>
</html>
```

### File: `extension/popup/popup.js`

```javascript
/**
 * FocusBubble Popup Entry Point
 * Reuses your existing React components!
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { runtime } from '../shared/api-bridge.js';
import FocusApp from './components/FocusApp.jsx';
import './styles.css';

// Render React app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <FocusApp />
  </React.StrictMode>
);

// Listen for timer state updates from background
runtime.onMessage.addListener((message) => {
  if (message.type === 'TIMER_STATE_UPDATE') {
    // Update React state via event
    window.dispatchEvent(new CustomEvent('timerStateUpdate', {
      detail: message.state
    }));
  }
});
```

---

## 🎈 Floating Bubble Overlay

### File: `extension/content/content.js`

```javascript
/**
 * Content Script - Injects floating timer bubble
 */

import { runtime } from '../shared/api-bridge.js';

// Create floating bubble container
function injectFloatingBubble() {
  // Check if already injected
  if (document.getElementById('focusbubble-overlay')) return;

  // Create container
  const container = document.createElement('div');
  container.id = 'focusbubble-overlay';
  container.className = 'focusbubble-container';

  // Initial position (top-right)
  container.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 999999;
    width: 120px;
    height: 120px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 50%;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: move;
    user-select: none;
    transition: transform 0.2s;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  `;

  // Timer display
  const timerDisplay = document.createElement('div');
  timerDisplay.id = 'focusbubble-timer';
  timerDisplay.style.cssText = `
    color: white;
    font-size: 24px;
    font-weight: bold;
    text-align: center;
  `;
  timerDisplay.textContent = '25:00';

  container.appendChild(timerDisplay);
  document.body.appendChild(container);

  // Make draggable
  makeDraggable(container);

  // Listen for state updates
  runtime.onMessage.addListener((message) => {
    if (message.type === 'TIMER_STATE_UPDATE') {
      updateBubbleDisplay(message.state);
    }
  });

  // Get initial state
  runtime.sendMessage({ type: 'GET_TIMER_STATE' }).then(response => {
    if (response.state) {
      updateBubbleDisplay(response.state);
    }
  });
}

/**
 * Update bubble display
 */
function updateBubbleDisplay(state) {
  const timerDisplay = document.getElementById('focusbubble-timer');
  if (!timerDisplay) return;

  const minutes = Math.floor(state.timeRemaining / 60);
  const seconds = state.timeRemaining % 60;
  timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // Update bubble color based on state
  const container = document.getElementById('focusbubble-overlay');
  if (state.isRunning) {
    container.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  } else {
    container.style.background = 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)';
  }
}

/**
 * Make bubble draggable
 */
function makeDraggable(element) {
  let isDragging = false;
  let currentX;
  let currentY;
  let initialX;
  let initialY;

  element.addEventListener('mousedown', (e) => {
    isDragging = true;
    initialX = e.clientX - element.offsetLeft;
    initialY = e.clientY - element.offsetTop;
    element.style.transform = 'scale(0.95)';
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      e.preventDefault();
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;
      element.style.left = currentX + 'px';
      element.style.top = currentY + 'px';
      element.style.right = 'auto';
    }
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      element.style.transform = 'scale(1)';
    }
  });
}

// Inject bubble when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectFloatingBubble);
} else {
  injectFloatingBubble();
}
```

---

## 🎨 Icon Generation Prompts

### For Midjourney / DALL-E

```
"Minimalist logo for FocusBubble app: soft floating bubble with subtle light blue gradient, clean sans-serif text, friendly and professional, transparent background, icon optimized for 128x128px"

"3D rendered cloud-bubble hybrid icon, pastel blue and white colors, soft glow effect, perfect circle shape, productivity app aesthetic, high resolution"

"Simple geometric bubble logo: overlapping circles forming a brain or target pattern, gradient from sky blue to indigo, modern flat design, scalable vector style"
```

---

## 📦 Build & Distribution

### Chrome Web Store
1. Zip extension folder
2. Upload to [Chrome Developer Dashboard](https://chrome.google.com/webstore/devconsole)
3. Fill in store listing
4. Submit for review

### Firefox Add-ons
1. Create account at [addons.mozilla.org](https://addons.mozilla.org/developers/)
2. Submit extension
3. Wait for automated + manual review

### Microsoft Edge Add-ons
1. Use same package as Chrome
2. Submit to [Edge Add-ons](https://partner.microsoft.com/dashboard/microsoftedge/overview)

---

## 🎯 Next Steps

1. ✅ Set up extension structure
2. ✅ Create manifest.json
3. ⬜ Build popup UI (reuse React components)
4. ⬜ Implement background service worker
5. ⬜ Add floating bubble content script
6. ⬜ Test in Chrome/Edge
7. ⬜ Test in Firefox
8. ⬜ Generate icons
9. ⬜ Submit to stores

---

**Your AI Insights module is PERFECT for this extension!** Just import it into the popup and it works immediately. 🚀
