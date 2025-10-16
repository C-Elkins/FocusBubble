/**
 * FocusBubble Popup Script
 *
 * Connects to background service worker
 * Displays timer and controls
 * Shows session statistics
 *
 * @author Chase Elkins
 */

const browserAPI = (typeof browser !== 'undefined' ? browser : chrome);

// ============================================================================
// STATE
// ============================================================================

let timerState = null;
let selectedDuration = 25; // minutes

// ============================================================================
// DOM ELEMENTS
// ============================================================================

const timerDisplay = document.getElementById('timer-display');
const timerStatus = document.getElementById('timer-status');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const presetBtns = document.querySelectorAll('.preset-btn');

const statSessions = document.getElementById('stat-sessions');
const statTime = document.getElementById('stat-time');
const statDistractions = document.getElementById('stat-distractions');

// Custom time elements
const customBtn = document.getElementById('custom-btn');
const customTimeDiv = document.getElementById('custom-time');
const hoursInput = document.getElementById('hours-input');
const minutesInput = document.getElementById('minutes-input');
const setCustomBtn = document.getElementById('set-custom-btn');

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize popup
 */
async function init() {
  console.log('[FocusBubble Popup] Initializing...');

  // Get current state from background
  await fetchState();

  // Setup event listeners
  setupEventListeners();

  // Listen for state updates
  browserAPI.runtime.onMessage.addListener(handleMessage);

  // Update UI
  updateUI();

  console.log('[FocusBubble Popup] Initialized');
}

/**
 * Fetch current state from background
 */
async function fetchState() {
  try {
    const response = await browserAPI.runtime.sendMessage({ type: 'GET_STATE' });

    if (response && response.state) {
      timerState = response.state;
      selectedDuration = Math.round(timerState.duration / 60);
    }

    // Load sessions for stats
    if (response && response.sessions) {
      updateStats(response.sessions);
    }

  } catch (error) {
    console.error('[FocusBubble Popup] Failed to fetch state:', error);
  }
}

// ============================================================================
// EVENT LISTENERS
// ============================================================================

/**
 * Setup all event listeners
 */
function setupEventListeners() {
  // Start button
  startBtn.addEventListener('click', handleStart);

  // Pause button
  pauseBtn.addEventListener('click', handlePause);

  // Reset button
  resetBtn.addEventListener('click', handleReset);

  // Preset duration buttons
  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Check if it's the custom button
      if (btn.id === 'custom-btn') {
        // Toggle custom time input
        customTimeDiv.style.display = customTimeDiv.style.display === 'none' ? 'block' : 'none';

        // Update active state
        presetBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        return;
      }

      selectedDuration = parseInt(btn.dataset.duration);

      // Hide custom time input
      customTimeDiv.style.display = 'none';

      // Update active state
      presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Reset timer if not running
      if (!timerState || !timerState.isRunning) {
        updateTimerDisplay(selectedDuration * 60);
      }
    });
  });

  // Custom time set button
  setCustomBtn.addEventListener('click', () => {
    const hours = parseInt(hoursInput.value) || 0;
    const minutes = parseInt(minutesInput.value) || 0;
    const totalMinutes = hours * 60 + minutes;

    // Validation: 5 min - 5 hours (300 minutes)
    if (totalMinutes < 5) {
      alert('Minimum time is 5 minutes');
      return;
    }
    if (totalMinutes > 300) {
      alert('Maximum time is 5 hours (300 minutes)');
      return;
    }

    selectedDuration = totalMinutes;
    customTimeDiv.style.display = 'none';

    // Update timer display
    if (!timerState || !timerState.isRunning) {
      updateTimerDisplay(selectedDuration * 60);
    }
  });
}

/**
 * Handle start button
 */
async function handleStart() {
  try {
    const response = await browserAPI.runtime.sendMessage({
      type: timerState && timerState.isPaused ? 'RESUME_TIMER' : 'START_TIMER',
      duration: selectedDuration
    });

    if (response && response.state) {
      timerState = response.state;
      updateUI();
    }
  } catch (error) {
    console.error('[FocusBubble Popup] Failed to start timer:', error);
  }
}

/**
 * Handle pause button
 */
async function handlePause() {
  try {
    const response = await browserAPI.runtime.sendMessage({
      type: 'PAUSE_TIMER'
    });

    if (response && response.state) {
      timerState = response.state;
      updateUI();
    }
  } catch (error) {
    console.error('[FocusBubble Popup] Failed to pause timer:', error);
  }
}

/**
 * Handle reset button
 */
async function handleReset() {
  if (!confirm('Reset timer?')) return;

  try {
    const response = await browserAPI.runtime.sendMessage({
      type: 'RESET_TIMER'
    });

    if (response && response.state) {
      timerState = response.state;
      updateUI();
    }
  } catch (error) {
    console.error('[FocusBubble Popup] Failed to reset timer:', error);
  }
}

// ============================================================================
// UI UPDATES
// ============================================================================

/**
 * Update entire UI
 */
function updateUI() {
  if (!timerState) {
    updateTimerDisplay(selectedDuration * 60);
    return;
  }

  updateTimerDisplay(timerState.timeRemaining);
  updateButtons();
  updateStatus();
}

/**
 * Update timer display with hours:minutes:seconds format
 */
function updateTimerDisplay(seconds) {
  // If timer is running, calculate current remaining time
  if (timerState && timerState.isRunning && timerState.startTime) {
    const elapsed = Math.floor((Date.now() - timerState.startTime) / 1000);
    seconds = Math.max(0, timerState.timeRemaining - elapsed);
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  // Format: HH:MM:SS or MM:SS if no hours
  if (hours > 0) {
    timerDisplay.textContent =
      `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  } else {
    timerDisplay.textContent =
      `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}

/**
 * Update button visibility
 */
function updateButtons() {
  if (!timerState) return;

  if (timerState.isRunning) {
    startBtn.style.display = 'none';
    pauseBtn.style.display = 'flex';
  } else {
    startBtn.style.display = 'flex';
    pauseBtn.style.display = 'none';

    // Change start button text if paused
    if (timerState.timeRemaining < timerState.duration && timerState.timeRemaining > 0) {
      startBtn.textContent = '▶️ Resume';
    } else {
      startBtn.textContent = '▶️ Start';
    }
  }
}

/**
 * Update status text
 */
function updateStatus() {
  if (!timerState) {
    timerStatus.textContent = 'Ready to focus';
    return;
  }

  if (timerState.isRunning) {
    timerStatus.textContent = `🎯 Focus time${timerState.distractionCount > 0 ? ` • ${timerState.distractionCount} distractions` : ''}`;
  } else if (timerState.timeRemaining === 0) {
    timerStatus.textContent = '✨ Session complete!';
  } else if (timerState.timeRemaining < timerState.duration) {
    timerStatus.textContent = '⏸️ Paused';
  } else {
    timerStatus.textContent = 'Ready to focus';
  }
}

/**
 * Update statistics display
 */
function updateStats(sessions) {
  const today = new Date().toDateString();
  const todaySessions = sessions.filter(s => {
    const sessionDate = new Date(s.startTime).toDateString();
    return sessionDate === today;
  });

  statSessions.textContent = todaySessions.length;

  const totalTime = todaySessions.reduce((sum, s) => sum + s.duration, 0);
  statTime.textContent = `${Math.round(totalTime / 60)} min`;

  const totalDistractions = todaySessions.reduce((sum, s) => sum + s.distractions, 0);
  statDistractions.textContent = totalDistractions;
}

// ============================================================================
// MESSAGING
// ============================================================================

/**
 * Handle messages from background
 */
function handleMessage(message, sender, sendResponse) {
  if (message.type === 'TIMER_STATE_UPDATE') {
    timerState = message.state;
    updateUI();
  }

  return true;
}

// ============================================================================
// START
// ============================================================================

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
