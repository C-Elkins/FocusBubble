# FocusBubble Extension - Quick Start Guide

Get started with FocusBubble in 5 minutes!

**Author:** Chase Elkins

---

## 1. Build the Extension

```bash
# Navigate to extension directory
cd extension

# Install dependencies
npm install

# Build the extension
npm run build
```

The built extension will be in the `dist/` folder.

## 2. Load in Browser

### Chrome / Edge / Brave

1. Open browser and go to: `chrome://extensions/` (or `edge://extensions/`)
2. Enable "Developer mode" (toggle in top-right corner)
3. Click "Load unpacked"
4. Select the `extension/dist/` folder
5. Done! The extension icon should appear in your toolbar

### Firefox

1. Open Firefox and go to: `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on"
3. Navigate to `extension/dist/`
4. Select `manifest.json`
5. Done! The extension icon should appear in your toolbar

## 3. Start Your First Focus Session

1. **Click the FocusBubble icon** in your toolbar
2. **Choose a duration:**
   - 25 min (Pomodoro)
   - 50 min (Deep work)
   - 90 min (Flow state)
3. **Click "Start"** ▶️
4. **See the floating bubble** appear on your page
5. **Stay focused!** Minimize tab switching and distractions

## 4. View Your Dashboard

**Method 1:** Right-click the extension icon → "Options"

**Method 2:** Keyboard shortcut: `Ctrl+Shift+D` (or `Cmd+Shift+D` on Mac)

**Method 3:** Click extension icon → "View Dashboard" button (if added)

The dashboard shows:
- 📊 Today's session statistics
- ⏱️ Total focus time
- 🎯 Distraction count
- 💡 AI-powered insights

## 5. Enable AI Insights (Optional)

By default, FocusBubble uses **local insights** (no API needed).

To enable AI-powered insights:

1. Open the **Dashboard** (right-click icon → Options)
2. Scroll to **Settings** section (you may need to add a settings panel)
3. Choose your AI provider:
   - **Local** (default, no setup needed)
   - **OpenAI** (requires API key)
   - **Anthropic Claude** (requires API key)
4. Enter your **API key** if using OpenAI or Anthropic
5. Select your preferred **insight tone**

### Getting API Keys

**OpenAI:**
1. Go to https://platform.openai.com/api-keys
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy and paste into FocusBubble settings

**Anthropic:**
1. Go to https://console.anthropic.com/settings/keys
2. Sign in or create an account
3. Click "Create Key"
4. Copy and paste into FocusBubble settings

## 6. Keyboard Shortcuts

| Action | Windows/Linux | Mac |
|--------|---------------|-----|
| Open popup | `Ctrl+Shift+F` | `Cmd+Shift+F` |
| Start/pause timer | `Ctrl+Shift+S` | `Cmd+Shift+S` |
| Open dashboard | `Ctrl+Shift+D` | `Cmd+Shift+D` |

You can customize these in your browser's extension settings.

## 7. Floating Bubble Features

The floating timer bubble appears on all web pages when a session is active:

- **Drag to move** - Click and drag to reposition
- **Auto-saves position** - Remembers where you placed it
- **Real-time sync** - Updates instantly with popup/background
- **Click to focus** - Click bubble to see time remaining
- **Smooth animations** - GPU-accelerated for performance

## 8. Understanding Distractions

FocusBubble automatically detects distractions when you:
- **Switch tabs** - Moving to a different browser tab
- **Switch windows** - Focusing a different application
- **Navigate away** - Page visibility changes

**Tips to minimize distractions:**
- Close unnecessary tabs before starting
- Use a separate browser profile for focused work
- Enable "Do Not Disturb" mode on your computer
- Consider using a website blocker alongside FocusBubble

## 9. Development Mode

If you're actively developing the extension:

```bash
# Watch mode (auto-rebuild on changes)
npm run dev

# After making changes, reload the extension:
# Chrome: chrome://extensions/ → Click reload icon
# Firefox: about:debugging → Click "Reload"
```

## 10. Troubleshooting

### Extension not appearing in toolbar
- Make sure "Developer mode" is enabled
- Check that you selected the correct `dist/` folder
- Try reloading the extension

### Floating bubble not appearing
- Check the browser console for errors (`F12` → Console tab)
- Make sure content scripts are enabled
- Try refreshing the page

### Timer not persisting across restarts
- Check browser console for service worker errors
- Ensure storage permissions are granted
- Try clearing extension data and starting fresh

### AI insights not working
- Verify your API key is correct
- Check browser console for API errors
- Try switching to "local" mode first
- Ensure host permissions are granted for API URLs

### Build errors
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Try building again
npm run build
```

## 11. File Structure Reference

```
extension/
├── dist/                    # Built extension (created after npm run build)
├── background/
│   └── service-worker.js   # Timer logic, state management
├── content/
│   ├── content.js          # Floating bubble injection
│   └── bubble.css          # Bubble styles
├── popup/
│   ├── popup.html          # Extension popup UI
│   └── popup.js            # Popup controls
├── dashboard/
│   ├── dashboard.html      # Analytics dashboard
│   └── dashboard.js        # Dashboard logic
├── shared/
│   ├── browser-api.js      # Cross-browser compatibility
│   └── aiInsights.js       # AI insights module
├── icons/
│   └── icon.svg            # SVG icon (convert to PNG)
├── manifest.json           # Extension configuration
├── package.json            # Build dependencies
├── webpack.config.js       # Build configuration
└── README.md              # Full documentation
```

## 12. Next Steps

- ⭐ **Customize durations** - Modify preset buttons in `popup.html`
- 🎨 **Adjust styling** - Edit `bubble.css` and `popup.html` styles
- 🔧 **Add features** - Check `service-worker.js` for timer logic
- 📊 **Enhance dashboard** - Add charts using a library like Chart.js
- 🤖 **Fine-tune AI** - Modify prompts in `aiInsights.js`

## 13. Support

For detailed documentation, see [README.md](README.md)

---

**Happy focusing! 🎯**

Made by Chase Elkins
