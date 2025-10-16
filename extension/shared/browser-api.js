/**
 * Cross-Browser API Compatibility Layer
 *
 * Handles differences between chrome.* (Chromium) and browser.* (Firefox)
 * Provides a unified, promise-based API for all browser extension APIs
 *
 * Supports: Chrome, Edge, Brave, Opera, Firefox
 *
 * @author Chase Elkins
 */

// Detect which API is available
// Note: We use globalThis to access browser/chrome safely
const isFirefox = typeof globalThis.browser !== 'undefined' && globalThis.browser?.runtime;
const isChrome = typeof globalThis.chrome !== 'undefined' && globalThis.chrome?.runtime;

if (!isFirefox && !isChrome) {
  throw new Error('Browser extension API not available');
}

// Use the available API
const browserAPI = isFirefox ? globalThis.browser : globalThis.chrome;

/**
 * Storage API - Unified promise-based storage
 * Works with both chrome.storage and browser.storage
 */
export const storage = {
  /**
   * Get items from storage
   * @param {string|string[]|null} keys - Keys to retrieve (null = all)
   * @returns {Promise<Object>} Object with key-value pairs
   */
  async get(keys) {
    return new Promise((resolve, reject) => {
      browserAPI.storage.local.get(keys, (result) => {
        if (browserAPI.runtime.lastError) {
          reject(new Error(browserAPI.runtime.lastError.message));
        } else {
          resolve(result);
        }
      });
    });
  },

  /**
   * Set items in storage
   * @param {Object} items - Key-value pairs to store
   * @returns {Promise<void>}
   */
  async set(items) {
    return new Promise((resolve, reject) => {
      browserAPI.storage.local.set(items, () => {
        if (browserAPI.runtime.lastError) {
          reject(new Error(browserAPI.runtime.lastError.message));
        } else {
          resolve();
        }
      });
    });
  },

  /**
   * Remove items from storage
   * @param {string|string[]} keys - Keys to remove
   * @returns {Promise<void>}
   */
  async remove(keys) {
    return new Promise((resolve, reject) => {
      browserAPI.storage.local.remove(keys, () => {
        if (browserAPI.runtime.lastError) {
          reject(new Error(browserAPI.runtime.lastError.message));
        } else {
          resolve();
        }
      });
    });
  },

  /**
   * Clear all storage
   * @returns {Promise<void>}
   */
  async clear() {
    return new Promise((resolve, reject) => {
      browserAPI.storage.local.clear(() => {
        if (browserAPI.runtime.lastError) {
          reject(new Error(browserAPI.runtime.lastError.message));
        } else {
          resolve();
        }
      });
    });
  },

  /**
   * Listen for storage changes
   * @param {Function} callback - Called when storage changes
   */
  onChanged: {
    addListener(callback) {
      browserAPI.storage.onChanged.addListener((changes, areaName) => {
        if (areaName === 'local') {
          callback(changes);
        }
      });
    },
    removeListener(callback) {
      browserAPI.storage.onChanged.removeListener(callback);
    }
  }
};

/**
 * Tabs API - Manage browser tabs
 */
export const tabs = {
  /**
   * Query for tabs matching criteria
   * @param {Object} queryInfo - Query criteria
   * @returns {Promise<Array>} Array of tab objects
   */
  async query(queryInfo) {
    return new Promise((resolve) => {
      browserAPI.tabs.query(queryInfo, resolve);
    });
  },

  /**
   * Get the current active tab
   * @returns {Promise<Object>} Current tab object
   */
  async getCurrent() {
    return new Promise((resolve) => {
      browserAPI.tabs.getCurrent(resolve);
    });
  },

  /**
   * Send message to specific tab
   * @param {number} tabId - Target tab ID
   * @param {*} message - Message to send
   * @returns {Promise<*>} Response from tab
   */
  async sendMessage(tabId, message) {
    return new Promise((resolve) => {
      browserAPI.tabs.sendMessage(tabId, message, resolve);
    });
  },

  /**
   * Listen for tab activation
   */
  onActivated: browserAPI.tabs.onActivated,

  /**
   * Listen for tab removal
   */
  onRemoved: browserAPI.tabs.onRemoved,

  /**
   * Listen for tab updates
   */
  onUpdated: browserAPI.tabs.onUpdated
};

/**
 * Notifications API - Show desktop notifications
 */
export const notifications = {
  /**
   * Create a notification
   * @param {string} notificationId - Unique ID
   * @param {Object} options - Notification options
   * @returns {Promise<string>} Notification ID
   */
  async create(notificationId, options) {
    return new Promise((resolve) => {
      browserAPI.notifications.create(notificationId, options, resolve);
    });
  },

  /**
   * Clear a notification
   * @param {string} notificationId - Notification to clear
   * @returns {Promise<boolean>} True if cleared
   */
  async clear(notificationId) {
    return new Promise((resolve) => {
      browserAPI.notifications.clear(notificationId, resolve);
    });
  },

  /**
   * Listen for notification clicks
   */
  onClicked: browserAPI.notifications.onClicked
};

/**
 * Alarms API - Schedule periodic or delayed tasks
 */
export const alarms = {
  /**
   * Create an alarm
   * @param {string} name - Alarm name
   * @param {Object} alarmInfo - When to fire (delayInMinutes or when)
   */
  create(name, alarmInfo) {
    browserAPI.alarms.create(name, alarmInfo);
  },

  /**
   * Clear an alarm
   * @param {string} name - Alarm name
   * @returns {Promise<boolean>} True if cleared
   */
  async clear(name) {
    return new Promise((resolve) => {
      browserAPI.alarms.clear(name, resolve);
    });
  },

  /**
   * Get an alarm
   * @param {string} name - Alarm name
   * @returns {Promise<Object>} Alarm object
   */
  async get(name) {
    return new Promise((resolve) => {
      browserAPI.alarms.get(name, resolve);
    });
  },

  /**
   * Get all alarms
   * @returns {Promise<Array>} Array of alarms
   */
  async getAll() {
    return new Promise((resolve) => {
      browserAPI.alarms.getAll(resolve);
    });
  },

  /**
   * Listen for alarm triggers
   */
  onAlarm: browserAPI.alarms.onAlarm
};

/**
 * Runtime API - Messaging and extension info
 */
export const runtime = {
  /**
   * Send message to background or popup
   * @param {*} message - Message to send
   * @returns {Promise<*>} Response
   */
  async sendMessage(message) {
    return new Promise((resolve) => {
      browserAPI.runtime.sendMessage(message, resolve);
    });
  },

  /**
   * Listen for messages
   */
  onMessage: browserAPI.runtime.onMessage,

  /**
   * Get extension URL
   * @param {string} path - Path to resource
   * @returns {string} Full URL
   */
  getURL(path) {
    return browserAPI.runtime.getURL(path);
  },

  /**
   * Get extension ID
   */
  get id() {
    return browserAPI.runtime.id;
  },

  /**
   * Listen for extension install/update
   */
  onInstalled: browserAPI.runtime.onInstalled
};

/**
 * Commands API - Keyboard shortcuts
 */
export const commands = {
  /**
   * Listen for command execution
   */
  onCommand: browserAPI.commands?.onCommand
};

// Export browser detection
export const browser = {
  isFirefox,
  isChrome,
  isEdge: navigator.userAgent.includes('Edg/'),
  isBrave: navigator.brave !== undefined,
  isOpera: navigator.userAgent.includes('OPR/')
};

// Default export for convenience
export default {
  storage,
  tabs,
  notifications,
  alarms,
  runtime,
  commands,
  browser
};
