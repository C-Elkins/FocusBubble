import React, { useState, useEffect, useCallback } from 'react';
import { generateAIInsight } from '../utils/aiInsights';

/**
 * AI Insights Card Component
 * Displays AI-generated insights about focus sessions
 */
export default function AIInsightsCard({ stats }) {
  const [insight, setInsight] = useState('');
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState('local');
  const [apiKey, setApiKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const generateInsight = useCallback(async () => {
    setLoading(true);
    
    try {
      // Calculate completion rate (assuming full sessions completed)
      const completionRate = stats.totalSessions > 0 ? 95 : 0;
      
      const sessionData = {
        duration: stats.totalFocusTime,
        distractions: stats.totalDistractions,
        completionRate: completionRate,
        totalSessions: stats.totalSessions,
        averageSessionLength: stats.averageSessionLength
      };

      const options = {
        provider: provider,
        apiKey: apiKey || undefined
      };

      const generatedInsight = await generateAIInsight(sessionData, options);
      setInsight(generatedInsight);
    } catch (error) {
      console.error('Error generating insight:', error);
      setInsight('Keep up the great work! Your focus sessions are building strong productivity habits. 💪');
    } finally {
      setLoading(false);
    }
  }, [stats, provider, apiKey]);

  // Generate insight when stats change
  useEffect(() => {
    if (stats.totalSessions > 0) {
      generateInsight();
    }
  }, [stats.totalFocusTime, stats.totalDistractions, stats.totalSessions, generateInsight]);

  const handleProviderChange = (newProvider) => {
    setProvider(newProvider);
    // Save to localStorage
    localStorage.setItem('aiProvider', newProvider);
  };

  const handleApiKeyChange = (key) => {
    setApiKey(key);
    // Save to localStorage (encrypted in production!)
    localStorage.setItem(`${provider}ApiKey`, key);
  };

  // Load saved settings on mount
  useEffect(() => {
    const savedProvider = localStorage.getItem('aiProvider') || 'local';
    const savedKey = localStorage.getItem(`${savedProvider}ApiKey`) || '';
    setProvider(savedProvider);
    setApiKey(savedKey);
  }, []);

  if (stats.totalSessions === 0) {
    return (
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-lg p-6 border border-purple-100">
        <div className="flex items-center gap-3 mb-3">
          <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
          </svg>
          <h3 className="text-xl font-bold text-gray-900">AI Insights</h3>
        </div>
        <p className="text-gray-600 text-sm">
          Complete your first focus session to receive personalized AI-powered insights! 🚀
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-lg p-6 border border-purple-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
          </svg>
          <div>
            <h3 className="text-xl font-bold text-gray-900">AI Insights</h3>
            <p className="text-xs text-gray-500">
              Powered by {provider === 'local' ? 'Local Analysis' : provider === 'openai' ? 'OpenAI' : 'Claude'}
            </p>
          </div>
        </div>
        
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-100 rounded-lg transition-colors duration-200"
          title="Settings"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="mb-4 p-4 bg-white rounded-lg border border-purple-200">
          <h4 className="font-semibold text-gray-800 mb-3">AI Provider Settings</h4>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Provider
              </label>
              <select
                value={provider}
                onChange={(e) => handleProviderChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="local">Local Analysis (Free, No API Key)</option>
                <option value="openai">OpenAI (GPT-4)</option>
                <option value="anthropic">Anthropic (Claude)</option>
              </select>
            </div>

            {provider !== 'local' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Key
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => handleApiKeyChange(e.target.value)}
                  placeholder={`Enter your ${provider === 'openai' ? 'OpenAI' : 'Anthropic'} API key`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Get your API key from {provider === 'openai' ? 'platform.openai.com' : 'console.anthropic.com'}
                </p>
              </div>
            )}

            <button
              onClick={() => {
                generateInsight();
                setShowSettings(false);
              }}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
            >
              Save & Regenerate Insight
            </button>
          </div>
        </div>
      )}

      {/* Insight Display */}
      <div className="relative">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 border-l-4 border-purple-500">
              <p className="text-gray-800 text-lg leading-relaxed">
                {insight}
              </p>
            </div>

            <button
              onClick={generateInsight}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 text-sm text-purple-600 hover:text-purple-700 hover:bg-purple-100 rounded-lg transition-colors duration-200 disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Regenerate Insight
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
