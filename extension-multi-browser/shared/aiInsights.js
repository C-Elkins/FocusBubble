/**
 * AI Insights Generator for FocusBubble
 * 
 * Generates motivational insights and productivity recommendations using AI.
 * Supports multiple AI providers (OpenAI GPT, Anthropic Claude, and fallback messages).
 * 
 * Features:
 * - Accepts session data (minutes, distractions, completion rate)
 * - Generates natural language prompts
 * - Returns short motivational insights
 * - Includes comprehensive fallback messages
 * - Easy API key configuration
 * - Cross-browser compatible
 * 
 * @author Krubles Team
 * @version 1.0.0
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * AI Provider Configuration
 * 
 * To use AI insights, you'll need to:
 * 1. Choose a provider (OpenAI or Anthropic)
 * 2. Get an API key from the provider
 * 3. Store it securely using the configure() method
 * 
 * IMPORTANT: Never commit API keys to version control!
 * Store them in user settings or environment variables.
 */

const AI_CONFIG = {
  // OpenAI Configuration
  // Get your API key at: https://platform.openai.com/api-keys
  OPENAI: {
    endpoint: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4o-mini', // More affordable model, great for insights
    maxTokens: 300, // Short, focused insights
    temperature: 0.7 // Balanced creativity
  },

  // Anthropic Claude Configuration
  // Get your API key at: https://console.anthropic.com/
  ANTHROPIC: {
    endpoint: 'https://api.anthropic.com/v1/messages',
    model: 'claude-3-haiku-20240307', // Fast, cost-effective model
    maxTokens: 300,
    version: '2023-06-01'
  },

  // General settings
  TIMEOUT: 10000, // 10 second timeout for API calls
  RETRY_ATTEMPTS: 2 // Number of retry attempts on failure
};

// ============================================================================
// AI INSIGHTS CLASS
// ============================================================================

class AIInsights {
  constructor() {
    this.provider = null; // 'openai' or 'anthropic'
    this.apiKey = null;
    this.isConfigured = false;
  }

  // ==========================================================================
  // CONFIGURATION METHODS
  // ==========================================================================

  /**
   * Configure AI provider with API key
   * 
   * Usage:
   *   await aiInsights.configure('openai', 'sk-...');
   *   await aiInsights.configure('anthropic', 'sk-ant-...');
   * 
   * @param {string} provider - 'openai' or 'anthropic'
   * @param {string} apiKey - API key from provider
   * @returns {Promise<Object>} - Configuration result
   */
  async configure(provider, apiKey) {
    if (!provider || !apiKey) {
      return { success: false, error: 'Provider and API key required' };
    }

    if (!['openai', 'anthropic'].includes(provider)) {
      return { success: false, error: 'Invalid provider. Use "openai" or "anthropic"' };
    }

    this.provider = provider;
    this.apiKey = apiKey;
    this.isConfigured = true;

    console.log(`✅ AI Insights configured with ${provider}`);
    return { success: true, provider };
  }

  /**
   * Check if AI insights are configured and ready
   * 
   * @returns {boolean} - Whether AI is configured
   */
  isReady() {
    return this.isConfigured && this.apiKey && this.provider;
  }

  /**
   * Get current configuration status
   * 
   * @returns {Object} - Configuration info (without exposing API key)
   */
  getStatus() {
    return {
      configured: this.isConfigured,
      provider: this.provider,
      hasApiKey: !!this.apiKey
    };
  }

  // ==========================================================================
  // MAIN INSIGHTS GENERATION
  // ==========================================================================

  /**
   * Generate AI-powered insights from session data
   * 
   * Usage:
   *   const insight = await aiInsights.generateInsight({
   *     totalMinutes: 120,
   *     distractions: 3,
   *     sessionsCompleted: 5,
   *     completionRate: 0.8,
   *     currentStreak: 3
   *   });
   * 
   * @param {Object} sessionData - User's session statistics
   * @returns {Promise<Object>} - Generated insight
   */
  async generateInsight(sessionData) {
    // Validate input
    if (!sessionData || typeof sessionData !== 'object') {
      return this.getFallbackInsight('error');
    }

    // If AI not configured, return smart fallback
    if (!this.isReady()) {
      return this.getSmartFallback(sessionData);
    }

    try {
      // Generate natural language prompt
      const prompt = this.buildPrompt(sessionData);

      // Call appropriate AI provider
      let result;
      if (this.provider === 'openai') {
        result = await this.callOpenAI(prompt);
      } else if (this.provider === 'anthropic') {
        result = await this.callAnthropic(prompt);
      }

      // Validate and return result
      if (result && result.insight) {
        console.log('✨ AI insight generated successfully');
        return {
          success: true,
          insight: result.insight,
          mood: result.mood || 'motivational',
          source: this.provider
        };
      } else {
        throw new Error('Invalid AI response format');
      }
    } catch (error) {
      console.error('❌ AI insight generation failed:', error.message);
      
      // Return smart fallback on error
      return this.getSmartFallback(sessionData);
    }
  }

  // ==========================================================================
  // PROMPT GENERATION
  // ==========================================================================

  /**
   * Build natural language prompt from session data
   * 
   * @param {Object} data - Session statistics
   * @returns {string} - Formatted prompt for AI
   */
  buildPrompt(data) {
    const {
      totalMinutes = 0,
      distractions = 0,
      sessionsCompleted = 0,
      completionRate = 0,
      currentStreak = 0,
      totalSessions = 0,
      averageSessionLength = 0
    } = data;

    // Calculate derived metrics
    const focusScore = this.calculateFocusScore(data);
    const performanceLevel = this.getPerformanceLevel(focusScore);

    // Build contextual prompt
    const prompt = `You are a supportive productivity coach. Based on these focus session statistics, provide ONE short, motivational insight (2-3 sentences max):

Statistics:
- Total focus time: ${totalMinutes} minutes
- Sessions completed: ${sessionsCompleted}${totalSessions ? ` out of ${totalSessions}` : ''}
- Completion rate: ${Math.round(completionRate * 100)}%
- Distractions: ${distractions}
- Current streak: ${currentStreak} days
- Average session: ${averageSessionLength} minutes
- Focus score: ${focusScore}/100 (${performanceLevel})

Respond with a JSON object in this exact format:
{
  "insight": "Your motivational message here (2-3 sentences)",
  "mood": "celebratory|encouraging|supportive|motivational"
}

Focus on being positive, specific, and actionable. Celebrate wins and offer gentle guidance for improvement.`;

    return prompt;
  }

  // ==========================================================================
  // AI API CALLS
  // ==========================================================================

  /**
   * Call OpenAI ChatGPT API
   * 
   * @param {string} prompt - Generated prompt
   * @returns {Promise<Object>} - Parsed AI response
   */
  async callOpenAI(prompt) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), AI_CONFIG.TIMEOUT);

    try {
      const response = await fetch(AI_CONFIG.OPENAI.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: AI_CONFIG.OPENAI.model,
          messages: [
            {
              role: 'system',
              content: 'You are a supportive productivity coach who provides brief, motivational insights. Always respond in valid JSON format.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: AI_CONFIG.OPENAI.temperature,
          max_tokens: AI_CONFIG.OPENAI.maxTokens,
          response_format: { type: 'json_object' } // Ensures JSON response
        }),
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error?.message || `API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        throw new Error('Empty response from OpenAI');
      }

      // Parse JSON response
      return JSON.parse(content);
    } catch (error) {
      clearTimeout(timeout);
      
      if (error.name === 'AbortError') {
        throw new Error('API request timed out');
      }
      throw error;
    }
  }

  /**
   * Call Anthropic Claude API
   * 
   * @param {string} prompt - Generated prompt
   * @returns {Promise<Object>} - Parsed AI response
   */
  async callAnthropic(prompt) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), AI_CONFIG.TIMEOUT);

    try {
      const response = await fetch(AI_CONFIG.ANTHROPIC.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': AI_CONFIG.ANTHROPIC.version
        },
        body: JSON.stringify({
          model: AI_CONFIG.ANTHROPIC.model,
          max_tokens: AI_CONFIG.ANTHROPIC.maxTokens,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ]
        }),
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error?.message || `API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.content[0]?.text;

      if (!content) {
        throw new Error('Empty response from Anthropic');
      }

      // Parse JSON response
      return JSON.parse(content);
    } catch (error) {
      clearTimeout(timeout);
      
      if (error.name === 'AbortError') {
        throw new Error('API request timed out');
      }
      throw error;
    }
  }

  // ==========================================================================
  // FALLBACK MESSAGES
  // ==========================================================================

  /**
   * Generate smart fallback based on session data
   * Used when AI is not configured or fails
   * 
   * @param {Object} data - Session statistics
   * @returns {Object} - Fallback insight
   */
  getSmartFallback(data) {
    const {
      totalMinutes = 0,
      distractions = 0,
      sessionsCompleted = 0,
      completionRate = 0,
      currentStreak = 0
    } = data;

    let insight, mood;

    // High performance - celebrate!
    if (completionRate >= 0.9 && distractions <= 2) {
      insight = `Outstanding focus! You've completed ${sessionsCompleted} sessions with minimal distractions. Your discipline is paying off. Keep this momentum going! 🌟`;
      mood = 'celebratory';
    }
    // Long streak - acknowledge dedication
    else if (currentStreak >= 7) {
      insight = `Incredible ${currentStreak}-day streak! Your consistency is building strong productivity habits. Remember, it's the daily practice that creates lasting change. 🔥`;
      mood = 'celebratory';
    }
    // Good focus time - encourage
    else if (totalMinutes >= 120) {
      insight = `You've logged ${totalMinutes} minutes of focus time! Deep work sessions like these compound over time. Small, consistent efforts lead to remarkable results. 💪`;
      mood = 'encouraging';
    }
    // Completed multiple sessions
    else if (sessionsCompleted >= 4) {
      insight = `${sessionsCompleted} sessions completed! You're building the habit of focused work. Each session strengthens your ability to concentrate. Keep going! ✨`;
      mood = 'motivational';
    }
    // Some distractions - supportive
    else if (distractions > 5) {
      insight = `${distractions} distractions detected. Try eliminating one distraction source at a time. Small environment changes can dramatically improve focus. You've got this! 🎯`;
      mood = 'supportive';
    }
    // Low completion rate - encourage
    else if (completionRate < 0.5 && sessionsCompleted > 0) {
      insight = `Starting is half the battle, and you've shown up! Focus on completing one full session today. Progress over perfection always wins. 🌱`;
      mood = 'encouraging';
    }
    // First session or minimal data
    else if (sessionsCompleted <= 1) {
      insight = `Great start on your focus journey! Every expert was once a beginner. Build your focus muscle one session at a time. You're on the right path! 🚀`;
      mood = 'motivational';
    }
    // Default positive message
    else {
      insight = `You're making progress on your focus goals! Consistency beats intensity. Keep showing up, and trust the process. Small wins add up! 💫`;
      mood = 'motivational';
    }

    return {
      success: true,
      insight,
      mood,
      source: 'fallback'
    };
  }

  /**
   * Get generic fallback insight (for errors)
   * 
   * @param {string} reason - Error reason
   * @returns {Object} - Generic fallback insight
   */
  getFallbackInsight(reason = 'default') {
    const fallbacks = {
      error: {
        insight: "Focus is a superpower in a distracted world. Keep building your concentration muscle, and you'll see remarkable results over time. 🌟",
        mood: 'motivational'
      },
      timeout: {
        insight: "Every moment of focused work compounds. Stay consistent with your practice, and watch your productivity soar! 💪",
        mood: 'encouraging'
      },
      default: {
        insight: "Great work on prioritizing focused time! Your commitment to deep work is an investment in your future success. Keep it up! ✨",
        mood: 'motivational'
      }
    };

    return {
      success: true,
      ...fallbacks[reason] || fallbacks.default,
      source: 'fallback'
    };
  }

  // ==========================================================================
  // UTILITY METHODS
  // ==========================================================================

  /**
   * Calculate focus score (0-100) based on session data
   * 
   * @param {Object} data - Session statistics
   * @returns {number} - Focus score
   */
  calculateFocusScore(data) {
    const {
      totalMinutes = 0,
      distractions = 0,
      completionRate = 0,
      currentStreak = 0
    } = data;

    // Weighted scoring
    const timeScore = Math.min(totalMinutes / 120, 1) * 30; // Up to 30 points for 2+ hours
    const distractionScore = Math.max(0, 1 - (distractions / 10)) * 25; // Up to 25 points for <10 distractions
    const completionScore = completionRate * 30; // Up to 30 points for completion rate
    const streakScore = Math.min(currentStreak / 7, 1) * 15; // Up to 15 points for 7+ day streak

    return Math.round(timeScore + distractionScore + completionScore + streakScore);
  }

  /**
   * Get performance level label based on focus score
   * 
   * @param {number} score - Focus score (0-100)
   * @returns {string} - Performance level
   */
  getPerformanceLevel(score) {
    if (score >= 90) return 'Exceptional';
    if (score >= 75) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 45) return 'Fair';
    return 'Building';
  }

  /**
   * Generate a quick motivational tip
   * Doesn't require AI - instant response
   * 
   * @param {Object} data - Session statistics
   * @returns {string} - Quick tip
   */
  getQuickTip(data) {
    const tips = [
      { condition: (d) => d.distractions === 0, tip: "Perfect focus! You're in the zone! �" },
      { condition: (d) => d.distractions > 8, tip: "Try 'Do Not Disturb' mode to minimize interruptions 📵" },
      { condition: (d) => d.totalMinutes > 90, tip: "Great endurance! Remember to take short breaks 🧘" },
      { condition: (d) => d.completionRate >= 0.9, tip: "Outstanding completion rate! You're crushing it! 🌟" },
      { condition: (d) => d.currentStreak >= 5, tip: `${d.currentStreak}-day streak! Don't break the chain! 🔥` },
      { condition: (d) => d.sessionsCompleted >= 6, tip: "You've had a productive day! Well done! 💪" },
      { condition: (d) => d.totalMinutes < 15, tip: "Start with small wins - try completing one 25-minute session ⏰" }
    ];

    // Find first matching tip
    for (const { condition, tip } of tips) {
      if (condition(data)) {
        return tip;
      }
    }

    // Default tip
    return "Focus is a practice. You're building a valuable skill! 🚀";
  }
}

// ============================================================================
// EXPORT
// ============================================================================

/**
 * Singleton instance
 * 
 * Usage in extension:
 *   import { aiInsights } from './shared/aiInsights.js';
 *   
 *   // Configure once
 *   await aiInsights.configure('openai', apiKey);
 *   
 *   // Generate insights
 *   const result = await aiInsights.generateInsight(sessionData);
 *   console.log(result.insight);
 */
const aiInsights = new AIInsights();

// ES Module export
export { aiInsights, AIInsights };

// CommonJS export (for compatibility)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { aiInsights, AIInsights };
}

// Browser global (for non-module contexts)
if (typeof window !== 'undefined') {
  window.FocusBubbleAI = { aiInsights, AIInsights };
}
