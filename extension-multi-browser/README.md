# FocusBubble - Multi-Browser Extension

Complete cross-browser extension structure for Chrome, Firefox, Edge, Opera, and Safari.

## 📁 Structure

```
extension-multi-browser/
├── chrome/               # Chrome Web Store version
│   ├── manifest.json
│   ├── background.js
│   ├── contentScript.js
│   ├── popup/
│   │   ├── index.html
│   │   ├── popup.js
│   │   └── popup.css
│   └── icons/           # Add your icons here
├── firefox/             # Firefox Add-ons (AMO) version
│   └── manifest.json
├── edge/                # Microsoft Edge Add-ons version
│   └── manifest.json
├── opera/               # Opera Add-ons version
│   └── manifest.json
├── safari/              # Safari conversion instructions
│   └── README.txt
├── shared/              # Shared utilities
│   ├── browserApi.js    # Cross-browser API wrapper
│   ├── aiInsights.js    # AI insights generator
│   ├── timer.js         # Timer utilities
│   ├── utils.js         # General utilities
│   └── styles.css       # Shared styles
└── build/               # Build outputs (zipped extensions)
```

## 🚀 Quick Start

### 1. Add Icons

Create icons in `/chrome/icons/` with these sizes:
- `icon16.png` - 16x16px
- `icon32.png` - 32x32px
- `icon48.png` - 48x48px
- `icon128.png` - 128x128px

**Icon Requirements:**
- PNG format with transparency
- Simple, recognizable design (bubble theme)
- Colors: Match gradient (#667eea to #764ba2)
- Test on light and dark backgrounds

**Quick Icon Creation Options:**
1. Use Figma/Canva templates for browser extension icons
2. Export your logo at multiple sizes
3. Use a tool like [RealFaviconGenerator](https://realfavicongenerator.net/)

### 2. Test Chrome Version

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (top right)
3. Click "Load unpacked"
4. Select the `/chrome/` folder
5. Test all features:
   - ✓ Timer starts/stops/pauses
   - ✓ Bubble appears on websites
   - ✓ Bubble is draggable
   - ✓ Distractions are tracked
   - ✓ Stats persist after browser restart

### 3. Test Firefox Version

1. Open Firefox and go to `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on"
3. Navigate to `/firefox/` and select `manifest.json`
4. Test all features (same as Chrome)

**Note:** Firefox references Chrome files via `../chrome/` paths in manifest.

### 4. Test Edge Version

1. Open Edge and go to `edge://extensions/`
2. Enable "Developer mode" (bottom left)
3. Click "Load unpacked"
4. Select the `/edge/` folder
5. Test all features

### 5. Safari Conversion

Follow instructions in `/safari/README.txt` to convert the Chrome extension for Safari using Xcode.

## 🔧 Development

### File Sharing Strategy

All browsers share the Chrome implementation files:
- `background.js` - Service worker with timer logic
- `contentScript.js` - Floating bubble injection
- `popup/` - UI files

Only `manifest.json` differs per browser to handle:
- API differences (Firefox uses `scripts` instead of `service_worker`)
- Browser-specific settings (Firefox requires `browser_specific_settings`)
- Store metadata

### Modifying Code

When you modify core functionality:

1. Edit files in `/chrome/` directory
2. Changes automatically apply to Firefox/Edge/Opera (they reference Chrome files)
3. Test in all browsers to ensure compatibility
4. If browser-specific code is needed, use:
   ```javascript
   if (typeof browser !== 'undefined') {
     // Firefox-specific code
   } else {
     // Chrome/Edge/Opera code
   }
   ```

### Using Shared Utilities

Import shared utilities in your scripts:

```javascript
// In background.js or contentScript.js
import Timer from '../shared/timer.js';
import utils from '../shared/utils.js';
import aiInsights from '../shared/aiInsights.js';

// Format time
const timeStr = Timer.formatTime(90000); // "1:30"

// Check productive URL
const isProductive = utils.isProductiveUrl('https://github.com');

// Generate AI insights
const insights = await aiInsights.generateInsights(sessions);
```

## 📦 Building for Release

### Chrome Web Store

1. Create ZIP of `/chrome/` folder:
   ```bash
   cd extension-multi-browser
   zip -r build/focusbubble-chrome-v1.0.0.zip chrome/ -x "*.DS_Store"
   ```

2. Upload to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)

3. Fill out store listing:
   - Use content from `/STORE_LISTING.md`
   - Upload screenshots (1280x800px or 640x400px)
   - Set privacy policy URL

### Firefox Add-ons (AMO)

1. Create ZIP of Chrome folder + Firefox manifest:
   ```bash
   cd extension-multi-browser
   mkdir -p build/firefox-temp
   cp -r chrome/* build/firefox-temp/
   cp firefox/manifest.json build/firefox-temp/
   cd build/firefox-temp
   zip -r ../focusbubble-firefox-v1.0.0.zip . -x "*.DS_Store"
   cd ../..
   rm -rf build/firefox-temp
   ```

2. Upload to [Firefox Add-on Developer Hub](https://addons.mozilla.org/developers/)

3. Mozilla requires source code review if using minification

### Microsoft Edge Add-ons

1. Create ZIP (same as Chrome):
   ```bash
   cd extension-multi-browser
   mkdir -p build/edge-temp
   cp -r chrome/* build/edge-temp/
   cp edge/manifest.json build/edge-temp/
   cd build/edge-temp
   zip -r ../focusbubble-edge-v1.0.0.zip . -x "*.DS_Store"
   cd ../..
   rm -rf build/edge-temp
   ```

2. Upload to [Partner Center](https://partner.microsoft.com/dashboard)

### Opera Add-ons

1. Create ZIP (same as Chrome/Edge):
   ```bash
   cd extension-multi-browser
   mkdir -p build/opera-temp
   cp -r chrome/* build/opera-temp/
   cp opera/manifest.json build/opera-temp/
   cd build/opera-temp
   zip -r ../focusbubble-opera-v1.0.0.zip . -x "*.DS_Store"
   cd ../..
   rm -rf build/opera-temp
   ```

2. Upload to [Opera Add-ons](https://addons.opera.com/developer/)

## 🐛 Common Issues

### "chrome is not defined" errors

These are expected lint warnings. The `chrome` global is provided by the browser at runtime and won't cause actual errors.

### Icons not loading

- Ensure all 4 icon sizes exist in `/chrome/icons/`
- Verify paths in manifest.json are correct
- Check file names match exactly (case-sensitive)

### Content script not injecting

- Check `matches` pattern in manifest.json
- Verify permissions include necessary URLs
- Test on a simple page first (e.g., example.com)

### Timer alarms not firing

- Service workers can be terminated by browser
- Use `chrome.alarms` API (persistent), not `setTimeout`
- Always recreate alarms on startup

### Firefox compatibility issues

- Use `browser.*` instead of `chrome.*` in Firefox-specific code
- Check `browser_specific_settings.gecko.strict_min_version`
- Firefox has stricter CSP requirements

## 📚 Additional Resources

- [Chrome Extension Docs](https://developer.chrome.com/docs/extensions/)
- [Firefox Extension Docs](https://extensionworkshop.com/)
- [Edge Extension Docs](https://docs.microsoft.com/microsoft-edge/extensions-chromium/)
- [Manifest V3 Migration Guide](https://developer.chrome.com/docs/extensions/mv3/intro/)

## 🔐 Privacy & Security

- Extension requests minimal permissions
- No data sent to external servers (except optional AI features)
- All session data stored locally in browser
- AI features require user-provided API keys
- Open source for transparency

## 🤝 Contributing

Made by **Krubles Team**  
GitHub: [@C-Elkins](https://github.com/C-Elkins)

For issues or questions, please open a GitHub issue.

## 📝 Version History

- **v1.0.0** - Initial multi-browser release
  - Chrome, Firefox, Edge, Opera support
  - Floating timer bubble
  - Distraction tracking
  - AI-powered insights
  - Session statistics

---

**Next Steps:**
1. Add icons to `/chrome/icons/`
2. Test in Chrome (load unpacked)
3. Test in Firefox (load temporary)
4. Build for release (see instructions above)
5. Submit to browser stores
