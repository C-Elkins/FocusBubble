// AI Insights Utility

/**
 * Generate AI-powered insights from focus session data
 * @param {Object} sessionData - User's focus session statistics
 * @param {number} sessionData.duration - Total focus time in seconds
 * @param {number} sessionData.distractions - Number of distractions detected
 * @param {number} sessionData.completionRate - Percentage of planned time completed (0-100)
 * @param {number} sessionData.totalSessions - Number of sessions in period
 * @param {number} sessionData.averageSessionLength - Average session duration in seconds
 * @param {Object} options - Configuration options
 * @param {string} options.provider - 'openai', 'anthropic', or 'local' (default: 'local')
 * @param {string} options.apiKey - API key for the selected provider
 * @param {string} options.model - Model to use (default: gpt-4 for OpenAI, claude-3-sonnet for Anthropic)
 * @returns {Promise<string>} Natural language insight
 */
export async function generateAIInsight(sessionData, options = {}) {
  const { provider = 'local', apiKey, model } = options;

  // Format the session data for better readability
  const hours = Math.floor(sessionData.duration / 3600);
  const minutes = Math.floor((sessionData.duration % 3600) / 60);
  const timeString = hours > 0 ? `${hours}.${Math.round(minutes / 6)} hours` : `${minutes} minutes`;

  try {
    switch (provider) {
      case 'openai':
        return await generateOpenAIInsight(sessionData, timeString, apiKey, model);
      
      case 'anthropic':
        return await generateAnthropicInsight(sessionData, timeString, apiKey, model);
      
      case 'local':
      default:
        return generateLocalInsight(sessionData, timeString);
    }
  } catch (error) {
    console.error('Error generating AI insight:', error);
    // Fallback to local generation if API call fails
    return generateLocalInsight(sessionData, timeString);
  }
}

/**
 * Generate insight using OpenAI API
 */
async function generateOpenAIInsight(sessionData, timeString, apiKey, model = 'gpt-4') {
  if (!apiKey) {
    throw new Error('OpenAI API key is required');
  }

  const prompt = createInsightPrompt(sessionData, timeString);

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: 'system',
          content: 'You are a productivity coach who provides brief, encouraging insights about focus sessions. Keep responses to 1-2 sentences, be positive and actionable.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 100,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
}

/**
 * Generate insight using Anthropic Claude API
 */
async function generateAnthropicInsight(sessionData, timeString, apiKey, model = 'claude-3-sonnet-20240229') {
  if (!apiKey) {
    throw new Error('Anthropic API key is required');
  }

  const prompt = createInsightPrompt(sessionData, timeString);

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: model,
      max_tokens: 100,
      messages: [
        {
          role: 'user',
          content: `You are a productivity coach. Provide a brief, encouraging insight (1-2 sentences) about this focus session:\n\n${prompt}`
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.content[0].text.trim();
}

/**
 * Create a standardized prompt for AI models
 */
function createInsightPrompt(sessionData, timeString) {
  const completionQuality = sessionData.completionRate >= 90 ? 'excellent' : 
                           sessionData.completionRate >= 70 ? 'good' : 
                           sessionData.completionRate >= 50 ? 'moderate' : 'needs improvement';
  
  const distractionLevel = sessionData.distractions === 0 ? 'zero' :
                          sessionData.distractions <= 2 ? 'minimal' :
                          sessionData.distractions <= 5 ? 'some' : 'many';

  return `Today's focus session: ${timeString} of deep work across ${sessionData.totalSessions} session(s). 
Distractions: ${sessionData.distractions} (${distractionLevel}). 
Completion rate: ${sessionData.completionRate}% (${completionQuality}).
Average session: ${Math.round(sessionData.averageSessionLength / 60)} minutes.

Generate a brief, encouraging insight that acknowledges their performance and provides one actionable tip.`;
}

/**
 * Generate insight using local rule-based logic (no API required)
 */
function generateLocalInsight(sessionData, timeString) {
  const { duration, distractions, completionRate, totalSessions } = sessionData;
  
  const insights = [];

  // Performance assessment
  if (duration >= 7200) { // 2+ hours
    if (distractions <= 3) {
      insights.push(`Incredible! You focused for ${timeString} with only ${distractions} distraction${distractions !== 1 ? 's' : ''} — that's exceptional deep work! 🎯`);
    } else {
      insights.push(`You focused for ${timeString} today, though ${distractions} distractions interrupted your flow. Try the Pomodoro technique to maintain focus.`);
    }
  } else if (duration >= 3600) { // 1-2 hours
    if (distractions <= 2) {
      insights.push(`Great session! ${timeString} of focused work with minimal distractions. You're building excellent focus habits! 💪`);
    } else {
      insights.push(`Solid ${timeString} of work completed with ${distractions} distractions. Consider using website blockers to reduce interruptions.`);
    }
  } else if (duration >= 1500) { // 25-60 minutes
    if (distractions === 0) {
      insights.push(`Perfect focus! ${timeString} of uninterrupted deep work. Keep up this momentum! ⭐`);
    } else {
      insights.push(`${timeString} completed across ${totalSessions} session${totalSessions !== 1 ? 's' : ''}. Try closing unnecessary tabs to minimize ${distractions} distraction${distractions !== 1 ? 's' : ''}.`);
    }
  } else { // Less than 25 minutes
    insights.push(`Every minute counts! You logged ${timeString} today. Try scheduling longer blocks for deeper focus.`);
  }

  // Completion rate feedback
  if (completionRate >= 90) {
    insights.push(`Outstanding ${completionRate}% completion rate — you're crushing your goals! 🚀`);
  } else if (completionRate >= 70) {
    insights.push(`Solid ${completionRate}% completion. You're staying on track!`);
  } else if (completionRate < 50) {
    insights.push(`${completionRate}% completion today. Consider breaking tasks into smaller, achievable chunks.`);
  }

  // Distraction patterns
  if (distractions === 0 && duration >= 1500) {
    insights.push(`Zero distractions! You've mastered the art of focus. This is your productivity sweet spot! 🎖️`);
  } else if (distractions > 8) {
    insights.push(`${distractions} distractions detected. Try airplane mode or a dedicated focus app to create distraction-free time blocks.`);
  }

  // Session consistency
  if (totalSessions >= 4) {
    insights.push(`${totalSessions} sessions completed — you're building a consistent focus routine! Consistency is key to productivity.`);
  }

  // Return the most relevant insight (first one from our rules)
  return insights[0] || `You focused for ${timeString} today. Keep building your focus practice!`;
}

/**
 * Analyze patterns across multiple sessions
 */
export function analyzePatterns(sessions) {
  if (!sessions || sessions.length === 0) {
    return {
      bestTimeOfDay: 'Not enough data',
      averageSessionLength: 0,
      totalFocusTime: 0,
      totalDistractions: 0,
      trend: 'neutral'
    };
  }

  // Calculate total metrics
  const totalFocusTime = sessions.reduce((sum, s) => sum + s.duration, 0);
  const averageSessionLength = Math.round(totalFocusTime / sessions.length);
  const totalDistractions = sessions.reduce((sum, s) => sum + s.distractions, 0);

  // Analyze time of day patterns
  const timeOfDayData = sessions.reduce((acc, session) => {
    const hour = new Date(session.date).getHours();
    const period = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
    acc[period] = (acc[period] || 0) + session.duration;
    return acc;
  }, {});

  const bestTimeOfDay = Object.keys(timeOfDayData).reduce((a, b) => 
    timeOfDayData[a] > timeOfDayData[b] ? a : b
  , 'morning');

  // Calculate trend (comparing first half vs second half)
  const midpoint = Math.floor(sessions.length / 2);
  const firstHalfAvg = sessions.slice(0, midpoint).reduce((sum, s) => sum + s.duration, 0) / midpoint;
  const secondHalfAvg = sessions.slice(midpoint).reduce((sum, s) => sum + s.duration, 0) / (sessions.length - midpoint);
  
  const trend = secondHalfAvg > firstHalfAvg * 1.1 ? 'improving' : 
                secondHalfAvg < firstHalfAvg * 0.9 ? 'declining' : 'stable';

  return {
    bestTimeOfDay: bestTimeOfDay.charAt(0).toUpperCase() + bestTimeOfDay.slice(1),
    averageSessionLength,
    totalFocusTime,
    totalDistractions,
    trend,
    averageDistractionsPerSession: (totalDistractions / sessions.length).toFixed(1)
  };
}

/**
 * Calculate completion rate based on planned vs actual time
 */
export function calculateCompletionRate(plannedDuration, actualDuration) {
  if (plannedDuration === 0) return 100;
  return Math.min(100, Math.round((actualDuration / plannedDuration) * 100));
}
