/**
 * browserApi.js - Cross-Browser Extension API Wrapper
 * 
 * Provides unified API interface for Chrome, Edge, and Firefox extensions.
 * Automatically detects browser environment and wraps callback-based APIs
 * into modern Promise-based functions.
 * 
 * @author Krubles Team
 * @version 1.0.0
 */

// ============================================================================
// AUTO-DETECT BROWSER ENVIRONMENT
// ============================================================================
// Firefox provides native 'browser' namespace with Promises
// Chrome/Edge use 'chrome' namespace with callbacks
const api = typeof browser !== 'undefined' ? browser : chrome;

/**
 * Helper function to promisify callback-based Chrome APIs
 * Firefox already returns Promises, so we check and wrap only when needed
 * 
 * @param {Function} fn - The API function to call
 * @param {...any} args - Arguments to pass to the function
 * @returns {Promise} - Promisified result
 */
const promisify = (fn, ...args) => {
  return new Promise((resolve, reject) => {
    fn(...args, (result) => {
      // Check for Chrome's runtime error
      if (api.runtime?.lastError) {
        reject(new Error(api.runtime.lastError.message));
      } else {
        resolve(result);
      }
    });
  });
};

// ============================================================================
// STORAGE API
// ============================================================================

/**
 * Get data from local storage
 * 
 * Usage:
 *   const data = await getStorage(['key1', 'key2']);
 *   const data = await getStorage('singleKey');
 *   const allData = await getStorage(null); // Get all stored data
 * 
 * @param {string|string[]|null} keys - Key(s) to retrieve
 * @returns {Promise<Object>} - Object with key-value pairs
 */
export async function getStorage(keys) {
  if (typeof api.storage.local.get === 'function') {
    // Firefox returns Promise natively, Chrome needs promisification
    try {
      return await api.storage.local.get(keys);
    } catch (error) {
      // Fallback for Chrome
      return promisify(api.storage.local.get.bind(api.storage.local), keys);
    }
  }
  throw new Error('Storage API not available');
}

/**
 * Save data to local storage
 * 
 * Usage:
 *   await setStorage({ key: 'value', count: 42 });
 *   await setStorage({ user: { name: 'John', age: 30 } });
 * 
 * @param {Object} items - Object with key-value pairs to store
 * @returns {Promise<void>}
 */
export async function setStorage(items) {
  if (typeof api.storage.local.set === 'function') {
    try {
      await api.storage.local.set(items);
    } catch (error) {
      // Fallback for Chrome
      await promisify(api.storage.local.set.bind(api.storage.local), items);
    }
  } else {
    throw new Error('Storage API not available');
  }
}

/**
 * Remove data from local storage
 * 
 * Usage:
 *   await removeStorage('key');
 *   await removeStorage(['key1', 'key2']);
 * 
 * @param {string|string[]} keys - Key(s) to remove
 * @returns {Promise<void>}
 */
export async function removeStorage(keys) {
  if (typeof api.storage.local.remove === 'function') {
    try {
      await api.storage.local.remove(keys);
    } catch (error) {
      await promisify(api.storage.local.remove.bind(api.storage.local), keys);
    }
  } else {
    throw new Error('Storage API not available');
  }
}

/**
 * Clear all data from local storage
 * 
 * Usage:
 *   await clearStorage();
 * 
 * @returns {Promise<void>}
 */
export async function clearStorage() {
  if (typeof api.storage.local.clear === 'function') {
    try {
      await api.storage.local.clear();
    } catch (error) {
      await promisify(api.storage.local.clear.bind(api.storage.local));
    }
  } else {
    throw new Error('Storage API not available');
  }
}

// ============================================================================
// MESSAGING API
// ============================================================================

/**
 * Send message to background script or other extension components
 * 
 * Usage:
 *   const response = await sendMessage({ type: 'GET_DATA', id: 123 });
 *   await sendMessage({ action: 'START_TIMER', duration: 25 });
 * 
 * @param {Object} message - Message object to send
 * @param {Object} options - Optional: { tabId: number } to send to specific tab
 * @returns {Promise<any>} - Response from receiver
 */
export async function sendMessage(message, options = {}) {
  try {
    if (options.tabId) {
      // Send message to specific tab
      return await api.tabs.sendMessage(options.tabId, message);
    } else {
      // Send message to background/extension
      return await api.runtime.sendMessage(message);
    }
  } catch (error) {
    // Handle disconnected port errors gracefully
    if (error.message?.includes('Could not establish connection')) {
      console.warn('Receiver not available:', error.message);
      return null;
    }
    throw error;
  }
}

/**
 * Listen for messages from other extension components
 * 
 * Usage:
 *   onMessage((message, sender) => {
 *     if (message.type === 'PING') {
 *       return { status: 'PONG' }; // Return response
 *     }
 *   });
 * 
 * @param {Function} callback - Function to handle incoming messages
 * @returns {void}
 */
export function onMessage(callback) {
  api.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Handle both sync and async callbacks
    const result = callback(message, sender);
    
    // If callback returns a Promise, handle it
    if (result instanceof Promise) {
      result.then(sendResponse);
      return true; // Keep message channel open for async response
    } else if (result !== undefined) {
      sendResponse(result);
    }
  });
}

// ============================================================================
// NOTIFICATIONS API
// ============================================================================

/**
 * Create a browser notification
 * 
 * Usage:
 *   await createNotification('timer-complete', {
 *     title: 'Timer Complete!',
 *     message: 'Great focus session!',
 *     iconUrl: 'icons/icon48.png'
 *   });
 * 
 * @param {string} notificationId - Unique ID for this notification
 * @param {Object} options - Notification options
 * @param {string} options.title - Notification title
 * @param {string} options.message - Notification body text
 * @param {string} options.iconUrl - Path to notification icon
 * @param {string} options.type - Type: 'basic', 'image', 'list', 'progress' (default: 'basic')
 * @returns {Promise<string>} - Created notification ID
 */
export async function createNotification(notificationId, options) {
  const notificationOptions = {
    type: options.type || 'basic',
    iconUrl: options.iconUrl || api.runtime.getURL('icons/icon48.png'),
    title: options.title || 'FocusBubble',
    message: options.message || '',
    ...options
  };

  try {
    return await api.notifications.create(notificationId, notificationOptions);
  } catch (error) {
    // Fallback for Chrome
    return promisify(
      api.notifications.create.bind(api.notifications),
      notificationId,
      notificationOptions
    );
  }
}

/**
 * Clear/dismiss a notification
 * 
 * Usage:
 *   await clearNotification('timer-complete');
 * 
 * @param {string} notificationId - ID of notification to clear
 * @returns {Promise<boolean>} - Whether notification was cleared
 */
export async function clearNotification(notificationId) {
  try {
    return await api.notifications.clear(notificationId);
  } catch (error) {
    return promisify(
      api.notifications.clear.bind(api.notifications),
      notificationId
    );
  }
}

/**
 * Listen for notification clicks
 * 
 * Usage:
 *   onNotificationClick((notificationId) => {
 *     console.log('User clicked:', notificationId);
 *   });
 * 
 * @param {Function} callback - Function to handle notification clicks
 * @returns {void}
 */
export function onNotificationClick(callback) {
  api.notifications.onClicked.addListener(callback);
}

// ============================================================================
// TABS API
// ============================================================================

/**
 * Query browser tabs
 * 
 * Usage:
 *   const activeTabs = await queryTabs({ active: true });
 *   const allTabs = await queryTabs({});
 * 
 * @param {Object} queryInfo - Query parameters
 * @returns {Promise<Array>} - Array of matching tabs
 */
export async function queryTabs(queryInfo) {
  try {
    return await api.tabs.query(queryInfo);
  } catch (error) {
    return promisify(api.tabs.query.bind(api.tabs), queryInfo);
  }
}

/**
 * Create a new tab
 * 
 * Usage:
 *   await createTab({ url: 'https://example.com', active: true });
 * 
 * @param {Object} createProperties - Tab creation options
 * @returns {Promise<Object>} - Created tab object
 */
export async function createTab(createProperties) {
  try {
    return await api.tabs.create(createProperties);
  } catch (error) {
    return promisify(api.tabs.create.bind(api.tabs), createProperties);
  }
}

// ============================================================================
// ALARMS API
// ============================================================================

/**
 * Create an alarm (persistent timer)
 * 
 * Usage:
 *   createAlarm('my-timer', { delayInMinutes: 1 });
 *   createAlarm('repeating', { periodInMinutes: 5 });
 * 
 * @param {string} name - Alarm name
 * @param {Object} alarmInfo - Alarm configuration
 * @param {number} alarmInfo.when - Time in ms since epoch
 * @param {number} alarmInfo.delayInMinutes - Delay before firing
 * @param {number} alarmInfo.periodInMinutes - Repeat interval
 * @returns {void}
 */
export function createAlarm(name, alarmInfo) {
  api.alarms.create(name, alarmInfo);
}

/**
 * Clear/cancel an alarm
 * 
 * Usage:
 *   await clearAlarm('my-timer');
 * 
 * @param {string} name - Alarm name to clear
 * @returns {Promise<boolean>} - Whether alarm was cleared
 */
export async function clearAlarm(name) {
  try {
    return await api.alarms.clear(name);
  } catch (error) {
    return promisify(api.alarms.clear.bind(api.alarms), name);
  }
}

/**
 * Listen for alarm events
 * 
 * Usage:
 *   onAlarm((alarm) => {
 *     if (alarm.name === 'my-timer') {
 *       console.log('Timer fired!');
 *     }
 *   });
 * 
 * @param {Function} callback - Function to handle alarm events
 * @returns {void}
 */
export function onAlarm(callback) {
  api.alarms.onAlarm.addListener(callback);
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get URL for extension resource
 * 
 * Usage:
 *   const iconPath = getExtensionURL('icons/icon48.png');
 *   // Returns: chrome-extension://[id]/icons/icon48.png
 * 
 * @param {string} path - Relative path to resource
 * @returns {string} - Full extension URL
 */
export function getExtensionURL(path) {
  return api.runtime.getURL(path);
}

/**
 * Get extension manifest data
 * 
 * Usage:
 *   const manifest = getManifest();
 *   console.log(manifest.version); // "1.0.0"
 * 
 * @returns {Object} - Manifest object
 */
export function getManifest() {
  return api.runtime.getManifest();
}

/**
 * Detect current browser
 * 
 * Usage:
 *   const browserName = getBrowser();
 *   // Returns: 'firefox', 'chrome', or 'edge'
 * 
 * @returns {string} - Browser name
 */
export function getBrowser() {
  if (typeof browser !== 'undefined') {
    return 'firefox';
  }
  // Detect Edge vs Chrome
  const isEdge = navigator.userAgent.includes('Edg/');
  return isEdge ? 'edge' : 'chrome';
}

// ============================================================================
// DEFAULT EXPORT (for CommonJS compatibility)
// ============================================================================

export default {
  getStorage,
  setStorage,
  removeStorage,
  clearStorage,
  sendMessage,
  onMessage,
  createNotification,
  clearNotification,
  onNotificationClick,
  queryTabs,
  createTab,
  createAlarm,
  clearAlarm,
  onAlarm,
  getExtensionURL,
  getManifest,
  getBrowser
};
