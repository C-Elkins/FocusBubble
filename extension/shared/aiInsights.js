/**
 * AI Insights Generator for FocusBubble Extension
 *
 * Generates short, motivational natural-language insights from focus session data
 * Supports multiple AI providers (OpenAI, Anthropic) with local fallback
 *
 * @author Chase Elkins
 * @module aiInsights
 */

// ============================================================================
// PROMPT TEMPLATES - Different tones for varied insights
// ============================================================================

const PROMPT_TEMPLATES = {
  /**
   * Motivational tone - Encouraging and uplifting
   */
  motivational: (data) => {
    const { totalMinutes, totalDistractions, sessionsCompleted, avgFocusDuration } = data;
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    const timeStr = hours > 0 ? `${hours}h ${mins}m` : `${mins} minutes`;

    return `You focused for ${timeStr} today with ${totalDistractions} distractions across ${sessionsCompleted} sessions (avg: ${avgFocusDuration.toFixed(1)} min per session).

Generate a brief, highly encouraging 1-2 sentence insight that celebrates their wins and motivates them to keep going. Be warm and supportive!`;
  },

  /**
   * Analytical tone - Data-driven and precise
   */
  analytical: (data) => {
    const { totalMinutes, totalDistractions, sessionsCompleted, avgFocusDuration } = data;
    const distractionsPerSession = (totalDistractions / sessionsCompleted).toFixed(2);

    return `Session metrics: ${totalMinutes} total minutes, ${sessionsCompleted} sessions, ${avgFocusDuration.toFixed(1)} min average duration, ${distractionsPerSession} distractions per session.

Provide a concise analytical insight (1-2 sentences) identifying the strongest pattern or metric, plus one specific optimization suggestion.`;
  },

  /**
   * Humorous tone - Light-hearted and fun
   */
  humorous: (data) => {
    const { totalMinutes, totalDistractions, sessionsCompleted } = data;

    return `Today's focus stats: ${totalMinutes} minutes across ${sessionsCompleted} sessions, with ${totalDistractions} distractions trying to steal your attention (and ${totalDistractions === 0 ? 'failing miserably' : 'partially succeeding'}).

Write a playful, slightly humorous 1-2 sentence insight that's still genuinely helpful. Keep it light but actionable!`;
  },

  /**
   * Coach tone - Direct and action-oriented
   */
  coach: (data) => {
    const { totalMinutes, totalDistractions, sessionsCompleted, avgFocusDuration } = data;

    return `Focus session summary: ${totalMinutes} min total, ${sessionsCompleted} sessions, ${totalDistractions} distractions, ${avgFocusDuration.toFixed(1)} min avg.

As a productivity coach, give one sharp insight (1-2 sentences) with a clear action item for tomorrow. Be direct and specific.`;
  },

  /**
   * Reflective tone - Thoughtful and introspective
   */
  reflective: (data) => {
    const { totalMinutes, totalDistractions, sessionsCompleted } = data;
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;

    return `You spent ${hours > 0 ? `${hours} hours and ${mins} minutes` : `${mins} minutes`} in focused work today, distributed across ${sessionsCompleted} sessions with ${totalDistractions} interruptions.

Reflect on this data and share a thoughtful insight (1-2 sentences) about what this reveals about their focus patterns and potential.`;
  },

  /**
   * Competitive tone - Goal-oriented and challenging
   */
  competitive: (data) => {
    const { totalMinutes, totalDistractions, sessionsCompleted, avgFocusDuration } = data;

    return `Stats: ${totalMinutes} minutes, ${sessionsCompleted} sessions, ${totalDistractions} distractions, ${avgFocusDuration.toFixed(1)} min average.

Give a brief, competitive-toned insight (1-2 sentences) that challenges them to beat their own record. Make it energizing!`;
  }
};

// ============================================================================
// FALLBACK MESSAGES - Used when API calls fail
// ============================================================================

const FALLBACK_MESSAGES = {
  highPerformance: [
    "Outstanding focus today! You're in the zone — keep this momentum going tomorrow.",
    "Impressive deep work session! Your concentration is at peak levels.",
    "You're crushing it! This kind of sustained focus is rare — protect this time.",
    "Exceptional performance! You've found your flow state.",
    "Stellar focus session! You're building serious productivity muscle."
  ],

  goodPerformance: [
    "Solid focus session! You're making steady progress on your goals.",
    "Nice work today! You stayed focused when it mattered most.",
    "Good consistency! Keep building on this foundation.",
    "You're on track! A few tweaks could push you even further.",
    "Strong effort today! Your focus habits are improving."
  ],

  needsImprovement: [
    "Every session is practice! Try breaking tasks into shorter 25-minute blocks.",
    "Progress, not perfection! Tomorrow, try eliminating one major distraction.",
    "You showed up — that's what counts! Consider using website blockers next time.",
    "Building focus takes time! Start with just 15 minutes of uninterrupted work.",
    "Keep going! Even 10 focused minutes beats hours of distracted work."
  ],

  highDistractions: [
    "Lots of interruptions today! Try airplane mode or a dedicated focus app tomorrow.",
    "Distractions happen! Consider creating a distraction-free zone for your next session.",
    "Your focus was tested today! Closing unnecessary tabs might help reduce interruptions.",
    "Noticed the interruptions! Set clear boundaries before your next focus block.",
    "Distractions are feedback! They're showing you what needs blocking or boundaries."
  ],

  lowDistractions: [
    "Zero (or minimal) distractions — you're a focus champion! 🎯",
    "Distraction-free session! This is your productivity sweet spot.",
    "Uninterrupted focus! You've mastered the art of deep work.",
    "Clean focus session! Whatever you did to minimize distractions, do it again.",
    "Perfect concentration! You've created an ideal focus environment."
  ],

  consistentSessions: [
    "Consistency wins! Multiple sessions show you're building a real focus habit.",
    "Regular sessions are the secret! You're developing discipline.",
    "Love the consistency! Steady practice beats occasional marathons.",
    "You're showing up daily! This routine will compound over time.",
    "Multiple sessions = commitment! You're taking focus seriously."
  ]
};

// ============================================================================
// MAIN API FUNCTIONS
// ============================================================================

/**
 * Generate a focus insight from session statistics
 *
 * @param {Object} sessionStats - Focus session statistics
 * @param {number} sessionStats.totalMinutes - Total focus time in minutes
 * @param {number} sessionStats.totalDistractions - Number of distractions detected
 * @param {number} sessionStats.sessionsCompleted - Number of completed sessions
 * @param {number} sessionStats.avgFocusDuration - Average session duration in minutes
 * @param {Object} options - Configuration options
 * @param {string} [options.provider='local'] - AI provider: 'openai', 'anthropic', or 'local'
 * @param {string} [options.apiKey] - API key for the provider
 * @param {string} [options.model] - Model name
 * @param {string} [options.tone='motivational'] - Tone for the insight
 * @param {number} [options.maxTokens=100] - Maximum tokens for AI response
 * @param {number} [options.temperature=0.7] - Temperature for AI response
 *
 * @returns {Promise<string>} A 1-2 sentence insight about focus performance
 */
export async function generateFocusInsight(sessionStats, options = {}) {
  const {
    provider = 'local',
    apiKey,
    model,
    tone = 'motivational',
    maxTokens = 100,
    temperature = 0.7
  } = options;

  // Validate input
  if (!sessionStats || typeof sessionStats !== 'object') {
    throw new Error('sessionStats must be an object');
  }

  const { totalMinutes, totalDistractions, sessionsCompleted, avgFocusDuration } = sessionStats;

  if (totalMinutes === undefined || totalDistractions === undefined ||
      sessionsCompleted === undefined || avgFocusDuration === undefined) {
    throw new Error('sessionStats must include: totalMinutes, totalDistractions, sessionsCompleted, avgFocusDuration');
  }

  try {
    // Route to appropriate provider
    switch (provider.toLowerCase()) {
      case 'openai':
        return await generateOpenAIInsight(sessionStats, { apiKey, model, tone, maxTokens, temperature });

      case 'anthropic':
      case 'claude':
        return await generateAnthropicInsight(sessionStats, { apiKey, model, tone, maxTokens, temperature });

      case 'local':
      default:
        return generateLocalInsight(sessionStats);
    }
  } catch (error) {
    console.error('[AI Insights] Generation failed:', error.message);
    // Always fall back to local generation
    return generateLocalInsight(sessionStats);
  }
}

/**
 * Generate insight using OpenAI API
 * @private
 */
async function generateOpenAIInsight(sessionStats, options) {
  const { apiKey, model = 'gpt-4o-mini', tone, maxTokens, temperature } = options;

  if (!apiKey) {
    throw new Error('OpenAI API key is required');
  }

  const promptTemplate = PROMPT_TEMPLATES[tone] || PROMPT_TEMPLATES.motivational;
  const prompt = promptTemplate(sessionStats);

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'system',
          content: 'You are a productivity coach who provides brief, insightful feedback about focus sessions. Keep responses to 1-2 sentences maximum. Be concise, specific, and actionable.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: maxTokens,
      temperature
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
}

/**
 * Generate insight using Anthropic Claude API
 * @private
 */
async function generateAnthropicInsight(sessionStats, options) {
  const { apiKey, model = 'claude-3-5-sonnet-20241022', tone, maxTokens, temperature } = options;

  if (!apiKey) {
    throw new Error('Anthropic API key is required');
  }

  const promptTemplate = PROMPT_TEMPLATES[tone] || PROMPT_TEMPLATES.motivational;
  const prompt = promptTemplate(sessionStats);

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      temperature,
      messages: [
        {
          role: 'user',
          content: `You are a productivity coach. ${prompt}\n\nProvide ONLY the 1-2 sentence insight, nothing else.`
        }
      ]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Anthropic API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data.content[0].text.trim();
}

/**
 * Generate insight using local rule-based logic (no API required)
 * @private
 */
function generateLocalInsight(sessionStats) {
  const { totalMinutes, totalDistractions, sessionsCompleted } = sessionStats;

  // Calculate performance metrics
  const distractionsPerSession = totalDistractions / sessionsCompleted;
  const isHighPerformance = totalMinutes >= 120 && distractionsPerSession <= 2;
  const isGoodPerformance = totalMinutes >= 60 && distractionsPerSession <= 4;
  const hasHighDistractions = distractionsPerSession > 5;
  const hasLowDistractions = totalDistractions <= 2 && totalMinutes >= 25;
  const hasConsistentSessions = sessionsCompleted >= 4;

  // Select appropriate fallback category
  let category;
  if (isHighPerformance) {
    category = 'highPerformance';
  } else if (hasLowDistractions) {
    category = 'lowDistractions';
  } else if (hasHighDistractions) {
    category = 'highDistractions';
  } else if (hasConsistentSessions) {
    category = 'consistentSessions';
  } else if (isGoodPerformance) {
    category = 'goodPerformance';
  } else {
    category = 'needsImprovement';
  }

  // Select random message from category
  const messages = FALLBACK_MESSAGES[category];
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format session data for insight generation
 *
 * @param {Array} sessions - Array of session objects
 * @returns {Object} Formatted stats
 */
export function formatSessionsForInsight(sessions) {
  const today = new Date().toDateString();
  const todaySessions = sessions.filter(s => {
    const sessionDate = new Date(s.startTime).toDateString();
    return sessionDate === today && s.completed;
  });

  const totalMinutes = todaySessions.reduce((sum, s) => sum + Math.round(s.duration / 60), 0);
  const totalDistractions = todaySessions.reduce((sum, s) => sum + s.distractions, 0);
  const sessionsCompleted = todaySessions.length;
  const avgFocusDuration = sessionsCompleted > 0 ? totalMinutes / sessionsCompleted : 0;

  return {
    totalMinutes,
    totalDistractions,
    sessionsCompleted,
    avgFocusDuration
  };
}

/**
 * Get all available prompt tones
 *
 * @returns {string[]} Array of available tone names
 */
export function getAvailableTones() {
  return Object.keys(PROMPT_TEMPLATES);
}

/**
 * Get a random prompt tone
 *
 * @returns {string} A random tone name
 */
export function getRandomTone() {
  const tones = getAvailableTones();
  return tones[Math.floor(Math.random() * tones.length)];
}

// ============================================================================
// EXPORTS
// ============================================================================

export default generateFocusInsight;
