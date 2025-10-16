/**
 * FocusBubble Background Service Worker
 *
 * Manages timer state, persists data, handles notifications
 * Runs independently of popup/content scripts
 *
 * Key responsibilities:
 * - Timer logic (start/pause/resume/reset)
 * - Session tracking and statistics
 * - Distraction detection via tab switching
 * - Alarm management for timer completion
 * - Data persistence to storage
 *
 * @author Chase Elkins
 */

import { storage, tabs, notifications, alarms, runtime } from '../shared/browser-api.js';

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

/**
 * Timer state - persisted to storage
 */
let timerState = {
  isRunning: false,
  timeRemaining: 0,           // seconds
  duration: 25 * 60,          // default 25 minutes
  startTime: null,            // timestamp when started
  pausedAt: null,             // timestamp when paused
  sessionId: null,            // current session ID
  distractionCount: 0,        // distractions in current session
  currentSessionStart: null   // when current session started
};

/**
 * Session history for analytics
 */
let sessions = [];

/**
 * Settings
 */
let settings = {
  defaultDuration: 25,        // minutes
  notificationsEnabled: true,
  soundEnabled: false,
  autoStartBreak: false,
  floatingBubbleEnabled: true
};

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize background script
 */
async function initializeBackground() {
  console.log('[FocusBubble] Background script initializing...');

  // Load saved state from storage
  await loadState();

  // Resume timer if it was running
  if (timerState.isRunning && timerState.startTime) {
    await resumeTimerAfterRestart();
  }

  console.log('[FocusBubble] Background script initialized');
}

// For service workers (Chrome)
if (typeof self !== 'undefined' && self.addEventListener) {
  self.addEventListener('install', (event) => {
    console.log('[FocusBubble] Service worker installed');
    self.skipWaiting();
  });

  self.addEventListener('activate', async (event) => {
    console.log('[FocusBubble] Service worker activated');
    await initializeBackground();
    if (self.clients && self.clients.claim) {
      self.clients.claim();
    }
  });
}

// For background scripts (Firefox) - run immediately
if (typeof browser !== 'undefined' || (typeof chrome !== 'undefined' && chrome.runtime)) {
  // Initialize immediately for background scripts
  initializeBackground();
}

/**
 * Load state from storage
 */
async function loadState() {
  try {
    const data = await storage.get(['timerState', 'sessions', 'settings']);

    if (data.timerState) {
      timerState = { ...timerState, ...data.timerState };
    }

    if (data.sessions) {
      sessions = data.sessions;
    }

    if (data.settings) {
      settings = { ...settings, ...data.settings };
    }

    console.log('[FocusBubble] State loaded:', { timerState, sessions: sessions.length, settings });
  } catch (error) {
    console.error('[FocusBubble] Failed to load state:', error);
  }
}

/**
 * Save state to storage
 */
async function saveState() {
  try {
    await storage.set({
      timerState,
      sessions: sessions.slice(-1000), // Keep last 1000 sessions
      settings
    });
  } catch (error) {
    console.error('[FocusBubble] Failed to save state:', error);
  }
}

/**
 * Resume timer after service worker restart
 */
async function resumeTimerAfterRestart() {
  const elapsed = Math.floor((Date.now() - timerState.startTime) / 1000);
  timerState.timeRemaining = Math.max(0, timerState.timeRemaining - elapsed);

  if (timerState.timeRemaining > 0) {
    console.log('[FocusBubble] Resuming timer:', timerState.timeRemaining, 'seconds remaining');
    startTimerAlarm();
    broadcastState();
  } else {
    console.log('[FocusBubble] Timer completed while service worker was inactive');
    await handleTimerComplete();
  }
}

// ============================================================================
// TIMER LOGIC
// ============================================================================

/**
 * Start timer with specified duration
 */
async function startTimer(duration) {
  const durationInSeconds = duration * 60;

  timerState = {
    isRunning: true,
    timeRemaining: durationInSeconds,
    duration: durationInSeconds,
    startTime: Date.now(),
    pausedAt: null,
    sessionId: generateSessionId(),
    distractionCount: 0,
    currentSessionStart: Date.now()
  };

  await saveState();
  startTimerAlarm();
  startTimerUpdates(); // Start 1-second interval
  broadcastState();

  console.log('[FocusBubble] Timer started:', duration, 'minutes');
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
  timerState.pausedAt = Date.now();
  timerState.startTime = null;

  await alarms.clear('focusBubbleTimer');
  stopTimerUpdates(); // Stop 1-second interval
  await saveState();
  broadcastState();

  console.log('[FocusBubble] Timer paused:', timerState.timeRemaining, 'seconds remaining');
}

/**
 * Resume paused timer
 */
async function resumeTimer() {
  if (timerState.isRunning || timerState.timeRemaining <= 0) return;

  timerState.isRunning = true;
  timerState.startTime = Date.now();
  timerState.pausedAt = null;

  await saveState();
  startTimerAlarm();
  startTimerUpdates(); // Start 1-second interval
  broadcastState();

  console.log('[FocusBubble] Timer resumed:', timerState.timeRemaining, 'seconds remaining');
}

/**
 * Reset timer to initial duration
 */
async function resetTimer() {
  timerState = {
    isRunning: false,
    timeRemaining: timerState.duration,
    duration: timerState.duration,
    startTime: null,
    pausedAt: null,
    sessionId: null,
    distractionCount: 0,
    currentSessionStart: null
  };

  await alarms.clear('focusBubbleTimer');
  await saveState();
  broadcastState();

  console.log('[FocusBubble] Timer reset');
}

/**
 * Start alarm for timer completion
 */
function startTimerAlarm() {
  const delayInMinutes = timerState.timeRemaining / 60;

  alarms.create('focusBubbleTimer', {
    delayInMinutes
  });

  console.log('[FocusBubble] Alarm set for', delayInMinutes, 'minutes');
}

/**
 * Handle timer completion
 */
async function handleTimerComplete() {
  console.log('[FocusBubble] Timer completed!');

  timerState.isRunning = false;
  timerState.timeRemaining = 0;

  // Save completed session
  await saveSession({
    startTime: new Date(timerState.currentSessionStart),
    endTime: new Date(),
    duration: timerState.duration,
    distractions: timerState.distractionCount,
    completed: true
  });

  // Show completion notification
  if (settings.notificationsEnabled) {
    await showNotification('sessionComplete', {
      type: 'basic',
      iconUrl: runtime.getURL('icons/icon128.png'),
      title: 'Focus Session Complete! 🎉',
      message: `Great work! You focused for ${Math.round(timerState.duration / 60)} minutes.`,
      priority: 2
    });
  }

  await saveState();
  broadcastState();
}

// ============================================================================
// SESSION MANAGEMENT
// ============================================================================

/**
 * Save completed session
 */
async function saveSession(session) {
  sessions.push({
    id: timerState.sessionId || generateSessionId(),
    ...session
  });

  console.log('[FocusBubble] Session saved:', session);
  await saveState();
}

/**
 * Generate unique session ID
 */
function generateSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Record distraction
 */
async function recordDistraction(type = 'tab_switch') {
  if (!timerState.isRunning) return;

  timerState.distractionCount++;

  console.log('[FocusBubble] Distraction recorded:', type, '(total:', timerState.distractionCount, ')');

  await saveState();
  broadcastState();
}

// ============================================================================
// MESSAGING
// ============================================================================

/**
 * Broadcast state to all connected clients (popup, content scripts)
 */
function broadcastState() {
  const message = {
    type: 'TIMER_STATE_UPDATE',
    state: { ...timerState }
  };

  // Send to popup (if open)
  runtime.sendMessage(message).catch(() => {
    // Popup might not be open, ignore error
  });

  // Send to all tabs with content script
  tabs.query({}).then(allTabs => {
    allTabs.forEach(tab => {
      tabs.sendMessage(tab.id, message).catch(() => {
        // Tab might not have content script, ignore error
      });
    });
  });
}

/**
 * Handle messages from popup and content scripts
 */
runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('[FocusBubble] Message received:', message.type);

  // Handle async operations
  (async () => {
    try {
      switch (message.type) {
        case 'START_TIMER':
          await startTimer(message.duration || settings.defaultDuration);
          sendResponse({ success: true, state: timerState });
          break;

        case 'PAUSE_TIMER':
          await pauseTimer();
          sendResponse({ success: true, state: timerState });
          break;

        case 'RESUME_TIMER':
          await resumeTimer();
          sendResponse({ success: true, state: timerState });
          break;

        case 'RESET_TIMER':
          await resetTimer();
          sendResponse({ success: true, state: timerState });
          break;

        case 'GET_STATE':
          sendResponse({ state: timerState, sessions, settings });
          break;

        case 'RECORD_DISTRACTION':
          await recordDistraction(message.distractionType);
          sendResponse({ success: true });
          break;

        case 'UPDATE_SETTINGS':
          settings = { ...settings, ...message.settings };
          await saveState();
          sendResponse({ success: true, settings });
          break;

        case 'GET_SESSIONS':
          sendResponse({ sessions });
          break;

        default:
          sendResponse({ error: 'Unknown message type: ' + message.type });
      }
    } catch (error) {
      console.error('[FocusBubble] Error handling message:', error);
      sendResponse({ error: error.message });
    }
  })();

  return true; // Keep channel open for async response
});

// ============================================================================
// ALARMS
// ============================================================================

/**
 * Handle alarm triggers (timer completion)
 */
alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'focusBubbleTimer') {
    handleTimerComplete();
  }
});

// ============================================================================
// TAB MONITORING (Distraction Detection)
// ============================================================================

/**
 * Detect tab switches as potential distractions
 */
tabs.onActivated.addListener(async (activeInfo) => {
  if (timerState.isRunning) {
    console.log('[FocusBubble] Tab switched - recording distraction');
    await recordDistraction('tab_switch');

    // Auto-pause (optional)
    // await pauseTimer();
  }
});

/**
 * Detect window focus loss
 */
// Note: Service workers don't have direct window access
// This is handled by content script via Page Visibility API

// ============================================================================
// NOTIFICATIONS
// ============================================================================

/**
 * Show notification helper
 */
async function showNotification(id, options) {
  try {
    await notifications.create(id, options);
  } catch (error) {
    console.error('[FocusBubble] Failed to show notification:', error);
  }
}

/**
 * Handle notification clicks
 */
notifications.onClicked.addListener((notificationId) => {
  if (notificationId === 'sessionComplete') {
    // Open popup or dashboard
    console.log('[FocusBubble] User clicked completion notification');
  }
});

// ============================================================================
// PERIODIC SYNC AND TIMER UPDATES
// ============================================================================

// Save state every 30 seconds
alarms.create('stateSyncAlarm', {
  periodInMinutes: 0.5
});

// Update timer every second when running
let timerUpdateInterval = null;

function startTimerUpdates() {
  if (timerUpdateInterval) return;

  timerUpdateInterval = setInterval(() => {
    if (timerState.isRunning && timerState.startTime) {
      // Calculate current remaining time
      const elapsed = Math.floor((Date.now() - timerState.startTime) / 1000);
      const currentRemaining = Math.max(0, timerState.timeRemaining - elapsed);

      // Broadcast current state
      broadcastState();

      // Check if timer completed
      if (currentRemaining <= 0) {
        stopTimerUpdates();
        handleTimerComplete();
      }
    } else {
      stopTimerUpdates();
    }
  }, 1000); // Every second
}

function stopTimerUpdates() {
  if (timerUpdateInterval) {
    clearInterval(timerUpdateInterval);
    timerUpdateInterval = null;
  }
}

alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'stateSyncAlarm') {
    saveState();
  }
});

// ============================================================================
// INITIALIZATION COMPLETE
// ============================================================================

console.log('[FocusBubble] Background service worker initialized');
