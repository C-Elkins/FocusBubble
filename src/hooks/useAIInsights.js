/**
 * useAIInsights Hook
 *
 * React hook for generating AI-powered insights from focus session data
 * Manages loading states, errors, and automatic refresh of insights
 *
 * @author Chase Elkins
 * @module useAIInsights
 */

import { useState, useEffect, useCallback } from 'react';
import generateFocusInsight, { formatStatsForInsight, getRandomTone } from '../utils/aiInsightsEnhanced';

/**
 * Custom hook for generating and managing AI insights
 *
 * @param {Object} stats - Focus session statistics from useFocusStats
 * @param {Object} options - Configuration options
 * @param {string} [options.provider='local'] - AI provider: 'openai', 'anthropic', or 'local'
 * @param {string} [options.apiKey] - API key for the provider
 * @param {string} [options.model] - Model name
 * @param {string} [options.tone] - Tone: 'motivational', 'analytical', 'humorous', 'coach', 'reflective', 'competitive', or 'random'
 * @param {boolean} [options.autoRefresh=false] - Automatically refresh insight when stats change
 * @param {number} [options.refreshInterval] - Auto-refresh interval in ms (if autoRefresh is true)
 * @param {boolean} [options.enabled=true] - Enable/disable insight generation
 *
 * @returns {Object} Hook state and methods
 * @returns {string|null} return.insight - Generated insight text
 * @returns {boolean} return.isLoading - Loading state
 * @returns {Error|null} return.error - Error object if generation failed
 * @returns {Function} return.refresh - Function to manually refresh insight
 * @returns {Function} return.clear - Function to clear current insight
 * @returns {string} return.currentTone - Current tone being used
 *
 * @example
 * function Dashboard() {
 *   const { stats } = useFocusStats();
 *   const { insight, isLoading, error, refresh } = useAIInsights(stats, {
 *     provider: 'anthropic',
 *     apiKey: process.env.REACT_APP_ANTHROPIC_KEY,
 *     tone: 'motivational'
 *   });
 *
 *   if (isLoading) return <div>Generating insight...</div>;
 *   if (error) return <div>Failed to generate insight</div>;
 *   return <div>{insight}</div>;
 * }
 */
export function useAIInsights(stats, options = {}) {
  const {
    provider = 'local',
    apiKey,
    model,
    tone = 'motivational',
    autoRefresh = false,
    refreshInterval,
    enabled = true
  } = options;

  const [insight, setInsight] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentTone, setCurrentTone] = useState(tone);

  /**
   * Generate a new insight
   */
  const generateInsight = useCallback(async () => {
    // Don't generate if disabled or no stats
    if (!enabled || !stats || stats.totalSessions === 0) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Select tone (use random if specified)
      const selectedTone = tone === 'random' ? getRandomTone() : tone;
      setCurrentTone(selectedTone);

      // Format stats for the insight generator
      const formattedStats = formatStatsForInsight(stats);

      // Generate insight
      const newInsight = await generateFocusInsight(formattedStats, {
        provider,
        apiKey,
        model,
        tone: selectedTone
      });

      setInsight(newInsight);
    } catch (err) {
      console.error('Error generating AI insight:', err);
      setError(err);
      // Even on error, we should have a fallback from the generator
      // Set a generic message as last resort
      setInsight('Keep up the great work! Every focus session builds your concentration muscle.');
    } finally {
      setIsLoading(false);
    }
  }, [enabled, stats, provider, apiKey, model, tone]);

  /**
   * Manually refresh the insight
   */
  const refresh = useCallback(() => {
    generateInsight();
  }, [generateInsight]);

  /**
   * Clear the current insight
   */
  const clear = useCallback(() => {
    setInsight(null);
    setError(null);
  }, []);

  // Initial generation
  useEffect(() => {
    if (enabled && stats && stats.totalSessions > 0 && !insight) {
      generateInsight();
    }
  }, [enabled, stats, insight, generateInsight]);

  // Auto-refresh based on stats changes
  useEffect(() => {
    if (autoRefresh && enabled && stats && stats.totalSessions > 0) {
      generateInsight();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRefresh, enabled, stats?.totalSessions, stats?.totalFocusTime]);

  // Auto-refresh based on interval
  useEffect(() => {
    if (refreshInterval && enabled) {
      const interval = setInterval(() => {
        generateInsight();
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [refreshInterval, enabled, generateInsight]);

  return {
    insight,
    isLoading,
    error,
    refresh,
    clear,
    currentTone
  };
}

/**
 * Simpler hook that just generates an insight once
 * Good for one-time insight generation without state management
 *
 * @param {Object} sessionStats - Session statistics in the format expected by generateFocusInsight
 * @param {Object} options - Same options as useAIInsights
 *
 * @returns {Object} Hook state
 * @returns {string|null} return.insight - Generated insight
 * @returns {boolean} return.isLoading - Loading state
 * @returns {Error|null} return.error - Error object
 *
 * @example
 * const { insight, isLoading } = useGenerateInsight({
 *   totalMinutes: 145,
 *   totalDistractions: 6,
 *   sessionsCompleted: 4,
 *   avgFocusDuration: 36.25
 * });
 */
export function useGenerateInsight(sessionStats, options = {}) {
  const [insight, setInsight] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function generate() {
      try {
        const result = await generateFocusInsight(sessionStats, options);
        if (mounted) {
          setInsight(result);
          setIsLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err);
          setIsLoading(false);
        }
      }
    }

    if (sessionStats) {
      generate();
    }

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionStats, options.provider, options.tone]);

  return { insight, isLoading, error };
}

export default useAIInsights;
