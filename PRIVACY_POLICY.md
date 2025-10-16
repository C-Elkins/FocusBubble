# Privacy Policy for FocusBubble

**Last Updated: October 15, 2025**

## Overview

FocusBubble ("we," "our," or "the app") is committed to protecting your privacy. This Privacy Policy explains how our focus timer application handles your data.

## Data Collection & Storage

### What We Collect

FocusBubble operates on a **privacy-first principle**. All your data is stored **locally on your device only**:

- **Focus session data**: Duration, timestamps, and distraction counts
- **Statistics**: Total focus time, session count, and performance metrics
- **Settings**: Timer preferences and display options
- **Optional AI API keys**: If you choose to use AI insights features

### What We DON'T Collect

- ❌ No personal information (name, email, phone number)
- ❌ No browsing history or web activity tracking
- ❌ No analytics or usage tracking
- ❌ No cookies or tracking pixels
- ❌ No data is sent to our servers (we don't have servers)

## Data Storage

- **Web Application**: All data is stored in your browser's localStorage
- **Browser Extension**: All data is stored using the browser's local storage API (chrome.storage.local)
- **Your data never leaves your device** unless you explicitly use optional AI features

## Optional AI Features

If you choose to enable AI-powered insights:

### OpenAI Integration
- **What's sent**: Aggregated session statistics (total time, session count, distractions)
- **What's NOT sent**: Specific timestamps, website URLs, or personal information
- **Your API key**: Stored locally on your device, encrypted by your browser
- **Data usage**: Processed according to [OpenAI's Privacy Policy](https://openai.com/policies/privacy-policy)

### Anthropic Claude Integration
- **What's sent**: Aggregated session statistics (total time, session count, distractions)
- **What's NOT sent**: Specific timestamps, website URLs, or personal information
- **Your API key**: Stored locally on your device, encrypted by your browser
- **Data usage**: Processed according to [Anthropic's Privacy Policy](https://www.anthropic.com/privacy)

### Local Analysis (Default)
- **Completely offline**: No data ever sent anywhere
- **No API key required**: Works without any external services
- **100% private**: All analysis happens on your device

## Browser Permissions

### Web Application
- **No special permissions required**: Runs entirely in your browser

### Browser Extension

The extension requests the following permissions:

1. **storage**: To save your focus sessions and settings locally
2. **tabs**: To detect tab switches for distraction tracking
3. **activeTab**: To inject the floating bubble on web pages
4. **notifications**: To alert you when focus sessions complete
5. **alarms**: To maintain accurate timing even when the browser is in the background

**What we DON'T do with these permissions:**
- ❌ We don't read or collect your browsing history
- ❌ We don't track which websites you visit
- ❌ We don't access page content or form data
- ❌ We don't share any information with third parties

## Data Retention

- **Data persists**: Until you clear your browser data or uninstall the app/extension
- **Manual deletion**: You can clear all data anytime through the app settings
- **Browser clearing**: Clearing browser data will remove all FocusBubble data

## Third-Party Services

FocusBubble does not integrate with any third-party analytics, tracking, or advertising services.

The only external connections are:
- **Optional**: OpenAI API (if you enable it and provide an API key)
- **Optional**: Anthropic API (if you enable it and provide an API key)

## Children's Privacy

FocusBubble does not knowingly collect data from anyone. Since we don't collect any personal information, there are no age restrictions.

## Data Security

- All data is stored locally using browser-native encryption
- API keys (if provided) are encrypted by your browser
- We implement best practices for secure local storage
- No server-side data means no risk of server breaches

## Your Rights

You have complete control over your data:

- **Access**: View all your data within the app
- **Delete**: Clear all data at any time
- **Export**: (Coming soon) Export your session data as CSV/JSON
- **Opt-out**: Simply don't use optional AI features

## Changes to This Policy

We may update this Privacy Policy from time to time. Changes will be reflected with a new "Last Updated" date at the top of this policy.

## Open Source

FocusBubble is **open source**. You can:
- Review the source code on [GitHub](https://github.com/C-Elkins/focusbubble)
- Verify that we follow these privacy practices
- Contribute to the project

## Contact Us

If you have questions about this Privacy Policy, please:

- **Open an issue**: [GitHub Issues](https://github.com/C-Elkins/focusbubble/issues)
- **Email**: [Contact info coming soon]
- **Team**: Krubles Team

## Compliance

- **GDPR**: FocusBubble doesn't collect personal data, so GDPR requirements don't apply
- **CCPA**: We don't sell or share personal information because we don't collect it
- **COPPA**: Safe for all ages since no data is collected

## Summary

**FocusBubble is privacy-first by design:**
- ✅ All data stays on your device
- ✅ No tracking or analytics
- ✅ No servers or databases
- ✅ Optional AI features with transparent data usage
- ✅ Open source for transparency

---

**Your focus time is yours. Your data is yours. We believe in your right to privacy.**

Made with ❤️ by the Krubles Team | [GitHub](https://github.com/C-Elkins/focusbubble)
