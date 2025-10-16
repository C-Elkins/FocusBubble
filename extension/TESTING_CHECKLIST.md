# FocusBubble Testing & QA Checklist

## Pre-Submission Testing

### ✅ Manifest Validation

- [ ] Manifest version is 3
- [ ] Version number follows semver (e.g., 1.0.0)
- [ ] All icon files exist (16, 48, 128)
- [ ] Popup HTML file exists
- [ ] Background service worker exists
- [ ] Content script files exist
- [ ] All permissions are necessary and justified
- [ ] Host permissions only include needed APIs
- [ ] No syntax errors in manifest.json
- [ ] Firefox: Run `web-ext lint` with no errors
- [ ] Chrome: Validate via Chrome Web Store Developer Dashboard
- [ ] Edge: Validate via Microsoft Edge Add-ons Dashboard
- [ ] Opera: Validate via Opera Add-ons Developer Dashboard
- [ ] Safari: Validate via Safari Extensions Developer Dashboard
- [ ] Brave: Validate via Brave Web Store Developer Dashboard

### ✅ Core Functionality

**Timer Operations:**
- [ ] Timer starts correctly from popup
- [ ] Timer countdown displays accurately
- [ ] Timer can be paused and resumed
- [ ] Timer can be reset
- [ ] Timer completes and shows notification
- [ ] Preset durations work (15, 25, 45 minutes)
- [ ] Custom duration input works
- [ ] Timer persists after closing popup
- [ ] Timer persists after browser restart
- [ ] Timer handles multiple start clicks gracefully
- [ ] Timer displays a warning if started again before completion
- [ ] Timer can be stopped and restarted
- [ ] 

**Floating Bubble:**
- [ ] Bubble appears on page after starting timer
- [ ] Bubble is draggable
- [ ] Bubble shows correct remaining time
- [ ] Bubble updates every second
- [ ] Bubble responds to pause/resume
- [ ] Bubble disappears when timer stops
- [ ] Bubble doesn't interfere with page interactions
- [ ] Bubble works on different website layouts
- [ ] Responsive design is maintained
- [ ] Bubble is visible on light and dark backgrounds
- [ ] Bubble does not cover important UI elements
- [ ] Bubble can be resized/moved by the user
- [ ] Bubble can be minimized/maximized by the user
- [ ] Bubble can be closed by the user
- [ ] Bubble can be reset by the user
- [ ] Bubble can be minimized by the user
- [ ] 

**Distraction Tracking:**
- [ ] Tab switches are detected
- [ ] Distraction events are recorded
- [ ] Distraction count displays in bubble/popup
- [ ] Page Visibility API works correctly
- [ ] Works across different websites
  - [ ] Gmail / Email clients
  - [ ] GitHub / Development tools
  - [ ] Google Docs / Office apps
  - [ ] YouTube / Video sites
  - [ ] Reddit / Social media
  - [ ] News sites (heavy content)
  - [ ] Single-page apps (React/Vue)
  - [ ] Static sites
  - [ ] HTTPS sites
  - [ ] Sites with complex CSS/JS
  - [ ]  Sites with iframes
  - [ ]  Sites with popups/modals
  - [ ]  Sites with infinite scroll
  - [ ]  Sites with heavy ads
  - [ ]  Sites with dark mode
  - [ ]  Sites with custom fonts
  - [ ]  Sites with animations
  - [ ]  Sites with video backgrounds
  - [ ]  Sites with high CPU usage
  - [ ]  Sites with high memory usage
  - [ ]  Sites with frequent DOM updates
  - [ ]  Sites with service workers
  - [ ]  Sites with WebSockets
  - [ ]  Sites with heavy JavaScript frameworks
  - [ ]  Sites with complex navigation
  - [ ]  Sites with multiple tabs/windows
  - [ ]  Sites with browser extensions

### ✅ Storage & Data

- [ ] Settings persist after closing browser
- [ ] Session history saves correctly
- [ ] Stats calculate accurately
- [ ] Data can be cleared from settings
- [ ] No data corruption after multiple sessions
- [ ] Storage doesn't exceed quota
- [ ] Export data works (if implemented)
- [ ] Import data works (if implemented)
- [ ] Data is backed up securely
- [ ] Data can be restored from backup
- [ ] Data is encrypted at rest and in transit
- [ ] Data access is logged and monitored
- [ ] Data retention policy is defined
- [ ] Data anonymization techniques are applied
- [ ] Data minimization principles are followed
- [ ] Data integrity checks are implemented
- [ ] Data is pseudonymized where possible
- [ ] Data is regularly reviewed for accuracy
- [ ] Data is securely deleted when no longer needed

### ✅ UI/UX Testing

**Popup:**
- [ ] Opens quickly (< 500ms)
- [ ] All buttons are clickable
- [ ] Hover states work
- [ ] Responsive to window resize
- [ ] No layout shifts
- [ ] Text is readable
- [ ] Icons load correctly
- [ ] Color contrast meets accessibility standards
- [ ] Keyboard navigation works
- [ ] Screen reader compatible (basic)
- [ ] Focus indicators visible
- [ ] ARIA roles and properties used correctly
- [ ] Keyboard navigation works
- [ ] 

**Dashboard:**
- [ ] Opens from options
- [ ] Charts render correctly
- [ ] Stats display accurately
- [ ] Settings save
- [ ] Responsive design works
- [ ] Export/import functions work
- [ ] No layout shifts
- [ ] Text is readable
- [ ] Icons load correctly
- [ ] Color contrast meets accessibility standards
- [ ] Keyboard navigation works
- [ ] Screen reader compatible (basic)
- [ ] Focus indicators visible
- [ ] ARIA roles and properties used correctly
- [ ] Keyboard navigation works
- [ ] 

**Floating Bubble:**
- [ ] Readable on light backgrounds
- [ ] Readable on dark backgrounds
- [ ] Doesn't block important content
- [ ] Can be moved if blocking content
- [ ] Z-index is appropriate
- [ ] Draggable functionality works
- [ ] Resizable functionality works
- [ ] Bubble can be minimized/maximized
- [ ] Bubble stays on top of other content
- [ ] Bubble is not obstructed by other elements
- [ ] Bubble can be closed
- [ ] Bubble can be hidden
- [ ] 

### ✅ Cross-Browser Testing

**Chrome:**
- [ ] Extension loads without errors
- [ ] Service worker stays alive
- [ ] All features work
- [ ] Console shows no errors
- [ ] Tested on Chrome 100+
- [ ] `chrome.*` API compatibility confirmed
- [ ] Manifest V3 compatibility confirmed

**Firefox:**
- [ ] Extension loads without errors
- [ ] Background script works
- [ ] All features work
- [ ] Console shows no errors
- [ ] Tested on Firefox 109+
- [ ] `browser.*` API compatibility confirmed
- [ ] Manifest V3 compatibility confirmed
- [ ] 

**Edge:**
- [ ] Extension loads without errors
- [ ] All features work (should match Chrome)
- [ ] Tested on Edge 100+
- [ ] `chrome.*` API compatibility confirmed
- [ ] Manifest V3 compatibility confirmed
- [ ] 

**Opera (Optional):**
- [ ] Extension loads without errors
- [ ] Basic features work
- [ ] Tested on Opera 80+

### ✅ Website Compatibility

Test on diverse websites to ensure content script works:

- [ ] Gmail / Email clients
- [ ] GitHub / Development tools
- [ ] Google Docs / Office apps
- [ ] YouTube / Video sites
- [ ] Reddit / Social media
- [ ] News sites (heavy content)
- [ ] Single-page apps (React/Vue)
- [ ] Static sites
- [ ] HTTPS sites
- [ ] Sites with complex CSS/JS
- [ ] Sites with iframes
- [ ] Sites with popups/modals
**Check for:**
- Content script injection works
- Bubble displays correctly
- No JavaScript errors in console
- No CSS conflicts
- Page functionality not affected
- Bubble remains draggable
- Distraction tracking works
- Timer functions correctly
- AI features work (if enabled)
- 

### ✅ Performance Testing

- [ ] Extension size < 5MB
- [ ] Popup opens in < 500ms
- [ ] No memory leaks (check Task Manager)
- [ ] CPU usage < 5% when idle
- [ ] No excessive storage writes
- [ ] Service worker doesn't crash
- [ ] Content script doesn't slow page load
- [ ] No "Extension slowing browser" warnings
- [ ] Background script doesn't block UI
- [ ] Content script doesn't interfere with page functionality
- [ ] Popup doesn't block important content
- [ ] Bubble remains draggable
- [ ] Distraction tracking works
- [ ] 

**Performance Checks:**
```bash
# Chrome Task Manager: Shift+Esc
# Check extension memory and CPU usage

# Firefox about:performance
# Monitor extension impact
```

### ✅ Permissions Testing

- [ ] Storage permission works correctly
- [ ] Notifications permission granted
- [ ] Tabs permission doesn't overreach
- [ ] Alarms work without issues
- [ ] Host permissions only used when needed
- [ ] Optional permissions work (if applicable)

### ✅ AI Features (Optional)

If AI insights enabled:

- [ ] API key input field works
- [ ] API key saves securely
- [ ] API key can be removed
- [ ] OpenAI API calls work
- [ ] Claude API calls work
- [ ] Error handling for invalid keys
- [ ] Error handling for network failures
- [ ] Error handling for rate limits
- [ ] Fallback messages display
- [ ] No API key = feature disabled gracefully
- [ ] No data sent without user consent

### ✅ Error Handling

**Test Edge Cases:**
- [ ] No internet connection
- [ ] Invalid API keys
- [ ] Storage quota exceeded
- [ ] Rapid button clicks
- [ ] Browser tab closed during timer
- [ ] Browser closed during timer
- [ ] Extension updated during session
- [ ] Corrupted storage data
- [ ] Very long session (24+ hours)
- [ ] Multiple timers started quickly

**Expected Behavior:**
- [ ] Graceful error messages
- [ ] No crashes or freezes
- [ ] Data doesn't get corrupted
- [ ] User can recover from errors

### ✅ Keyboard Shortcuts

- [ ] Ctrl+Shift+F opens popup (Cmd on Mac)
- [ ] Ctrl+Shift+S starts/pauses timer
- [ ] Ctrl+Shift+D opens dashboard
- [ ] Shortcuts don't conflict with browser
- [ ] Shortcuts don't conflict with websites
- [ ] Shortcuts work on all pages

### ✅ Notifications

- [ ] Timer complete notification shows
- [ ] Notification has correct text
- [ ] Notification has extension icon
- [ ] Notification sound works (if enabled)
- [ ] Clicking notification opens dashboard
- [ ] Notifications can be dismissed
- [ ] Works when browser is minimized

### ✅ Offline Behavior

- [ ] Timer works offline
- [ ] Settings persist offline
- [ ] Dashboard accessible offline
- [ ] Graceful degradation for AI features
- [ ] No unnecessary network requests
- [ ] Error messages for network features

### ✅ Security Testing

- [ ] No eval() usage
- [ ] No inline scripts in HTML
- [ ] Content Security Policy compliant
- [ ] API keys not logged or exposed
- [ ] No XSS vulnerabilities
- [ ] No data leaks to third parties
- [ ] HTTPS only for external calls

### ✅ Accessibility

- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Screen reader compatible (basic)
- [ ] Color contrast meets WCAG AA
- [ ] Text is resizable
- [ ] No flashing content (seizure risk)

### ✅ Documentation

- [ ] README is accurate
- [ ] Privacy policy is complete
- [ ] Store listing matches features
- [ ] Screenshots are current
- [ ] Version number matches everywhere
- [ ] License file present
- [ ] Changelog updated

---

## Testing Commands

### Lint & Validate

```bash
# Firefox lint
cd extension/dist
web-ext lint

# Check manifest validity
node -e "console.log(JSON.parse(require('fs').readFileSync('./manifest.json')))"
```

### Memory Testing

```bash
# Chrome DevTools:
# 1. Open chrome://extensions
# 2. Click "Inspect views: service worker"
# 3. Go to Memory tab
# 4. Take heap snapshot
# 5. Start timer, let run 10 minutes
# 6. Take another heap snapshot
# 7. Compare - should not grow significantly
```

### Console Error Check

```bash
# 1. Open any website
# 2. Open DevTools (F12)
# 3. Check Console tab
# 4. Should be no errors from extension
# 5. Filter by extension ID to isolate errors
```

---

## Common Issues & Fixes

### Issue: Service worker inactive
**Fix:** Check for unhandled promise rejections, add error handlers

### Issue: Content script not injecting
**Fix:** Check `matches` pattern in manifest, test on different sites

### Issue: Storage not persisting
**Fix:** Ensure using `chrome.storage.local` not `localStorage`, check async/await

### Issue: Timer drifts over time
**Fix:** Use `Date.now()` or `alarms` API, not setInterval

### Issue: High memory usage
**Fix:** Remove event listeners, clear intervals, avoid memory leaks

### Issue: Notifications not showing
**Fix:** Check permissions, test on multiple OS, check notification settings

---

## Pre-Submission Checklist

Before uploading to stores:

- [ ] All tests above passed
- [ ] No console errors
- [ ] Privacy policy URL live
- [ ] Screenshots prepared
- [ ] Store description finalized
- [ ] Version bumped if updating
- [ ] CHANGELOG.md updated
- [ ] Git tagged with version
- [ ] Zip file created and verified
- [ ] Tested in incognito/private mode
- [ ] Tested on fresh browser profile

---

## Post-Submission Monitoring

After approval:

- [ ] Install from store (not sideload)
- [ ] Test core features again
- [ ] Monitor store reviews
- [ ] Check for crash reports
- [ ] Watch for user bug reports
- [ ] Track installation metrics

---

Use this checklist before every submission. Check off each item systematically to ensure quality! ✅
