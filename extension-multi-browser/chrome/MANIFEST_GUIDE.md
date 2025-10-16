# FocusBubble Manifest V3 - Complete Guide

This document explains every field in the `manifest.json` file for developers who want to customize or understand the extension configuration.

---

## 📋 Table of Contents

1. [Extension Identity](#extension-identity)
2. [Icons](#icons)
3. [Popup Action](#popup-action)
4. [Background Service Worker](#background-service-worker)
5. [Content Scripts](#content-scripts)
6. [Permissions](#permissions)
7. [Host Permissions](#host-permissions)
8. [Keyboard Commands](#keyboard-commands)
9. [Web Accessible Resources](#web-accessible-resources)
10. [Content Security Policy](#content-security-policy)
11. [Optional Features](#optional-features)
12. [Best Practices](#best-practices)

---

## 🆔 Extension Identity

```json
"manifest_version": 3,
"name": "FocusBubble - Focus Timer & Distraction Tracker",
"short_name": "FocusBubble",
"version": "1.0.0",
"description": "Stay focused with a floating timer bubble...",
"author": "Krubles Team",
"homepage_url": "https://github.com/C-Elkins/focusbubble"
```

### Fields Explained:

- **`manifest_version`**: Must be `3` for new extensions (Manifest V2 deprecated in 2024)
- **`name`**: Full name shown in Chrome Web Store (max 75 characters, includes SEO keywords)
- **`short_name`**: Abbreviated name for small spaces (max 12 characters, used in launcher/taskbar)
- **`version`**: Semantic versioning (MAJOR.MINOR.PATCH) - increment for each release
- **`description`**: Shown in store listing and extension management (max 132 characters)
- **`author`**: Developer/team name (optional but recommended)
- **`homepage_url`**: Link to project website or GitHub repo

### Customization Tips:
- Include keywords in `name` and `description` for better discoverability
- Version format: `1.0.0` → `1.0.1` (bug fix), `1.1.0` (new feature), `2.0.0` (breaking change)
- `short_name` appears in Chrome's app launcher - keep it memorable

---

## 🖼️ Icons

```json
"icons": {
  "16": "icons/icon16.png",
  "32": "icons/icon32.png",
  "48": "icons/icon48.png",
  "128": "icons/icon128.png"
}
```

### Icon Usage:

| Size | Used For |
|------|----------|
| 16px | Favicon, browser toolbar (standard displays) |
| 32px | Windows taskbar, retina toolbar (high-DPI) |
| 48px | Extension management page (`chrome://extensions`) |
| 128px | Chrome Web Store listing, installation dialog |

### Requirements:
- **Format**: PNG with transparency (RGBA)
- **Color Space**: sRGB
- **File Size**: Keep each under 50KB for fast loading
- **Design**: Simple, recognizable at 16px size

### Customization:
```json
"icons": {
  "16": "assets/images/icon-16.png",
  "48": "assets/images/icon-48.png",
  "128": "assets/images/icon-128.png"
}
```

---

## 🎛️ Popup Action

```json
"action": {
  "default_popup": "popup/index.html",
  "default_title": "FocusBubble - Start Focus Session",
  "default_icon": {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  }
}
```

### Fields Explained:

- **`default_popup`**: HTML file shown when user clicks toolbar icon (your React app entry point)
- **`default_title`**: Tooltip text on hover over toolbar icon
- **`default_icon`**: Icons for toolbar (can differ from main extension icons)

### React/Tailwind Build Setup:

If using a build process, update paths after building:

```json
"default_popup": "dist/index.html"
```

### Disabling Popup (Programmatically):

```javascript
// In background.js - remove popup on certain conditions
chrome.action.setPopup({ popup: '' });
```

---

## ⚙️ Background Service Worker

```json
"background": {
  "service_worker": "background.js",
  "type": "module"
}
```

### Key Concepts:

**Service Worker Lifecycle:**
- Event-driven (not always running)
- Browser terminates after 30 seconds of inactivity
- Automatically restarted when events occur (alarm, message, etc.)

**Critical Rules:**
1. ❌ **DON'T use** `setTimeout()` or `setInterval()` - will be lost when worker terminates
2. ✅ **DO use** `chrome.alarms` API for persistent timing
3. ✅ Store state in `chrome.storage.local` (persists across restarts)
4. ✅ All async code must use Promises (no callbacks in MV3)

### Example:

```javascript
// ❌ BAD - Lost when service worker terminates
setTimeout(() => {
  console.log('This may never run!');
}, 60000);

// ✅ GOOD - Alarm persists
chrome.alarms.create('myTimer', { delayInMinutes: 1 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'myTimer') {
    console.log('This will run reliably!');
  }
});
```

### Module Type:

- **`"type": "module"`**: Enables ES6 `import`/`export` syntax
- Required for using shared utilities from `/shared` folder

---

## 📝 Content Scripts

```json
"content_scripts": [
  {
    "matches": ["<all_urls>"],
    "js": ["contentScript.js"],
    "css": ["../shared/styles.css"],
    "run_at": "document_end",
    "all_frames": false
  }
]
```

### Fields Explained:

- **`matches`**: URL patterns where script is injected
  - `"<all_urls>"` - All HTTP/HTTPS pages
  - `"https://*/*"` - All HTTPS pages
  - `"https://github.com/*"` - Specific domain
  - `["https://github.com/*", "https://gitlab.com/*"]` - Multiple patterns

- **`js`**: JavaScript files to inject (order matters if multiple)
- **`css`**: Stylesheets to inject (isolated from page styles)
- **`run_at`**: Injection timing
  - `"document_start"` - Before DOM loads
  - `"document_end"` - After DOM loads, before images (**recommended**)
  - `"document_idle"` - After window.onload

- **`all_frames`**: 
  - `false` - Inject only in main page (default)
  - `true` - Inject in all iframes too

### Excluding Specific Sites:

```json
"content_scripts": [
  {
    "matches": ["<all_urls>"],
    "exclude_matches": [
      "https://bank.com/*",
      "https://mail.google.com/*"
    ],
    "js": ["contentScript.js"]
  }
]
```

### Multiple Content Scripts:

```json
"content_scripts": [
  {
    "matches": ["https://github.com/*"],
    "js": ["github-integration.js"]
  },
  {
    "matches": ["<all_urls>"],
    "js": ["contentScript.js"]
  }
]
```

### Content Script Isolation:

Content scripts run in an **isolated world**:
- ✅ Can access and modify DOM
- ✅ Can use Chrome APIs (limited set)
- ❌ Cannot access page's JavaScript variables
- ❌ Cannot call page's functions directly

To communicate with page scripts, use `window.postMessage()`.

---

## 🔐 Permissions

```json
"permissions": [
  "storage",
  "tabs",
  "activeTab",
  "notifications",
  "alarms",
  "scripting"
]
```

### Permission Descriptions:

| Permission | Purpose | User Impact |
|------------|---------|-------------|
| `storage` | Store timer data, sessions, settings | Silent (no prompt) |
| `tabs` | Query active tab, detect distractions | "Read browsing history" warning ⚠️ |
| `activeTab` | Access current tab when user interacts | Silent (granted on click) |
| `notifications` | Show timer completion alerts | Silent (user can disable) |
| `alarms` | Persistent timers that survive restarts | Silent |
| `scripting` | Inject scripts dynamically | Silent (if used with `activeTab`) |

### Minimizing Permissions:

**Before publishing**, remove unused permissions:

```json
"permissions": [
  "storage",
  "activeTab",
  "notifications",
  "alarms"
]
```

**Use `activeTab` instead of `tabs`** if you don't need to query all tabs - it's less scary for users!

### Optional Permissions:

For AI features, make them optional:

```json
"optional_permissions": [
  "https://api.openai.com/*"
],
"permissions": [
  "storage",
  "activeTab"
]
```

Request at runtime:
```javascript
chrome.permissions.request({
  origins: ['https://api.openai.com/*']
});
```

---

## 🌐 Host Permissions

```json
"host_permissions": [
  "<all_urls>"
]
```

### Why Needed:

- Inject content scripts on all websites (floating bubble)
- Make API calls to external services (OpenAI, Claude)

### Alternatives to `<all_urls>`:

If you want to reduce permission warnings:

```json
"host_permissions": []
```

Then use `activeTab` permission + user grants access per-tab when they click the extension.

### For AI APIs Only:

```json
"host_permissions": [
  "https://api.openai.com/*",
  "https://api.anthropic.com/*"
]
```

But this won't allow content script on all pages - you'd need to inject dynamically:

```javascript
chrome.scripting.executeScript({
  target: { tabId: tab.id },
  files: ['contentScript.js']
});
```

---

## ⌨️ Keyboard Commands

```json
"commands": {
  "start-timer": {
    "suggested_key": {
      "default": "Ctrl+Shift+F",
      "mac": "Command+Shift+F",
      "windows": "Ctrl+Shift+F",
      "linux": "Ctrl+Shift+F"
    },
    "description": "Start focus timer"
  }
}
```

### Handling Commands:

In `background.js`:

```javascript
chrome.commands.onCommand.addListener((command) => {
  if (command === 'start-timer') {
    // Start timer logic
    startTimer();
  } else if (command === 'stop-timer') {
    stopTimer();
  }
});
```

### Keyboard Shortcut Rules:

- Must include a modifier key: `Ctrl`, `Alt`, `Command` (Mac), `Shift`
- Cannot override browser shortcuts (e.g., `Ctrl+T`)
- Users can customize in `chrome://extensions/shortcuts`

### Global vs. Page Commands:

```json
"commands": {
  "_execute_action": {
    "suggested_key": {
      "default": "Ctrl+Shift+F"
    },
    "description": "Open extension popup"
  }
}
```

Special command `_execute_action` opens the popup (equivalent to clicking icon).

---

## 🔗 Web Accessible Resources

```json
"web_accessible_resources": [
  {
    "resources": [
      "icons/*.png",
      "shared/styles.css"
    ],
    "matches": ["<all_urls>"]
  }
]
```

### When Needed:

Allows web pages to access extension files via `chrome-extension://` URL.

**Use Cases:**
- Content script needs to inject images
- Page needs to load extension CSS
- Injecting iframe with extension HTML

### Example Usage:

In `contentScript.js`:

```javascript
const iconUrl = chrome.runtime.getURL('icons/icon48.png');
const img = document.createElement('img');
img.src = iconUrl; // chrome-extension://[id]/icons/icon48.png
document.body.appendChild(img);
```

### Security Note:

Only expose necessary files - exposed resources can be accessed by **any website**.

---

## 🔒 Content Security Policy

```json
"content_security_policy": {
  "extension_pages": "script-src 'self'; object-src 'self';"
}
```

### What It Does:

Restricts what extension pages (popup, options) can do:

- ✅ Can load scripts from extension files only (`'self'`)
- ❌ Cannot use `eval()` or inline scripts
- ❌ Cannot load external scripts from CDNs

### Manifest V3 CSP Rules:

**These are NOT allowed:**
```html
<!-- ❌ Inline scripts -->
<script>alert('hi');</script>

<!-- ❌ External scripts -->
<script src="https://cdn.jsdelivr.net/jquery.js"></script>

<!-- ❌ eval() -->
<script>eval('alert("hi")');</script>
```

**Do this instead:**
```html
<!-- ✅ Local script file -->
<script src="popup.js"></script>
```

### Relaxing CSP (Not Recommended):

```json
"content_security_policy": {
  "extension_pages": "script-src 'self' 'wasm-unsafe-eval'; object-src 'self';"
}
```

Only add `'wasm-unsafe-eval'` if using WebAssembly.

---

## 🎨 Optional Features

### Options Page (Settings):

```json
"options_page": "options/index.html"
```

Opens in new tab. Or use embedded:

```json
"options_ui": {
  "page": "options/index.html",
  "open_in_tab": false
}
```

Opens in modal (embedded in `chrome://extensions`).

### Override New Tab:

```json
"chrome_url_overrides": {
  "newtab": "dashboard/index.html"
}
```

⚠️ **Caution**: Many users dislike extensions that override new tab. Only do this if it's core to your extension's value.

### Side Panel (Chrome 114+):

```json
"side_panel": {
  "default_path": "sidepanel/index.html"
}
```

Opens a sidebar instead of popup.

### Omnibox (Address Bar):

```json
"omnibox": {
  "keyword": "focus"
}
```

User types `focus` + Tab in address bar to trigger your extension.

---

## 🎯 Best Practices

### 1. Minimize Permissions

❌ **Bad:**
```json
"permissions": ["storage", "tabs", "history", "bookmarks", "cookies"]
```

✅ **Good:**
```json
"permissions": ["storage", "activeTab", "alarms"]
```

**Why**: Users are suspicious of extensions requesting many permissions. Only request what you absolutely need.

---

### 2. Use Declarative Permissions

Instead of broad `"tabs"` permission, use:

```json
"permissions": ["activeTab"]
```

Grants access only when user clicks extension icon.

---

### 3. Service Worker Best Practices

```javascript
// ❌ BAD - Doesn't persist
let timerState = { active: false };

// ✅ GOOD - Persists across restarts
chrome.storage.local.set({ timerState: { active: false } });
```

---

### 4. Handle Service Worker Restarts

```javascript
// On startup, restore state
chrome.runtime.onStartup.addListener(async () => {
  const { timerState } = await chrome.storage.local.get('timerState');
  if (timerState?.active) {
    // Recreate alarms, update badge, etc.
    recreateTimer(timerState);
  }
});
```

---

### 5. Version Updates

When updating `version` in manifest:

```json
"version": "1.0.1"
```

Also update in `package.json` (if using npm):

```json
{
  "version": "1.0.1"
}
```

Listen for updates:

```javascript
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'update') {
    console.log('Updated from', details.previousVersion);
    // Run migration logic if needed
  }
});
```

---

### 6. Test Before Publishing

1. **Load unpacked** in `chrome://extensions/`
2. Test all features
3. Check console for errors
4. Test on different websites
5. Test after browser restart (service worker restoration)
6. Test keyboard shortcuts
7. Test with slow network (for API calls)

---

### 7. Production Checklist

Before submitting to Chrome Web Store:

- [ ] Remove `console.log()` statements
- [ ] Minify JavaScript files
- [ ] Optimize images (compress PNGs)
- [ ] Remove unused permissions
- [ ] Test in incognito mode
- [ ] Test with extension enabled/disabled
- [ ] Add privacy policy URL
- [ ] Create store screenshots (1280×800px or 640×400px)
- [ ] Write compelling store description

---

## 🚀 Building for Production

### React Build Configuration

If using Create React App for popup:

```bash
cd popup
npm run build
```

Update manifest to point to build output:

```json
"action": {
  "default_popup": "popup/build/index.html"
}
```

### Directory Structure for Production:

```
chrome/
├── manifest.json
├── background.js
├── contentScript.js
├── popup/
│   └── build/
│       ├── index.html
│       └── static/
│           ├── js/
│           └── css/
├── icons/
└── shared/
```

---

## 📦 Packaging for Chrome Web Store

1. Create ZIP of `/chrome/` folder:
   ```bash
   cd extension-multi-browser/chrome
   zip -r focusbubble-v1.0.0.zip . -x "*.DS_Store" -x "node_modules/*"
   ```

2. Upload to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)

3. Fill out store listing (use `STORE_LISTING.md` from release pack)

---

## 🔧 Troubleshooting

### "Service worker registration failed"

**Cause**: Syntax error in `background.js`

**Fix**: Check console in `chrome://extensions/` for error details

---

### "Could not load icon"

**Cause**: Icon path incorrect in manifest

**Fix**: Verify paths are relative to manifest.json location:
```json
"icons": {
  "16": "icons/icon16.png"  // ✅ Correct
  // NOT "/icons/icon16.png" or "./icons/icon16.png"
}
```

---

### Content script not injecting

**Cause**: Missing `host_permissions` or incorrect `matches` pattern

**Fix**: Ensure `"host_permissions": ["<all_urls>"]` is present

---

### Alarms not firing

**Cause**: Service worker not restarting properly

**Fix**: Recreate alarms in `chrome.runtime.onStartup` listener

---

## 📚 Additional Resources

- [Chrome Extension Docs](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Migration Guide](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [Service Worker Lifecycle](https://developer.chrome.com/docs/extensions/mv3/service_workers/)
- [chrome.alarms API](https://developer.chrome.com/docs/extensions/reference/alarms/)

---

**Made by Krubles Team** | GitHub: [@C-Elkins](https://github.com/C-Elkins)

For questions, open an issue on GitHub or contact support@krublesteam.com
