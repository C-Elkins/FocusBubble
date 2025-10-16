FocusBubble - Safari Conversion Instructions
===========================================

Safari requires converting web extensions using Xcode. Here's how:

PREREQUISITES:
-------------
1. macOS with Xcode installed (free from Mac App Store)
2. Apple Developer account ($99/year for App Store distribution)
3. Chrome extension files (located in ../chrome/)


CONVERSION STEPS:
----------------

1. Open Terminal and navigate to this directory:
   cd /path/to/extension-multi-browser/safari

2. Run the Safari Web Extension Converter:
   xcrun safari-web-extension-converter ../chrome/ --app-name FocusBubble

3. This creates an Xcode project with:
   - FocusBubble.xcodeproj
   - FocusBubble/ (app wrapper)
   - FocusBubble Extension/ (converted extension)

4. Open the project in Xcode:
   open FocusBubble.xcodeproj

5. Update the following in Xcode:
   - Team: Select your Apple Developer team
   - Bundle Identifier: com.krublesteam.focusbubble
   - Version: 1.0.0
   - Build: 1

6. Adjust manifest.json if needed:
   - Safari may require permission adjustments
   - Check background script compatibility
   - Verify content script injection

7. Test the extension:
   - Build & Run in Xcode (Cmd+R)
   - Safari will open with extension loaded
   - Test all features thoroughly

8. Create App Store build:
   - Product > Archive
   - Distribute to App Store
   - Follow App Store submission guidelines


IMPORTANT NOTES:
---------------
- Safari Web Extensions use the same manifest format as Chrome
- However, some APIs may have different behavior
- Test thoroughly on Safari before submission
- Safari requires an app wrapper (not just the extension)
- Must be distributed through Mac App Store or signed for distribution


API COMPATIBILITY WARNINGS:
--------------------------
- chrome.* APIs work in Safari, but test these carefully:
  • chrome.alarms - Test persistence
  • chrome.notifications - Safari has different UI
  • chrome.storage.local - Test quota limits
  • content_scripts - Verify injection on all sites

- If issues arise, use browser.* namespace instead:
  • Find/replace 'chrome.' with 'browser.' in JS files
  • Most modern browsers support both namespaces


TESTING CHECKLIST:
-----------------
□ Timer starts and stops correctly
□ Floating bubble appears on all websites
□ Bubble is draggable and stays on screen
□ Notifications appear and work properly
□ Distraction tracking detects tab switches
□ Data persists after browser restart
□ Keyboard shortcuts work (Cmd+Shift+F, Cmd+Shift+S)
□ Popup UI displays correctly
□ Settings save properly
□ AI insights generate (if implemented)


TROUBLESHOOTING:
---------------
Issue: "No provisioning profile found"
Solution: Select your developer team in Xcode project settings

Issue: Extension doesn't load in Safari
Solution: Check Safari > Preferences > Extensions, enable FocusBubble

Issue: Permissions errors
Solution: Review host_permissions in manifest.json, may need adjustment

Issue: Background script not working
Solution: Safari handles service workers differently, may need conversion to persistent background page

Issue: Content script not injecting
Solution: Check "matches" patterns in manifest.json, ensure <all_urls> is permitted


HELPFUL RESOURCES:
-----------------
- Safari Web Extensions Guide: https://developer.apple.com/documentation/safariservices/safari_web_extensions
- Converting Extensions: https://developer.apple.com/documentation/safariservices/safari_web_extensions/converting_a_web_extension_for_safari
- App Store Guidelines: https://developer.apple.com/app-store/review/guidelines/

For questions, contact: C-Elkins (GitHub) or support@krublesteam.com
