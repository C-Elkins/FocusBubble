# FocusBubble Release Checklist

## Pre-Release Preparation

### 1. Version & Code Quality
- [ ] Update version in `manifest.json` (follow semver: 1.0.0, 1.0.1, etc.)
- [ ] Update version in `package.json` to match
- [ ] Run full test suite: `npm test` (if applicable)
- [ ] Test locally in Chrome (load unpacked from `chrome://extensions`)
- [ ] Test locally in Firefox (load temporary from `about:debugging#/runtime/this-firefox`)
- [ ] Review all console errors and warnings
- [ ] Check all permissions are justified and documented
- [ ] Verify AI API calls have proper error handling
- [ ] Test offline behavior (graceful degradation)

### 2. Build Production Package
```bash
# Clean previous builds
npm run clean

# Install dependencies
npm install

# Create production build
npm run build

# Verify dist folder contains all required files
ls -la dist/
```

### 3. Assets Preparation
- [ ] Generate all required icon sizes (16x16, 48x48, 128x128)
- [ ] Create promotional tile (440x280 for Chrome)
- [ ] Create 3-5 screenshots (1280x800 or 640x400)
- [ ] Prepare demo video/GIF (30-60 seconds)
- [ ] Write store description (see STORE_LISTING.md)
- [ ] Finalize privacy policy (see PRIVACY_POLICY.md)

### 4. Documentation
- [ ] Update README.md with accurate install instructions
- [ ] Include changelog in CHANGELOG.md
- [ ] Review and update PRIVACY_POLICY.md
- [ ] Ensure LICENSE file is present (MIT recommended)
- [ ] Add support email/contact method

### 5. Create Release Packages

#### For Chrome Web Store / Edge / Opera:
```bash
cd dist
zip -r ../focusbubble-v1.0.0-chromium.zip .
cd ..
```

#### For Firefox (AMO):
```bash
# Install web-ext if not already installed
npm install -g web-ext

# Build and package for Firefox
cd dist
web-ext build --overwrite-dest
# This creates a .zip in web-ext-artifacts/

# Or manually zip:
cd dist
zip -r ../focusbubble-v1.0.0-firefox.zip .
cd ..
```

#### Verify Packages:
```bash
# Check Chrome/Edge package
unzip -l focusbubble-v1.0.0-chromium.zip | head -20

# Check Firefox package
unzip -l focusbubble-v1.0.0-firefox.zip | head -20
```

---

## Store Submission

### Chrome Web Store

**Account Setup:**
1. Create developer account: https://chrome.google.com/webstore/devconsole
2. Pay one-time $5 registration fee
3. Verify email and account

**Upload Steps:**
1. Go to Chrome Web Store Developer Dashboard
2. Click "New Item" → Upload `focusbubble-v1.0.0-chromium.zip`
3. Fill in Store Listing:
   - Product name: **FocusBubble**
   - Summary: Copy from STORE_LISTING.md (132 chars max)
   - Description: Copy detailed description (16,000 chars max)
   - Category: **Productivity**
   - Language: **English (United States)**
4. Upload Assets:
   - Icon (128x128): `icon128.png`
   - Screenshots: Upload 3-5 images (1280x800 or 640x400)
   - Promotional tile (440x280): `promo-tile.png`
   - Small promo tile (optional, 200x200)
5. Privacy Section:
   - Privacy policy URL: `https://your-domain.com/privacy`
   - Justification for each permission (storage, notifications, etc.)
   - Declare if using remote code (AI API calls - YES)
6. Distribution:
   - Visibility: **Public**
   - Regions: **All regions** (or specific)
   - Pricing: **Free**
7. Click "Submit for Review"

**Review Timeline:** 1-3 days typically, up to 7 days for first submission

---

### Microsoft Edge Add-ons

**Account Setup:**
1. Partner Center: https://partner.microsoft.com/dashboard/microsoftedge
2. Enroll in Microsoft Edge program (free)
3. Complete publisher verification

**Upload Steps:**
1. Click "New Extension"
2. Upload the **same** `focusbubble-v1.0.0-chromium.zip`
3. Fill in Product Listing (very similar to Chrome):
   - Display name: **FocusBubble**
   - Short description: Same as Chrome
   - Detailed description: Same as Chrome
   - Category: **Productivity**
4. Upload Assets:
   - Store logo (300x300): Crop/resize your icon
   - Screenshots: Same as Chrome (1280x800)
5. Privacy:
   - Privacy policy URL: Same as Chrome
   - Permission justifications
6. Notes to Certification (optional):
   - Explain AI API usage
   - Provide test credentials if needed
7. Submit for Review

**Review Timeline:** 1-5 days

---

### Mozilla Add-ons (AMO - Firefox)

**Account Setup:**
1. Create account: https://addons.mozilla.org/developers/
2. Verify email
3. Accept Developer Agreement

**Upload Steps:**
1. Go to Developer Hub: https://addons.mozilla.org/developers/addon/submit/distribution
2. Choose "On this site" distribution
3. Upload `focusbubble-v1.0.0-firefox.zip`
4. Fill in Add-on Details:
   - Name: **FocusBubble**
   - Add-on URL: Choose slug (e.g., `focusbubble-timer`)
   - Summary: Same as Chrome (250 chars max)
   - Description: Use markdown formatting
   - Categories: **Productivity**, **Other**
   - Tags: focus, timer, productivity, distraction, AI
5. Upload Icon (64x64 minimum, 128x128 recommended)
6. Screenshots: 3-5 images
7. Privacy Policy: Paste full policy or link
8. License: MIT recommended
9. Version Notes: Describe what's new
10. Source Code (if obfuscated/minified):
    - Upload source repo link or zip
    - Include build instructions
11. Submit for Review

**Firefox-Specific Notes:**
- Manifest V3 support is solid in Firefox 109+
- Use `browser.storage` API (cross-compatible)
- Avoid Chrome-only APIs
- Self-hosting option available (if you sign .xpi yourself)

**Review Timeline:** 1-7 days (manual review for first submission)

**Using web-ext for Testing:**
```bash
# Run in Firefox for testing
cd dist
web-ext run --firefox-profile=dev-profile

# Lint before submission
web-ext lint
```

---

### Opera Add-ons

**Account Setup:**
1. Create account: https://addons.opera.com/developer/
2. Verify email

**Upload Steps:**
1. Opera uses Chromium, so upload the **same** `focusbubble-v1.0.0-chromium.zip`
2. Fill in listing (similar to Chrome):
   - Name: **FocusBubble**
   - Summary: Same as Chrome
   - Description: Same as Chrome
   - Category: **Productivity**
3. Upload Assets:
   - Icon (128x128)
   - Screenshots
4. Submit for Review

**Review Timeline:** 1-5 days

**Note:** Opera has smaller user base but easy to support if you're already Chrome-compatible.

---

### Safari (Optional - More Complex)

**Requirements:**
- macOS with Xcode 14+
- Apple Developer account ($99/year)
- Convert extension using `xcrun safari-web-extension-converter`

**High-Level Steps:**
1. Install Xcode from Mac App Store
2. Convert extension:
   ```bash
   xcrun safari-web-extension-converter /path/to/dist --app-name FocusBubble
   ```
3. Open generated Xcode project
4. Configure signing & capabilities
5. Test in Safari
6. Archive and submit to App Store Connect
7. Review process: 1-7 days

**Notes:**
- Safari uses Manifest V2 or V3 (check compatibility)
- Requires native app wrapper
- Distributed through Mac App Store
- More involved setup - consider if you have Mac user demand

---

## Post-Publish

### 1. Immediate Actions
- [ ] Update README.md with store links
- [ ] Create release on GitHub (tag version)
- [ ] Update CHANGELOG.md
- [ ] Share internally with team

### 2. Monitor
- [ ] Check Chrome Web Store dashboard daily for first week
- [ ] Respond to reviews within 48 hours
- [ ] Monitor error reports in browser consoles
- [ ] Track installation metrics

### 3. Promote
- [ ] Post to ProductHunt (see PROMOTION.md)
- [ ] Share on Twitter/X with demo GIF
- [ ] Post to relevant subreddits (r/productivity, r/chrome_extensions)
- [ ] Email existing users (if migrating from beta)
- [ ] Add store badges to landing page

### 4. Iterate
- [ ] Collect user feedback
- [ ] Plan next version features
- [ ] Address critical bugs immediately
- [ ] Regular updates every 4-8 weeks

---

## Quick Reference Links

- **Chrome Web Store:** https://chrome.google.com/webstore/devconsole
- **Edge Partner Center:** https://partner.microsoft.com/dashboard/microsoftedge
- **Firefox AMO:** https://addons.mozilla.org/developers/
- **Opera Add-ons:** https://addons.opera.com/developer/

---

## Rollback Plan

If critical issue found after release:

1. **Immediate:**
   - Mark as "Unlisted" in store (stops new installs)
   - Post notice on GitHub Issues
   
2. **Fix:**
   - Create hotfix branch
   - Increment patch version (1.0.0 → 1.0.1)
   - Test thoroughly
   
3. **Resubmit:**
   - Upload new version
   - Mark as "Public" again
   - Version review is typically faster (1-2 days)

---

## Version History

- v1.0.0 - Initial release
- [Future versions here]
