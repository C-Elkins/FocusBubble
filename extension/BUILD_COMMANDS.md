# Build & Package Commands for FocusBubble

## Prerequisites

Ensure you have Node.js 16+ and npm installed:

```bash
node --version  # Should be 16.x or higher
npm --version   # Should be 8.x or higher
```

---

## Development Build

For local testing with live reload:

```bash
# Navigate to extension directory
cd extension

# Install dependencies
npm install

# Run development build with watch mode
npm run dev
```

This creates a `dist/` folder that auto-rebuilds when you edit source files.

---

## Production Build

Create optimized build for store submission:

```bash
# Clean previous builds
npm run clean

# Install dependencies (if not already done)
npm install

# Build for production
npm run build
```

This creates a minified, optimized `dist/` folder ready for packaging.

---

## Package for Chrome / Edge / Opera

These stores all use the same Chromium-based package:

```bash
# Make sure you're in the extension directory
cd extension

# Build production version first
npm run build

# Create zip file
cd dist
zip -r ../focusbubble-v1.0.0-chromium.zip .
cd ..

# Verify the zip
unzip -l focusbubble-v1.0.0-chromium.zip | head -30
```

**What gets zipped:**
- All files from `dist/` folder
- manifest.json, icons, JS bundles, HTML files
- No source files, no node_modules, no .git

---

## Package for Firefox

Firefox has stricter requirements and benefits from web-ext tool:

### Option 1: Using web-ext (Recommended)

```bash
# Install web-ext globally (one-time)
npm install -g web-ext

# Navigate to dist folder
cd dist

# Lint the extension
web-ext lint

# Build and package
web-ext build --overwrite-dest

# This creates: web-ext-artifacts/focusbubble-1.0.0.zip
```

### Option 2: Manual Zip

```bash
cd dist
zip -r ../focusbubble-v1.0.0-firefox.zip .
cd ..
```

**Firefox-Specific Notes:**
- Add `browser_specific_settings` to manifest.json
- Test with `web-ext run` before packaging
- Include source code if using build tools (link to GitHub repo)

---

## Test Locally

### Chrome / Edge / Opera

1. **Load Unpacked Extension:**
   ```bash
   # Build first
   npm run build
   ```

2. Open Chrome and navigate to: `chrome://extensions/`

3. Enable "Developer mode" (toggle in top right)

4. Click "Load unpacked"

5. Select the `extension/dist` folder

6. Test all features:
   - Click extension icon
   - Start timer
   - Check floating bubble
   - Try keyboard shortcuts
   - Open dashboard

7. **Check Console for Errors:**
   - Right-click extension icon → "Inspect popup"
   - Check browser console (F12) on any website
   - Check service worker: Click "Inspect views: service worker" in `chrome://extensions/`

### Firefox

1. **Load Temporary Extension:**
   ```bash
   # Build first
   npm run build
   ```

2. Navigate to: `about:debugging#/runtime/this-firefox`

3. Click "Load Temporary Add-on"

4. Select any file in `extension/dist` (e.g., manifest.json)

5. Test all features as above

6. **Check Console:**
   - Click "Inspect" next to your extension
   - Browser console (F12) for content script errors

### Using web-ext Run (Firefox)

```bash
cd dist
web-ext run --firefox-profile=dev-profile

# This auto-opens Firefox with extension loaded
# Auto-reloads on file changes
```

---

## Verify Package Contents

Before submitting, verify your zip contains correct files:

```bash
# List all files in the zip
unzip -l focusbubble-v1.0.0-chromium.zip

# Should include:
# - manifest.json
# - icons/ (icon16.png, icon48.png, icon128.png)
# - background/ (service-worker.js)
# - content/ (content.js, bubble.css)
# - popup/ (popup.html, popup.js)
# - dashboard/ (dashboard.html, dashboard.js)
# - shared/ (browserApi.js, aiInsights.js, etc.)
```

**Should NOT include:**
- `node_modules/`
- Source `.jsx` or `.ts` files (only compiled JS)
- `.git/` or `.gitignore`
- `package.json` or `webpack.config.js` (unless required by Firefox)
- `.DS_Store` or other OS files

---

## Clean Unnecessary Files

```bash
# Remove OS files before zipping
find dist -name ".DS_Store" -delete
find dist -name "Thumbs.db" -delete

# Remove source maps (optional, but reduces size)
find dist -name "*.map" -delete
```

---

## Size Optimization

Keep package under 10MB (store limit):

```bash
# Check zip size
ls -lh focusbubble-v1.0.0-chromium.zip

# Typical size: 200KB - 2MB for a simple extension

# If too large, optimize:
# 1. Remove unused dependencies
# 2. Minify images (use TinyPNG or ImageOptim)
# 3. Enable tree-shaking in webpack
# 4. Remove source maps in production build
```

---

## Firefox Signing (Optional)

If self-hosting Firefox extension (not using AMO):

```bash
# Sign with Mozilla API keys
web-ext sign --api-key=YOUR_KEY --api-secret=YOUR_SECRET

# This creates a signed .xpi file
# Users can install directly
```

**Note:** Most developers use AMO, which signs automatically after review.

---

## Multi-Store Build Script

Create a convenience script to build for all stores at once:

**File:** `extension/scripts/package-all.sh`

```bash
#!/bin/bash

# Build for all stores
echo "🔨 Building FocusBubble for all stores..."

# Clean and build
npm run clean
npm run build

# Get version from manifest
VERSION=$(node -p "require('./dist/manifest.json').version")

echo "📦 Packaging version $VERSION..."

# Chrome/Edge/Opera
cd dist
zip -r ../releases/focusbubble-v${VERSION}-chromium.zip .
echo "✅ Chrome/Edge/Opera package created"

# Firefox
zip -r ../releases/focusbubble-v${VERSION}-firefox.zip .
echo "✅ Firefox package created"

cd ..

# List packages
echo ""
echo "📋 Packages created:"
ls -lh releases/

echo ""
echo "🎉 Done! Upload packages to stores."
```

**Make it executable:**
```bash
chmod +x scripts/package-all.sh
```

**Run it:**
```bash
./scripts/package-all.sh
```

---

## Build Troubleshooting

### Error: "Module not found"
```bash
# Solution: Install dependencies
npm install
```

### Error: "dist folder not found"
```bash
# Solution: Run build first
npm run build
```

### Error: "webpack command not found"
```bash
# Solution: Install locally
npm install --save-dev webpack webpack-cli
```

### Error: "Permission denied" (macOS/Linux)
```bash
# Solution: Fix permissions
chmod +x node_modules/.bin/webpack
```

### Firefox: "manifest.json is not valid"
```bash
# Solution: Lint with web-ext
cd dist
web-ext lint

# Fix reported issues
```

---

## Continuous Integration (CI)

For automated builds on GitHub Actions:

**File:** `.github/workflows/build.yml`

```yaml
name: Build Extension

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: cd extension && npm install
    
    - name: Build
      run: cd extension && npm run build
    
    - name: Lint Firefox
      run: |
        npm install -g web-ext
        cd extension/dist
        web-ext lint
    
    - name: Upload artifact
      uses: actions/upload-artifact@v3
      with:
        name: focusbubble-dist
        path: extension/dist/
```

---

## Quick Reference

```bash
# Development
npm run dev          # Watch mode for development
npm run build        # Production build
npm run clean        # Remove dist folder

# Testing
chrome://extensions/  # Chrome testing
about:debugging       # Firefox testing

# Packaging
cd dist && zip -r ../release.zip .  # Create zip
unzip -l release.zip                # Verify contents

# Firefox Tools
web-ext lint         # Validate manifest
web-ext run          # Test in Firefox
web-ext build        # Create signed package
```

---

All commands are ready to copy-paste. Build and package with confidence! 🚀
