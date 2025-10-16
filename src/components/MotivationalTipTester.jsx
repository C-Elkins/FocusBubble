import React, { useState } from 'react';
import { generateMotivationalTip, getRandomProductivityQuote } from '../utils/motivationalTips';

/**
 * MotivationalTipTester Component
 * Test component to demonstrate motivational tips with different scenarios
 */
export default function MotivationalTipTester() {
  const [currentTip, setCurrentTip] = useState('');
  const [selectedScenario, setSelectedScenario] = useState(null);

  // Test scenarios
  const scenarios = [
    {
      name: 'New User (No Sessions)',
      stats: {
        totalHours: 0,
        avgDistractions: 0,
        totalSessions: 0,
        avgSessionMinutes: 0,
        streakDays: 0
      },
      description: 'First-time user who has not completed any sessions yet'
    },
    {
      name: 'Beginner (Few Sessions)',
      stats: {
        totalHours: 1.5,
        avgDistractions: 4,
        totalSessions: 3,
        avgSessionMinutes: 30,
        streakDays: 1
      },
      description: 'Just getting started with a few sessions'
    },
    {
      name: 'Low Distractions (Excellent Focus)',
      stats: {
        totalHours: 3.2,
        avgDistractions: 0.5,
        totalSessions: 8,
        avgSessionMinutes: 24,
        streakDays: 2
      },
      description: 'Excellent focus with minimal distractions'
    },
    {
      name: 'High Distractions (Needs Improvement)',
      stats: {
        totalHours: 2.5,
        avgDistractions: 7,
        totalSessions: 6,
        avgSessionMinutes: 25,
        streakDays: 1
      },
      description: 'Struggling with frequent distractions'
    },
    {
      name: 'Power User (High Volume)',
      stats: {
        totalHours: 12.5,
        avgDistractions: 1.2,
        totalSessions: 25,
        avgSessionMinutes: 30,
        streakDays: 5
      },
      description: 'Experienced user with many sessions'
    },
    {
      name: 'Deep Work Master',
      stats: {
        totalHours: 8.0,
        avgDistractions: 0,
        totalSessions: 10,
        avgSessionMinutes: 48,
        streakDays: 7
      },
      description: 'Perfect focus with long sessions and no distractions'
    },
    {
      name: 'Short Sessions',
      stats: {
        totalHours: 1.0,
        avgDistractions: 2,
        totalSessions: 8,
        avgSessionMinutes: 7.5,
        streakDays: 2
      },
      description: 'Multiple short sessions, needs to extend duration'
    },
    {
      name: 'Long Streak Champion',
      stats: {
        totalHours: 15.0,
        avgDistractions: 0.8,
        totalSessions: 30,
        avgSessionMinutes: 30,
        streakDays: 14
      },
      description: 'Two-week streak with consistent performance'
    },
    {
      name: 'Ultra Focus (90 min sessions)',
      stats: {
        totalHours: 6.0,
        avgDistractions: 0.3,
        totalSessions: 4,
        avgSessionMinutes: 90,
        streakDays: 3
      },
      description: 'Extended 90-minute deep work sessions'
    },
    {
      name: 'Inconsistent Performance',
      stats: {
        totalHours: 4.0,
        avgDistractions: 5.5,
        totalSessions: 12,
        avgSessionMinutes: 20,
        streakDays: 0
      },
      description: 'Moderate sessions with inconsistent focus'
    }
  ];

  const testScenario = (scenario) => {
    setSelectedScenario(scenario);
    const tip = generateMotivationalTip(scenario.stats);
    setCurrentTip(tip);
  };

  const testRandomQuote = () => {
    setSelectedScenario(null);
    const quote = getRandomProductivityQuote();
    setCurrentTip(quote);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            💡 Motivational Tips Tester
          </h1>
          <p className="text-gray-600">
            Test different scenarios to see how motivational tips adapt to user performance
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Test Scenarios */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Test Scenarios</h2>
            
            <div className="space-y-3 mb-6">
              {scenarios.map((scenario, index) => (
                <button
                  key={index}
                  onClick={() => testScenario(scenario)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                    selectedScenario?.name === scenario.name
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50'
                  }`}
                >
                  <div className="font-semibold text-gray-900 mb-1">
                    {scenario.name}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    {scenario.description}
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                      {scenario.stats.totalHours.toFixed(1)}h
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                      {scenario.stats.totalSessions} sessions
                    </span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">
                      {scenario.stats.avgDistractions.toFixed(1)} avg distractions
                    </span>
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded">
                      {scenario.stats.avgSessionMinutes.toFixed(0)} min avg
                    </span>
                    {scenario.stats.streakDays > 0 && (
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded">
                        {scenario.stats.streakDays} day streak
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={testRandomQuote}
              className="w-full p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg"
            >
              🎲 Get Random Quote
            </button>
          </div>

          {/* Generated Tip Display */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Generated Tip</h2>
            
            {currentTip ? (
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 text-white mb-6">
                <div className="flex items-start gap-3 mb-4">
                  <svg className="w-6 h-6 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                  </svg>
                  <p className="text-lg leading-relaxed font-medium">
                    {currentTip}
                  </p>
                </div>

                {selectedScenario && (
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <div className="text-sm opacity-90">
                      <div className="font-semibold mb-2">Scenario: {selectedScenario.name}</div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="opacity-75">Total Hours:</span>
                          <span className="font-semibold ml-1">
                            {selectedScenario.stats.totalHours.toFixed(1)}
                          </span>
                        </div>
                        <div>
                          <span className="opacity-75">Sessions:</span>
                          <span className="font-semibold ml-1">
                            {selectedScenario.stats.totalSessions}
                          </span>
                        </div>
                        <div>
                          <span className="opacity-75">Avg Distractions:</span>
                          <span className="font-semibold ml-1">
                            {selectedScenario.stats.avgDistractions.toFixed(1)}
                          </span>
                        </div>
                        <div>
                          <span className="opacity-75">Avg Duration:</span>
                          <span className="font-semibold ml-1">
                            {selectedScenario.stats.avgSessionMinutes.toFixed(0)}m
                          </span>
                        </div>
                        {selectedScenario.stats.streakDays > 0 && (
                          <div className="col-span-2">
                            <span className="opacity-75">Streak:</span>
                            <span className="font-semibold ml-1">
                              {selectedScenario.stats.streakDays} days
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center border-2 border-dashed border-gray-300">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <p className="text-gray-600">
                  Select a scenario to see the generated motivational tip
                </p>
              </div>
            )}

            {/* Info Panel */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                How It Works
              </h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>• Tips adapt based on user performance metrics</li>
                <li>• Multiple categories: distractions, hours, sessions, duration</li>
                <li>• Weighted algorithm selects most relevant tip</li>
                <li>• Includes motivational quotes for variety</li>
                <li>• Provides actionable advice and encouragement</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Algorithm Explanation */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Algorithm Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Tip Categories</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• <strong>Distraction-based:</strong> 0-10 weight based on avg distractions</li>
                <li>• <strong>Hours-based:</strong> 6-9 weight based on total focus time</li>
                <li>• <strong>Session-based:</strong> 6-8 weight based on session count</li>
                <li>• <strong>Duration-based:</strong> 7-9 weight for avg session length</li>
                <li>• <strong>Streak-based:</strong> 8-10 weight for consecutive days</li>
                <li>• <strong>Combined:</strong> 9-10 weight for exceptional performance</li>
                <li>• <strong>Improvement:</strong> 7-8 weight for actionable advice</li>
                <li>• <strong>Inspirational:</strong> 5 weight for quotes</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Selection Process</h3>
              <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                <li>Evaluate all relevant tip categories</li>
                <li>Assign weight based on performance metrics</li>
                <li>Add random factor (0-2) for variety</li>
                <li>Sort tips by weight (higher = more relevant)</li>
                <li>Return highest-weighted tip</li>
              </ol>
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600">
                  <strong>Note:</strong> The algorithm ensures users receive relevant,
                  actionable feedback while maintaining motivation through positive
                  reinforcement and practical advice.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
