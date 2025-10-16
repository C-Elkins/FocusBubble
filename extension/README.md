# FocusBubble Browser Extension

A distraction-aware focus timer that helps you stay productive with AI-powered insights.

**Author:** Chase Elkins

## Features

- ⏱️ **Pomodoro-Style Timer** - Preset durations (25, 50, 90 minutes) with start/pause/reset controls
- 🎯 **Floating Timer Bubble** - Draggable overlay on all web pages that syncs with your active session
- 📊 **Analytics Dashboard** - Visual insights into your focus sessions, distractions, and productivity patterns
- 🤖 **AI-Powered Insights** - Get personalized feedback using OpenAI, Anthropic Claude, or local generation
- 🔔 **Smart Notifications** - Completion alerts and distraction warnings
- 👁️ **Distraction Detection** - Automatic tracking via Page Visibility API and tab switching
- 💾 **Persistent State** - Timer continues accurately across browser restarts
- 🌐 **Cross-Browser** - Works on Chrome, Edge, Firefox, Brave, and Opera

## Installation

### For Users

#### Chrome / Edge / Brave / Opera

1. Download the latest release from the [releases page](#)
2. Unzip the downloaded file
3. Open your browser and navigate to:
   - **Chrome/Brave:** `chrome://extensions/`
   - **Edge:** `edge://extensions/`
   - **Opera:** `opera://extensions/`
4. Enable "Developer mode" (toggle in top right)
5. Click "Load unpacked"
6. Select the unzipped `focusbubble-extension` folder
7. The extension icon should appear in your toolbar!

#### Firefox

1. Download the latest `.xpi` file from the [releases page](#)
2. Open Firefox and navigate to `about:addons`
3. Click the gear icon and select "Install Add-on From File"
4. Select the downloaded `.xpi` file
5. Click "Add" when prompted

### For Developers

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/focusbubble.git
   cd focusbubble/extension
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build the extension:**
   ```bash
   # Development build (with source maps)
   npm run dev

   # Production build (minified)
   npm run build
   ```

4. **Load in browser:**
   - The built extension will be in the `dist/` folder
   - Follow the "For Users" installation steps above, but select the `dist/` folder

## Usage

### Starting a Focus Session

1. **Click the extension icon** in your toolbar
2. **Select a duration** using the preset buttons (25, 50, or 90 minutes)
3. **Click "Start"** to begin your focus session
4. The **floating bubble** will appear on all web pages showing your remaining time
5. **Stay focused!** The extension will track any distractions

### During a Session

- **Pause:** Click the pause button in the popup or floating bubble
- **Resume:** Click the play button to continue
- **Reset:** Click the reset button (will ask for confirmation)
- **Minimize Distractions:** Avoid switching tabs or windows frequently

### Viewing Analytics

1. **Right-click the extension icon** and select "Dashboard"
2. Or **open the popup** and click "View Dashboard"
3. See your:
   - Total focus time today
   - Number of sessions completed
   - Distraction count
   - AI-generated insights

### AI Insights Configuration

1. Open the **extension settings** (right-click icon → Options)
2. Choose your AI provider:
   - **Local** (default, no API key needed)
   - **OpenAI** (requires API key)
   - **Anthropic Claude** (requires API key)
3. If using an AI provider, enter your **API key**
4. Select your preferred **insight tone**:
   - Motivational (default)
   - Analytical
   - Humorous
   - Coach
   - Reflective
   - Competitive

## Architecture

### File Structure

```
extension/
├── manifest.json              # Extension configuration (Manifest V3)
├── package.json              # Build dependencies
├── webpack.config.js         # Build configuration
│
├── background/
│   └── service-worker.js     # Timer logic, state management, alarms
│
├── content/
│   ├── content.js           # Floating bubble injection, visibility detection
│   └── bubble.css           # Bubble styles and animations
│
├── popup/
│   ├── popup.html           # Extension popup UI
│   └── popup.js             # Popup logic and controls
│
├── dashboard/
│   ├── dashboard.html       # Analytics dashboard page
│   └── dashboard.js         # Dashboard logic, charts, insights
│
├── shared/
│   ├── browser-api.js       # Cross-browser API compatibility layer
│   └── aiInsights.js        # AI insights generation module
│
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

### Key Components

#### Background Service Worker ([service-worker.js](background/service-worker.js))
- Manages timer state and persistence
- Handles session tracking and statistics
- Coordinates alarms for timer completion
- Detects distractions via tab switching
- Broadcasts state updates to popup and content scripts

#### Content Script ([content.js](content/content.js))
- Injects floating timer bubble on all pages
- Syncs with background service worker
- Detects page visibility changes (tab switching)
- Provides draggable UI with position persistence

#### Popup ([popup.html](popup/popup.html), [popup.js](popup/popup.js))
- User interface for timer controls
- Preset duration selection
- Real-time timer display
- Today's session statistics

#### Dashboard ([dashboard.html](dashboard/dashboard.html), [dashboard.js](dashboard/dashboard.js))
- Full-page analytics view
- Session history and charts
- AI-powered insights
- Performance metrics

#### Browser API Wrapper ([browser-api.js](shared/browser-api.js))
- Cross-browser compatibility layer
- Handles `chrome.*` vs `browser.*` API differences
- Promise-based unified interface

#### AI Insights ([aiInsights.js](shared/aiInsights.js))
- Generates personalized productivity insights
- Supports OpenAI GPT-4, Anthropic Claude, and local generation
- Multiple tone options (motivational, analytical, humorous, etc.)
- Automatic fallback to local generation if API fails

## Technical Details

### Timer Accuracy

The timer uses absolute timestamps (`Date.now()`) rather than counting intervals, ensuring accuracy even if:
- The computer goes to sleep
- The service worker is terminated and restarted
- The browser is restarted

The `chrome.alarms` API is used instead of `setInterval` because it persists across service worker restarts.

### State Persistence

All state is saved to `chrome.storage.local`:
- Current timer state (running, paused, remaining time)
- Session history (last 1000 sessions)
- User settings (AI provider, API keys, preferences)

State is saved:
- On every timer action (start, pause, resume, reset)
- Every 30 seconds via periodic alarm
- When distractions are detected

### Distraction Detection

Distractions are detected via:
1. **Tab Switching:** `chrome.tabs.onActivated` event
2. **Page Visibility:** Page Visibility API in content script
3. **Window Focus Loss:** Visibility change to `hidden` state

### Cross-Browser Compatibility

The extension uses a unified API wrapper that detects the available browser API:

```javascript
const browserAPI = (typeof browser !== 'undefined' ? browser : chrome);
```

All callback-based Chrome APIs are wrapped with Promises for consistent async/await usage.

### Message Passing

Components communicate via `chrome.runtime.sendMessage`:

```javascript
// Popup → Background
const response = await browserAPI.runtime.sendMessage({
  type: 'START_TIMER',
  duration: 25
});

// Background → All tabs
broadcastState({
  type: 'TIMER_STATE_UPDATE',
  state: timerState
});
```

## Development

### Build Commands

```bash
# Install dependencies
npm install

# Development build with watch mode
npm run dev

# Production build (minified)
npm run build

# Clean build artifacts
npm run clean
```

### Testing

1. Make changes to source files in `extension/`
2. Run `npm run dev` to build
3. Reload the extension in your browser:
   - Chrome: Go to `chrome://extensions/` and click the reload icon
   - Firefox: Go to `about:debugging#/runtime/this-firefox` and click "Reload"
4. Test your changes

### Debugging

- **Background Service Worker:**
  - Chrome: `chrome://extensions/` → "Inspect views: service worker"
  - Firefox: `about:debugging#/runtime/this-firefox` → "Inspect"

- **Popup:**
  - Right-click the extension icon and select "Inspect popup"

- **Content Script:**
  - Open DevTools on any page (`F12` or `Cmd+Option+I`)
  - Check the Console tab for content script logs

- **Dashboard:**
  - Open the dashboard page and use DevTools normally

## Publishing

### Chrome Web Store

1. Create a ZIP file of the `dist/` folder after building
2. Go to the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
3. Click "New Item" and upload the ZIP file
4. Fill in the listing details (description, screenshots, etc.)
5. Submit for review

### Firefox Add-ons

1. Create a ZIP file of the `dist/` folder
2. Go to [Firefox Add-ons Developer Hub](https://addons.mozilla.org/developers/)
3. Click "Submit a New Add-on"
4. Upload the ZIP file
5. Fill in the listing details and submit for review

### Edge Add-ons

1. Same process as Chrome (Edge uses Chromium)
2. Go to [Microsoft Edge Add-ons](https://partner.microsoft.com/dashboard/microsoftedge/overview)
3. Upload the same ZIP file used for Chrome

## API Keys

To use AI-powered insights, you'll need an API key from:

- **OpenAI:** https://platform.openai.com/api-keys
- **Anthropic:** https://console.anthropic.com/settings/keys

API keys are stored securely in `chrome.storage.sync` (syncs across devices).

**Never commit API keys to version control.**

## Privacy

FocusBubble respects your privacy:

- ✅ All session data is stored **locally** on your device
- ✅ No data is sent to external servers (except AI API calls if enabled)
- ✅ AI API calls only send **anonymous session statistics** (no personal data)
- ✅ You can use **local insights** mode without any external API calls
- ✅ Open source - you can inspect all code

## Contributing

This is a personal project by Chase Elkins. Feel free to fork and customize for your own use!

## License

MIT License

Copyright (c) 2025 Chase Elkins

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Support

For bug reports and feature requests, please open an issue on GitHub.

---

**Made with focus by Chase Elkins** 🎯
