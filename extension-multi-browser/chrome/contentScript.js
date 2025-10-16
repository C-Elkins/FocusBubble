/**
 * FocusBubble - Content Script
 * 
 * Injects a beautiful, draggable floating bubble onto web pages that:
 * - Displays countdown timer in real-time
 * - Click to toggle pause/resume
 * - Smooth drag functionality
 * - Elegant styling with soft shadows
 * - Tracks user distractions
 * - Syncs with background script
 * 
 * Cross-browser compatible: Chrome, Edge, Firefox, Opera
 * 
 * @author Krubles Team
 * @version 1.0.0
 */

// ============================================================================
// BROWSER API DETECTION
// ============================================================================

const api = typeof browser !== 'undefined' ? browser : chrome;

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

/**
 * Global state for timer and bubble
 */
let state = {
  isActive: false,
  isPaused: false,
  timeRemaining: 0,
  duration: 0,
  mode: 'focus',
  distractions: 0
};

/**
 * Bubble DOM element reference
 */
let bubbleElement = null;

/**
 * Drag state
 */
let dragState = {
  isDragging: false,
  hasDragged: false, // Track if drag occurred (vs click)
  startX: 0,
  startY: 0,
  initialX: 0,
  initialY: 0
};

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize content script
 * Sets up message listeners and checks for existing timer
 */
(function initialize() {
  console.log('🎯 FocusBubble: Content script loaded on', window.location.hostname);

  // Listen for messages from background script
  setupMessageListener();

  // Check if timer is already running when page loads
  checkExistingTimer();

  // Add global styles
  injectGlobalStyles();
})();

/**
 * Setup message listener for background script communications
 */
function setupMessageListener() {
  api.runtime.onMessage.addListener((message, sender, sendResponse) => {
    try {
      handleMessage(message);
      sendResponse({ success: true });
    } catch (error) {
      console.error('❌ Error handling message:', error);
      sendResponse({ success: false, error: error.message });
    }
    return true; // Keep channel open for async response
  });
}

/**
 * Handle incoming messages from background script
 */
function handleMessage(message) {
  console.log('📨 Message received:', message.type);

  switch (message.type) {
    case 'TIMER_STARTED':
      handleTimerStarted(message.state);
      break;

    case 'TIMER_TICK':
      handleTimerTick(message.timeRemaining, message.state);
      break;

    case 'TIMER_PAUSED':
      handleTimerPaused(message.state);
      break;

    case 'TIMER_RESUMED':
      handleTimerResumed(message.state);
      break;

    case 'TIMER_STOPPED':
    case 'TIMER_COMPLETED':
      handleTimerEnded(message.type);
      break;

    case 'DISTRACTION_COUNT_UPDATED':
      handleDistractionUpdate(message.distractions);
      break;

    default:
      console.log('⚠️ Unknown message type:', message.type);
  }
}

/**
 * Check if timer is already running when page loads
 */
function checkExistingTimer() {
  api.runtime.sendMessage({ type: 'GET_STATE' }, (response) => {
    if (response?.success && response.state?.isActive) {
      console.log('⏱️ Active timer detected, creating bubble');
      state = response.state;
      createBubble();
      startDistractionTracking();
    }
  });
}

// ============================================================================
// MESSAGE HANDLERS
// ============================================================================

function handleTimerStarted(newState) {
  state = newState;
  createBubble();
  startDistractionTracking();
  console.log('▶️ Timer started');
}

function handleTimerTick(timeRemaining, newState) {
  if (newState) {
    state = newState;
  } else {
    state.timeRemaining = timeRemaining;
  }
  updateBubbleDisplay();
}

function handleTimerPaused(newState) {
  state = newState;
  updateBubbleState('paused');
  console.log('⏸️ Timer paused');
}

function handleTimerResumed(newState) {
  state = newState;
  updateBubbleState('active');
  console.log('▶️ Timer resumed');
}

function handleTimerEnded(type) {
  const wasCompleted = type === 'TIMER_COMPLETED';
  removeBubble(wasCompleted);
  stopDistractionTracking();
  console.log(wasCompleted ? '✅ Timer completed!' : '⏹️ Timer stopped');
}

function handleDistractionUpdate(count) {
  state.distractions = count;
  // Could show visual feedback here
}

// ============================================================================
// BUBBLE CREATION AND MANAGEMENT
// ============================================================================

/**
 * Create and inject the floating bubble into the page
 */
function createBubble() {
  // Prevent duplicate bubbles
  if (bubbleElement) {
    console.log('Bubble already exists');
    return;
  }

  // Create main bubble container
  bubbleElement = document.createElement('div');
  bubbleElement.id = 'focusbubble-timer';
  bubbleElement.className = 'focusbubble-bubble';

  // Restore saved position or use default
  const savedPosition = getSavedPosition();
  
  // Apply styles
  Object.assign(bubbleElement.style, {
    position: 'fixed',
    top: savedPosition.top,
    right: savedPosition.right,
    left: savedPosition.left || 'auto',
    width: '90px',
    height: '90px',
    background: getBubbleGradient(state.mode),
    borderRadius: '50%',
    color: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: '18px',
    fontWeight: '700',
    boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3), 0 2px 8px rgba(0, 0, 0, 0.1)',
    cursor: 'pointer',
    zIndex: '2147483647',
    transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s ease, opacity 0.2s ease',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    backdropFilter: 'blur(10px)',
    opacity: state.isPaused ? '0.7' : '1',
    border: '2px solid rgba(255, 255, 255, 0.2)'
  });

  // Create time display
  const timeDisplay = document.createElement('div');
  timeDisplay.id = 'focusbubble-time';
  timeDisplay.textContent = formatTime(state.timeRemaining || state.duration);
  Object.assign(timeDisplay.style, {
    fontSize: '20px',
    fontWeight: '700',
    letterSpacing: '0.5px',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
  });

  // Create mode indicator (small text below time)
  const modeDisplay = document.createElement('div');
  modeDisplay.id = 'focusbubble-mode';
  modeDisplay.textContent = getModeLabel(state.mode);
  Object.assign(modeDisplay.style, {
    fontSize: '10px',
    fontWeight: '500',
    marginTop: '4px',
    opacity: '0.9',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  });

  // Append elements
  bubbleElement.appendChild(timeDisplay);
  bubbleElement.appendChild(modeDisplay);

  // Add event listeners
  setupBubbleEvents();

  // Add to page
  document.body.appendChild(bubbleElement);

  // Entrance animation
  requestAnimationFrame(() => {
    bubbleElement.style.transform = 'scale(0)';
    requestAnimationFrame(() => {
      bubbleElement.style.transform = 'scale(1)';
    });
  });

  console.log('✨ Bubble created');
}

/**
 * Setup all event listeners for the bubble
 */
function setupBubbleEvents() {
  // Mouse events for drag and click
  bubbleElement.addEventListener('mousedown', handleMouseDown);
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);

  // Touch events for mobile
  bubbleElement.addEventListener('touchstart', handleTouchStart, { passive: false });
  document.addEventListener('touchmove', handleTouchMove, { passive: false });
  document.addEventListener('touchend', handleTouchEnd);

  // Hover effects
  bubbleElement.addEventListener('mouseenter', () => {
    if (!dragState.isDragging) {
      bubbleElement.style.transform = 'scale(1.05)';
      bubbleElement.style.boxShadow = '0 12px 40px rgba(102, 126, 234, 0.4), 0 4px 12px rgba(0, 0, 0, 0.15)';
    }
  });

  bubbleElement.addEventListener('mouseleave', () => {
    if (!dragState.isDragging) {
      bubbleElement.style.transform = 'scale(1)';
      bubbleElement.style.boxShadow = '0 8px 32px rgba(102, 126, 234, 0.3), 0 2px 8px rgba(0, 0, 0, 0.1)';
    }
  });
}

// ============================================================================
// DRAG AND CLICK FUNCTIONALITY
// ============================================================================

/**
 * Handle mouse down - start potential drag or click
 */
function handleMouseDown(e) {
  e.preventDefault();
  dragState.isDragging = true;
  dragState.hasDragged = false;
  dragState.startX = e.clientX;
  dragState.startY = e.clientY;
  
  const rect = bubbleElement.getBoundingClientRect();
  dragState.initialX = rect.left;
  dragState.initialY = rect.top;

  bubbleElement.style.cursor = 'grabbing';
  bubbleElement.style.transition = 'none';
}

/**
 * Handle mouse move - perform drag
 */
function handleMouseMove(e) {
  if (!dragState.isDragging) return;

  const deltaX = e.clientX - dragState.startX;
  const deltaY = e.clientY - dragState.startY;

  // Detect if user has moved more than 5px (threshold for click vs drag)
  if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
    dragState.hasDragged = true;
  }

  if (dragState.hasDragged) {
    const newX = dragState.initialX + deltaX;
    const newY = dragState.initialY + deltaY;

    // Keep within viewport bounds
    const maxX = window.innerWidth - bubbleElement.offsetWidth;
    const maxY = window.innerHeight - bubbleElement.offsetHeight;

    const boundedX = Math.max(0, Math.min(newX, maxX));
    const boundedY = Math.max(0, Math.min(newY, maxY));

    bubbleElement.style.left = boundedX + 'px';
    bubbleElement.style.top = boundedY + 'px';
    bubbleElement.style.right = 'auto';
  }
}

/**
 * Handle mouse up - end drag or trigger click
 */
function handleMouseUp(e) {
  if (!dragState.isDragging) return;

  dragState.isDragging = false;
  bubbleElement.style.cursor = 'pointer';
  bubbleElement.style.transition = 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s ease, opacity 0.2s ease';

  // If didn't drag, treat as click
  if (!dragState.hasDragged) {
    handleBubbleClick(e);
  } else {
    // Save position after drag
    savePosition();
  }
}

/**
 * Handle touch start - mobile drag/click
 */
function handleTouchStart(e) {
  e.preventDefault();
  const touch = e.touches[0];
  dragState.isDragging = true;
  dragState.hasDragged = false;
  dragState.startX = touch.clientX;
  dragState.startY = touch.clientY;
  
  const rect = bubbleElement.getBoundingClientRect();
  dragState.initialX = rect.left;
  dragState.initialY = rect.top;

  bubbleElement.style.transition = 'none';
}

/**
 * Handle touch move - mobile drag
 */
function handleTouchMove(e) {
  if (!dragState.isDragging) return;
  e.preventDefault();

  const touch = e.touches[0];
  const deltaX = touch.clientX - dragState.startX;
  const deltaY = touch.clientY - dragState.startY;

  if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
    dragState.hasDragged = true;
  }

  if (dragState.hasDragged) {
    const newX = dragState.initialX + deltaX;
    const newY = dragState.initialY + deltaY;

    const maxX = window.innerWidth - bubbleElement.offsetWidth;
    const maxY = window.innerHeight - bubbleElement.offsetHeight;

    const boundedX = Math.max(0, Math.min(newX, maxX));
    const boundedY = Math.max(0, Math.min(newY, maxY));

    bubbleElement.style.left = boundedX + 'px';
    bubbleElement.style.top = boundedY + 'px';
    bubbleElement.style.right = 'auto';
  }
}

/**
 * Handle touch end - mobile drag/click end
 */
function handleTouchEnd(e) {
  if (!dragState.isDragging) return;

  dragState.isDragging = false;
  bubbleElement.style.transition = 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s ease, opacity 0.2s ease';

  if (!dragState.hasDragged) {
    handleBubbleClick(e);
  } else {
    savePosition();
  }
}

/**
 * Handle bubble click - toggle pause/resume
 */
function handleBubbleClick(e) {
  console.log('🖱️ Bubble clicked');

  // Visual feedback
  bubbleElement.style.transform = 'scale(0.95)';
  setTimeout(() => {
    bubbleElement.style.transform = 'scale(1)';
  }, 150);

  // Toggle pause/resume
  if (state.isPaused) {
    // Resume timer
    api.runtime.sendMessage({ type: 'RESUME_TIMER' }, (response) => {
      if (response?.success) {
        console.log('▶️ Timer resumed via click');
      }
    });
  } else if (state.isActive) {
    // Pause timer
    api.runtime.sendMessage({ type: 'PAUSE_TIMER' }, (response) => {
      if (response?.success) {
        console.log('⏸️ Timer paused via click');
      }
    });
  }
}

// ============================================================================
// BUBBLE UPDATES
// ============================================================================

/**
 * Update bubble display with current time
 */
function updateBubbleDisplay() {
  if (!bubbleElement) return;

  const timeDisplay = document.getElementById('focusbubble-time');
  if (timeDisplay) {
    const formattedTime = formatTime(state.timeRemaining);
    if (timeDisplay.textContent !== formattedTime) {
      timeDisplay.textContent = formattedTime;
    }
  }
}

/**
 * Update bubble visual state (paused/active)
 */
function updateBubbleState(newState) {
  if (!bubbleElement) return;

  if (newState === 'paused') {
    bubbleElement.style.opacity = '0.7';
    bubbleElement.style.background = 'linear-gradient(135deg, #a8b5ff 0%, #c9aeff 100%)';
    bubbleElement.style.border = '2px solid rgba(255, 255, 255, 0.4)';
    
    // Add pause indicator
    addPauseIndicator();
  } else if (newState === 'active') {
    bubbleElement.style.opacity = '1';
    bubbleElement.style.background = getBubbleGradient(state.mode);
    bubbleElement.style.border = '2px solid rgba(255, 255, 255, 0.2)';
    
    // Remove pause indicator
    removePauseIndicator();
  }
}

/**
 * Add visual pause indicator
 */
function addPauseIndicator() {
  if (document.getElementById('focusbubble-pause-icon')) return;

  const pauseIcon = document.createElement('div');
  pauseIcon.id = 'focusbubble-pause-icon';
  pauseIcon.innerHTML = '⏸';
  Object.assign(pauseIcon.style, {
    position: 'absolute',
    top: '5px',
    right: '5px',
    fontSize: '12px',
    opacity: '0.8'
  });
  bubbleElement.appendChild(pauseIcon);
}

/**
 * Remove pause indicator
 */
function removePauseIndicator() {
  const pauseIcon = document.getElementById('focusbubble-pause-icon');
  if (pauseIcon) {
    pauseIcon.remove();
  }
}

/**
 * Remove bubble from page with animation
 */
function removeBubble(completed = false) {
  if (!bubbleElement) return;

  // Exit animation
  if (completed) {
    bubbleElement.style.transform = 'scale(1.2)';
    bubbleElement.style.opacity = '0';
  } else {
    bubbleElement.style.transform = 'scale(0)';
  }

  setTimeout(() => {
    if (bubbleElement) {
      bubbleElement.remove();
      bubbleElement = null;
    }
  }, 200);

  console.log('🗑️ Bubble removed');
}

// ============================================================================
// DISTRACTION TRACKING
// ============================================================================

let isTrackingDistractions = false;

/**
 * Start tracking user distractions
 */
function startDistractionTracking() {
  if (isTrackingDistractions) return;

  document.addEventListener('visibilitychange', handleVisibilityChange);
  window.addEventListener('blur', handleWindowBlur);
  
  isTrackingDistractions = true;
  console.log('👀 Distraction tracking started');
}

/**
 * Stop tracking distractions
 */
function stopDistractionTracking() {
  if (!isTrackingDistractions) return;

  document.removeEventListener('visibilitychange', handleVisibilityChange);
  window.removeEventListener('blur', handleWindowBlur);
  
  isTrackingDistractions = false;
  console.log('👀 Distraction tracking stopped');
}

/**
 * Handle page visibility change (tab switch)
 */
function handleVisibilityChange() {
  if (document.hidden && state.isActive && !state.isPaused) {
    console.log('⚠️ Distraction: Tab switched');
    api.runtime.sendMessage({
      type: 'DISTRACTION_DETECTED',
      data: {
        url: window.location.href,
        title: document.title,
        reason: 'tab_switch',
        timestamp: Date.now()
      }
    });
  }
}

/**
 * Handle window blur (switched to different app)
 */
function handleWindowBlur() {
  if (state.isActive && !state.isPaused) {
    console.log('⚠️ Distraction: Window blur');
    api.runtime.sendMessage({
      type: 'DISTRACTION_DETECTED',
      data: {
        url: window.location.href,
        title: document.title,
        reason: 'window_blur',
        timestamp: Date.now()
      }
    });
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format milliseconds to MM:SS
 */
function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Get bubble gradient based on mode
 */
function getBubbleGradient(mode) {
  const gradients = {
    'focus': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'short-break': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'long-break': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  };
  return gradients[mode] || gradients.focus;
}

/**
 * Get mode display label
 */
function getModeLabel(mode) {
  const labels = {
    'focus': 'Focus',
    'short-break': 'Break',
    'long-break': 'Long Break'
  };
  return labels[mode] || 'Timer';
}

/**
 * Save bubble position to local storage
 */
function savePosition() {
  if (!bubbleElement) return;

  const position = {
    top: bubbleElement.style.top,
    left: bubbleElement.style.left,
    right: bubbleElement.style.right
  };

  try {
    localStorage.setItem('focusbubble-position', JSON.stringify(position));
  } catch (error) {
    console.warn('Could not save bubble position:', error);
  }
}

/**
 * Get saved bubble position
 */
function getSavedPosition() {
  try {
    const saved = localStorage.getItem('focusbubble-position');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.warn('Could not load bubble position:', error);
  }

  // Default position (top-right)
  return {
    top: '20px',
    right: '20px',
    left: 'auto'
  };
}

// ============================================================================
// GLOBAL STYLES INJECTION
// ============================================================================

/**
 * Inject global styles to ensure bubble renders correctly
 * Prevents page styles from interfering with bubble
 */
function injectGlobalStyles() {
  const style = document.createElement('style');
  style.id = 'focusbubble-global-styles';
  style.textContent = `
    /* FocusBubble - Global Styles */
    #focusbubble-timer {
      all: initial !important;
      position: fixed !important;
      z-index: 2147483647 !important;
    }
    
    #focusbubble-timer * {
      all: unset !important;
      display: block !important;
    }
    
    /* Ensure bubble is always visible */
    #focusbubble-timer {
      pointer-events: auto !important;
      visibility: visible !important;
      display: flex !important;
    }

    /* Smooth animations */
    @keyframes focusbubble-pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }

    /* Prevent text selection during drag */
    .focusbubble-dragging * {
      user-select: none !important;
      -webkit-user-select: none !important;
    }
  `;

  // Wait for head to be available
  if (document.head) {
    document.head.appendChild(style);
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      document.head.appendChild(style);
    });
  }
}

// ============================================================================
// CLEANUP ON PAGE UNLOAD
// ============================================================================

window.addEventListener('beforeunload', () => {
  stopDistractionTracking();
  if (bubbleElement) {
    savePosition();
  }
});

console.log('✅ FocusBubble content script initialized');
