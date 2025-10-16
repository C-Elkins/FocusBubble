/**
 * FocusBubble Content Script
 *
 * Injects a floating, draggable timer bubble into web pages
 * Syncs with background service worker for real-time updates
 * Detects page visibility changes (tab switches, window minimize)
 *
 * @author Chase Elkins
 */

// Import browser API (needs to be bundled or use CDN approach)
// For now, use global chrome/browser object
const browserAPI = (typeof browser !== 'undefined' ? browser : chrome);

// ============================================================================
// STATE
// ============================================================================

let timerState = null;
let bubbleElement = null;
let isDragging = false;
let bubblePosition = { x: window.innerWidth - 140, y: 20 }; // Top-right by default

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize content script
 */
function init() {
  console.log('[FocusBubble Content] Initializing...');

  // Create floating bubble
  createFloatingBubble();

  // Setup page visibility detection
  setupVisibilityDetection();

  // Get initial timer state
  requestTimerState();

  // Listen for state updates from background
  browserAPI.runtime.onMessage.addListener(handleMessage);

  console.log('[FocusBubble Content] Initialized successfully');
}

// ============================================================================
// FLOATING BUBBLE UI
// ============================================================================

/**
 * Create the floating timer bubble
 */
function createFloatingBubble() {
  // Check if already exists
  if (document.getElementById('focusbubble-overlay')) {
    console.log('[FocusBubble Content] Bubble already exists');
    return;
  }

  // Create container
  const container = document.createElement('div');
  container.id = 'focusbubble-overlay';
  container.className = 'focusbubble-floating';

  // Load saved position
  const savedPos = localStorage.getItem('focusbubble-position');
  if (savedPos) {
    bubblePosition = JSON.parse(savedPos);
  }

  // Set styles
  container.style.cssText = `
    position: fixed;
    top: ${bubblePosition.y}px;
    left: ${bubblePosition.x}px;
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
    z-index: 999999;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    transition: transform 0.2s, opacity 0.2s;
    opacity: 0.9;
    will-change: transform;
    backface-visibility: hidden;
  `;

  // Timer display
  const timerDisplay = document.createElement('div');
  timerDisplay.id = 'focusbubble-timer';
  timerDisplay.style.cssText = `
    color: white;
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    text-shadow: 0 2px 4px rgba(0,0,0,0.2);
  `;
  timerDisplay.textContent = '--:--';

  container.appendChild(timerDisplay);
  document.body.appendChild(container);

  bubbleElement = container;

  // Make draggable
  makeDraggable(container);

  // Hover effects
  container.addEventListener('mouseenter', () => {
    container.style.opacity = '1';
    container.style.transform = 'scale(1.05)';
  });

  container.addEventListener('mouseleave', () => {
    if (!isDragging) {
      container.style.opacity = '0.9';
      container.style.transform = 'scale(1)';
    }
  });

  // Double-click to hide/show
  container.addEventListener('dblclick', () => {
    const isHidden = container.style.opacity === '0.3';
    container.style.opacity = isHidden ? '0.9' : '0.3';
    container.style.transform = isHidden ? 'scale(1)' : 'scale(0.7)';
  });
}

/**
 * Make bubble draggable
 */
function makeDraggable(element) {
  let initialX, initialY;
  let currentX, currentY;

  element.addEventListener('mousedown', dragStart);
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', dragEnd);

  function dragStart(e) {
    isDragging = true;
    initialX = e.clientX - bubblePosition.x;
    initialY = e.clientY - bubblePosition.y;
    element.style.cursor = 'grabbing';
    element.style.transform = 'scale(0.95)';
  }

  function drag(e) {
    if (!isDragging) return;

    e.preventDefault();

    currentX = e.clientX - initialX;
    currentY = e.clientY - initialY;

    // Keep within viewport bounds
    currentX = Math.max(0, Math.min(currentX, window.innerWidth - element.offsetWidth));
    currentY = Math.max(0, Math.min(currentY, window.innerHeight - element.offsetHeight));

    element.style.left = currentX + 'px';
    element.style.top = currentY + 'px';

    bubblePosition = { x: currentX, y: currentY };
  }

  function dragEnd() {
    if (!isDragging) return;

    isDragging = false;
    element.style.cursor = 'move';
    element.style.transform = 'scale(1)';

    // Save position
    localStorage.setItem('focusbubble-position', JSON.stringify(bubblePosition));
  }
}

/**
 * Update bubble display with timer state
 */
function updateBubbleDisplay(state) {
  const timerDisplay = document.getElementById('focusbubble-timer');
  if (!timerDisplay || !bubbleElement) return;

  const minutes = Math.floor(state.timeRemaining / 60);
  const seconds = state.timeRemaining % 60;
  timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // Update color based on state
  if (state.isRunning) {
    bubbleElement.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  } else if (state.timeRemaining === 0) {
    bubbleElement.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
  } else {
    bubbleElement.style.background = 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)';
  }
}

// ============================================================================
// PAGE VISIBILITY DETECTION
// ============================================================================

/**
 * Detect tab switches and window minimize
 */
function setupVisibilityDetection() {
  let wasVisible = !document.hidden;

  document.addEventListener('visibilitychange', () => {
    const isVisible = !document.hidden;

    if (wasVisible && !isVisible) {
      // Tab became hidden - user switched away
      console.log('[FocusBubble Content] Page hidden - potential distraction');
      notifyDistraction();
    } else if (!wasVisible && isVisible) {
      // Tab became visible - user returned
      console.log('[FocusBubble Content] Page visible again');
    }

    wasVisible = isVisible;
  });

  // Also detect window blur
  window.addEventListener('blur', () => {
    console.log('[FocusBubble Content] Window lost focus');
    // Could notify distraction here too
  });

  console.log('[FocusBubble Content] Visibility detection active');
}

/**
 * Notify background of distraction
 */
function notifyDistraction() {
  if (!timerState || !timerState.isRunning) return;

  browserAPI.runtime.sendMessage({
    type: 'RECORD_DISTRACTION',
    distractionType: 'tab_switch'
  }).catch((error) => {
    console.error('[FocusBubble Content] Failed to record distraction:', error);
  });
}

// ============================================================================
// MESSAGING
// ============================================================================

/**
 * Request current timer state
 */
function requestTimerState() {
  browserAPI.runtime.sendMessage({
    type: 'GET_STATE'
  }).then((response) => {
    if (response && response.state) {
      timerState = response.state;
      updateBubbleDisplay(timerState);
    }
  }).catch((error) => {
    console.error('[FocusBubble Content] Failed to get state:', error);
  });
}

/**
 * Handle messages from background
 */
function handleMessage(message, sender, sendResponse) {
  if (message.type === 'TIMER_STATE_UPDATE') {
    timerState = message.state;
    updateBubbleDisplay(timerState);
  }

  return true;
}

// ============================================================================
// CLEANUP
// ============================================================================

/**
 * Remove bubble when page unloads
 */
window.addEventListener('beforeunload', () => {
  if (bubbleElement && bubbleElement.parentNode) {
    bubbleElement.parentNode.removeChild(bubbleElement);
  }
});

// ============================================================================
// START
// ============================================================================

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
