// Motivational Tips Generator
// Generates personalized motivational messages based on user's focus statistics

/**
 * Generates a motivational tip based on user's focus history
 * @param {Object} stats - User's focus statistics
 * @param {number} stats.totalHours - Total hours focused
 * @param {number} stats.avgDistractions - Average distractions per session
 * @param {number} stats.totalSessions - Total number of sessions
 * @param {number} stats.avgSessionMinutes - Average session length in minutes
 * @param {number} stats.streakDays - Consecutive days with sessions
 * @returns {string} Personalized motivational tip
 */
export function generateMotivationalTip(stats) {
  const {
    totalHours = 0,
    avgDistractions = 0,
    totalSessions = 0,
    avgSessionMinutes = 0,
    streakDays = 0
  } = stats;

  // Category-based tips based on performance metrics
  const tips = [];

  // === DISTRACTION-BASED TIPS ===
  if (avgDistractions === 0 && totalSessions > 0) {
    tips.push({
      category: 'distractions',
      message: "🎯 Perfect focus! Zero distractions means you're in the zone. Keep this momentum going!",
      weight: 10
    });
  } else if (avgDistractions < 1 && totalSessions > 0) {
    tips.push({
      category: 'distractions',
      message: "✨ Outstanding! Less than 1 distraction per session shows incredible focus discipline.",
      weight: 9
    });
  } else if (avgDistractions < 2) {
    tips.push({
      category: 'distractions',
      message: "🌟 You're getting better at avoiding distractions! Try grouping your tasks to maintain your rhythm.",
      weight: 8
    });
  } else if (avgDistractions < 3) {
    tips.push({
      category: 'distractions',
      message: "💪 Good progress on focus! Consider using 'Do Not Disturb' mode to reduce interruptions.",
      weight: 7
    });
  } else if (avgDistractions < 5) {
    tips.push({
      category: 'distractions',
      message: "🎯 You're averaging " + Math.round(avgDistractions) + " distractions per session. Try closing unnecessary tabs before starting.",
      weight: 6
    });
  } else if (avgDistractions >= 5) {
    tips.push({
      category: 'distractions',
      message: "📱 High distraction count detected. Remember: Deep work requires deep focus. Close social media and messaging apps!",
      weight: 8
    });
  }

  // === TOTAL HOURS BASED TIPS ===
  if (totalHours >= 10) {
    tips.push({
      category: 'hours',
      message: "🏆 " + totalHours.toFixed(1) + " hours of focused work! You're building serious momentum. Elite performers are made of this!",
      weight: 9
    });
  } else if (totalHours >= 5) {
    tips.push({
      category: 'hours',
      message: "🔥 " + totalHours.toFixed(1) + " hours logged! You're well on your way. Remember: consistency beats intensity.",
      weight: 8
    });
  } else if (totalHours >= 2) {
    tips.push({
      category: 'hours',
      message: "📈 " + totalHours.toFixed(1) + " hours is a great start! Small, focused sessions add up to big achievements.",
      weight: 7
    });
  } else if (totalHours >= 1) {
    tips.push({
      category: 'hours',
      message: "🌱 First hour completed! Every expert was once a beginner. Keep showing up.",
      weight: 7
    });
  } else if (totalHours > 0) {
    tips.push({
      category: 'hours',
      message: "🚀 Great start! The hardest part is beginning. You've already won by starting your first session.",
      weight: 6
    });
  }

  // === SESSION COUNT TIPS ===
  if (totalSessions >= 20) {
    tips.push({
      category: 'sessions',
      message: "🎖️ " + totalSessions + " sessions completed! You're building a powerful habit. This is what success looks like.",
      weight: 8
    });
  } else if (totalSessions >= 10) {
    tips.push({
      category: 'sessions',
      message: "⭐ " + totalSessions + " sessions done! You're past the beginner phase. Keep this routine strong!",
      weight: 7
    });
  } else if (totalSessions >= 5) {
    tips.push({
      category: 'sessions',
      message: "💫 " + totalSessions + " sessions in the books! You're forming a solid focus habit. The brain loves patterns.",
      weight: 7
    });
  } else if (totalSessions >= 1) {
    tips.push({
      category: 'sessions',
      message: "🎯 Session #" + totalSessions + " completed! Each session is a vote for the person you're becoming.",
      weight: 6
    });
  }

  // === AVERAGE SESSION LENGTH TIPS ===
  if (avgSessionMinutes >= 90) {
    tips.push({
      category: 'duration',
      message: "🧠 90+ minute sessions! You've mastered deep work. Your focus endurance is exceptional.",
      weight: 9
    });
  } else if (avgSessionMinutes >= 50) {
    tips.push({
      category: 'duration',
      message: "⏱️ 50+ minute sessions show strong focus stamina. You're in the optimal flow zone!",
      weight: 8
    });
  } else if (avgSessionMinutes >= 25) {
    tips.push({
      category: 'duration',
      message: "✅ Perfect pomodoro length! 25-minute blocks are scientifically proven for productivity.",
      weight: 7
    });
  } else if (avgSessionMinutes > 0 && avgSessionMinutes < 25) {
    tips.push({
      category: 'duration',
      message: "💡 Try longer sessions! Aim for at least 25 minutes to reach true deep work state.",
      weight: 7
    });
  }

  // === STREAK-BASED TIPS ===
  if (streakDays >= 7) {
    tips.push({
      category: 'streak',
      message: "🔥 " + streakDays + " day streak! Consistency is the mother of mastery. Don't break the chain!",
      weight: 10
    });
  } else if (streakDays >= 3) {
    tips.push({
      category: 'streak',
      message: "📅 " + streakDays + " days in a row! You're building unstoppable momentum.",
      weight: 8
    });
  }

  // === COMBINED PERFORMANCE TIPS ===
  if (totalHours >= 5 && avgDistractions < 2) {
    tips.push({
      category: 'combined',
      message: "🌟 Exceptional performance! High volume + low distractions = mastery. You're in the top 5% of focus warriors!",
      weight: 10
    });
  }

  if (totalSessions >= 10 && avgSessionMinutes >= 40) {
    tips.push({
      category: 'combined',
      message: "💎 Quality AND quantity! Long sessions with consistency = exponential growth. Keep this up!",
      weight: 9
    });
  }

  // === IMPROVEMENT TIPS ===
  if (avgDistractions > 5 && totalSessions >= 5) {
    tips.push({
      category: 'improvement',
      message: "🎯 Action plan: Close email, mute phone, use website blockers. Your future self will thank you!",
      weight: 8
    });
  }

  if (avgSessionMinutes < 20 && totalSessions >= 5) {
    tips.push({
      category: 'improvement',
      message: "⏰ Challenge: Try one 25-minute session today. Commit fully. You might surprise yourself!",
      weight: 7
    });
  }

  // === INSPIRATIONAL QUOTES (fallback and variety) ===
  const inspirationalQuotes = [
    {
      message: "💭 'Focus is the ultimate productivity hack.' - Unknown",
      weight: 5
    },
    {
      message: "📚 'Deep work is rare, valuable, and meaningful.' - Cal Newport",
      weight: 5
    },
    {
      message: "🎯 'The successful warrior is the average person with laser-like focus.' - Bruce Lee",
      weight: 5
    },
    {
      message: "⚡ 'Concentrate all your thoughts upon the work in hand. The sun's rays do not burn until brought to a focus.' - Alexander Graham Bell",
      weight: 5
    },
    {
      message: "🌊 'Focus on being productive instead of busy.' - Tim Ferriss",
      weight: 5
    },
    {
      message: "🎨 'The key is not to prioritize what's on your schedule, but to schedule your priorities.' - Stephen Covey",
      weight: 5
    },
    {
      message: "🚀 'Productivity is never an accident. It is always the result of commitment to excellence.' - Paul J. Meyer",
      weight: 5
    },
    {
      message: "💡 'The shorter way to do many things is to do only one thing at a time.' - Mozart",
      weight: 5
    }
  ];

  tips.push(...inspirationalQuotes);

  // === FIRST-TIME USER TIPS ===
  if (totalSessions === 0) {
    return "🌟 Welcome! Start your first focus session and begin building your productivity momentum. You've got this!";
  }

  // === SELECT BEST TIP BASED ON WEIGHT ===
  // Sort by weight (higher = more relevant) and add some randomness
  tips.sort((a, b) => {
    // Higher weight tips have priority, but add randomness for variety
    const randomFactor = Math.random() * 2; // 0-2 random addition
    return (b.weight + randomFactor) - (a.weight + randomFactor);
  });

  // Return the top-weighted tip
  return tips[0]?.message || "💪 Keep up the great work! Every session brings you closer to your goals.";
}

/**
 * Get a random productivity quote (for variety)
 * @returns {string} Random productivity quote
 */
export function getRandomProductivityQuote() {
  const quotes = [
    "🎯 'The secret of getting ahead is getting started.' - Mark Twain",
    "⚡ 'You don't have to be great to start, but you have to start to be great.' - Zig Ziglar",
    "🌟 'The way to get started is to quit talking and begin doing.' - Walt Disney",
    "💪 'Don't watch the clock; do what it does. Keep going.' - Sam Levenson",
    "🔥 'Either you run the day or the day runs you.' - Jim Rohn",
    "📈 'Success is the sum of small efforts repeated day in and day out.' - Robert Collier",
    "🎨 'The only way to do great work is to love what you do.' - Steve Jobs",
    "🚀 'Strive for progress, not perfection.' - Unknown",
    "💎 'Quality is not an act, it is a habit.' - Aristotle",
    "🌱 'Small daily improvements lead to stunning results over time.' - Robin Sharma"
  ];

  return quotes[Math.floor(Math.random() * quotes.length)];
}

/**
 * Generate tip with session statistics
 * @param {Object} sessionStats - Statistics from useFocusStats
 * @returns {string} Motivational tip
 */
export function generateTipFromStats(sessionStats) {
  const {
    totalFocusTime = 0,
    totalSessions = 0,
    totalDistractions = 0,
    averageSessionLength = 0
  } = sessionStats;

  // Convert to friendly format
  const totalHours = totalFocusTime / 3600;
  const avgDistractions = totalSessions > 0 ? totalDistractions / totalSessions : 0;
  const avgSessionMinutes = averageSessionLength / 60;

  return generateMotivationalTip({
    totalHours,
    avgDistractions,
    totalSessions,
    avgSessionMinutes,
    streakDays: 0 // Can be enhanced with streak tracking
  });
}
