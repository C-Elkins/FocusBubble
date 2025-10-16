/**
 * FocusBubble - Background Service Worker
 * 
 * Handles core extension functionality:
 * - Timer management (start/pause/resume/stop/reset)
 * - Alarms API for precise timing
 * - Message passing between popup and content scripts
 * - Persistent state storage
 * - Session tracking and statistics
 * - Event logging
 * 
 * Cross-browser compatible: Chrome, Edge, Firefox, Opera
 * 
 * @author Krubles Team
 * @version 1.0.0
 */

// ============================================================================
// IMPORTS - Using unified browserApi for cross-browser compatibility
// ============================================================================

import {
  getStorage,
  setStorage,
  onMessage,
  createNotification,
  createAlarm,
  clearAlarm,
  onAlarm,
  queryTabs,
  sendMessage,
  getBrowser
} from '../shared/browserApi.js';

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

/**
 * Global timer state
 * Tracks current session progress and metadata
 */
let timerState = {
  isActive: false,          // Whether timer is currently running
  isPaused: false,          // Whether timer is paused
  startTime: null,          // Unix timestamp when timer started
  pauseTime: null,          // Unix timestamp when timer was paused
  duration: 25 * 60 * 1000, // Total duration in ms (default 25 min)
  remainingTime: null,      // Time remaining in ms
  distractions: 0,          // Number of distractions in this session
  sessionId: null,          // Unique session identifier
  mode: 'focus'             // 'focus', 'short-break', or 'long-break'
};

/**
 * Event log for debugging and analytics
 * Stores recent events with timestamps
 */
const eventLog = [];
const MAX_LOG_SIZE = 100;

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize extension on install or update
 * Sets up default settings and storage structure
 */
const api = typeof browser !== 'undefined' ? browser : chrome;

api.runtime.onInstalled.addListener(async (details) => {
  logEvent('EXTENSION_INSTALLED', { reason: details.reason });

  try {
    if (details.reason === 'install') {
      // First-time installation - set up defaults
      await setStorage({
        settings: {
          defaultFocusDuration: 25,      // Minutes
          shortBreakDuration: 5,         // Minutes
          longBreakDuration: 15,         // Minutes
          sessionsUntilLongBreak: 4,     // Number of focus sessions
          notificationsEnabled: true,
          soundEnabled: true,
          autoStartBreaks: false,
          autoStartPomodoros: false,
          darkMode: false,
          aiInsightsEnabled: false
        },
        sessions: [],
        stats: {
          totalSessions: 0,
          completedSessions: 0,
          totalFocusTime: 0,
          totalDistractions: 0,
          currentStreak: 0,
          longestStreak: 0,
          lastSessionDate: null
        },
        version: '1.0.0'
      });

      logEvent('DEFAULT_SETTINGS_SAVED');
      console.log('✅ FocusBubble installed successfully!');
    } else if (details.reason === 'update') {
      // Extension updated - migrate data if needed
      logEvent('EXTENSION_UPDATED', { 
        previousVersion: details.previousVersion 
      });
      console.log('✅ FocusBubble updated to v1.0.0');
    }
  } catch (error) {
    logEvent('INITIALIZATION_ERROR', { error: error.message });
    console.error('❌ Error during initialization:', error);
  }
});

// ============================================================================
// MESSAGE HANDLING
// ============================================================================

/**
 * Central message handler
 * Routes messages from popup and content scripts to appropriate handlers
 */
onMessage(async (message, sender) => {
  logEvent('MESSAGE_RECEIVED', { type: message.type, sender: sender.id });

  try {
    switch (message.type) {
      // Timer control messages
      case 'START_TIMER':
        return await handleStartTimer(message.duration, message.mode);
      
      case 'PAUSE_TIMER':
        return await handlePauseTimer();
      
      case 'RESUME_TIMER':
        return await handleResumeTimer();
      
      case 'STOP_TIMER':
        return await handleStopTimer(message.saveSession);
      
      case 'RESET_TIMER':
        return await handleResetTimer();
      
      // State queries
      case 'GET_STATE':
        return { success: true, state: getTimerState() };
      
      case 'GET_STATS':
        return await handleGetStats();
      
      case 'GET_SESSIONS':
        return await handleGetSessions(message.limit);
      
      // Distraction tracking
      case 'DISTRACTION_DETECTED':
        return await handleDistraction(message.data);
      
      // Settings
      case 'UPDATE_SETTINGS':
        return await handleUpdateSettings(message.settings);
      
      case 'GET_SETTINGS':
        return await handleGetSettings();
      
      // Session management
      case 'DELETE_SESSION':
        return await handleDeleteSession(message.sessionId);
      
      case 'CLEAR_ALL_DATA':
        return await handleClearAllData();
      
      default:
        logEvent('UNKNOWN_MESSAGE_TYPE', { type: message.type });
        return { success: false, error: `Unknown message type: ${message.type}` };
    }
  } catch (error) {
    logEvent('MESSAGE_HANDLER_ERROR', { 
      type: message.type, 
      error: error.message 
    });
    console.error('❌ Error handling message:', error);
    return { success: false, error: error.message };
  }
});

// ============================================================================
// TIMER CONTROL FUNCTIONS
// ============================================================================

/**
 * Start a new timer session
 * 
 * @param {number} duration - Duration in minutes
 * @param {string} mode - Timer mode: 'focus', 'short-break', 'long-break'
 * @returns {Promise<Object>} - Response with success status and new state
 */
async function handleStartTimer(duration = 25, mode = 'focus') {
  try {
    // Validate input
    if (typeof duration !== 'number' || duration <= 0) {
      throw new Error('Invalid duration');
    }

    // Stop any existing timer
    if (timerState.isActive || timerState.isPaused) {
      await handleStopTimer(false);
    }

    // Initialize new timer state
    timerState = {
      isActive: true,
      isPaused: false,
      startTime: Date.now(),
      pauseTime: null,
      duration: duration * 60 * 1000, // Convert to ms
      remainingTime: duration * 60 * 1000,
      distractions: 0,
      sessionId: generateSessionId(),
      mode: mode
    };

    // Create alarm for timer completion
    createAlarm('focusTimer', {
      delayInMinutes: duration
    });

    // Start tick alarm for UI updates (every second)
    createAlarm('timerTick', {
      periodInMinutes: 1 / 60 // 1 second
    });

    // Save state to storage for persistence
    await saveTimerState();

    // Notify all tabs
    await broadcastToTabs({ 
      type: 'TIMER_STARTED', 
      state: getTimerState() 
    });

    logEvent('TIMER_STARTED', { 
      duration, 
      mode, 
      sessionId: timerState.sessionId 
    });

    console.log(`✅ Timer started: ${duration} minutes (${mode})`);

    return { success: true, state: getTimerState() };
  } catch (error) {
    logEvent('START_TIMER_ERROR', { error: error.message });
    console.error('❌ Error starting timer:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Pause the active timer
 * Preserves remaining time for resumption
 * 
 * @returns {Promise<Object>} - Response with success status
 */
async function handlePauseTimer() {
  try {
    if (!timerState.isActive) {
      return { success: false, error: 'No active timer to pause' };
    }

    if (timerState.isPaused) {
      return { success: false, error: 'Timer already paused' };
    }

    // Calculate and save remaining time
    timerState.isPaused = true;
    timerState.pauseTime = Date.now();
    timerState.remainingTime = calculateRemainingTime();

    // Clear alarms
    await clearAlarm('focusTimer');
    await clearAlarm('timerTick');

    // Save state
    await saveTimerState();

    // Notify all tabs
    await broadcastToTabs({ 
      type: 'TIMER_PAUSED', 
      state: getTimerState() 
    });

    logEvent('TIMER_PAUSED', { 
      remainingTime: timerState.remainingTime,
      sessionId: timerState.sessionId 
    });

    console.log('⏸️ Timer paused');

    return { success: true, state: getTimerState() };
  } catch (error) {
    logEvent('PAUSE_TIMER_ERROR', { error: error.message });
    console.error('❌ Error pausing timer:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Resume a paused timer
 * Continues from remaining time
 * 
 * @returns {Promise<Object>} - Response with success status
 */
async function handleResumeTimer() {
  try {
    if (!timerState.isActive || !timerState.isPaused) {
      return { success: false, error: 'No paused timer to resume' };
    }

    // Resume timer with remaining time
    timerState.isPaused = false;
    timerState.startTime = Date.now();
    timerState.pauseTime = null;

    // Create new alarms for remaining time
    const remainingMinutes = timerState.remainingTime / (60 * 1000);
    createAlarm('focusTimer', {
      delayInMinutes: remainingMinutes
    });

    createAlarm('timerTick', {
      periodInMinutes: 1 / 60
    });

    // Save state
    await saveTimerState();

    // Notify all tabs
    await broadcastToTabs({ 
      type: 'TIMER_RESUMED', 
      state: getTimerState() 
    });

    logEvent('TIMER_RESUMED', { 
      remainingTime: timerState.remainingTime,
      sessionId: timerState.sessionId 
    });

    console.log('▶️ Timer resumed');

    return { success: true, state: getTimerState() };
  } catch (error) {
    logEvent('RESUME_TIMER_ERROR', { error: error.message });
    console.error('❌ Error resuming timer:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Stop the active timer
 * Optionally saves session data
 * 
 * @param {boolean} saveSession - Whether to save session to history
 * @returns {Promise<Object>} - Response with success status
 */
async function handleStopTimer(saveSession = true) {
  try {
    if (!timerState.isActive && !timerState.isPaused) {
      return { success: false, error: 'No active timer to stop' };
    }

    const sessionData = { ...timerState };
    const wasActive = timerState.isActive && !timerState.isPaused;

    // Reset state
    timerState = {
      isActive: false,
      isPaused: false,
      startTime: null,
      pauseTime: null,
      duration: 25 * 60 * 1000,
      remainingTime: null,
      distractions: 0,
      sessionId: null,
      mode: 'focus'
    };

    // Clear all alarms
    await clearAlarm('focusTimer');
    await clearAlarm('timerTick');

    // Save state
    await saveTimerState();

    // Save session if requested
    if (saveSession && sessionData.sessionId) {
      await saveSessionToHistory(sessionData, false);
    }

    // Notify all tabs
    await broadcastToTabs({ 
      type: 'TIMER_STOPPED', 
      state: getTimerState() 
    });

    logEvent('TIMER_STOPPED', { 
      sessionId: sessionData.sessionId,
      wasActive 
    });

    console.log('⏹️ Timer stopped');

    return { success: true, state: getTimerState() };
  } catch (error) {
    logEvent('STOP_TIMER_ERROR', { error: error.message });
    console.error('❌ Error stopping timer:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Reset timer to default state without saving
 * 
 * @returns {Promise<Object>} - Response with success status
 */
async function handleResetTimer() {
  try {
    await handleStopTimer(false); // Stop without saving
    
    logEvent('TIMER_RESET');
    console.log('🔄 Timer reset');

    return { success: true, state: getTimerState() };
  } catch (error) {
    logEvent('RESET_TIMER_ERROR', { error: error.message });
    console.error('❌ Error resetting timer:', error);
    return { success: false, error: error.message };
  }
}

// ============================================================================
// ALARM HANDLING
// ============================================================================

/**
 * Handle alarm events
 * Processes timer completion and tick updates
 */
onAlarm(async (alarm) => {
  try {
    if (alarm.name === 'focusTimer') {
      // Timer has completed
      await handleTimerComplete();
    } else if (alarm.name === 'timerTick') {
      // Update timer state every second
      await handleTimerTick();
    }
  } catch (error) {
    logEvent('ALARM_HANDLER_ERROR', { 
      alarm: alarm.name, 
      error: error.message 
    });
    console.error('❌ Error handling alarm:', error);
  }
});

/**
 * Handle timer completion
 * Saves session, shows notification, updates stats
 */
async function handleTimerComplete() {
  try {
    const sessionData = { ...timerState };

    // Mark as inactive
    timerState.isActive = false;
    timerState.remainingTime = 0;

    // Clear tick alarm
    await clearAlarm('timerTick');

    // Save completed session
    await saveSessionToHistory(sessionData, true);

    // Get settings for notification
    const { settings = {} } = await getStorage(['settings']);
    
    // Show completion notification
    if (settings.notificationsEnabled !== false) {
      const messages = {
        focus: {
          title: 'Focus Session Complete! 🎉',
          message: `Great work! You completed ${sessionData.duration / 60000} minutes with ${sessionData.distractions} distractions.`
        },
        'short-break': {
          title: 'Break Complete! ☕',
          message: 'Time to get back to work!'
        },
        'long-break': {
          title: 'Long Break Complete! 🌟',
          message: 'Feeling refreshed? Let\'s focus!'
        }
      };

      const notif = messages[sessionData.mode] || messages.focus;

      await createNotification('timer-complete', {
        title: notif.title,
        message: notif.message,
        iconUrl: '../icons/icon128.png'
      });
    }

    // Notify all tabs
    await broadcastToTabs({ 
      type: 'TIMER_COMPLETED', 
      state: getTimerState(),
      sessionData 
    });

    logEvent('TIMER_COMPLETED', { 
      sessionId: sessionData.sessionId,
      mode: sessionData.mode,
      distractions: sessionData.distractions 
    });

    console.log('✅ Timer completed!');
  } catch (error) {
    logEvent('TIMER_COMPLETE_ERROR', { error: error.message });
    console.error('❌ Error completing timer:', error);
  }
}

/**
 * Handle timer tick (every second)
 * Updates remaining time and broadcasts to tabs
 */
async function handleTimerTick() {
  if (!timerState.isActive || timerState.isPaused) {
    await clearAlarm('timerTick');
    return;
  }

  // Update remaining time
  timerState.remainingTime = calculateRemainingTime();

  // Check if timer should complete
  if (timerState.remainingTime <= 0) {
    await handleTimerComplete();
    return;
  }

  // Broadcast update to tabs
  await broadcastToTabs({
    type: 'TIMER_TICK',
    timeRemaining: timerState.remainingTime,
    state: getTimerState()
  });
}

// ============================================================================
// STORAGE FUNCTIONS
// ============================================================================

/**
 * Save current timer state to storage
 * Enables persistence across browser restarts
 */
async function saveTimerState() {
  try {
    await setStorage({ timerState: getTimerState() });
  } catch (error) {
    logEvent('SAVE_STATE_ERROR', { error: error.message });
    console.error('❌ Error saving timer state:', error);
  }
}

/**
 * Save completed or stopped session to history
 * Updates statistics
 * 
 * @param {Object} sessionData - Session information
 * @param {boolean} completed - Whether session was completed (not stopped early)
 */
async function saveSessionToHistory(sessionData, completed) {
  try {
    const { sessions = [], stats = {} } = await getStorage(['sessions', 'stats']);

    // Calculate actual time elapsed
    const endTime = Date.now();
    const actualDuration = sessionData.isPaused 
      ? (sessionData.pauseTime - sessionData.startTime)
      : (endTime - sessionData.startTime);

    // Create session record
    const session = {
      id: sessionData.sessionId,
      mode: sessionData.mode,
      startTime: sessionData.startTime,
      endTime: endTime,
      plannedDuration: sessionData.duration,
      actualDuration: actualDuration,
      distractions: sessionData.distractions,
      completed: completed,
      date: new Date(sessionData.startTime).toDateString()
    };

    // Add to sessions array (keep last 100)
    sessions.push(session);
    if (sessions.length > 100) {
      sessions.shift(); // Remove oldest
    }

    // Update statistics
    const newStats = {
      totalSessions: (stats.totalSessions || 0) + 1,
      completedSessions: (stats.completedSessions || 0) + (completed ? 1 : 0),
      totalFocusTime: (stats.totalFocusTime || 0) + (sessionData.mode === 'focus' ? actualDuration : 0),
      totalDistractions: (stats.totalDistractions || 0) + sessionData.distractions,
      lastSessionDate: new Date(sessionData.startTime).toDateString()
    };

    // Update streak
    if (completed && sessionData.mode === 'focus') {
      newStats.currentStreak = (stats.currentStreak || 0) + 1;
      newStats.longestStreak = Math.max(
        newStats.currentStreak,
        stats.longestStreak || 0
      );
    }

    // Save to storage
    await setStorage({ sessions, stats: newStats });

    logEvent('SESSION_SAVED', { 
      sessionId: session.id, 
      completed, 
      mode: session.mode 
    });

    console.log('💾 Session saved:', session.id);
  } catch (error) {
    logEvent('SAVE_SESSION_ERROR', { error: error.message });
    console.error('❌ Error saving session:', error);
  }
}

/**
 * Get statistics from storage
 * 
 * @returns {Promise<Object>} - Stats object
 */
async function handleGetStats() {
  try {
    const { stats = {} } = await getStorage(['stats']);
    return { success: true, stats };
  } catch (error) {
    logEvent('GET_STATS_ERROR', { error: error.message });
    return { success: false, error: error.message };
  }
}

/**
 * Get session history from storage
 * 
 * @param {number} limit - Maximum number of sessions to return
 * @returns {Promise<Object>} - Sessions array
 */
async function handleGetSessions(limit = 50) {
  try {
    const { sessions = [] } = await getStorage(['sessions']);
    const limited = sessions.slice(-limit).reverse(); // Most recent first
    return { success: true, sessions: limited };
  } catch (error) {
    logEvent('GET_SESSIONS_ERROR', { error: error.message });
    return { success: false, error: error.message };
  }
}

/**
 * Get settings from storage
 * 
 * @returns {Promise<Object>} - Settings object
 */
async function handleGetSettings() {
  try {
    const { settings = {} } = await getStorage(['settings']);
    return { success: true, settings };
  } catch (error) {
    logEvent('GET_SETTINGS_ERROR', { error: error.message });
    return { success: false, error: error.message };
  }
}

/**
 * Update settings in storage
 * 
 * @param {Object} newSettings - Settings to update
 * @returns {Promise<Object>} - Response with success status
 */
async function handleUpdateSettings(newSettings) {
  try {
    const { settings = {} } = await getStorage(['settings']);
    const updated = { ...settings, ...newSettings };
    await setStorage({ settings: updated });
    
    logEvent('SETTINGS_UPDATED', { keys: Object.keys(newSettings) });
    return { success: true, settings: updated };
  } catch (error) {
    logEvent('UPDATE_SETTINGS_ERROR', { error: error.message });
    return { success: false, error: error.message };
  }
}

/**
 * Delete a specific session from history
 * 
 * @param {string} sessionId - ID of session to delete
 * @returns {Promise<Object>} - Response with success status
 */
async function handleDeleteSession(sessionId) {
  try {
    const { sessions = [] } = await getStorage(['sessions']);
    const filtered = sessions.filter(s => s.id !== sessionId);
    await setStorage({ sessions: filtered });
    
    logEvent('SESSION_DELETED', { sessionId });
    return { success: true };
  } catch (error) {
    logEvent('DELETE_SESSION_ERROR', { error: error.message });
    return { success: false, error: error.message };
  }
}

/**
 * Clear all user data (sessions and stats)
 * Settings are preserved
 * 
 * @returns {Promise<Object>} - Response with success status
 */
async function handleClearAllData() {
  try {
    await setStorage({
      sessions: [],
      stats: {
        totalSessions: 0,
        completedSessions: 0,
        totalFocusTime: 0,
        totalDistractions: 0,
        currentStreak: 0,
        longestStreak: 0,
        lastSessionDate: null
      }
    });
    
    logEvent('ALL_DATA_CLEARED');
    console.log('🗑️ All data cleared');
    return { success: true };
  } catch (error) {
    logEvent('CLEAR_DATA_ERROR', { error: error.message });
    return { success: false, error: error.message };
  }
}

// ============================================================================
// DISTRACTION HANDLING
// ============================================================================

/**
 * Handle distraction detection from content script
 * Increments distraction counter for active session
 * 
 * @param {Object} data - Distraction data (url, title, etc.)
 * @returns {Promise<Object>} - Response with success status
 */
async function handleDistraction(data) {
  try {
    if (!timerState.isActive || timerState.isPaused) {
      return { success: false, error: 'No active timer' };
    }

    timerState.distractions++;
    
    logEvent('DISTRACTION_DETECTED', {
      sessionId: timerState.sessionId,
      count: timerState.distractions,
      url: data?.url
    });

    console.log(`⚠️ Distraction detected: ${timerState.distractions}`);

    // Notify all tabs
    await broadcastToTabs({
      type: 'DISTRACTION_COUNT_UPDATED',
      distractions: timerState.distractions
    });

    return { success: true, distractions: timerState.distractions };
  } catch (error) {
    logEvent('DISTRACTION_ERROR', { error: error.message });
    return { success: false, error: error.message };
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Calculate remaining time for active timer
 * Accounts for paused state
 * 
 * @returns {number} - Remaining time in milliseconds
 */
function calculateRemainingTime() {
  if (!timerState.startTime) {
    return timerState.duration;
  }

  if (timerState.isPaused && timerState.remainingTime !== null) {
    return timerState.remainingTime;
  }

  const elapsed = Date.now() - timerState.startTime;
  return Math.max(0, timerState.duration - elapsed);
}

/**
 * Get current timer state
 * Includes calculated remaining time
 * 
 * @returns {Object} - Complete timer state
 */
function getTimerState() {
  return {
    ...timerState,
    remainingTime: calculateRemainingTime(),
    progress: timerState.duration > 0 
      ? ((timerState.duration - calculateRemainingTime()) / timerState.duration) * 100 
      : 0
  };
}

/**
 * Generate unique session ID
 * 
 * @returns {string} - Unique session identifier
 */
function generateSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Broadcast message to all tabs
 * Silently fails for tabs without content script
 * 
 * @param {Object} message - Message to broadcast
 */
async function broadcastToTabs(message) {
  try {
    const tabs = await queryTabs({});
    for (const tab of tabs) {
      try {
        await sendMessage(message, { tabId: tab.id });
      } catch (error) {
        // Tab doesn't have content script - ignore
      }
    }
  } catch (error) {
    logEvent('BROADCAST_ERROR', { error: error.message });
  }
}

/**
 * Log event with timestamp
 * Maintains circular buffer of recent events
 * 
 * @param {string} eventType - Type of event
 * @param {Object} data - Additional event data
 */
function logEvent(eventType, data = {}) {
  const event = {
    type: eventType,
    timestamp: Date.now(),
    date: new Date().toISOString(),
    ...data
  };

  eventLog.push(event);

  // Keep log size manageable
  if (eventLog.length > MAX_LOG_SIZE) {
    eventLog.shift();
  }

  // Log to console in development
  if (process?.env?.NODE_ENV === 'development') {
    console.log(`[${event.date}] ${eventType}:`, data);
  }
}

/**
 * Get recent event log
 * Useful for debugging
 * 
 * @returns {Array} - Recent events
 */
function getEventLog() {
  return [...eventLog];
}

// ============================================================================
// RESTORE STATE ON STARTUP
// ============================================================================

/**
 * Restore timer state if browser was restarted during active session
 */
async function restoreState() {
  try {
    const stored = await getStorage(['timerState']);
    if (stored?.timerState?.isActive) {
      const saved = stored.timerState;
      
      // Check if timer should have completed while browser was closed
      const elapsed = Date.now() - saved.startTime;
      if (elapsed >= saved.duration) {
        // Timer completed while offline
        logEvent('TIMER_COMPLETED_OFFLINE');
        await handleTimerComplete();
      } else if (!saved.isPaused) {
        // Restore active timer
        timerState = { ...saved };
        timerState.remainingTime = saved.duration - elapsed;
        
        // Recreate alarms
        const remainingMinutes = timerState.remainingTime / (60 * 1000);
        createAlarm('focusTimer', { delayInMinutes: remainingMinutes });
        createAlarm('timerTick', { periodInMinutes: 1 / 60 });
        
        logEvent('STATE_RESTORED', { sessionId: timerState.sessionId });
        console.log('🔄 Timer state restored');
      }
    }
  } catch (error) {
    logEvent('RESTORE_STATE_ERROR', { error: error.message });
    console.error('❌ Error restoring state:', error);
  }
}

// Restore state on startup
restoreState();

// ============================================================================
// INITIALIZATION COMPLETE
// ============================================================================

logEvent('BACKGROUND_SCRIPT_LOADED', { browser: getBrowser() });
console.log(`✅ FocusBubble background script loaded (${getBrowser()})`);
console.log('📝 Ready to receive messages');
