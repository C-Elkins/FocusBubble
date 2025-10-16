# AI Insights Feature - Complete Guide

## 🤖 Overview

The AI Insights feature generates personalized, natural-language feedback about your focus sessions using either local analysis or external AI models (OpenAI GPT-4 or Anthropic Claude).

## 🎯 Features

### Insight Generation
- **Automatic insights** generated after each focus session
- **Contextual feedback** based on:
  - Total focus time
  - Number of distractions
  - Completion rate
  - Session consistency
  - Average session length

### Multiple AI Providers
1. **Local Analysis (Default)** - Free, no API key required
2. **OpenAI (GPT-4)** - Advanced AI insights
3. **Anthropic (Claude)** - Alternative AI provider

### Insight Examples

```javascript
// Example 1: Excellent performance
"Incredible! You focused for 2.5 hours with only 3 distractions — that's exceptional deep work! 🎯"

// Example 2: Good session with improvement tips
"Solid 1.5 hours of work completed with 5 distractions. Consider using website blockers to reduce interruptions."

// Example 3: Perfect focus
"Perfect focus! 50 minutes of uninterrupted deep work. Keep up this momentum! ⭐"

// Example 4: Needs improvement
"You focused for 30 minutes today. Try scheduling longer blocks for deeper focus."
```

## 📊 How It Works

### Data Flow

```
1. User completes focus session
2. Session data collected:
   - Duration (seconds)
   - Distractions count
   - Completion rate (%)
   - Total sessions
   - Average session length

3. Data sent to AI provider:
   - Local: Rule-based analysis
   - OpenAI/Claude: API call

4. Natural language insight generated

5. Insight displayed in Dashboard
```

## 🔧 Usage

### Basic Usage (Local Provider)

```jsx
import AIInsightsCard from './components/AIInsightsCard';
import { useFocusStats } from './hooks/useFocusStats';

function Dashboard() {
  const { stats } = useFocusStats();
  
  return <AIInsightsCard stats={stats} />;
}
```

### Programmatic Insight Generation

```javascript
import { generateAIInsight } from './utils/aiInsights';

// Local analysis (no API key needed)
const sessionData = {
  duration: 9000,        // 2.5 hours in seconds
  distractions: 3,       // 3 tab switches
  completionRate: 95,    // 95% completion
  totalSessions: 4,      // 4 sessions today
  averageSessionLength: 2250  // 37.5 minutes average
};

const insight = await generateAIInsight(sessionData, { provider: 'local' });
console.log(insight);
// "Incredible! You focused for 2.5 hours with only 3 distractions..."
```

### Using OpenAI

```javascript
const insight = await generateAIInsight(sessionData, {
  provider: 'openai',
  apiKey: 'sk-your-openai-api-key',
  model: 'gpt-4' // optional, defaults to gpt-4
});
```

### Using Anthropic Claude

```javascript
const insight = await generateAIInsight(sessionData, {
  provider: 'anthropic',
  apiKey: 'sk-ant-your-anthropic-key',
  model: 'claude-3-sonnet-20240229' // optional
});
```

## 🎨 Local Analysis Rules

The local provider uses intelligent rule-based analysis:

### Performance Tiers

**Exceptional Performance (2+ hours, ≤3 distractions)**
- "Incredible! You focused for X hours with only Y distractions — that's exceptional deep work! 🎯"

**Great Performance (1-2 hours, ≤2 distractions)**
- "Great session! X hours of focused work with minimal distractions. You're building excellent focus habits! 💪"

**Good Performance (25-60 min, 0 distractions)**
- "Perfect focus! X minutes of uninterrupted deep work. Keep up this momentum! ⭐"

**Needs Improvement (<25 min)**
- "Every minute counts! You logged X minutes today. Try scheduling longer blocks for deeper focus."

### Completion Rate Feedback

- **90%+**: "Outstanding X% completion rate — you're crushing your goals! 🚀"
- **70-89%**: "Solid X% completion. You're staying on track!"
- **<50%**: "X% completion today. Consider breaking tasks into smaller, achievable chunks."

### Distraction Patterns

- **Zero distractions (≥25 min)**: "Zero distractions! You've mastered the art of focus. This is your productivity sweet spot! 🎖️"
- **8+ distractions**: "X distractions detected. Try airplane mode or a dedicated focus app..."

### Session Consistency

- **4+ sessions**: "X sessions completed — you're building a consistent focus routine! Consistency is key to productivity."

## 🔐 API Key Management

### Setting Up API Keys

**In the UI:**
1. Click the settings icon on AI Insights Card
2. Select your provider (OpenAI or Anthropic)
3. Enter your API key
4. Click "Save & Regenerate Insight"

**Programmatically:**
```javascript
// Save to localStorage
localStorage.setItem('aiProvider', 'openai');
localStorage.setItem('openaiApiKey', 'sk-your-key');
```

### Security Notes

⚠️ **Important for Production:**
- Current implementation stores API keys in localStorage
- For production apps, use:
  - Backend proxy to hide API keys
  - Environment variables
  - Encrypted storage
  - User authentication

**Example Backend Proxy:**
```javascript
// server.js
app.post('/api/generate-insight', async (req, res) => {
  const { sessionData } = req.body;
  
  // Use server-side API key (secure)
  const insight = await generateAIInsight(sessionData, {
    provider: 'openai',
    apiKey: process.env.OPENAI_API_KEY
  });
  
  res.json({ insight });
});
```

## 📈 Pattern Analysis

Additional utility for analyzing session patterns:

```javascript
import { analyzePatterns } from './utils/aiInsights';

const sessions = [
  { date: '2025-10-14T09:00:00', duration: 1500, distractions: 2 },
  { date: '2025-10-14T14:00:00', duration: 3000, distractions: 1 },
  // ... more sessions
];

const patterns = analyzePatterns(sessions);

console.log(patterns);
// {
//   bestTimeOfDay: 'Afternoon',
//   averageSessionLength: 2250,
//   totalFocusTime: 4500,
//   totalDistractions: 3,
//   trend: 'improving',
//   averageDistractionsPerSession: '1.5'
// }
```

## 💡 Advanced Examples

### Custom Insight Function

```javascript
// Create your own insight generator
function generateCustomInsight(sessionData) {
  const hours = sessionData.duration / 3600;
  const productivity = sessionData.distractions / hours;
  
  if (productivity < 2) {
    return "🔥 You're in the zone! Amazing focus today!";
  } else if (productivity < 5) {
    return "💪 Solid work! Room for improvement on minimizing distractions.";
  } else {
    return "⚠️ High distraction rate. Try Do Not Disturb mode tomorrow.";
  }
}
```

### Batch Insight Generation

```javascript
// Generate insights for multiple sessions
async function generateSessionInsights(sessions) {
  const insights = [];
  
  for (const session of sessions) {
    const sessionData = {
      duration: session.duration,
      distractions: session.distractions,
      completionRate: 100, // completed sessions
      totalSessions: 1,
      averageSessionLength: session.duration
    };
    
    const insight = await generateAIInsight(sessionData);
    insights.push({ ...session, insight });
  }
  
  return insights;
}
```

### Compare Providers

```javascript
// Test different providers
async function compareProviders(sessionData) {
  const providers = ['local', 'openai', 'anthropic'];
  const results = {};
  
  for (const provider of providers) {
    try {
      const insight = await generateAIInsight(sessionData, {
        provider,
        apiKey: provider !== 'local' ? getApiKey(provider) : undefined
      });
      results[provider] = insight;
    } catch (error) {
      results[provider] = `Error: ${error.message}`;
    }
  }
  
  return results;
}
```

## 🎯 Best Practices

### 1. Start with Local Provider
- No API costs
- Instant insights
- Privacy-friendly (no data leaves browser)

### 2. Upgrade to AI When Ready
- More nuanced feedback
- Natural conversation style
- Better context understanding

### 3. Monitor API Usage
```javascript
// Track API calls
let apiCallCount = 0;

async function generateInsightWithTracking(data, options) {
  if (options.provider !== 'local') {
    apiCallCount++;
    console.log(`API calls today: ${apiCallCount}`);
  }
  return generateAIInsight(data, options);
}
```

### 4. Handle Errors Gracefully
```javascript
try {
  const insight = await generateAIInsight(data, options);
  setInsight(insight);
} catch (error) {
  console.error('AI error:', error);
  // Fallback to local
  const fallback = await generateAIInsight(data, { provider: 'local' });
  setInsight(fallback);
}
```

## 🔮 Future Enhancements

Potential improvements:
- ✅ Weekly/monthly summaries
- ✅ Personalized goal recommendations
- ✅ Trend predictions
- ✅ Comparison with past performance
- ✅ Team insights (multi-user)
- ✅ Voice-based insights
- ✅ Integration with calendar
- ✅ Automated coaching tips

## 📊 Testing

### Generate Test Insights

```javascript
// Test different scenarios
const scenarios = [
  {
    name: 'Perfect session',
    data: { duration: 3000, distractions: 0, completionRate: 100, totalSessions: 1, averageSessionLength: 3000 }
  },
  {
    name: 'Many distractions',
    data: { duration: 3000, distractions: 10, completionRate: 80, totalSessions: 1, averageSessionLength: 3000 }
  },
  {
    name: 'Short session',
    data: { duration: 600, distractions: 1, completionRate: 100, totalSessions: 1, averageSessionLength: 600 }
  },
  {
    name: 'Multiple sessions',
    data: { duration: 7200, distractions: 4, completionRate: 95, totalSessions: 5, averageSessionLength: 1440 }
  }
];

for (const scenario of scenarios) {
  const insight = await generateAIInsight(scenario.data);
  console.log(`${scenario.name}: ${insight}`);
}
```

## 🆘 Troubleshooting

### Issue: API Key Not Working

**Check:**
- API key format is correct
- API key has sufficient credits
- Network connection is stable
- CORS is not blocking requests

### Issue: Insight Not Updating

**Solutions:**
- Clear localStorage and refresh
- Check browser console for errors
- Verify stats data is populated
- Try regenerating manually

### Issue: Slow Insight Generation

**Optimize:**
- Use local provider for instant results
- Cache insights for unchanged data
- Implement request debouncing
- Use lighter AI models

## 📝 API Reference

### `generateAIInsight(sessionData, options)`

Generates natural language insight from session data.

**Parameters:**
- `sessionData` (Object):
  - `duration` (number): Focus time in seconds
  - `distractions` (number): Count of distractions
  - `completionRate` (number): 0-100 percentage
  - `totalSessions` (number): Number of sessions
  - `averageSessionLength` (number): Average in seconds

- `options` (Object):
  - `provider` (string): 'local', 'openai', 'anthropic'
  - `apiKey` (string): API key for external providers
  - `model` (string): Specific model to use

**Returns:** Promise<string> - Natural language insight

**Example:**
```javascript
const insight = await generateAIInsight({
  duration: 5400,
  distractions: 2,
  completionRate: 95,
  totalSessions: 3,
  averageSessionLength: 1800
}, {
  provider: 'openai',
  apiKey: 'sk-...',
  model: 'gpt-4'
});
```

---

**Built with 💜 to help you achieve peak productivity!**
