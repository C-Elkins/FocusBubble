# AI Insights Prompt Templates Guide

Quick reference for the 6 creative prompt templates included in FocusBubble's AI Insights Generator.

---

## 🎉 Motivational Tone

**Use when:** You want to encourage and celebrate user wins

**Personality:** Warm, supportive, celebratory

**System Prompt:**
> "Generate a brief, highly encouraging 1-2 sentence insight that celebrates their wins and motivates them to keep going. Be warm and supportive!"

**Example Output:**
> "Incredible! You focused for 2.4 hours with only 6 distractions — that's exceptional deep work! Keep this momentum going tomorrow."

**Best for:**
- Daily dashboards
- End-of-session summaries
- Encouraging new users
- Celebrating personal bests

---

## 📊 Analytical Tone

**Use when:** Users want data-driven optimization advice

**Personality:** Precise, metrics-focused, optimization-oriented

**System Prompt:**
> "Provide a concise analytical insight (1-2 sentences) identifying the strongest pattern or metric, plus one specific optimization suggestion."

**Example Output:**
> "Your average session length of 36.25 minutes is optimal for deep work research. Reducing distractions per session from 1.5 to under 1.0 would increase efficiency by approximately 20%."

**Best for:**
- Power users
- Data enthusiasts
- Performance optimization
- Business/productivity apps

---

## 😄 Humorous Tone

**Use when:** You want to keep things light and fun

**Personality:** Playful, witty, approachable

**System Prompt:**
> "Write a playful, slightly humorous 1-2 sentence insight that's still genuinely helpful. Keep it light but actionable!"

**Example Output:**
> "145 minutes of pure focus! Your brain deserves a trophy (and maybe a snack). Keep those distractions on their toes tomorrow!"

**Best for:**
- Casual apps
- Younger audiences
- Gamified experiences
- Breaking tension after long sessions

---

## 💪 Coach Tone

**Use when:** Users need direct, action-oriented guidance

**Personality:** Direct, specific, action-focused

**System Prompt:**
> "As a productivity coach, give one sharp insight (1-2 sentences) with a clear action item for tomorrow. Be direct and specific."

**Example Output:**
> "Strong consistency today! Tomorrow's goal: push that average session to 40 minutes and knock out 5 sessions. You've got this!"

**Best for:**
- Goal-oriented users
- Habit-building features
- Daily challenges
- Coaching/mentoring apps

---

## 🧘 Reflective Tone

**Use when:** Users appreciate thoughtful, introspective feedback

**Personality:** Mindful, philosophical, growth-oriented

**System Prompt:**
> "Reflect on this data and share a thoughtful insight (1-2 sentences) about what this reveals about their focus patterns and potential."

**Example Output:**
> "You demonstrated remarkable discipline today, maintaining focus across 4 distinct sessions. This consistency reveals growing mental endurance and a maturing practice."

**Best for:**
- Mindfulness apps
- Self-improvement contexts
- Meditation/focus apps
- Long-term habit tracking

---

## 🏆 Competitive Tone

**Use when:** Users thrive on challenges and beating records

**Personality:** Energizing, challenging, achievement-focused

**System Prompt:**
> "Give a brief, competitive-toned insight (1-2 sentences) that challenges them to beat their own record. Make it energizing!"

**Example Output:**
> "Good work, but you can do better. Tomorrow: beat your 145-minute record and cut those distractions in half. Challenge accepted?"

**Best for:**
- Gamified apps
- Leaderboard features
- Streak tracking
- Achievement systems
- Fitness/performance apps

---

## 🎲 Random Tone

**Use when:** You want variety and freshness

**Behavior:** Randomly selects one of the 6 tones on each generation

**Example Usage:**
```javascript
const { insight } = useAIInsights(stats, {
  tone: 'random' // Will pick a different tone each time
});
```

**Best for:**
- Keeping insights fresh
- Preventing "insight fatigue"
- Discovery/exploration
- A/B testing different tones

---

## Customization Guide

### Creating Your Own Tone

Want to add a custom tone? Edit `src/utils/aiInsightsEnhanced.js`:

```javascript
const PROMPT_TEMPLATES = {
  // ... existing tones ...

  /**
   * YOUR CUSTOM TONE
   */
  yourTone: (data) => {
    const { totalMinutes, totalDistractions, sessionsCompleted, avgFocusDuration } = data;

    return `Your custom prompt here using ${totalMinutes} minutes, ${sessionsCompleted} sessions, etc.

    Instructions for the AI model about tone, style, and format.`;
  }
};
```

### Tone Rotation Strategy

Rotate through tones to keep users engaged:

```javascript
const tones = ['motivational', 'analytical', 'coach'];
const currentTone = tones[new Date().getDay() % tones.length];

// Monday = motivational
// Tuesday = analytical
// Wednesday = coach
// (repeats...)
```

### User Preferences

Let users pick their preferred tone:

```javascript
// Save to localStorage
localStorage.setItem('preferredTone', 'analytical');

// Use in hook
const preferredTone = localStorage.getItem('preferredTone') || 'motivational';

const { insight } = useAIInsights(stats, {
  tone: preferredTone
});
```

---

## Tone Selection Decision Tree

```
Start Here
    │
    ├─ Need encouragement? → Motivational 🎉
    │
    ├─ Want data/metrics? → Analytical 📊
    │
    ├─ Keep it fun? → Humorous 😄
    │
    ├─ Need action items? → Coach 💪
    │
    ├─ Prefer mindfulness? → Reflective 🧘
    │
    ├─ Love challenges? → Competitive 🏆
    │
    └─ Want variety? → Random 🎲
```

---

## Performance Comparison

| Tone | Token Usage | Response Speed | User Engagement |
|------|------------|----------------|-----------------|
| Motivational | ~80 tokens | Fast | ⭐⭐⭐⭐⭐ |
| Analytical | ~90 tokens | Fast | ⭐⭐⭐⭐ |
| Humorous | ~70 tokens | Fastest | ⭐⭐⭐⭐⭐ |
| Coach | ~75 tokens | Fast | ⭐⭐⭐⭐ |
| Reflective | ~85 tokens | Medium | ⭐⭐⭐ |
| Competitive | ~70 tokens | Fast | ⭐⭐⭐⭐ |

---

## A/B Testing Recommendations

**Hypothesis:** Different tones work better for different user segments

**Test Setup:**
1. Randomly assign new users to a default tone
2. Track engagement metrics:
   - Time spent reading insight
   - Refresh button clicks
   - Session return rate
3. After 2 weeks, show users their "matched tone"
4. Let them opt to change it

**Metrics to track:**
- Click-through rate on insights
- Time to next session (does tone motivate?)
- Insight refresh frequency
- User retention

---

## Multi-Tone Experiences

### Progressive Difficulty
```javascript
// Start motivational, gradually increase challenge
const sessionCount = stats.totalSessions;

let tone;
if (sessionCount < 5) tone = 'motivational';
else if (sessionCount < 20) tone = 'coach';
else tone = 'competitive';
```

### Adaptive Tone
```javascript
// Choose tone based on performance
const distractionsPerSession = stats.totalDistractions / stats.totalSessions;

let tone;
if (distractionsPerSession > 5) tone = 'coach'; // Need help
else if (stats.totalMinutes > 180) tone = 'competitive'; // Push harder
else tone = 'motivational'; // Keep going
```

### Time-of-Day Tones
```javascript
const hour = new Date().getHours();

let tone;
if (hour < 12) tone = 'motivational'; // Morning boost
else if (hour < 17) tone = 'analytical'; // Afternoon reflection
else tone = 'reflective'; // Evening wind-down
```

---

## Tips for Writing Great Prompts

### 1. Be Specific About Length
✅ "Provide a 1-2 sentence insight"
❌ "Give some feedback"

### 2. Include Personality Descriptors
✅ "Be warm and encouraging"
❌ Generic prompt

### 3. Provide Example Metrics
✅ Include actual numbers in the prompt
❌ Vague references

### 4. Set Clear Constraints
✅ "Keep it under 100 tokens"
❌ No length guidance

### 5. Add Context
✅ "You are a productivity coach helping someone improve focus"
❌ No role/context

---

## FAQs

**Q: Which tone performs best?**
A: Motivational and Humorous consistently show highest engagement, but it depends on your audience.

**Q: Can I use multiple tones in one session?**
A: Yes! You could show a motivational tone during the session and an analytical tone on the dashboard.

**Q: How do I prevent repetitive insights?**
A: Use the `random` tone or rotate through tones based on time/performance.

**Q: Are these templates optimized for cost?**
A: Yes! All templates target 1-2 sentences (~70-90 tokens) to minimize API costs while maximizing value.

**Q: Can I translate these to other languages?**
A: Absolutely! The AI models support 50+ languages. Just modify the prompts to your target language.

---

## Resources

- **OpenAI Prompt Engineering:** https://platform.openai.com/docs/guides/prompt-engineering
- **Anthropic Prompting Guide:** https://docs.anthropic.com/claude/docs/prompt-engineering
- **Token Counter Tool:** https://platform.openai.com/tokenizer

---

**Questions or suggestions for new tones?**
Open an issue on GitHub or contribute your own!
