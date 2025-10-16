# AI Insights Generator Module

**A modular, reusable AI insights generator for FocusBubble**

Generate short, motivational natural-language insights from focus session data using AI models (Claude, OpenAI) or local rule-based fallbacks.

---

## 🚀 Quick Start

### Basic Usage (No API Required)

```javascript
import generateFocusInsight from './utils/aiInsightsEnhanced';

const sessionStats = {
  totalMinutes: 145,
  totalDistractions: 6,
  sessionsCompleted: 4,
  avgFocusDuration: 36.25
};

const insight = await generateFocusInsight(sessionStats);
console.log(insight);
// "Nice work — you stayed focused for over two hours today!"
```

### With React Hook

```javascript
import { useAIInsights } from './hooks/useAIInsights';
import { useFocusStats } from './hooks/useFocusStats';

function Dashboard() {
  const { stats } = useFocusStats();

  const { insight, isLoading, refresh } = useAIInsights(stats, {
    provider: 'local', // or 'anthropic', 'openai'
    tone: 'motivational'
  });

  if (isLoading) return <div>Generating insight...</div>;

  return (
    <div>
      <p>{insight}</p>
      <button onClick={refresh}>New Insight</button>
    </div>
  );
}
```

---

## 📦 What's Included

### Files

1. **`src/utils/aiInsightsEnhanced.js`** - Core insight generation module
2. **`src/hooks/useAIInsights.js`** - React hook for state management
3. **`src/components/AIInsightDemo.jsx`** - Interactive demo component

### Features

✅ **Multiple AI Providers**
- OpenAI (GPT-4, GPT-4o-mini, etc.)
- Anthropic Claude (Claude 3.5 Sonnet, etc.)
- Local rule-based fallback (no API required)

✅ **6 Prompt Tones**
- 🎉 **Motivational** - Encouraging and uplifting
- 📊 **Analytical** - Data-driven and precise
- 😄 **Humorous** - Light-hearted and fun
- 💪 **Coach** - Direct and action-oriented
- 🧘 **Reflective** - Thoughtful and introspective
- 🏆 **Competitive** - Goal-oriented and challenging

✅ **Smart Fallbacks**
- Automatically falls back to local generation if API fails
- 30+ pre-written motivational messages
- Categorized by performance level

✅ **React Integration**
- Custom hooks with loading/error states
- Auto-refresh options
- Manual refresh control

---

## 🎯 API Reference

### Core Function: `generateFocusInsight()`

```javascript
generateFocusInsight(sessionStats, options)
```

#### Parameters

**`sessionStats`** (Object) - Required
- `totalMinutes` (number) - Total focus time in minutes
- `totalDistractions` (number) - Number of distractions detected
- `sessionsCompleted` (number) - Number of completed sessions
- `avgFocusDuration` (number) - Average session duration in minutes

**`options`** (Object) - Optional
- `provider` (string) - AI provider: `'openai'`, `'anthropic'`, or `'local'` (default: `'local'`)
- `apiKey` (string) - API key for the provider
- `model` (string) - Model name (e.g., `'gpt-4o-mini'`, `'claude-3-5-sonnet-20241022'`)
- `tone` (string) - Insight tone: `'motivational'`, `'analytical'`, `'humorous'`, `'coach'`, `'reflective'`, `'competitive'` (default: `'motivational'`)
- `maxTokens` (number) - Maximum tokens for AI response (default: `100`)
- `temperature` (number) - Temperature for AI response, 0-1 (default: `0.7`)

#### Returns

`Promise<string>` - A 1-2 sentence insight about focus performance

#### Examples

**Local (No API)**
```javascript
const insight = await generateFocusInsight({
  totalMinutes: 145,
  totalDistractions: 6,
  sessionsCompleted: 4,
  avgFocusDuration: 36.25
});
// "Solid focus session! You're making steady progress on your goals."
```

**With OpenAI**
```javascript
const insight = await generateFocusInsight({
  totalMinutes: 145,
  totalDistractions: 6,
  sessionsCompleted: 4,
  avgFocusDuration: 36.25
}, {
  provider: 'openai',
  apiKey: process.env.REACT_APP_OPENAI_KEY,
  model: 'gpt-4o-mini',
  tone: 'humorous'
});
// "145 minutes of focus! Your brain is basically a productivity superhero now. 🦸"
```

**With Anthropic Claude**
```javascript
const insight = await generateFocusInsight({
  totalMinutes: 145,
  totalDistractions: 6,
  sessionsCompleted: 4,
  avgFocusDuration: 36.25
}, {
  provider: 'anthropic',
  apiKey: process.env.REACT_APP_ANTHROPIC_KEY,
  model: 'claude-3-5-sonnet-20241022',
  tone: 'analytical'
});
// "Your 36-minute average session length aligns with peak cognitive performance research. Reducing distractions from 1.5 to <1 per session would yield approximately 20% efficiency gains."
```

---

### React Hook: `useAIInsights()`

```javascript
useAIInsights(stats, options)
```

#### Parameters

**`stats`** (Object) - Focus statistics from `useFocusStats` hook

**`options`** (Object) - Optional
- Same as `generateFocusInsight()` options, plus:
- `autoRefresh` (boolean) - Auto-refresh when stats change (default: `false`)
- `refreshInterval` (number) - Auto-refresh interval in ms
- `enabled` (boolean) - Enable/disable generation (default: `true`)

#### Returns

Object with:
- `insight` (string|null) - Generated insight text
- `isLoading` (boolean) - Loading state
- `error` (Error|null) - Error object if generation failed
- `refresh` (Function) - Manually refresh insight
- `clear` (Function) - Clear current insight
- `currentTone` (string) - Current tone being used

#### Example

```javascript
function MyComponent() {
  const { stats } = useFocusStats();

  const {
    insight,
    isLoading,
    error,
    refresh,
    currentTone
  } = useAIInsights(stats, {
    provider: 'anthropic',
    apiKey: process.env.REACT_APP_ANTHROPIC_KEY,
    tone: 'motivational',
    autoRefresh: true
  });

  return (
    <div>
      {isLoading && <Spinner />}
      {error && <ErrorMessage error={error} />}
      {insight && (
        <div>
          <p>{insight}</p>
          <small>Tone: {currentTone}</small>
        </div>
      )}
      <button onClick={refresh}>Refresh</button>
    </div>
  );
}
```

---

## 🎨 Prompt Tones

### 1. Motivational 🎉
**Best for:** Daily encouragement, celebrating wins

**Example:**
> "Incredible! You focused for 2.4 hours with only 6 distractions — that's exceptional deep work! Keep this momentum going tomorrow."

### 2. Analytical 📊
**Best for:** Data lovers, optimization enthusiasts

**Example:**
> "Your average session length of 36.25 minutes is optimal for deep work. Reducing distractions per session from 1.5 to under 1.0 would increase efficiency by ~20%."

### 3. Humorous 😄
**Best for:** Keeping things light and fun

**Example:**
> "145 minutes of pure focus! Your brain deserves a trophy (and maybe a snack). Keep those distractions on their toes tomorrow!"

### 4. Coach 💪
**Best for:** Action-oriented individuals, goal-chasers

**Example:**
> "Strong consistency today! Tomorrow's goal: push that average session to 40 minutes and knock out 5 sessions. You've got this!"

### 5. Reflective 🧘
**Best for:** Mindful users, self-improvement focused

**Example:**
> "You demonstrated remarkable discipline today, maintaining focus across 4 distinct sessions. This consistency reveals growing mental endurance."

### 6. Competitive 🏆
**Best for:** Achievement-driven users, record-breakers

**Example:**
> "Good work, but you can do better. Tomorrow: beat your 145-minute record and cut those distractions in half. Challenge accepted?"

---

## 🔧 Utility Functions

### `formatStatsForInsight(stats)`
Convert stats from `useFocusStats` to the format needed by `generateFocusInsight`

```javascript
import { formatStatsForInsight } from './utils/aiInsightsEnhanced';

const focusStats = {
  totalFocusTime: 8700, // seconds
  totalSessions: 4,
  totalDistractions: 6,
  averageSessionLength: 2175 // seconds
};

const formatted = formatStatsForInsight(focusStats);
// {
//   totalMinutes: 145,
//   totalDistractions: 6,
//   sessionsCompleted: 4,
//   avgFocusDuration: 36.25
// }
```

### `getRandomTone()`
Get a random tone from available options

```javascript
import { getRandomTone } from './utils/aiInsightsEnhanced';

const tone = getRandomTone();
// Returns: 'motivational', 'analytical', 'humorous', etc.
```

### `getAvailableTones()`
Get all available tone names

```javascript
import { getAvailableTones } from './utils/aiInsightsEnhanced';

const tones = getAvailableTones();
// ['motivational', 'analytical', 'humorous', 'coach', 'reflective', 'competitive']
```

---

## 🔐 Setting Up API Keys

### OpenAI

1. Get an API key from [platform.openai.com](https://platform.openai.com/)
2. Create a `.env` file in your project root:
   ```bash
   REACT_APP_OPENAI_KEY=sk-...
   ```
3. Use in your code:
   ```javascript
   const insight = await generateFocusInsight(stats, {
     provider: 'openai',
     apiKey: process.env.REACT_APP_OPENAI_KEY
   });
   ```

**Recommended Models:**
- `gpt-4o-mini` - Fast, cheap, great quality
- `gpt-4o` - Higher quality, more expensive
- `gpt-3.5-turbo` - Fastest, cheapest

### Anthropic Claude

1. Get an API key from [console.anthropic.com](https://console.anthropic.com/)
2. Create a `.env` file:
   ```bash
   REACT_APP_ANTHROPIC_KEY=sk-ant-...
   ```
3. Use in your code:
   ```javascript
   const insight = await generateFocusInsight(stats, {
     provider: 'anthropic',
     apiKey: process.env.REACT_APP_ANTHROPIC_KEY
   });
   ```

**Recommended Models:**
- `claude-3-5-sonnet-20241022` - Best overall (recommended)
- `claude-3-5-haiku-20241022` - Fastest, cheapest
- `claude-3-opus-20240229` - Highest quality, most expensive

---

## 💡 Advanced Examples

### Random Tone on Each Refresh

```javascript
const { insight, refresh } = useAIInsights(stats, {
  tone: 'random' // Will pick a random tone each time
});
```

### Auto-Refresh Every 5 Minutes

```javascript
const { insight } = useAIInsights(stats, {
  autoRefresh: true,
  refreshInterval: 5 * 60 * 1000 // 5 minutes
});
```

### Conditional Enable/Disable

```javascript
const [showInsights, setShowInsights] = useState(true);

const { insight } = useAIInsights(stats, {
  enabled: showInsights && stats.totalSessions > 0
});
```

### Error Handling

```javascript
const { insight, error } = useAIInsights(stats, {
  provider: 'anthropic',
  apiKey: myApiKey
});

if (error) {
  console.error('Insight generation failed:', error);
  // Will still have a fallback insight from local generation
}
```

---

## 🧪 Testing the Module

### Interactive Demo

The project includes an interactive demo component at `src/components/AIInsightDemo.jsx`:

```javascript
import AIInsightDemo from './components/AIInsightDemo';

function App() {
  return <AIInsightDemo />;
}
```

This demo lets you:
- Test all 6 prompt tones
- Switch between providers (local, OpenAI, Anthropic)
- Enter API keys and see real responses
- View your current session stats
- See example outputs for each tone

### Manual Testing

```javascript
// Test with sample data
const testStats = {
  totalMinutes: 145,
  totalDistractions: 6,
  sessionsCompleted: 4,
  avgFocusDuration: 36.25
};

// Test each tone
const tones = ['motivational', 'analytical', 'humorous', 'coach', 'reflective', 'competitive'];

for (const tone of tones) {
  const insight = await generateFocusInsight(testStats, { tone });
  console.log(`${tone}:`, insight);
}
```

---

## 📝 Fallback Messages

The module includes 30+ pre-written fallback messages categorized by performance:

- **High Performance** (120+ min, ≤2 distractions/session)
- **Good Performance** (60+ min, ≤4 distractions/session)
- **Needs Improvement** (<60 min or low completion)
- **High Distractions** (>5 distractions/session)
- **Low Distractions** (≤2 total distractions)
- **Consistent Sessions** (4+ sessions)

These ensure users always get meaningful feedback, even if:
- No API key is provided
- API call fails
- Network is offline
- API quota is exceeded

---

## 🎓 Best Practices

### 1. Use Local by Default
Start with `provider: 'local'` for development and offer API providers as optional premium features.

### 2. Don't Over-Generate
Avoid calling the API on every render. Use the hook's built-in state management or generate only when stats change significantly.

### 3. Keep Insights Short
The prompts are designed for 1-2 sentences. Longer responses cost more and may lose user attention.

### 4. Rotate Tones
Use `tone: 'random'` or rotate through tones to keep insights fresh and engaging.

### 5. Handle Errors Gracefully
The module always provides a fallback, but you should still show appropriate UI for loading/error states.

### 6. Secure API Keys
Never commit API keys to Git. Always use environment variables.

---

## 🚀 Deployment Checklist

- [ ] Set up environment variables for API keys
- [ ] Test all tones with your actual user data
- [ ] Implement proper error boundaries
- [ ] Add loading states to UI
- [ ] Test with no internet connection (fallback)
- [ ] Add user preference for tone selection
- [ ] Consider rate limiting API calls
- [ ] Monitor API usage/costs

---

## 📄 License

MIT License - Feel free to use this module in your own projects!

---

## 👨‍💻 Author

**Chase Elkins**

Built for FocusBubble - A distraction-aware focus timer with AI-powered insights

---

## 🤝 Contributing

This module is designed to be modular and extensible. To add new features:

1. **Add a new tone:** Edit `PROMPT_TEMPLATES` in `aiInsightsEnhanced.js`
2. **Add a new provider:** Add a new case in `generateFocusInsight()` switch statement
3. **Improve fallbacks:** Edit `FALLBACK_MESSAGES` with new categories or messages

---

## 📚 Additional Resources

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Anthropic Claude API Documentation](https://docs.anthropic.com/)
- [React Hooks Documentation](https://react.dev/reference/react)

---

**Questions? Issues? Suggestions?**

Open an issue on GitHub or contribute to the project!
