/**
 * browserApi.js - Cross-Browser API Wrapper
 * 
 * Normalizes differences between Chrome (chrome.*) and Firefox (browser.*)
 * Provides consistent API for storage, tabs, notifications, and scripting
 * 
 * Usage: Import this in all extension files instead of using chrome.* directly
 */

// Detect which API is available
const browserAPI = (() => {
  // Firefox uses browser.* (returns Promises)
  if (typeof browser !== 'undefined') {
    return browser;
  }
  
  // Chrome uses chrome.* (callback-based, but newer versions support promises)
  if (typeof chrome !== 'undefined') {
    return chrome;
  }
  
  // Fallback for testing/development
  return null;
})();

/**
 * Storage API - Unified interface for chrome.storage / browser.storage
 */
export const storage = {
  /**
   * Get items from storage
   * @param {string|string[]|object} keys - Key(s) to retrieve or defaults
   * @returns {Promise<object>} Retrieved data
   */
  async get(keys) {
    if (!browserAPI?.storage) {
      console.warn('Storage API not available');
      return {};
    }
    
    // Firefox returns promise, Chrome needs promisification
    if (browserAPI.storage.local.get.length === 1) {
      // Modern Chrome/Firefox with promise support
      return browserAPI.storage.local.get(keys);
    } else {
      // Older Chrome with callbacks
      return new Promise((resolve, reject) => {
        browserAPI.storage.local.get(keys, (result) => {
          if (browserAPI.runtime.lastError) {
            reject(browserAPI.runtime.lastError);
          } else {
            resolve(result);
          }
        });
      });
    }
  },

  /**
   * Set items in storage
   * @param {object} items - Key-value pairs to store
   * @returns {Promise<void>}
   */
  async set(items) {
    if (!browserAPI?.storage) {
      console.warn('Storage API not available');
      return;
    }
    
    if (browserAPI.storage.local.set.length === 1) {
      return browserAPI.storage.local.set(items);
    } else {
      return new Promise((resolve, reject) => {
        browserAPI.storage.local.set(items, () => {
          if (browserAPI.runtime.lastError) {
            reject(browserAPI.runtime.lastError);
          } else {
            resolve();
          }
        });
      });
    }
  },

  /**
   * Remove items from storage
   * @param {string|string[]} keys - Key(s) to remove
   * @returns {Promise<void>}
   */
  async remove(keys) {
    if (!browserAPI?.storage) {
      console.warn('Storage API not available');
      return;
    }
    
    if (browserAPI.storage.local.remove.length === 1) {
      return browserAPI.storage.local.remove(keys);
    } else {
      return new Promise((resolve, reject) => {
        browserAPI.storage.local.remove(keys, () => {
          if (browserAPI.runtime.lastError) {
            reject(browserAPI.runtime.lastError);
          } else {
            resolve();
          }
        });
      });
    }
  },

  /**
   * Clear all storage
   * @returns {Promise<void>}
   */
  async clear() {
    if (!browserAPI?.storage) {
      console.warn('Storage API not available');
      return;
    }
    
    if (browserAPI.storage.local.clear.length === 0) {
      return browserAPI.storage.local.clear();
    } else {
      return new Promise((resolve, reject) => {
        browserAPI.storage.local.clear(() => {
          if (browserAPI.runtime.lastError) {
            reject(browserAPI.runtime.lastError);
          } else {
            resolve();
          }
        });
      });
    }
  }
};

/**
 * Tabs API - Query and manage browser tabs
 */
export const tabs = {
  /**
   * Get current active tab
   * @returns {Promise<object>} Active tab object
   */
  async getCurrent() {
    if (!browserAPI?.tabs) {
      console.warn('Tabs API not available');
      return null;
    }
    
    const [tab] = await browserAPI.tabs.query({ active: true, currentWindow: true });
    return tab;
  },

  /**
   * Query tabs
   * @param {object} queryInfo - Query parameters
   * @returns {Promise<array>} Array of matching tabs
   */
  async query(queryInfo) {
    if (!browserAPI?.tabs) {
      console.warn('Tabs API not available');
      return [];
    }
    
    if (browserAPI.tabs.query.length === 1) {
      return browserAPI.tabs.query(queryInfo);
    } else {
      return new Promise((resolve, reject) => {
        browserAPI.tabs.query(queryInfo, (tabs) => {
          if (browserAPI.runtime.lastError) {
            reject(browserAPI.runtime.lastError);
          } else {
            resolve(tabs);
          }
        });
      });
    }
  },

  /**
   * Send message to tab
   * @param {number} tabId - Tab ID
   * @param {any} message - Message to send
   * @returns {Promise<any>} Response from tab
   */
  async sendMessage(tabId, message) {
    if (!browserAPI?.tabs) {
      console.warn('Tabs API not available');
      return null;
    }
    
    if (browserAPI.tabs.sendMessage.length === 2) {
      return browserAPI.tabs.sendMessage(tabId, message);
    } else {
      return new Promise((resolve, reject) => {
        browserAPI.tabs.sendMessage(tabId, message, (response) => {
          if (browserAPI.runtime.lastError) {
            reject(browserAPI.runtime.lastError);
          } else {
            resolve(response);
          }
        });
      });
    }
  }
};

/**
 * Notifications API - Show browser notifications
 */
export const notifications = {
  /**
   * Create notification
   * @param {string} id - Notification ID
   * @param {object} options - Notification options
   * @returns {Promise<string>} Notification ID
   */
  async create(id, options) {
    if (!browserAPI?.notifications) {
      console.warn('Notifications API not available');
      return null;
    }
    
    const notificationOptions = {
      type: 'basic',
      iconUrl: browserAPI.runtime.getURL('icons/icon128.png'),
      title: options.title || 'FocusBubble',
      message: options.message || '',
      priority: options.priority || 0,
      ...options
    };
    
    if (browserAPI.notifications.create.length === 2) {
      return browserAPI.notifications.create(id, notificationOptions);
    } else {
      return new Promise((resolve, reject) => {
        browserAPI.notifications.create(id, notificationOptions, (notificationId) => {
          if (browserAPI.runtime.lastError) {
            reject(browserAPI.runtime.lastError);
          } else {
            resolve(notificationId);
          }
        });
      });
    }
  },

  /**
   * Clear notification
   * @param {string} id - Notification ID
   * @returns {Promise<boolean>} Success status
   */
  async clear(id) {
    if (!browserAPI?.notifications) {
      console.warn('Notifications API not available');
      return false;
    }
    
    if (browserAPI.notifications.clear.length === 1) {
      return browserAPI.notifications.clear(id);
    } else {
      return new Promise((resolve, reject) => {
        browserAPI.notifications.clear(id, (wasCleared) => {
          if (browserAPI.runtime.lastError) {
            reject(browserAPI.runtime.lastError);
          } else {
            resolve(wasCleared);
          }
        });
      });
    }
  }
};

/**
 * Runtime API - Extension lifecycle and messaging
 */
export const runtime = {
  /**
   * Send message to extension
   * @param {any} message - Message to send
   * @returns {Promise<any>} Response from recipient
   */
  async sendMessage(message) {
    if (!browserAPI?.runtime) {
      console.warn('Runtime API not available');
      return null;
    }
    
    if (browserAPI.runtime.sendMessage.length === 1) {
      return browserAPI.runtime.sendMessage(message);
    } else {
      return new Promise((resolve, reject) => {
        browserAPI.runtime.sendMessage(message, (response) => {
          if (browserAPI.runtime.lastError) {
            reject(browserAPI.runtime.lastError);
          } else {
            resolve(response);
          }
        });
      });
    }
  },

  /**
   * Add message listener
   * @param {function} callback - Listener function (message, sender, sendResponse)
   */
  onMessage: {
    addListener(callback) {
      if (!browserAPI?.runtime) {
        console.warn('Runtime API not available');
        return;
      }
      browserAPI.runtime.onMessage.addListener(callback);
    },
    
    removeListener(callback) {
      if (!browserAPI?.runtime) return;
      browserAPI.runtime.onMessage.removeListener(callback);
    }
  },

  /**
   * Get extension URL
   * @param {string} path - Path to resource
   * @returns {string} Full URL
   */
  getURL(path) {
    if (!browserAPI?.runtime) {
      console.warn('Runtime API not available');
      return '';
    }
    return browserAPI.runtime.getURL(path);
  }
};

/**
 * Alarms API - Background timers
 */
export const alarms = {
  /**
   * Create alarm
   * @param {string} name - Alarm name
   * @param {object} alarmInfo - Alarm configuration
   * @returns {Promise<void>}
   */
  async create(name, alarmInfo) {
    if (!browserAPI?.alarms) {
      console.warn('Alarms API not available');
      return;
    }
    
    // Alarms API doesn't return promise in most browsers
    browserAPI.alarms.create(name, alarmInfo);
  },

  /**
   * Clear alarm
   * @param {string} name - Alarm name
   * @returns {Promise<boolean>} Success status
   */
  async clear(name) {
    if (!browserAPI?.alarms) {
      console.warn('Alarms API not available');
      return false;
    }
    
    if (browserAPI.alarms.clear.length === 1) {
      return browserAPI.alarms.clear(name);
    } else {
      return new Promise((resolve) => {
        browserAPI.alarms.clear(name, (wasCleared) => {
          resolve(wasCleared);
        });
      });
    }
  },

  /**
   * Add alarm listener
   * @param {function} callback - Listener function
   */
  onAlarm: {
    addListener(callback) {
      if (!browserAPI?.alarms) {
        console.warn('Alarms API not available');
        return;
      }
      browserAPI.alarms.onAlarm.addListener(callback);
    },
    
    removeListener(callback) {
      if (!browserAPI?.alarms) return;
      browserAPI.alarms.onAlarm.removeListener(callback);
    }
  }
};

// Export the raw browser API as well (for edge cases)
export { browserAPI };

// Default export
export default {
  storage,
  tabs,
  notifications,
  runtime,
  alarms,
  browserAPI
};

/**
 * EXAMPLE USAGE:
 * 
 * // In background/service-worker.js:
 * import { storage, alarms, notifications } from '../shared/browserApi.js';
 * 
 * // Store timer state
 * await storage.set({ timerActive: true, startTime: Date.now() });
 * 
 * // Create alarm
 * await alarms.create('focusTimer', { delayInMinutes: 25 });
 * 
 * // Listen for alarm
 * alarms.onAlarm.addListener((alarm) => {
 *   if (alarm.name === 'focusTimer') {
 *     notifications.create('timer-complete', {
 *       title: 'Focus Session Complete!',
 *       message: 'Great job! Take a 5-minute break.'
 *     });
 *   }
 * });
 * 
 * // In popup/popup.js:
 * import { storage, runtime } from '../shared/browserApi.js';
 * 
 * // Get stored data
 * const data = await storage.get(['timerActive', 'startTime']);
 * console.log('Timer active:', data.timerActive);
 * 
 * // Send message to background
 * const response = await runtime.sendMessage({ type: 'START_TIMER', duration: 25 });
 * console.log('Timer started:', response.success);
 * 
 * // In content/content.js:
 * import { runtime, tabs } from '../shared/browserApi.js';
 * 
 * // Send message to background
 * runtime.sendMessage({ type: 'DISTRACTION_DETECTED', url: window.location.href });
 * 
 * // Listen for messages
 * runtime.onMessage.addListener((message, sender, sendResponse) => {
 *   if (message.type === 'TIMER_TICK') {
 *     updateBubble(message.timeRemaining);
 *     sendResponse({ received: true });
 *   }
 *   return true; // Keep channel open for async response
 * });
 */
