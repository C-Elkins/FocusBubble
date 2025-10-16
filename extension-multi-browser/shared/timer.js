/**
 * Timer Utilities
 * Helper functions for timer management and formatting
 */

class Timer {
  /**
   * Format milliseconds to MM:SS
   */
  static formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  /**
   * Format milliseconds to HH:MM:SS
   */
  static formatTimeDetailed(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  /**
   * Format milliseconds to human-readable duration
   */
  static formatDuration(ms) {
    const totalMinutes = Math.floor(ms / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }

  /**
   * Parse duration string to milliseconds
   */
  static parseDuration(str) {
    const hourMatch = str.match(/(\d+)h/);
    const minuteMatch = str.match(/(\d+)m/);
    
    const hours = hourMatch ? parseInt(hourMatch[1]) : 0;
    const minutes = minuteMatch ? parseInt(minuteMatch[1]) : 0;
    
    return (hours * 60 + minutes) * 60000;
  }

  /**
   * Calculate remaining time
   */
  static calculateRemaining(startTime, duration) {
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, duration - elapsed);
    return remaining;
  }

  /**
   * Calculate progress percentage
   */
  static calculateProgress(startTime, duration) {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(100, (elapsed / duration) * 100);
    return progress;
  }

  /**
   * Check if timer has completed
   */
  static isComplete(startTime, duration) {
    return Date.now() >= startTime + duration;
  }

  /**
   * Generate session ID
   */
  static generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Calculate optimal break time based on focus duration
   * Uses modified Pomodoro technique principles
   */
  static calculateBreakTime(focusDuration) {
    const minutes = focusDuration / 60000;
    
    if (minutes <= 25) return 5 * 60000; // 5 min break
    if (minutes <= 50) return 10 * 60000; // 10 min break
    return 15 * 60000; // 15 min break
  }

  /**
   * Get time of day category
   */
  static getTimeOfDay() {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
  }

  /**
   * Get focus quality rating based on distractions
   */
  static getFocusQuality(duration, distractions) {
    const distractionsPerHour = (distractions / duration) * 3600000;
    
    if (distractionsPerHour === 0) return { rating: 'excellent', score: 100 };
    if (distractionsPerHour < 2) return { rating: 'good', score: 85 };
    if (distractionsPerHour < 5) return { rating: 'fair', score: 70 };
    return { rating: 'needs-improvement', score: 50 };
  }

  /**
   * Format date for display
   */
  static formatDate(timestamp) {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else if (date.getFullYear() === today.getFullYear()) {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else {
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }
  }

  /**
   * Group sessions by date
   */
  static groupSessionsByDate(sessions) {
    const groups = {};
    
    sessions.forEach(session => {
      const date = new Date(session.timestamp).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(session);
    });
    
    return groups;
  }

  /**
   * Calculate streak (consecutive days with at least one session)
   */
  static calculateStreak(sessions) {
    if (sessions.length === 0) return 0;
    
    const sortedSessions = [...sessions].sort((a, b) => b.timestamp - a.timestamp);
    const sessionDates = new Set(
      sortedSessions.map(s => new Date(s.timestamp).toDateString())
    );
    
    let streak = 0;
    let currentDate = new Date();
    
    while (true) {
      const dateStr = currentDate.toDateString();
      if (sessionDates.has(dateStr)) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (streak > 0) {
        break;
      } else {
        // Check yesterday for grace period
        currentDate.setDate(currentDate.getDate() - 1);
        const yesterdayStr = currentDate.toDateString();
        if (!sessionDates.has(yesterdayStr)) {
          break;
        }
      }
    }
    
    return streak;
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Timer;
}
