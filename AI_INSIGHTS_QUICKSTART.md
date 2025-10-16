# AI Insights Module - Quick Start Guide

**Get up and running with AI-powered focus insights in 5 minutes!**

---

## ⚡ Super Quick Start

### 1. Install Dependencies
Already included in your project - no additional packages needed!

### 2. Basic Usage (No API Required)

```javascript
import generateFocusInsight from './utils/aiInsightsEnhanced';

// Your session data
const stats = {
  totalMinutes: 145,
  totalDistractions: 6,
  sessionsCompleted: 4,
  avgFocusDuration: 36.25
};

// Generate insight (uses local fallback)
const insight = await generateFocusInsight(stats);
console.log(insight);
// "Solid focus session! You're making steady progress on your goals."
```

### 3. With React Hook

```javascript
import { useAIInsights } from './hooks/useAIInsights';
import { useFocusStats } from './hooks/useFocusStats';

function MyDashboard() {
  const { stats } = useFocusStats();
  const { insight, isLoading } = useAIInsights(stats);

  if (isLoading) return <div>Loading...</div>;
  return <div className="insight-card">{insight}</div>;
}
```

**That's it!** You now have AI insights working with zero configuration.

---

## 🚀 Level Up: Add Real AI

### Option 1: Anthropic Claude (Recommended)

**Why:** Best quality, latest models, excellent at concise responses

```javascript
// 1. Get API key from console.anthropic.com
// 2. Add to .env file:
REACT_APP_ANTHROPIC_KEY=sk-ant-...

// 3. Use in your code:
const { insight } = useAIInsights(stats, {
  provider: 'anthropic',
  apiKey: process.env.REACT_APP_ANTHROPIC_KEY,
  model: 'claude-3-5-sonnet-20241022', // Latest model
  tone: 'motivational'
});
```

**Cost:** ~$0.003 per insight (3/10 of a cent)

### Option 2: OpenAI

**Why:** Fast, cheap, widely available

```javascript
// 1. Get API key from platform.openai.com
// 2. Add to .env:
REACT_APP_OPENAI_KEY=sk-...

// 3. Use in code:
const { insight } = useAIInsights(stats, {
  provider: 'openai',
  apiKey: process.env.REACT_APP_OPENAI_KEY,
  model: 'gpt-4o-mini', // Cheap & fast
  tone: 'humorous'
});
```

**Cost:** ~$0.0003 per insight (3/100 of a cent)

---

## 🎨 Try Different Tones

```javascript
// Motivational (default) - "Great work! Keep it up! 💪"
{ tone: 'motivational' }

// Analytical - "36.25 min avg is optimal. Reduce distractions 20%."
{ tone: 'analytical' }

// Humorous - "Your brain is basically a superhero now! 🦸"
{ tone: 'humorous' }

// Coach - "Tomorrow: 5 sessions, 40 min each. Let's go!"
{ tone: 'coach' }

// Reflective - "Your growing consistency reveals discipline."
{ tone: 'reflective' }

// Competitive - "Good, but you can beat this. Tomorrow: 150+ min!"
{ tone: 'competitive' }

// Random - Picks a different tone each time
{ tone: 'random' }
```

---

## 📖 Complete Examples

### Example 1: Simple Insight Card

```javascript
import { useAIInsights } from './hooks/useAIInsights';
import { useFocusStats } from './hooks/useFocusStats';

function InsightCard() {
  const { stats } = useFocusStats();
  const { insight, isLoading, error, refresh } = useAIInsights(stats, {
    tone: 'motivational'
  });

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-bold mb-3">Today's Insight</h3>

      {isLoading && <div className="animate-pulse">Generating...</div>}

      {error && (
        <div className="text-red-600">
          Failed to generate insight
        </div>
      )}

      {insight && (
        <div>
          <p className="text-gray-700 mb-4">"{insight}"</p>
          <button
            onClick={refresh}
            className="text-sm text-indigo-600 hover:text-indigo-700"
          >
            Get new insight →
          </button>
        </div>
      )}
    </div>
  );
}
```

### Example 2: Multi-Tone Carousel

```javascript
import { useState } from 'react';
import { useAIInsights } from './hooks/useAIInsights';
import { useFocusStats } from './hooks/useFocusStats';

const TONES = ['motivational', 'analytical', 'humorous', 'coach'];

function MultiToneInsights() {
  const { stats } = useFocusStats();
  const [toneIndex, setToneIndex] = useState(0);

  const { insight, isLoading } = useAIInsights(stats, {
    tone: TONES[toneIndex]
  });

  const nextTone = () => {
    setToneIndex((prev) => (prev + 1) % TONES.length);
  };

  return (
    <div className="insight-carousel">
      <div className="tone-badge">{TONES[toneIndex]}</div>
      {!isLoading && <p>{insight}</p>}
      <button onClick={nextTone}>Try different tone →</button>
    </div>
  );
}
```

### Example 3: With API Key Input

```javascript
import { useState } from 'react';
import generateFocusInsight from './utils/aiInsightsEnhanced';

function AIInsightGenerator({ stats }) {
  const [apiKey, setApiKey] = useState('');
  const [insight, setInsight] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await generateFocusInsight(stats, {
        provider: apiKey ? 'anthropic' : 'local',
        apiKey,
        tone: 'motivational'
      });
      setInsight(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="password"
        placeholder="Optional: Enter Anthropic API key"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
      />
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Insight'}
      </button>
      {insight && <p>{insight}</p>}
    </div>
  );
}
```

### Example 4: Auto-Refresh on New Data

```javascript
import { useAIInsights } from './hooks/useAIInsights';
import { useFocusStats } from './hooks/useFocusStats';

function LiveInsights() {
  const { stats } = useFocusStats();

  const { insight, currentTone } = useAIInsights(stats, {
    autoRefresh: true, // Regenerate when stats change
    tone: 'random'     // Different tone each time
  });

  return (
    <div>
      <span className="tone-badge">{currentTone}</span>
      <p>{insight}</p>
    </div>
  );
}
```

---

## 🧪 Test with Demo App

Navigate to the **AI Insights** tab in your app to see the interactive demo:

1. Start your dev server: `npm start`
2. Open http://localhost:3000
3. Click **"AI Insights"** tab
4. Try different tones and providers
5. Enter an API key to test real AI responses

---

## 🎯 Best Practices

### ✅ DO

- Start with `provider: 'local'` - it's free and works offline
- Use the React hook for automatic state management
- Provide clear loading states for better UX
- Let users refresh insights manually
- Cache insights to avoid unnecessary API calls
- Use environment variables for API keys

### ❌ DON'T

- Don't call the API on every render
- Don't commit API keys to Git
- Don't show errors without fallback messages
- Don't generate insights for empty sessions
- Don't forget to handle loading states

---

## 💰 Cost Estimate

Based on typical usage:

| Provider | Cost per Insight | 1000 Insights | 10,000 Insights |
|----------|------------------|---------------|-----------------|
| Local    | $0               | $0            | $0              |
| OpenAI (GPT-4o-mini) | $0.0003 | $0.30 | $3.00 |
| Anthropic (Claude Sonnet) | $0.003 | $3.00 | $30.00 |

**Real-world example:**
- 100 users
- 5 insights per user per day
- 30 days
- = 15,000 insights/month
- **OpenAI cost:** ~$4.50/month
- **Anthropic cost:** ~$45/month

---

## 🐛 Troubleshooting

### "Error: API key is required"
**Solution:** Set your API key in `.env` or pass it in options

### Insights are repetitive
**Solution:** Use `tone: 'random'` or rotate through different tones

### App is slow when generating insights
**Solution:** Use `provider: 'local'` for instant results, or cache AI responses

### Getting rate limit errors
**Solution:** Add rate limiting or use local fallback when quota exceeded

### Type errors with stats object
**Solution:** Use `formatStatsForInsight()` helper to convert your stats format

---

## 🔗 Learn More

- **Full Documentation:** [AI_INSIGHTS_MODULE_README.md](./AI_INSIGHTS_MODULE_README.md)
- **Prompt Templates Guide:** [PROMPT_TEMPLATES_GUIDE.md](./PROMPT_TEMPLATES_GUIDE.md)
- **Interactive Demo:** Start app → AI Insights tab

---

## 🎓 Next Steps

1. ✅ Get basic insights working (local mode)
2. ✅ Choose your favorite tone
3. ✅ Add insight cards to your dashboard
4. ⬜ Sign up for Anthropic or OpenAI API
5. ⬜ Implement API key settings page
6. ⬜ Add user preference for tone selection
7. ⬜ Track which tones perform best with your users
8. ⬜ Customize fallback messages for your brand
9. ⬜ A/B test different tones
10. ⬜ Build your own custom tones!

---

## 💡 Pro Tips

**Tip 1:** Start users with `tone: 'motivational'`, then let them discover other tones

**Tip 2:** Use `tone: 'analytical'` for weekly summaries, `motivational` for daily

**Tip 3:** Show a different random tone each time user refreshes - increases engagement

**Tip 4:** Use competitive tone when user is close to beating a personal record

**Tip 5:** Cache insights in localStorage to reduce API calls

**Tip 6:** Add a "Share this insight" feature - great for social proof

---

**Ready to build? Start with the examples above! 🚀**

Questions? Check the full docs or open an issue on GitHub.
