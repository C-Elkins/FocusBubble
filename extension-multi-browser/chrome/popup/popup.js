/**
 * FocusBubble - Popup Script
 * Handles popup UI and communication with background script
 */

// DOM Elements
const timeDisplay = document.getElementById('timeDisplay');
const statusDisplay = document.getElementById('status');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resumeBtn = document.getElementById('resumeBtn');
const stopBtn = document.getElementById('stopBtn');
const customDurationInput = document.getElementById('customDuration');
const presetBtns = document.querySelectorAll('.preset-btn');
const progressCircle = document.getElementById('progressCircle');

// State
let currentDuration = 25; // minutes
let timerState = null;
const circumference = 2 * Math.PI * 90; // radius = 90

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  // Load current state
  await loadTimerState();
  await loadStats();

  // Setup event listeners
  setupEventListeners();

  // Set initial progress circle
  progressCircle.style.strokeDashoffset = circumference;
});

// Setup event listeners
function setupEventListeners() {
  // Start button
  startBtn.addEventListener('click', async () => {
    const duration = customDurationInput.value || currentDuration;
    await startTimer(parseInt(duration));
  });

  // Pause button
  pauseBtn.addEventListener('click', async () => {
    await sendMessage({ type: 'PAUSE_TIMER' });
  });

  // Resume button
  resumeBtn.addEventListener('click', async () => {
    await sendMessage({ type: 'RESUME_TIMER' });
  });

  // Stop button
  stopBtn.addEventListener('click', async () => {
    await sendMessage({ type: 'STOP_TIMER' });
  });

  // Preset buttons
  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currentDuration = parseInt(btn.dataset.duration);
      customDurationInput.value = '';
      highlightPreset(btn);
    });
  });

  // Dashboard link
  document.getElementById('dashboardLink').addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: chrome.runtime.getURL('dashboard/index.html') });
  });

  // Settings link
  document.getElementById('settingsLink').addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: chrome.runtime.getURL('settings/index.html') });
  });
}

// Load timer state
async function loadTimerState() {
  const response = await sendMessage({ type: 'GET_STATE' });
  if (response && response.success) {
    timerState = response.state;
    updateUI(timerState);
  }
}

// Load stats
async function loadStats() {
  const result = await chrome.storage.local.get(['stats']);
  if (result.stats) {
    updateStatsDisplay(result.stats);
  }
}

// Start timer
async function startTimer(duration) {
  const response = await sendMessage({ type: 'START_TIMER', duration });
  if (response && response.success) {
    timerState = response.state;
    updateUI(timerState);
  }
}

// Send message to background
function sendMessage(message) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(message, resolve);
  });
}

// Update UI based on timer state
function updateUI(state) {
  if (!state) return;

  if (state.active) {
    // Timer is running
    statusDisplay.textContent = 'Focusing...';
    statusDisplay.className = 'status active';

    startBtn.classList.add('hidden');
    pauseBtn.classList.remove('hidden');
    stopBtn.classList.remove('hidden');
    resumeBtn.classList.add('hidden');

    updateTimeDisplay(state.remainingTime || state.duration);
    updateProgress(state.remainingTime || state.duration, state.duration);
  } else if (state.remainingTime) {
    // Timer is paused
    statusDisplay.textContent = 'Paused';
    statusDisplay.className = 'status paused';

    startBtn.classList.add('hidden');
    pauseBtn.classList.add('hidden');
    resumeBtn.classList.remove('hidden');
    stopBtn.classList.remove('hidden');

    updateTimeDisplay(state.remainingTime);
    updateProgress(state.remainingTime, state.duration);
  } else {
    // Timer is idle
    statusDisplay.textContent = 'Ready';
    statusDisplay.className = 'status';

    startBtn.classList.remove('hidden');
    pauseBtn.classList.add('hidden');
    resumeBtn.classList.add('hidden');
    stopBtn.classList.add('hidden');

    updateTimeDisplay(currentDuration * 60 * 1000);
    progressCircle.style.strokeDashoffset = circumference;
  }
}

// Update time display
function updateTimeDisplay(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  timeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Update progress ring
function updateProgress(remaining, total) {
  const progress = remaining / total;
  const offset = circumference * (1 - progress);
  progressCircle.style.strokeDashoffset = offset;
}

// Update stats display
function updateStatsDisplay(stats) {
  document.getElementById('totalSessions').textContent = stats.totalSessions || 0;
  
  const hours = Math.floor((stats.totalFocusTime || 0) / (1000 * 60 * 60));
  document.getElementById('totalTime').textContent = `${hours}h`;
  
  document.getElementById('distractions').textContent = stats.totalDistractions || 0;
}

// Highlight selected preset
function highlightPreset(selectedBtn) {
  presetBtns.forEach(btn => btn.classList.remove('selected'));
  selectedBtn.classList.add('selected');
}

// Listen for timer updates
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'TIMER_TICK') {
    updateTimeDisplay(message.timeRemaining);
    if (timerState) {
      updateProgress(message.timeRemaining, timerState.duration);
    }
  } else if (message.type === 'TIMER_COMPLETED') {
    loadTimerState();
    loadStats();
  }
});

// Highlight default preset (25 minutes)
document.querySelector('[data-duration="25"]').classList.add('selected');
