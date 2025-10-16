# FocusBubble - Firefox Manifest Guide

## 🦊 Firefox vs Chrome Differences

This document explains the key differences between the Firefox and Chrome versions of FocusBubble.

---

## 📋 Manifest Differences

### 1. Background Scripts

**Chrome (Manifest V3):**
```json
"background": {
  "service_worker": "background.js",
  "type": "module"
}
```

**Firefox (Manifest V3):**
```json
"background": {
  "scripts": ["../chrome/background.js"],
  "type": "module"
}
```

**Key Difference:**
- Firefox uses `"scripts"` array instead of `"service_worker"` string
- Both support ES6 modules with `"type": "module"`
- Firefox 109+ fully supports Manifest V3

---

### 2. Browser-Specific Settings

**Firefox Requires:**
```json
"browser_specific_settings": {
  "gecko": {
    "id": "focusbubble@krublesteam.com",
    "strict_min_version": "109.0"
  }
}
```

**Required Fields:**
- `id`: Unique extension ID (email format recommended)
- `strict_min_version`: Minimum Firefox version (109.0 for MV3)

**Important:** This ID is **permanent** and must match across all updates on AMO (addons.mozilla.org)

---

### 3. API Namespace

Firefox supports **both** `chrome.*` and `browser.*` namespaces:

```javascript
// ✅ Works in Firefox
chrome.storage.local.get(['data']);
browser.storage.local.get(['data']);

// ✅ Recommended for cross-browser
const browserAPI = typeof browser !== 'undefined' ? browser : chrome;
browserAPI.storage.local.get(['data']);
```

**Our Implementation:**
The `/shared/browserApi.js` wrapper handles this automatically:

```javascript
// In shared/browserApi.js
const browserAPI = typeof browser !== 'undefined' ? browser : chrome;
```

---

### 4. Promises vs Callbacks

**Firefox Native Promises:**
```javascript
// Firefox - native Promise support
const data = await browser.storage.local.get(['sessions']);

// Chrome - requires promisification or callback
chrome.storage.local.get(['sessions'], (result) => {
  console.log(result);
});
```

**Our Solution:**
The `browserApi.js` wrapper converts everything to Promises:

```javascript
// Works in both browsers
const data = await browserApi.storage.local.get(['sessions']);
```

---

## 🔧 Code Compatibility

### Service Worker vs Background Script

**Chrome Service Worker Limitations:**
- Terminated after 30 seconds of inactivity
- No DOM access
- Must use `chrome.alarms` for persistent timing

**Firefox Background Script:**
- Event page model (similar to MV2)
- More persistent than Chrome service workers
- Can still use `chrome.alarms` for consistency

**Best Practice:**
Write code that works in both - use `chrome.alarms` and avoid assumptions about persistence:

```javascript
// ✅ GOOD - Works in both
chrome.alarms.create('timer', { delayInMinutes: 1 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'timer') {
    // Handle timer
  }
});

// ❌ BAD - Unreliable in Chrome
setTimeout(() => {
  // May not execute if service worker terminates
}, 60000);
```

---

## 📦 File Structure

Firefox manifest references Chrome files using relative paths:

```
extension-multi-browser/
├── firefox/
│   ├── manifest.json          ← Firefox-specific manifest
│   └── FIREFOX_GUIDE.md       ← This file
├── chrome/
│   ├── background.js          ← Shared by Firefox
│   ├── contentScript.js       ← Shared by Firefox
│   ├── popup/                 ← Shared by Firefox
│   └── icons/                 ← Shared by Firefox
└── shared/
    ├── browserApi.js          ← Cross-browser wrapper
    └── ...
```

**Why This Works:**
- Reduces code duplication
- Single codebase for multiple browsers
- Only manifests differ

---

## 🚀 Testing in Firefox

### Load Temporary Add-on

1. Open Firefox and navigate to:
   ```
   about:debugging#/runtime/this-firefox
   ```

2. Click **"Load Temporary Add-on..."**

3. Navigate to:
   ```
   /Users/chaseelkins/Documents/focusbubble/extension-multi-browser/firefox/
   ```

4. Select `manifest.json`

5. Extension loads! 🎉

### Limitations of Temporary Add-ons

- Removed when Firefox restarts
- For persistent testing, use `web-ext` tool or sign the extension

---

## 🛠️ Development with web-ext

### Install web-ext

```bash
npm install -g web-ext
```

### Run in Firefox

```bash
cd /Users/chaseelkins/Documents/focusbubble/extension-multi-browser/firefox
web-ext run
```

This launches Firefox with the extension pre-loaded.

### Auto-reload on Changes

```bash
web-ext run --watch-file ../chrome/background.js --watch-file ../chrome/contentScript.js
```

### Lint Extension

```bash
web-ext lint
```

Validates manifest and checks for common issues.

---

## 📝 Firefox-Specific Permissions

### Removed from Firefox Manifest

**Chrome has:**
```json
"permissions": ["scripting"]
```

**Firefox doesn't need:**
- `"scripting"` - Not required for content scripts in Firefox
- Automatically has access to inject scripts with `"tabs"` permission

### Content Security Policy

Firefox enforces stricter CSP by default. If you have issues:

```json
"content_security_policy": {
  "extension_pages": "script-src 'self'; object-src 'self';"
}
```

---

## 🎨 UI Differences

### Browser Action Icon

Firefox displays action icons differently:

**Chrome:**
- 16px for standard displays
- 32px for high-DPI displays

**Firefox:**
- Uses SVG if provided (better scaling)
- Falls back to PNG sizes

**Recommendation:**
Our PNG icons work fine, but consider adding SVG for Firefox:

```json
"action": {
  "default_icon": {
    "16": "../chrome/icons/icon.svg",
    "32": "../chrome/icons/icon.svg"
  }
}
```

### Popup Sizing

**Firefox:**
- Default popup size: 800×600px
- User can resize by dragging corner

**Chrome:**
- Popup size determined by content
- Max width: 800px, max height: 600px

**Fix:**
Set explicit dimensions in popup CSS:

```css
body {
  width: 360px;
  min-height: 500px;
}
```

---

## 🔐 AMO Submission Requirements

### 1. Extension ID

Must be set in manifest:

```json
"browser_specific_settings": {
  "gecko": {
    "id": "focusbubble@krublesteam.com"
  }
}
```

**Format Options:**
- Email-like: `addon@domain.com`
- GUID: `{12345678-1234-1234-1234-123456789012}`

### 2. Source Code Review

If using minified/compiled code (React build):

- ✅ **Must provide source code** to Mozilla reviewers
- Include `package.json` and build instructions
- Document how to reproduce the build

### 3. Privacy Policy

Required if extension:
- Collects user data
- Makes network requests
- Uses analytics

**FocusBubble:**
- Stores data locally only
- No analytics (currently)
- AI features are optional

**Still Recommended:**
Include privacy policy URL in AMO listing.

---

## 🌐 Cross-Browser API Usage

### Storage API

**Both browsers:**
```javascript
// Get
const data = await browserApi.storage.local.get(['key']);

// Set
await browserApi.storage.local.set({ key: 'value' });

// Remove
await browserApi.storage.local.remove(['key']);

// Clear
await browserApi.storage.local.clear();
```

### Tabs API

**Both browsers:**
```javascript
// Query tabs
const tabs = await browserApi.tabs.query({ active: true });

// Send message to tab
await browserApi.tabs.sendMessage(tabId, { type: 'MESSAGE' });

// Create new tab
await browserApi.tabs.create({ url: 'https://example.com' });
```

### Alarms API

**Both browsers:**
```javascript
// Create alarm
browserApi.alarms.create('timer', { delayInMinutes: 1 });

// Listen for alarms
browserApi.alarms.onAlarm.addListener((alarm) => {
  console.log(alarm.name);
});

// Clear alarm
await browserApi.alarms.clear('timer');
```

### Notifications API

**Both browsers:**
```javascript
await browserApi.notifications.create('id', {
  type: 'basic',
  title: 'Timer Complete',
  message: 'Great focus session!',
  iconUrl: browserApi.runtime.getURL('icons/icon48.png')
});
```

**Firefox Difference:**
- Uses `iconUrl` (not `iconURL`)
- Desktop integration may look different

---

## 🐛 Common Issues

### Issue 1: "browser is not defined"

**Cause:** Using `browser.*` in Chrome

**Fix:** Use our browserApi wrapper:
```javascript
import browserApi from '../shared/browserApi.js';
browserApi.storage.local.get(['data']);
```

### Issue 2: Background script not reloading

**Cause:** Firefox caches background script

**Fix:** 
1. Go to `about:debugging`
2. Click "Reload" on extension
3. Or use `web-ext run` with `--watch-file`

### Issue 3: Content script not injecting

**Cause:** Missing host permissions

**Fix:** Ensure manifest has:
```json
"host_permissions": ["<all_urls>"]
```

### Issue 4: Popup doesn't match Chrome styling

**Cause:** Firefox uses native UI elements

**Fix:** Set `browser_style: false` in manifest:
```json
"action": {
  "browser_style": false
}
```

### Issue 5: Extension ID conflict on AMO

**Cause:** ID already taken or changed between submissions

**Fix:** 
- Use unique ID: `focusbubble@krublesteam.com`
- Never change ID after first AMO submission

---

## 📦 Building for Firefox

### Create Distributable ZIP

```bash
cd /Users/chaseelkins/Documents/focusbubble/extension-multi-browser

# Create temporary build directory
mkdir -p build/firefox-temp

# Copy Chrome files
cp -r chrome/* build/firefox-temp/

# Copy Firefox manifest (overwrite)
cp firefox/manifest.json build/firefox-temp/

# Copy shared folder
cp -r shared build/firefox-temp/

# Create ZIP
cd build/firefox-temp
zip -r ../focusbubble-firefox-v1.0.0.zip . -x "*.DS_Store" -x "node_modules/*" -x "*.md"
cd ../..

# Clean up
rm -rf build/firefox-temp
```

Output: `build/focusbubble-firefox-v1.0.0.zip`

### Using web-ext

Alternative method:

```bash
cd firefox
web-ext build --source-dir=. --artifacts-dir=../build/
```

---

## 🧪 Testing Checklist

### Functional Tests

- [ ] Extension loads without errors
- [ ] Popup opens with correct styling
- [ ] Timer starts and counts down
- [ ] Floating bubble appears on websites
- [ ] Bubble is draggable
- [ ] Notifications appear on timer completion
- [ ] Tab switching triggers distraction detection
- [ ] Data persists after Firefox restart
- [ ] Keyboard shortcuts work (Ctrl+Shift+F, etc.)
- [ ] Settings save correctly

### Firefox-Specific Tests

- [ ] Test with `browser.*` namespace (if used directly)
- [ ] Test on Firefox Android (optional)
- [ ] Verify popup sizing is correct
- [ ] Check icon displays properly in toolbar
- [ ] Test in Private Browsing mode
- [ ] Verify no CSP errors in console

### Cross-Browser Tests

- [ ] Same data structure in storage
- [ ] Same alarm behavior
- [ ] Same notification appearance (UI may differ)
- [ ] Same content script injection timing

---

## 🚀 Publishing to AMO

### 1. Create Developer Account

- Go to [addons.mozilla.org](https://addons.mozilla.org)
- Sign up for developer account (free)

### 2. Submit Extension

1. Go to [Developer Hub](https://addons.mozilla.org/developers/addon/submit/)
2. Upload `focusbubble-firefox-v1.0.0.zip`
3. Fill out listing information
4. Submit for review

### 3. Review Process

**Timeline:** 1-2 weeks typically (longer than Chrome)

**What Mozilla Checks:**
- Manifest validity
- Privacy compliance
- Security issues
- Malicious code
- Source code (if minified)

### 4. Auto-Updates

Once approved, updates are automatic:

1. Increment `version` in manifest
2. Upload new ZIP to AMO
3. Users auto-update within 24 hours

---

## 📊 Feature Comparison

| Feature | Chrome | Firefox | Notes |
|---------|--------|---------|-------|
| Manifest V3 | ✅ Required | ✅ Supported (109+) | Same structure |
| Service Worker | ✅ | ✅ (as scripts) | Different implementation |
| `chrome.*` API | ✅ Native | ✅ Polyfill | Works in both |
| `browser.*` API | ❌ | ✅ Native | Firefox preferred |
| Alarms API | ✅ | ✅ | Identical behavior |
| Storage API | ✅ | ✅ | Identical behavior |
| Notifications | ✅ | ✅ | UI differs slightly |
| Content Scripts | ✅ | ✅ | Identical |
| Web Extensions | ✅ | ✅ | Standard compliant |

---

## 🎯 Best Practices

### 1. Use Browser API Wrapper

Always use `/shared/browserApi.js`:

```javascript
import browserApi from '../shared/browserApi.js';
// Not: import chrome from 'chrome';
```

### 2. Test in Both Browsers

Don't assume Firefox = Chrome:
- Load extension in Firefox Developer Edition
- Test all features before AMO submission

### 3. Handle API Differences

Some APIs behave differently:

```javascript
// Firefox returns Promise natively
const tabs = await browser.tabs.query({});

// Chrome requires callback or manual Promise wrap
chrome.tabs.query({}, (tabs) => {
  console.log(tabs);
});

// Our wrapper handles both ✅
const tabs = await browserApi.tabs.query({});
```

### 4. Version Sync

Keep version numbers in sync:

**Chrome:** `manifest.json` → `"version": "1.0.0"`
**Firefox:** `manifest.json` → `"version": "1.0.0"`

Update both when releasing.

### 5. Monitor Console

Firefox has helpful console warnings:

```
about:debugging → This Firefox → Inspect
```

Check for:
- CSP violations
- Permission warnings
- API deprecations

---

## 🔄 Update Workflow

When making changes:

1. **Edit Chrome files** (since Firefox references them)
   ```bash
   # Edit background.js, contentScript.js, popup files
   ```

2. **Test in Chrome first**
   ```
   chrome://extensions/ → Reload
   ```

3. **Test in Firefox**
   ```
   about:debugging → Reload
   ```

4. **Update version** in BOTH manifests
   ```json
   "version": "1.0.1"
   ```

5. **Build for both stores**
   ```bash
   # Chrome ZIP
   cd chrome && zip -r ../build/chrome-v1.0.1.zip .
   
   # Firefox ZIP  
   cd firefox && web-ext build
   ```

6. **Submit updates**
   - Chrome Web Store
   - Firefox AMO

---

## 📚 Resources

- [Firefox Extension Workshop](https://extensionworkshop.com/)
- [MDN Web Extensions](https://developer.mozilla.org/docs/Mozilla/Add-ons/WebExtensions)
- [web-ext Documentation](https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/)
- [Firefox API Differences](https://developer.mozilla.org/docs/Mozilla/Add-ons/WebExtensions/Chrome_incompatibilities)

---

**Made by Krubles Team** | GitHub: [@C-Elkins](https://github.com/C-Elkins)

Need help? Open an issue on GitHub or email support@krublesteam.com
