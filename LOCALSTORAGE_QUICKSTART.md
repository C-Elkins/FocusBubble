# 🎯 Quick Start: localStorage Persistence

## ✨ It Just Works!

Your focus sessions are **automatically saved** to your browser's localStorage. No setup required!

---

## 📝 What's Saved

Every completed session stores:

- ⏱️ **Duration** (in seconds)
- 📅 **Date & Time** (ISO format)
- 👀 **Distractions** (tab switches/minimizes)

---

## 🚀 How to Use

### 1️⃣ Complete a Session

1. Go to **Focus Bubble** or **Focus Timer** tab
2. Select duration (25, 50, or 90 minutes)
3. Click **Start**
4. Wait for timer to complete
5. ✅ Session automatically saved!

### 2️⃣ View Your Stats

1. Go to **Dashboard** tab
2. See your progress:
   - Total focus time (last 7 days)
   - Number of sessions completed
   - Average session length
   - Distractions count
3. View beautiful charts with trends

### 3️⃣ Data Persists!

- ✅ Refresh page - data stays
- ✅ Close browser - data stays
- ✅ Restart computer - data stays
- ✅ Return tomorrow - data stays

---

## 🔍 View Your Data

### Browser DevTools Method

1. Press **F12** (or Cmd+Option+I on Mac)
2. Click **Application** tab
3. Expand **Local Storage** in sidebar
4. Click on `http://localhost:3000`
5. Find key: `focusSessions`
6. See all your sessions as JSON!

### Console Method

Press F12, go to Console tab, then:

```javascript
// View all sessions
JSON.parse(localStorage.getItem('focusSessions'))

// Count total sessions
JSON.parse(localStorage.getItem('focusSessions')).length

// View most recent session
const sessions = JSON.parse(localStorage.getItem('focusSessions'));
sessions[sessions.length - 1];
```

---

## 🧪 Quick Test

Want to verify it's working? Try this:

1. ✅ Complete one 25-minute session
2. ✅ Check Dashboard (should show 1 session)
3. ✅ Refresh the page
4. ✅ Check Dashboard again (data should still be there!)

**If you see your data after refresh, it's working! 🎉**

---

## 🗑️ Clear Data (if needed)

### Via Browser Console

```javascript
localStorage.removeItem('focusSessions');
```

Then refresh the page.

### Via Browser Settings

**Chrome/Edge:**
- Settings → Privacy → Clear browsing data
- Select "Cookies and other site data"
- Choose time range and clear

**Firefox:**
- Settings → Privacy & Security
- Cookies and Site Data → Clear Data

---

## 💡 Pro Tips

✨ **Data is local** - Never leaves your device (100% private!)  
✨ **No account needed** - Works without signup/login  
✨ **Instant access** - No loading from servers  
✨ **Unlimited sessions** - Store thousands of sessions  
✨ **Multi-device** - Different data per browser/device  

---

## ⚠️ Important Notes

- **Per-browser storage** - Chrome and Firefox have separate data
- **Per-domain** - localhost:3000 and yoursite.com are different
- **Incognito/Private mode** - Data clears when closing incognito session
- **Storage limit** - ~5-10MB (enough for years of sessions!)

---

## 📊 Data Example

Here's what one session looks like in localStorage:

```json
{
  "id": 1728936420000,
  "date": "2025-10-14T10:27:00.000Z",
  "duration": 1500,
  "distractions": 2
}
```

**Translation:**
- Session ID: `1728936420000` (unique timestamp)
- Completed: `Oct 14, 2025 at 10:27 AM`
- Duration: `1500 seconds` (25 minutes)
- Distractions: `2 times` you switched tabs

---

## 🎯 That's It!

Just use the app normally. Sessions save automatically. View stats in Dashboard.

**Happy focusing! 🫧⏱️**

---

See **LOCALSTORAGE_PERSISTENCE.md** for advanced details.
