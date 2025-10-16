import React, { useState } from 'react';
import { generateAIInsight } from '../utils/aiInsights';

/**
 * AI Insights Testing Component
 * Test different scenarios and AI providers
 */
export default function AIInsightsTester() {
  const [insight, setInsight] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState('perfect');
  const [provider, setProvider] = useState('local');

  const scenarios = {
    perfect: {
      name: 'Perfect Session',
      description: '50 min, zero distractions',
      data: {
        duration: 3000,
        distractions: 0,
        completionRate: 100,
        totalSessions: 1,
        averageSessionLength: 3000
      }
    },
    excellent: {
      name: 'Excellent Deep Work',
      description: '2.5 hours, 3 distractions',
      data: {
        duration: 9000,
        distractions: 3,
        completionRate: 95,
        totalSessions: 4,
        averageSessionLength: 2250
      }
    },
    good: {
      name: 'Good Session',
      description: '1.5 hours, 5 distractions',
      data: {
        duration: 5400,
        distractions: 5,
        completionRate: 85,
        totalSessions: 3,
        averageSessionLength: 1800
      }
    },
    needsWork: {
      name: 'Needs Improvement',
      description: '20 min, 8 distractions',
      data: {
        duration: 1200,
        distractions: 8,
        completionRate: 50,
        totalSessions: 1,
        averageSessionLength: 1200
      }
    },
    multiSession: {
      name: 'Multiple Sessions',
      description: '5 sessions, 4 hours total',
      data: {
        duration: 14400,
        distractions: 6,
        completionRate: 92,
        totalSessions: 5,
        averageSessionLength: 2880
      }
    }
  };

  const handleGenerateInsight = async () => {
    setLoading(true);
    try {
      const scenario = scenarios[selectedScenario];
      const result = await generateAIInsight(scenario.data, {
        provider: provider,
        apiKey: localStorage.getItem(`${provider}ApiKey`) || undefined
      });
      setInsight(result);
    } catch (error) {
      setInsight(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Insights Tester</h1>
        <p className="text-gray-600">Test different scenarios and AI providers</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Select Scenario
          </label>
          <select
            value={selectedScenario}
            onChange={(e) => setSelectedScenario(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {Object.entries(scenarios).map(([key, scenario]) => (
              <option key={key} value={key}>
                {scenario.name} - {scenario.description}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            AI Provider
          </label>
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="local">Local Analysis (Free)</option>
            <option value="openai">OpenAI (GPT-4)</option>
            <option value="anthropic">Anthropic (Claude)</option>
          </select>
        </div>

        <button
          onClick={handleGenerateInsight}
          disabled={loading}
          className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Generating...
            </span>
          ) : (
            'Generate Insight'
          )}
        </button>
      </div>

      {/* Scenario Details */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-lg p-6 border border-blue-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Current Scenario Data</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(scenarios[selectedScenario].data).map(([key, value]) => (
            <div key={key} className="bg-white rounded-lg p-3 shadow-sm">
              <p className="text-xs text-gray-500 uppercase">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
              <p className="text-lg font-bold text-gray-900">
                {key === 'duration' 
                  ? `${Math.floor(value / 60)} min` 
                  : key.includes('Rate') || key.includes('Length')
                  ? key.includes('Rate') ? `${value}%` : `${Math.floor(value / 60)} min`
                  : value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Generated Insight */}
      {insight && (
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
          <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
            Generated Insight
          </h3>
          <p className="text-gray-800 text-lg leading-relaxed">
            {insight}
          </p>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Provider: <span className="font-semibold">{provider === 'local' ? 'Local Analysis' : provider === 'openai' ? 'OpenAI GPT-4' : 'Anthropic Claude'}</span>
            </p>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-6 border border-amber-200">
        <h3 className="text-lg font-bold text-amber-900 mb-3">💡 How to Use</h3>
        <ul className="space-y-2 text-sm text-amber-800">
          <li className="flex items-start gap-2">
            <span className="text-amber-600 font-bold">1.</span>
            <span>Select a scenario from the dropdown to test different session patterns</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-600 font-bold">2.</span>
            <span>Choose your AI provider (Local is free and works immediately)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-600 font-bold">3.</span>
            <span>For OpenAI/Anthropic, set your API key in the Dashboard's AI Insights settings first</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-600 font-bold">4.</span>
            <span>Click "Generate Insight" to see the AI-generated feedback</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
