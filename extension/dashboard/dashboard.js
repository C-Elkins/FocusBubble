/**
 * FocusBubble Dashboard Script
 *
 * Displays analytics, AI insights, and session history
 *
 * @author Chase Elkins
 */

import { storage, runtime } from '../shared/browser-api.js';
import { generateFocusInsight, formatSessionsForInsight } from '../shared/aiInsights.js';

const browserAPI = (typeof browser !== 'undefined' ? browser : chrome);

// ============================================================================
// STATE
// ============================================================================

let sessions = [];
let settings = {};

// ============================================================================
// DOM ELEMENTS
// ============================================================================

const statSessions = document.getElementById('stat-sessions');
const statTime = document.getElementById('stat-time');
const statDistractions = document.getElementById('stat-distractions');
const statAvg = document.getElementById('stat-avg');
const insightText = document.getElementById('insight-text');
const refreshBtn = document.getElementById('refresh-insight');
const sessionList = document.getElementById('session-list');

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize dashboard
 */
async function init() {
  console.log('[FocusBubble Dashboard] Initializing...');

  // Load data
  await loadData();

  // Update UI
  updateStats();
  updateSessionList();
  await generateInsight();

  // Setup event listeners
  setupEventListeners();

  console.log('[FocusBubble Dashboard] Initialized');
}

/**
 * Load data from storage
 */
async function loadData() {
  try {
    const data = await storage.get(['sessions', 'settings']);

    if (data.sessions) {
      sessions = data.sessions;
    }

    if (data.settings) {
      settings = data.settings;
    }
  } catch (error) {
    console.error('[FocusBubble Dashboard] Failed to load data:', error);
  }
}

// ============================================================================
// EVENT LISTENERS
// ============================================================================

/**
 * Setup event listeners
 */
function setupEventListeners() {
  refreshBtn.addEventListener('click', handleRefreshInsight);

  // Listen for storage updates
  storage.onChanged.addListener((changes) => {
    if (changes.sessions) {
      sessions = changes.sessions.newValue || [];
      updateStats();
      updateSessionList();
    }

    if (changes.settings) {
      settings = changes.settings.newValue || {};
    }
  });
}

/**
 * Handle refresh insight button
 */
async function handleRefreshInsight() {
  refreshBtn.disabled = true;
  insightText.textContent = 'Generating new insight...';
  insightText.classList.add('insight-loading');

  await generateInsight();

  refreshBtn.disabled = false;
}

// ============================================================================
// STATS
// ============================================================================

/**
 * Update statistics display
 */
function updateStats() {
  const today = new Date().toDateString();
  const todaySessions = sessions.filter(s => {
    const sessionDate = new Date(s.startTime).toDateString();
    return sessionDate === today && s.completed;
  });

  // Sessions count
  statSessions.textContent = todaySessions.length;

  // Total time
  const totalMinutes = todaySessions.reduce((sum, s) => sum + Math.round(s.duration / 60), 0);
  statTime.textContent = totalMinutes;

  // Total distractions
  const totalDistractions = todaySessions.reduce((sum, s) => sum + s.distractions, 0);
  statDistractions.textContent = totalDistractions;

  // Average session length
  const avgMinutes = todaySessions.length > 0
    ? Math.round(totalMinutes / todaySessions.length)
    : 0;
  statAvg.textContent = avgMinutes;
}

/**
 * Update session list
 */
function updateSessionList() {
  const today = new Date().toDateString();
  const todaySessions = sessions
    .filter(s => {
      const sessionDate = new Date(s.startTime).toDateString();
      return sessionDate === today && s.completed;
    })
    .sort((a, b) => new Date(b.startTime) - new Date(a.startTime));

  if (todaySessions.length === 0) {
    sessionList.innerHTML = `
      <div class="empty-state">
        <h3>No sessions yet</h3>
        <p>Start your first focus session to see it here!</p>
      </div>
    `;
    return;
  }

  sessionList.innerHTML = todaySessions.map(session => {
    const startTime = new Date(session.startTime);
    const timeStr = startTime.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    const durationMinutes = Math.round(session.duration / 60);

    return `
      <div class="session-item">
        <span class="session-time">${timeStr}</span>
        <span class="session-duration">${durationMinutes} min</span>
        <span class="session-distractions">${session.distractions} distractions</span>
      </div>
    `;
  }).join('');
}

// ============================================================================
// AI INSIGHTS
// ============================================================================

/**
 * Generate AI insight
 */
async function generateInsight() {
  try {
    // Format session data
    const stats = formatSessionsForInsight(sessions);

    // Check if we have any data
    if (stats.sessionsCompleted === 0) {
      insightText.textContent = "Start your first focus session to get personalized insights!";
      insightText.classList.remove('insight-loading');
      return;
    }

    // Get AI provider settings
    const provider = settings.aiProvider || 'local';
    const apiKey = settings.aiApiKey || '';
    const tone = settings.aiTone || 'motivational';

    // Generate insight
    const insight = await generateFocusInsight(stats, {
      provider,
      apiKey,
      tone
    });

    insightText.textContent = insight;
    insightText.classList.remove('insight-loading');

  } catch (error) {
    console.error('[FocusBubble Dashboard] Failed to generate insight:', error);
    insightText.textContent = "Keep up the great work! Every focus session builds your productivity muscle.";
    insightText.classList.remove('insight-loading');
  }
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
