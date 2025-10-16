# 🦊 Firefox Manifest - Conversion Complete!

## ✅ What Changed from Chrome to Firefox

### 1. Background Worker → Background Scripts
```diff
- "background": {
-   "service_worker": "background.js"
+ "background": {
+   "scripts": ["../chrome/background.js"]
```
**Why:** Firefox Manifest V3 uses `scripts` array instead of `service_worker` string.

---

### 2. Firefox-Specific Settings Added
```json
"browser_specific_settings": {
  "gecko": {
    "id": "focusbubble@krublesteam.com",
    "strict_min_version": "109.0"
  }
}
```
**Why:** Required for AMO (addons.mozilla.org) submission and updates.

---

### 3. Browser Style Disabled
```diff
  "action": {
    "default_popup": "../chrome/popup/index.html",
+   "browser_style": false
```
**Why:** Prevents Firefox from applying native styling to your popup UI.

---

### 4. Permission Removed
```diff
  "permissions": [
    "storage",
    "tabs",
    "activeTab",
    "notifications",
-   "alarms",
-   "scripting"
+   "alarms"
  ]
```
**Why:** Firefox doesn't require `scripting` permission for content scripts.

---

### 5. File References
All paths point to Chrome files via `../chrome/`:
- Icons: `../chrome/icons/icon16.png`
- Popup: `../chrome/popup/index.html`
- Scripts: `../chrome/background.js`

**Why:** Single codebase shared between browsers!

---

## 🎯 Manifest V3 in Firefox

Firefox 109+ supports Manifest V3 with these characteristics:

| Feature | Chrome MV3 | Firefox MV3 |
|---------|-----------|-------------|
| Background | Service Worker | Background Scripts |
| API Namespace | `chrome.*` | `browser.*` (also supports `chrome.*`) |
| Promises | Manual wrap | Native Promise support |
| Alarms API | ✅ | ✅ |
| Storage API | ✅ | ✅ |
| Content Scripts | ✅ | ✅ |
| Notifications | ✅ | ✅ |

---

## 🔧 Browser API Compatibility

### Our Cross-Browser Solution

The `/shared/browserApi.js` wrapper handles all differences:

```javascript
// Automatically detects browser
const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

// Works in both Chrome and Firefox
await browserApi.storage.local.get(['data']);
await browserApi.alarms.create('timer', { delayInMinutes: 1 });
await browserApi.notifications.create('id', { /* ... */ });
```

### Direct API Usage

If not using the wrapper:

**Chrome:**
```javascript
chrome.storage.local.get(['data'], (result) => {
  console.log(result);
});
```

**Firefox:**
```javascript
// Native Promise support
const result = await browser.storage.local.get(['data']);
console.log(result);

// Also supports chrome.* with callbacks
chrome.storage.local.get(['data'], (result) => {
  console.log(result);
});
```

---

## 🧪 Testing in Firefox

### Method 1: Load Temporary Add-on

1. Open Firefox
2. Navigate to: `about:debugging#/runtime/this-firefox`
3. Click **"Load Temporary Add-on..."**
4. Select: `/Users/chaseelkins/Documents/focusbubble/extension-multi-browser/firefox/manifest.json`
5. Extension loads! 🎉

**Note:** Temporary add-ons are removed when Firefox restarts.

---

### Method 2: Using web-ext Tool

```bash
# Install globally
npm install -g web-ext

# Run in Firefox
cd /Users/chaseelkins/Documents/focusbubble/extension-multi-browser/firefox
web-ext run

# Auto-reload on changes
web-ext run --watch-file ../chrome/background.js --watch-file ../chrome/contentScript.js

# Lint for issues
web-ext lint
```

---

## 📦 Building for Firefox Add-ons (AMO)

### Create Production ZIP

```bash
cd /Users/chaseelkins/Documents/focusbubble/extension-multi-browser

# Create build directory
mkdir -p build/firefox-temp

# Copy all Chrome files
cp -r chrome/* build/firefox-temp/

# Overwrite with Firefox manifest
cp firefox/manifest.json build/firefox-temp/

# Copy shared utilities
cp -r shared build/firefox-temp/

# Create ZIP
cd build/firefox-temp
zip -r ../focusbubble-firefox-v1.0.0.zip . -x "*.DS_Store" -x "node_modules/*" -x "*.md"
cd ../..

# Cleanup
rm -rf build/firefox-temp
```

**Output:** `build/focusbubble-firefox-v1.0.0.zip`

---

### Using web-ext Build

```bash
cd firefox
web-ext build --source-dir=. --artifacts-dir=../build/ --overwrite-dest
```

---

## 🚀 Publishing to AMO

### 1. Create Developer Account
- Go to [addons.mozilla.org](https://addons.mozilla.org)
- Click "Register" or log in with Firefox Account

### 2. Submit Extension
1. Navigate to [Developer Hub](https://addons.mozilla.org/developers/addon/submit/)
2. Upload `focusbubble-firefox-v1.0.0.zip`
3. Fill out listing:
   - Name: FocusBubble
   - Summary: (from manifest description)
   - Categories: Productivity, Tools
   - Support email: support@krublesteam.com
   - Homepage: https://github.com/C-Elkins/focusbubble

### 3. Review Process
- **Timeline:** 1-2 weeks (longer than Chrome)
- Mozilla reviews code manually
- May request source code if using build process
- Checks for privacy compliance and security

### 4. After Approval
- Auto-updates enabled by default
- Users update within 24 hours
- Track stats in Developer Hub

---

## 🔐 Important: Extension ID

```json
"browser_specific_settings": {
  "gecko": {
    "id": "focusbubble@krublesteam.com"
  }
}
```

### ⚠️ Critical Rules:

1. **Never change this ID** after first AMO submission
2. ID must be unique across all Firefox add-ons
3. Format: `name@domain.com` or `{uuid}`
4. Used for updates and user installations

**If you change it:** Users won't receive updates and it's treated as a new extension!

---

## ✅ Test Checklist

### Basic Functionality
- [ ] Extension loads without errors
- [ ] Popup opens with correct styling
- [ ] Timer starts/stops/pauses
- [ ] Floating bubble appears on websites
- [ ] Bubble is draggable
- [ ] Notifications work
- [ ] Distraction detection works
- [ ] Data persists after restart
- [ ] Keyboard shortcuts function

### Firefox-Specific
- [ ] No `chrome is not defined` errors in console
- [ ] No `browser is not defined` errors in console
- [ ] Popup size is correct (360px width)
- [ ] Icons display properly in toolbar
- [ ] Works in Private Browsing mode
- [ ] No CSP violations in console (`about:debugging` → Inspect)

### Cross-Browser Compatibility
- [ ] Same behavior as Chrome version
- [ ] Storage data structure identical
- [ ] Timer accuracy matches Chrome
- [ ] UI looks consistent

---

## 📊 Manifest Comparison

| Field | Chrome | Firefox | Notes |
|-------|--------|---------|-------|
| `manifest_version` | 3 | 3 | Both use MV3 |
| `background` | `service_worker` | `scripts` array | Key difference |
| `browser_specific_settings` | - | Required | Firefox only |
| `browser_style` | - | `false` | Firefox only |
| `permissions` | 6 permissions | 5 permissions | No `scripting` in Firefox |
| File paths | Local | `../chrome/` | Firefox references Chrome |

---

## 🎨 Features Supported

| Feature | Chrome | Firefox | Implementation |
|---------|--------|---------|----------------|
| Floating Bubble | ✅ | ✅ | Content Script |
| Timer Controls | ✅ | ✅ | Popup UI |
| Alarms API | ✅ | ✅ | Background Script |
| Storage API | ✅ | ✅ | Local Storage |
| Notifications | ✅ | ✅ | Native API |
| Keyboard Shortcuts | ✅ | ✅ | Commands API |
| Tab Detection | ✅ | ✅ | Tabs API |
| AI Integration | ✅ | ✅ | HTTP Requests |

---

## 🐛 Known Issues & Fixes

### Issue: "Module not found" error
**Cause:** Firefox can't find `../chrome/background.js`

**Fix:** Ensure file structure:
```
firefox/
  manifest.json
chrome/
  background.js
  contentScript.js
```

### Issue: Popup styling looks different
**Cause:** Firefox applies default styles

**Fix:** Set `"browser_style": false` in manifest (already done ✅)

### Issue: Storage data not syncing between Chrome/Firefox
**Cause:** Different browser storage (intentional)

**Solution:** This is expected - each browser has its own storage

---

## 🔄 Update Workflow

When making changes to the extension:

1. **Edit Chrome files** (Firefox references them)
2. **Update version in BOTH manifests**:
   - `/chrome/manifest.json` → `"version": "1.0.1"`
   - `/firefox/manifest.json` → `"version": "1.0.1"`
3. **Test in Chrome** → `chrome://extensions/` → Reload
4. **Test in Firefox** → `about:debugging` → Reload
5. **Build both ZIPs**
6. **Submit to both stores**

---

## 📚 Resources

- [Firefox Extension Workshop](https://extensionworkshop.com/)
- [MDN WebExtensions](https://developer.mozilla.org/docs/Mozilla/Add-ons/WebExtensions)
- [web-ext Tool](https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/)
- [AMO Developer Hub](https://addons.mozilla.org/developers/)
- [Chrome vs Firefox API Differences](https://developer.mozilla.org/docs/Mozilla/Add-ons/WebExtensions/Chrome_incompatibilities)

---

## 🎉 Ready for Firefox!

Your FocusBubble extension is now **Firefox-compatible** with:

- ✅ Valid Manifest V3 for Firefox 109+
- ✅ Proper background scripts configuration
- ✅ Firefox-specific settings (gecko ID)
- ✅ browser.* and chrome.* API support
- ✅ Shared codebase with Chrome version
- ✅ Complete documentation (FIREFOX_GUIDE.md)

**Next Step:** Test it!

```
about:debugging#/runtime/this-firefox
→ Load Temporary Add-on
→ Select manifest.json from /firefox/ folder
```

---

**Made by Krubles Team** | GitHub: [@C-Elkins](https://github.com/C-Elkins)
