# 🫧 FocusBubble

**A distraction-aware focus timer with AI-powered insights**

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/YOUR_EXTENSION_ID.svg)](https://chrome.google.com/webstore/detail/YOUR_EXTENSION_ID)
[![Mozilla Add-on](https://img.shields.io/amo/v/focusbubble.svg)](https://addons.mozilla.org/firefox/addon/focusbubble/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

---

## 📍 What is FocusBubble?

FocusBubble is a browser extension that helps you maintain focus and understand your productivity patterns. Unlike traditional timers that hide in a browser tab, FocusBubble shows a **floating bubble** that stays visible while you work—keeping you accountable without being intrusive.

### ✨ Key Features

- **🫧 Floating Bubble Timer** - Persistent, draggable timer visible on any website
- **📊 Automatic Distraction Detection** - Tracks tab switches and focus breaks automatically
- **📈 Beautiful Analytics** - Detailed stats on your focus patterns and productivity
- **🤖 AI-Powered Insights** - Optional personalized productivity recommendations (OpenAI/Claude)
- **🔒 Privacy-First** - All data stored locally on your device
- **⌨️ Keyboard Shortcuts** - Control your timer without leaving the keyboard
- **🌐 Cross-Site Compatible** - Works seamlessly across all your favorite websites
- **🚀 Lightweight & Fast** - Minimal performance impact, built with modern web tech

---

## 🎬 Demo

![FocusBubble Demo](docs/demo.gif)

*30-second demo showing floating timer, distraction tracking, and analytics*

---

## 🚀 Installation

### From Browser Stores (Recommended)

- **Chrome:** [Install from Chrome Web Store](https://chrome.google.com/webstore/detail/YOUR_ID)
- **Firefox:** [Install from Firefox Add-ons](https://addons.mozilla.org/firefox/addon/focusbubble/)
- **Edge:** [Install from Microsoft Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/YOUR_ID)
- **Opera:** [Install from Opera Add-ons](https://addons.opera.com/extensions/details/YOUR_ID)

### From Source (Development)

```bash
# Clone the repository
git clone https://github.com/C-Elkins/focusbubble.git
cd focusbubble/extension

# Install dependencies
npm install

# Build the extension
npm run build

# Load in browser:
# Chrome: chrome://extensions → "Load unpacked" → select dist/
# Firefox: about:debugging → "Load Temporary Add-on" → select any file in dist/
```

---

## 🎯 How to Use

### Quick Start

1. **Click the FocusBubble icon** in your browser toolbar
2. **Select a timer duration** (15, 25, or 45 minutes—or custom)
3. **Click "Start Focus"**
4. **Watch the floating bubble** appear on your current page
5. **Work without distraction** - the bubble tracks your focus
6. **Get notified** when your session completes
7. **View your stats** in the dashboard

### Keyboard Shortcuts

- `Ctrl+Shift+F` (or `Cmd+Shift+F` on Mac) - Open popup
- `Ctrl+Shift+S` - Start/pause timer
- `Ctrl+Shift+D` - Open dashboard

### Advanced Features

**AI Insights** (Optional):
1. Open dashboard → Settings
2. Add your OpenAI or Claude API key
3. Click "Get AI Insights" after completing sessions
4. Receive personalized productivity recommendations

---

## 📸 Screenshots

### Floating Timer
<img src="docs/screenshots/floating-bubble.png" alt="Floating bubble timer" width="600">

*The floating bubble stays visible while you work*

### Popup Controls
<img src="docs/screenshots/popup.png" alt="Timer popup" width="400">

*Quick controls for starting, pausing, and managing your timer*

### Analytics Dashboard
<img src="docs/screenshots/dashboard.png" alt="Analytics dashboard" width="600">

*Detailed insights into your focus patterns and productivity*

---

## 🛠️ Tech Stack

- **Frontend:** React 18, TailwindCSS
- **Extension:** Manifest V3, Service Workers
- **Build:** Webpack 5, Babel
- **AI:** OpenAI GPT-4, Anthropic Claude (optional)
- **Storage:** chrome.storage.local (cross-browser compatible)
- **APIs:** Page Visibility API, Alarms API, Notifications API

---

## 🏗️ Project Structure

```
extension/
├── manifest.json          # Extension manifest (Manifest V3)
├── background/
│   └── service-worker.js  # Background timer logic
├── content/
│   ├── content.js         # Floating bubble injection
│   └── bubble.css         # Bubble styles
├── popup/
│   ├── popup.html         # Extension popup UI
│   └── popup.js           # Popup logic
├── dashboard/
│   ├── dashboard.html     # Full analytics page
│   └── dashboard.js       # Dashboard logic
├── shared/
│   ├── browserApi.js      # Cross-browser API wrapper
│   └── aiInsights.js      # AI integration (optional)
└── icons/                 # Extension icons (16, 48, 128)
```

---

## 🧪 Development

### Prerequisites

- Node.js 16+ and npm 8+
- Chrome, Firefox, or Edge browser

### Setup

```bash
# Install dependencies
npm install

# Development mode (watch for changes)
npm run dev

# Production build
npm run build

# Clean build artifacts
npm run clean
```

### Testing Locally

**Chrome / Edge:**
1. Navigate to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `extension/dist` folder

**Firefox:**
1. Navigate to `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on"
3. Select any file in `extension/dist`

**Or use web-ext (Firefox):**
```bash
npm install -g web-ext
cd extension/dist
web-ext run
```

---

## 🧪 Testing

Run the complete test checklist:

```bash
# Lint manifest (Firefox)
cd extension/dist
web-ext lint

# Check for console errors
# Open chrome://extensions → Inspect views: service worker
# Check console on any website

# Performance test
# Chrome Task Manager (Shift+Esc)
# Monitor extension memory/CPU usage
```

See [TESTING_CHECKLIST.md](extension/TESTING_CHECKLIST.md) for comprehensive QA steps.

---

## 📦 Building & Packaging

### Create Release Packages

```bash
# Build production version
cd extension
npm run build

# Package for Chrome/Edge/Opera
cd dist
zip -r ../focusbubble-v1.0.0-chromium.zip .
cd ..

# Package for Firefox
cd dist
zip -r ../focusbubble-v1.0.0-firefox.zip .
cd ..

# Verify package
unzip -l focusbubble-v1.0.0-chromium.zip | head -20
```

See [BUILD_COMMANDS.md](extension/BUILD_COMMANDS.md) for detailed build instructions.

---

## 📤 Publishing

### Chrome Web Store

1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Pay $5 one-time developer fee
3. Upload `focusbubble-v1.0.0-chromium.zip`
4. Fill in store listing (see [STORE_LISTING.md](extension/STORE_LISTING.md))
5. Submit for review (1-3 days)

### Firefox Add-ons (AMO)

1. Go to [Firefox Add-ons Developer Hub](https://addons.mozilla.org/developers/)
2. Upload `focusbubble-v1.0.0-firefox.zip`
3. Provide source code link (this GitHub repo)
4. Submit for review (1-7 days)

### Microsoft Edge

1. Go to [Partner Center](https://partner.microsoft.com/dashboard/microsoftedge)
2. Upload same Chrome package
3. Fill in listing
4. Submit for review (1-5 days)

See [RELEASE.md](extension/RELEASE.md) for complete publishing guide.

---

## 🔒 Privacy & Security

FocusBubble is **privacy-first**:

- ✅ All data stored locally (chrome.storage.local)
- ✅ No analytics or tracking
- ✅ No external servers (except optional AI with your API key)
- ✅ Open source - audit the code yourself
- ✅ Minimal permissions (only what's necessary)

**What We Store:**
- Timer preferences and settings
- Session history (start/end times, duration, distraction count)
- Aggregated statistics

**What We DON'T Store:**
- Browsing history or URLs
- Page content or keystrokes
- Personal information
- Any data on external servers

See [PRIVACY_POLICY.md](extension/PRIVACY_POLICY.md) for full details.

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) first.

### Ways to Contribute

- 🐛 Report bugs via [GitHub Issues](https://github.com/C-Elkins/focusbubble/issues)
- 💡 Suggest features or improvements
- 🔧 Submit pull requests
- 📖 Improve documentation
- 🌍 Translate to other languages
- ⭐ Star the repo if you find it useful!

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 Changelog

### v1.0.0 (2025-01-15)
- 🎉 Initial release
- ✨ Floating bubble timer
- 📊 Session analytics
- 🤖 AI insights (optional)
- 🔒 Privacy-first design

See [CHANGELOG.md](CHANGELOG.md) for full version history.

---

## 🐛 Bug Reports & Support

- **Bug Reports:** [Open an issue](https://github.com/C-Elkins/focusbubble/issues/new?template=bug_report.md)
- **Feature Requests:** [Request a feature](https://github.com/C-Elkins/focusbubble/issues/new?template=feature_request.md)
- **Email Support:** focusbubble@krublesteam.com
- **Discussions:** [GitHub Discussions](https://github.com/C-Elkins/focusbubble/discussions)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with ❤️ by [Chase Elkins](https://github.com/C-Elkins) and the [Krubles Team](https://github.com/krubles-team) 🫧
- Icons inspired by bubble and focus concepts
- Thanks to all contributors and users!

---

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=C-Elkins/focusbubble&type=Date)](https://star-history.com/#C-Elkins/focusbubble&Date)

---

## 🔗 Links

- **Website:** [focusbubble.com](https://c-elkins.github.io/focusbubble) *(coming soon)*
- **Chrome Store:** [Install for Chrome](https://chrome.google.com/webstore/detail/YOUR_ID)
- **Firefox Store:** [Install for Firefox](https://addons.mozilla.org/firefox/addon/focusbubble/)
- **Product Hunt:** [Upvote on Product Hunt](https://www.producthunt.com/posts/focusbubble)
- **Twitter:** [@FocusBubbleApp](https://twitter.com/focusbubbleapp) *(coming soon)*

---

<p align="center">
  Made with focus by the <strong>Krubles Team</strong> 🫧
</p>

<p align="center">
  <a href="https://github.com/C-Elkins/focusbubble">⭐ Star us on GitHub</a> •
  <a href="https://chrome.google.com/webstore/detail/YOUR_ID">📥 Install Now</a> •
  <a href="https://github.com/C-Elkins/focusbubble/issues">🐛 Report Bug</a>
</p>
