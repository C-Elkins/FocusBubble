/**
 * AI Insight Demo Component
 *
 * Demonstrates various ways to use the AI Insights module
 * Shows different tones, providers, and usage patterns
 *
 * @author Chase Elkins
 */

import React, { useState } from 'react';
import { useAIInsights } from '../hooks/useAIInsights';
import { useFocusStats } from '../hooks/useFocusStats';
import { getAvailableTones } from '../utils/aiInsightsEnhanced';

/**
 * Main Demo Component
 */
export default function AIInsightDemo() {
  const { stats } = useFocusStats();
  const [provider, setProvider] = useState('local');
  const [tone, setTone] = useState('motivational');
  const [apiKey, setApiKey] = useState('');
  const [enabled, setEnabled] = useState(true);

  const { insight, isLoading, error, refresh, currentTone } = useAIInsights(stats, {
    provider,
    apiKey: apiKey || undefined,
    tone,
    enabled
  });

  const availableTones = getAvailableTones();

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          AI Insights Generator Demo
        </h1>
        <p className="text-gray-600">
          Test different AI providers and prompt tones for focus insights
        </p>
      </div>

      {/* Configuration Panel */}
      <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Configuration</h2>

        {/* Provider Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            AI Provider
          </label>
          <div className="flex gap-4">
            {['local', 'anthropic', 'openai'].map((p) => (
              <button
                key={p}
                onClick={() => setProvider(p)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  provider === p
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
          <p className="mt-2 text-sm text-gray-500">
            {provider === 'local'
              ? 'Uses rule-based fallback messages (no API required)'
              : `Uses ${provider} API (requires API key)`}
          </p>
        </div>

        {/* API Key Input (for non-local providers) */}
        {provider !== 'local' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={`Enter your ${provider} API key`}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <p className="mt-1 text-xs text-gray-500">
              Your API key is only used in your browser and never stored
            </p>
          </div>
        )}

        {/* Tone Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Insight Tone
          </label>
          <div className="grid grid-cols-3 gap-3">
            {availableTones.map((t) => (
              <button
                key={t}
                onClick={() => setTone(t)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  tone === t
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
            <button
              onClick={() => setTone('random')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                tone === 'random'
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🎲 Random
            </button>
          </div>
        </div>

        {/* Current Stats Display */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Current Session Stats
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Total Time:</span>
              <p className="font-semibold text-gray-900">
                {Math.round(stats.totalFocusTime / 60)} min
              </p>
            </div>
            <div>
              <span className="text-gray-500">Sessions:</span>
              <p className="font-semibold text-gray-900">
                {stats.totalSessions}
              </p>
            </div>
            <div>
              <span className="text-gray-500">Distractions:</span>
              <p className="font-semibold text-gray-900">
                {stats.totalDistractions}
              </p>
            </div>
            <div>
              <span className="text-gray-500">Avg Duration:</span>
              <p className="font-semibold text-gray-900">
                {Math.round(stats.averageSessionLength / 60)} min
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-4">
          <button
            onClick={refresh}
            disabled={isLoading || !enabled}
            className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? '⏳ Generating...' : '🔄 Generate New Insight'}
          </button>
          <button
            onClick={() => setEnabled(!enabled)}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              enabled
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {enabled ? 'Disable' : 'Enable'}
          </button>
        </div>
      </div>

      {/* Insight Display */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-lg p-8">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl">
              ✨
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-800">
                AI Insight
              </h3>
              <span className="text-xs px-2 py-1 bg-white rounded-full text-gray-600">
                {currentTone}
              </span>
            </div>

            {isLoading && (
              <div className="flex items-center gap-2 text-gray-600">
                <div className="animate-spin w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full" />
                <span>Generating insight...</span>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                <p className="font-medium">Error generating insight</p>
                <p className="text-sm mt-1">{error.message}</p>
              </div>
            )}

            {!isLoading && !error && insight && (
              <div className="space-y-4">
                <p className="text-lg text-gray-700 leading-relaxed">
                  "{insight}"
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    Generated using {provider === 'local' ? 'local rules' : `${provider} API`}
                  </span>
                </div>
              </div>
            )}

            {!isLoading && !error && !insight && stats.totalSessions === 0 && (
              <p className="text-gray-600">
                Complete some focus sessions to generate insights!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Tone Examples */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Tone Examples
        </h2>
        <div className="space-y-4">
          <ToneExample
            tone="Motivational"
            description="Encouraging and uplifting"
            example="Nice work — your focus duration improved by 15%! Try shorter breaks to keep your rhythm going."
          />
          <ToneExample
            tone="Analytical"
            description="Data-driven and precise"
            example="Your average session length of 36 minutes is optimal for deep work. Reducing distractions per session from 1.5 to under 1.0 would increase efficiency by ~20%."
          />
          <ToneExample
            tone="Humorous"
            description="Light-hearted and fun"
            example="145 minutes of pure focus! Your brain deserves a trophy (and maybe a snack). Keep those distractions on their toes tomorrow!"
          />
          <ToneExample
            tone="Coach"
            description="Direct and action-oriented"
            example="Strong consistency today! Tomorrow's goal: push that average session to 40 minutes and knock out 5 sessions."
          />
          <ToneExample
            tone="Reflective"
            description="Thoughtful and introspective"
            example="You demonstrated remarkable discipline today, maintaining focus across multiple sessions. This consistency reveals growing mental endurance."
          />
          <ToneExample
            tone="Competitive"
            description="Goal-oriented and challenging"
            example="Good work, but you can do better. Tomorrow: beat your 145-minute record and cut those distractions in half. You've got this!"
          />
        </div>
      </div>

      {/* Code Example */}
      <div className="bg-gray-900 rounded-xl shadow-lg p-6 text-gray-100">
        <h2 className="text-xl font-bold mb-4">Usage Example</h2>
        <pre className="text-sm overflow-x-auto">
          <code>{`import { useAIInsights } from './hooks/useAIInsights';
import { useFocusStats } from './hooks/useFocusStats';

function MyDashboard() {
  const { stats } = useFocusStats();

  const { insight, isLoading, refresh } = useAIInsights(stats, {
    provider: 'anthropic',
    apiKey: process.env.REACT_APP_ANTHROPIC_KEY,
    tone: 'motivational'
  });

  if (isLoading) return <div>Generating...</div>;

  return (
    <div>
      <p>{insight}</p>
      <button onClick={refresh}>New Insight</button>
    </div>
  );
}`}</code>
        </pre>
      </div>
    </div>
  );
}

/**
 * Helper component to display tone examples
 */
function ToneExample({ tone, description, example }) {
  return (
    <div className="border-l-4 border-indigo-500 pl-4 py-2">
      <div className="flex items-center gap-2 mb-1">
        <h3 className="font-semibold text-gray-800">{tone}</h3>
        <span className="text-sm text-gray-500">— {description}</span>
      </div>
      <p className="text-gray-600 italic">"{example}"</p>
    </div>
  );
}
