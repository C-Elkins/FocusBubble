# Common Store Rejection Reasons & Fixes

## Overview

Browser extension stores have strict review policies. Here are the most common rejection reasons and exact fixes for FocusBubble.

---

## 1. ❌ Insufficient Permission Justification

**Rejection Message:**
> "Your extension requests permissions that are not clearly justified in the description."

**Why It Happens:**
Reviewers need to understand WHY each permission is necessary.

**Fix:**
Add explicit permission justifications in your store listing:

```
PERMISSIONS JUSTIFICATION:

Storage: Required to save user preferences, timer settings, and session history locally on the user's device. All data remains private and is never transmitted to external servers.

Notifications: Used to alert users when focus sessions complete, helping maintain healthy work patterns with timely break reminders.

Alarms: Essential for background timer functionality. Ensures the timer continues running accurately even when the popup is closed.

Tabs: Required to detect tab switches during focus sessions for automatic distraction tracking. We only access the active tab title—no browsing history is collected or stored.

Host Permissions (api.anthropic.com, api.openai.com): Optional AI insights feature. Only used if the user explicitly provides their own API key. No data is sent to these services without user consent.
```

---

## 2. ❌ Privacy Policy Missing or Incomplete

**Rejection Message:**
> "Your extension requires a valid privacy policy URL."

**Why It Happens:**
Extensions using storage or network requests MUST have a privacy policy.

**Fix:**
1. Use the PRIVACY_POLICY.md file provided
2. Host it publicly:
   - GitHub Pages: `https://c-elkins.github.io/focusbubble/privacy.html`
   - Your domain: `https://yourdomain.com/privacy`
   - Even raw GitHub: `https://github.com/C-Elkins/focusbubble/blob/main/PRIVACY.md`
3. Add URL to manifest AND store listing

**Manifest Addition:**
```json
{
  "homepage_url": "https://github.com/C-Elkins/focusbubble",
  "privacy_policy": "https://c-elkins.github.io/focusbubble/privacy.html"
}
```

---

## 3. ❌ Overly Broad Permissions

**Rejection Message:**
> "Your extension requests `<all_urls>` but doesn't clearly need access to all websites."

**Why It Happens:**
`<all_urls>` is powerful. Reviewers scrutinize its necessity.

**Fix for FocusBubble:**
Add this to your "Notes for Reviewers" section:

```
WHY <all_urls> IS NECESSARY:

FocusBubble's core feature is a floating timer bubble that displays on any website the user is working on. This is the extension's primary value proposition—a timer that follows you across all sites.

Without <all_urls>, users would need to manually grant permission for every website they visit, defeating the purpose of seamless focus tracking.

The content script only:
1. Injects a small floating bubble UI
2. Listens for timer messages from the background script
3. Tracks page visibility for distraction detection

No data is collected, modified, or transmitted from web pages.
```

---

## 4. ❌ Remote Code Execution

**Rejection Message:**
> "Your extension appears to execute remote code, which violates policy."

**Why It Happens:**
Calling external APIs (OpenAI, Claude) can be flagged.

**Fix:**
Clarify in "Notes for Reviewers":

```
REGARDING EXTERNAL API CALLS:

FocusBubble does NOT execute remote code. The optional AI insights feature:

1. Is OFF by default
2. Requires users to provide their OWN API key
3. Sends only anonymized session data (e.g., "5 focus sessions, 3 distractions")
4. Never includes personal information or browsing data
5. Is fully under user control—can be disabled anytime

We do not host or control the AI models. Users connect directly to OpenAI/Anthropic using their accounts.

This is similar to how email clients connect to Gmail/Outlook—we facilitate the connection but don't control the service.
```

**Code Fix:**
Ensure your aiInsights.js has clear comments:

```javascript
// AI Insights - User-controlled, optional feature
// Requires user's own API key, off by default
// Only sends anonymized session statistics, no PII

async function getAIInsights(apiKey, sessionData) {
  // User must explicitly enable this feature
  if (!apiKey) {
    return { error: 'No API key provided' };
  }
  
  // Only send aggregated, anonymized data
  const anonymizedData = {
    totalSessions: sessionData.length,
    totalDistractions: sessionData.reduce((sum, s) => sum + s.distractions, 0),
    avgSessionLength: calculateAverage(sessionData.map(s => s.duration))
    // NO URLs, NO page titles, NO personal data
  };
  
  // ... API call
}
```

---

## 5. ❌ Misleading Description or Functionality

**Rejection Message:**
> "The extension's actual functionality doesn't match the description."

**Why It Happens:**
Your store listing promises features that don't exist yet, or you oversell.

**Fix:**
Ensure description accurately reflects current features:

**BAD:**
> "FocusBubble uses advanced AI to predict when you'll get distracted!"

**GOOD:**
> "FocusBubble optionally provides AI-powered insights based on your session history (requires your own OpenAI/Claude API key)."

**Checklist:**
- [ ] Every feature mentioned is implemented
- [ ] Screenshots show actual UI, not mockups
- [ ] No "coming soon" features in description
- [ ] Version number matches manifest

---

## 6. ❌ Insufficient Single Purpose

**Rejection Message:**
> "Your extension has multiple unrelated purposes."

**Why It Happens:**
Chrome Web Store requires "single purpose" extensions.

**Fix for FocusBubble:**
Clarify the single purpose:

```
SINGLE PURPOSE STATEMENT:

FocusBubble has ONE purpose: Help users maintain focus and track their productivity.

All features support this single goal:
• Timer: Core focus tool
• Distraction tracking: Understand focus patterns
• Analytics: Visualize productivity
• AI insights: Improve focus habits

These are not separate tools but integrated components of ONE productivity system.
```

---

## 7. ❌ Content Security Policy Violations

**Rejection Message:**
> "Your extension violates Content Security Policy."

**Why It Happens:**
Inline scripts, eval(), or unsafe practices in HTML files.

**Fix:**
Check all HTML files (popup.html, dashboard.html):

**BAD:**
```html
<button onclick="startTimer()">Start</button>
<script>
  function startTimer() { ... }
</script>
```

**GOOD:**
```html
<button id="start-button">Start</button>
<script src="popup.js"></script>

<!-- In popup.js -->
document.getElementById('start-button').addEventListener('click', startTimer);
```

**Manifest CSP (if needed):**
```json
{
  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'self'"
  }
}
```

---

## 8. ❌ Deceptive or Spammy Practices

**Rejection Message:**
> "Your extension engages in deceptive practices."

**Why It Happens:**
- Keyword stuffing in description
- Fake reviews
- Misleading branding
- Copying other extensions

**Fix:**
- Use natural language in description
- Don't mention competitors negatively
- Original branding and screenshots
- No "Download now!" buttons in screenshots
- No fake urgency ("Limited time!")

**BAD Title:**
> "FocusBubble Timer Focus Productivity Pomodoro Tracker Time Management Tool Extension"

**GOOD Title:**
> "FocusBubble - Focus Timer with AI Insights"

---

## 9. ❌ Broken Functionality

**Rejection Message:**
> "Your extension doesn't work as described during testing."

**Why It Happens:**
Bugs, service worker crashes, or missing features.

**Fix:**
Test thoroughly before submission (use TESTING_CHECKLIST.md):

Common issues:
- Service worker crashes after 30 seconds (use alarms API, not setInterval)
- Content script doesn't inject (check manifest matches)
- API keys not working (test error handling)
- Permissions not granted (check activeTab vs tabs)

**Pre-submission Test:**
```bash
# Chrome
1. Load unpacked in chrome://extensions
2. Open extension
3. Start timer
4. Leave for 30 minutes
5. Come back - timer should still work
6. Check service worker (Inspect views: service worker)
7. No errors in console
```

---

## 10. ❌ Excessive Data Collection

**Rejection Message:**
> "Your extension collects more data than necessary for its functionality."

**Why It Happens:**
Storing browsing history, URLs, or unnecessary user data.

**Fix for FocusBubble:**
We only store:
- Timer duration preferences
- Session start/end times
- Distraction count (number, not details)
- User settings

We DON'T store:
- Full URLs (only domain for distraction context)
- Page content
- User identity
- Browsing history

**Code Example:**
```javascript
// GOOD: Minimal data storage
const session = {
  id: generateId(),
  startTime: Date.now(),
  duration: 25 * 60 * 1000,
  distractions: 3, // Just the count
  completed: true
};

// BAD: Excessive data
const session = {
  startTime: Date.now(),
  urls: ['https://gmail.com/inbox/...', ...], // Too detailed!
  pageTitle: 'Email - John Doe', // PII!
  keystrokes: 1247, // Creepy!
};
```

---

## 11. ❌ Icon or Branding Issues

**Rejection Message:**
> "Your extension icons don't meet quality standards."

**Why It Happens:**
- Low resolution
- Wrong sizes
- Trademarked logos
- Generic icons

**Fix:**
Use the icons in your Logo/ folder:

Required sizes:
- 16x16 (toolbar)
- 48x48 (management page)
- 128x128 (store listing)

**Check icon quality:**
```bash
# Verify icon dimensions
file icons/icon128.png
# Should output: PNG image data, 128 x 128

# Convert if needed
convert icon.svg -resize 128x128 icon128.png
convert icon.svg -resize 48x48 icon48.png
convert icon.svg -resize 16x16 icon16.png
```

---

## 12. ❌ Firefox-Specific: Missing Source Code

**Rejection Message (Firefox):**
> "Your extension uses minified code but doesn't provide source or build instructions."

**Why It Happens:**
Firefox requires source code review for compiled/minified extensions.

**Fix:**
In your Firefox AMO submission, provide:

1. **GitHub repository link:**
   `https://github.com/C-Elkins/focusbubble`

2. **Build instructions:**
   ```
   BUILD INSTRUCTIONS:
   
   1. Clone repo: git clone https://github.com/C-Elkins/focusbubble
   2. Navigate: cd focusbubble/extension
   3. Install: npm install
   4. Build: npm run build
   5. Output: dist/ folder
   
   Built with Node.js 18+, Webpack 5, Babel.
   All dependencies in package.json.
   ```

3. **Or:** Upload source zip separately in AMO dashboard

---

## Quick Fix Checklist

Before resubmitting after rejection:

- [ ] Read rejection reason carefully
- [ ] Apply specific fix from this document
- [ ] Test the extension again
- [ ] Update version number (increment patch: 1.0.0 → 1.0.1)
- [ ] Add "Changes" note in submission explaining fix
- [ ] Resubmit

**Example Resubmission Note:**
```
CHANGES IN VERSION 1.0.1:

Fixed: Added comprehensive permission justifications in description
Fixed: Added privacy policy URL to manifest
Fixed: Clarified <all_urls> necessity in reviewer notes

All feedback from previous review has been addressed. Thank you!
```

---

## Appeal Process

If you believe rejection was incorrect:

**Chrome Web Store:**
1. Click "Appeal" in developer dashboard
2. Provide clear, respectful explanation
3. Reference specific policy sections
4. Include screenshots if helpful

**Firefox AMO:**
1. Reply to reviewer's message
2. Explain misunderstanding
3. Provide additional context

**Tips:**
- Be polite and professional
- Assume good faith
- Provide evidence (code snippets, screenshots)
- Explain technical details clearly

---

## Prevention: Reviewer Notes

Always include "Notes for Reviewers" when submitting:

```
NOTES FOR REVIEWERS:

Extension Purpose:
FocusBubble is a focus timer that helps users track productivity. The floating bubble timer is visible on all websites, allowing seamless focus tracking without switching tabs.

Testing Instructions:
1. Click extension icon
2. Select timer duration (25 minutes recommended)
3. Click "Start Focus"
4. Notice floating bubble appears on page
5. Switch tabs - bubble tracks as "distraction"
6. Wait for completion or click Stop
7. Open dashboard to see session stats

Why <all_urls>:
The floating bubble must display on any website the user visits. This is the core feature.

Why Tabs Permission:
Only used to detect tab switches for distraction tracking. No data is collected or transmitted.

AI Features:
Completely optional. Users provide their own API key. Off by default. No remote code execution.

Privacy:
All data stored locally. No analytics. No tracking. Privacy policy: [link]

Source Code:
Open source: https://github.com/C-Elkins/focusbubble

Thank you for your review!
```

---

Use this guide to prevent rejections and fix issues quickly. Most rejections are simple communication issues, not fundamental problems! ✅
