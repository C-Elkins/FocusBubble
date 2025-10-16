/**
 * AI Insights Generator for FocusBubble
 *
 * Generates short, motivational natural-language insights from focus session data
 * Supports multiple AI providers (OpenAI, Anthropic) with local fallback
 *
 * @author Chase Elkins
 * @module aiInsightsEnhanced
 */

// ============================================================================
// PROMPT TEMPLATES - Different tones for varied insights
// ============================================================================

const PROMPT_TEMPLATES = {
  /**
   * Motivational tone - Encouraging and uplifting
   */
  motivational: (data) => {
    const { totalMinutes, totalDistractions, sessionsCompleted } = data;
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    const timeStr = hours > 0 ? `${hours}h ${mins}m` : `${mins} minutes`;
    const avgDuration = (totalMinutes / sessionsCompleted).toFixed(1);

    return `You focused for ${timeStr} today with ${totalDistractions} distractions across ${sessionsCompleted} sessions (avg: ${avgDuration} min per session).

Generate a brief, highly encouraging 1-2 sentence insight that celebrates their wins and motivates them to keep going. Be warm and supportive!`;
  },

  /**
   * Analytical tone - Data-driven and precise
   */
  analytical: (data) => {
    const { totalMinutes, totalDistractions, sessionsCompleted } = data;
    const distractionsPerSession = (totalDistractions / sessionsCompleted).toFixed(2);
    const avgDuration = (totalMinutes / sessionsCompleted).toFixed(1);

    return `Session metrics: ${totalMinutes} total minutes, ${sessionsCompleted} sessions, ${avgDuration} min average duration, ${distractionsPerSession} distractions per session.

Provide a concise analytical insight (1-2 sentences) identifying the strongest pattern or metric, plus one specific optimization suggestion.`;
  },

  /**
   * Humorous tone - Light-hearted and fun
   */
  humorous: (data) => {
    const { totalMinutes, totalDistractions, sessionsCompleted, avgFocusDuration } = data;

    return `Today's focus stats: ${totalMinutes} minutes across ${sessionsCompleted} sessions, with ${totalDistractions} distractions trying to steal your attention (and ${totalDistractions === 0 ? 'failing miserably' : 'partially succeeding'}).

Write a playful, slightly humorous 1-2 sentence insight that's still genuinely helpful. Keep it light but actionable!`;
  },

  /**
   * Coach tone - Direct and action-oriented
   */
  coach: (data) => {
    const { totalMinutes, totalDistractions, sessionsCompleted } = data;
    const avgDuration = (totalMinutes / sessionsCompleted).toFixed(1);

    return `Focus session summary: ${totalMinutes} min total, ${sessionsCompleted} sessions, ${totalDistractions} distractions, ${avgDuration} min avg.

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
    const { totalMinutes, totalDistractions, sessionsCompleted } = data;
    const avgDuration = (totalMinutes / sessionsCompleted).toFixed(1);

    return `Stats: ${totalMinutes} minutes, ${sessionsCompleted} sessions, ${totalDistractions} distractions, ${avgDuration} min average.

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
 * @param {string} [options.model] - Model name (e.g., 'gpt-4', 'claude-3-5-sonnet-20241022')
 * @param {string} [options.tone='motivational'] - Tone: 'motivational', 'analytical', 'humorous', 'coach', 'reflective', 'competitive'
 * @param {number} [options.maxTokens=100] - Maximum tokens for AI response
 * @param {number} [options.temperature=0.7] - Temperature for AI response (0-1)
 *
 * @returns {Promise<string>} A 1-2 sentence insight about the user's focus performance
 *
 * @example
 * const insight = await generateFocusInsight({
 *   totalMinutes: 145,
 *   totalDistractions: 6,
 *   sessionsCompleted: 4,
 *   avgFocusDuration: 36.25
 * }, {
 *   provider: 'anthropic',
 *   apiKey: 'sk-ant-...',
 *   tone: 'motivational'
 * });
 * console.log(insight);
 * // "Nice work — your focus duration improved by 15%! Try shorter breaks to keep your rhythm going."
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
    console.error('AI Insight generation failed:', error.message);
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
    throw new Error('OpenAI API key is required. Set options.apiKey or use provider: "local"');
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
    throw new Error('Anthropic API key is required. Set options.apiKey or use provider: "local"');
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
 * Convert session stats from FocusBubble format to AI Insights format
 *
 * @param {Object} stats - Stats object from useFocusStats hook
 * @returns {Object} Formatted stats for generateFocusInsight
 */
export function formatStatsForInsight(stats) {
  return {
    totalMinutes: Math.round(stats.totalFocusTime / 60),
    totalDistractions: stats.totalDistractions,
    sessionsCompleted: stats.totalSessions,
    avgFocusDuration: Math.round(stats.averageSessionLength / 60)
  };
}

/**
 * Get a random prompt tone from available options
 *
 * @returns {string} A random tone name
 */
export function getRandomTone() {
  const tones = Object.keys(PROMPT_TEMPLATES);
  return tones[Math.floor(Math.random() * tones.length)];
}

/**
 * Get all available prompt tones
 *
 * @returns {string[]} Array of available tone names
 */
export function getAvailableTones() {
  return Object.keys(PROMPT_TEMPLATES);
}

// ============================================================================
// EXPORTS
// ============================================================================

export default generateFocusInsight;
