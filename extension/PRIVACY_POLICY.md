# Privacy Policy for FocusBubble

**Effective Date:** January 1, 2025  
**Last Updated:** October 15, 2025

---

## Short Version (For Store Listings)

FocusBubble is a privacy-first focus timer. All your session data, settings, and statistics are stored locally in your browser—we never collect, transmit, or access your information. Optional AI insights require your own API key and are entirely under your control. We don't track you, sell your data, or use analytics. Your focus sessions are yours alone.

---

## Full Privacy Policy

### 1. Overview

FocusBubble ("we," "our," or "the extension") is a browser extension designed to help you improve focus and productivity. We are committed to protecting your privacy and being transparent about data practices.

### 2. Information We Collect

**Local Storage Only:**
FocusBubble stores the following data **locally in your browser** using the browser's storage API:

- **Timer Settings:** Your preferred timer durations, notification preferences, and display settings
- **Session History:** Start times, end times, duration, and distraction events for your focus sessions
- **Statistics:** Aggregated data like total focus time, average session length, and distraction frequency
- **Optional AI API Keys:** If you choose to use AI insights, your API key is stored locally and never transmitted to us

**We Never Collect:**
- Personal identifying information (name, email, address)
- Browsing history beyond the current tab title during active sessions
- Keystrokes or form inputs
- Passwords or payment information
- Location data
- Device identifiers

### 3. How Data is Stored

All data is stored using `chrome.storage.local` (or `browser.storage.local` in Firefox), which means:

- Data stays on your device only
- Data persists across browser sessions
- Data is automatically deleted if you uninstall the extension
- You can clear data anytime from the extension's settings

### 4. Data Transmission

**No Data Sent to Our Servers:**
FocusBubble does not have backend servers and does not transmit your data anywhere except:

**Optional AI Insights:**
If you explicitly enable AI insights and provide your own API key (OpenAI or Anthropic Claude), the extension will:

- Send anonymized session summaries to the AI service you selected
- Use only aggregated statistics (e.g., "5 focus sessions, 3 distractions")
- Never include personally identifiable information
- Only transmit data when you click "Get AI Insights"

**Your API Key = Your Control:**
- You provide and manage your own API key
- Data goes directly from your browser to OpenAI/Anthropic (not through us)
- You can revoke access by removing your API key anytime
- AI insights are entirely optional and off by default

### 5. Third-Party Services

**AI Providers (Optional):**
If you use AI insights with your own API key, you are subject to the privacy policies of:

- **OpenAI:** https://openai.com/privacy
- **Anthropic:** https://www.anthropic.com/privacy

We are not responsible for their data practices. Please review their policies before using these features.

**No Other Third Parties:**
- No analytics services (e.g., Google Analytics)
- No advertising networks
- No crash reporting tools
- No social media integrations

### 6. Permissions Explained

FocusBubble requests the following browser permissions:

**Storage:**
To save your timer settings, session history, and statistics locally on your device.

**Notifications:**
To alert you when focus sessions complete, helping you take timely breaks.

**Alarms:**
To run background timers that work even when the popup is closed.

**Tabs:**
To detect tab switches during focus sessions for automatic distraction tracking. We only read the active tab's title—never full browsing history.

**Host Permissions (api.openai.com, api.anthropic.com):**
Only used if you enable AI insights with your own API key. Allows direct communication between your browser and AI services.

### 7. Data Retention

**Local Data:**
Data remains in your browser indefinitely until you:
- Manually delete it via extension settings
- Clear your browser's extension data
- Uninstall the extension (automatically removes all data)

**AI Service Data:**
If you use AI insights, refer to OpenAI or Anthropic's data retention policies. We do not store or have access to these requests.

### 8. Your Rights

You have complete control over your data:

- **Access:** View all stored data via the extension's dashboard
- **Export:** Download your session history as JSON
- **Delete:** Clear individual sessions or all data from settings
- **Opt-Out:** Disable AI insights anytime by removing your API key
- **Uninstall:** Remove the extension to delete all local data immediately

### 9. Children's Privacy

FocusBubble does not knowingly collect information from children under 13. The extension is designed for general productivity use and does not require age verification.

### 10. Changes to This Policy

We may update this privacy policy occasionally. Changes will be posted with a new "Last Updated" date. Continued use of FocusBubble after changes means you accept the updated policy.

### 11. Data Security

We take security seriously:

- All data stored locally is subject to your browser's built-in security
- API keys are stored securely using browser storage encryption
- No data transmitted to our servers means no server-side breaches possible
- Open-source code available for security audits on GitHub

### 12. Open Source Transparency

FocusBubble is open source. You can review the complete source code, including all data handling practices, at:

**GitHub Repository:** https://github.com/C-Elkins/focusbubble

If you have concerns about privacy, we encourage you to inspect the code or have a developer review it.

### 13. Contact Us

If you have questions about this privacy policy or FocusBubble's data practices:

**Email:** focusbubble@krublesteam.com  
**GitHub Issues:** https://github.com/C-Elkins/focusbubble/issues  
**Developer:** Chase Elkins, Krubles Team

### 14. Compliance

FocusBubble complies with:

- **GDPR (Europe):** Users have full control, data portability, and right to deletion
- **CCPA (California):** No personal information is collected or sold
- **Browser Store Policies:** Chrome Web Store, Firefox AMO, Edge Add-ons requirements

### 15. Summary

**In plain language:**

- Your data never leaves your device (except optional AI features with your API key)
- We don't track you, spy on you, or sell your data
- You own your data and can delete it anytime
- No ads, no analytics, no third-party integrations (except optional AI)
- Open source code = full transparency

**FocusBubble helps you focus, not monetize you.**

---

## For Website Privacy Page (HTML-friendly version)

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Privacy Policy - FocusBubble</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
        }
        h1 { color: #6366f1; }
        h2 { color: #4f46e5; margin-top: 2em; }
        .highlight { background: #f0fdf4; padding: 15px; border-left: 4px solid #10b981; margin: 20px 0; }
        a { color: #6366f1; }
    </style>
</head>
<body>
    <h1>🫧 FocusBubble Privacy Policy</h1>
    
    <div class="highlight">
        <strong>TL;DR:</strong> Your data stays on your device. We don't collect, track, or sell anything. Optional AI features use your own API key. Open source = full transparency.
    </div>
    
    <p><strong>Effective Date:</strong> January 1, 2025<br>
    <strong>Last Updated:</strong> January 1, 2025</p>
    
    <!-- Paste full policy content here -->
    
    <h2>Contact</h2>
    <p>Questions? Email us: <a href="mailto:focusbubble@krublesteam.com">focusbubble@krublesteam.com</a></p>
    
    <p><small>&copy; 2025 Krubles Team. <a href="https://github.com/C-Elkins/focusbubble">View on GitHub</a></small></p>
</body>
</html>
```

---

## Privacy Policy URL

**For Store Submissions:**

You need a live URL for your privacy policy. Options:

1. **GitHub Pages (Free):**
   - Create `privacy.html` in your repo
   - Enable GitHub Pages in repo settings
   - URL: `https://c-elkins.github.io/focusbubble/privacy.html`

2. **Your Own Domain:**
   - Host privacy page at `https://yourdomain.com/privacy`

3. **Quick Option - Use Raw GitHub:**
   - Create `PRIVACY.md` in repo
   - Link to: `https://github.com/C-Elkins/focusbubble/blob/main/PRIVACY.md`
   - (Some stores prefer a dedicated webpage, but this works)

**Use this URL in all store submissions.**

---

This privacy policy is designed to be store-compliant, user-friendly, and legally sound. Copy as needed!
