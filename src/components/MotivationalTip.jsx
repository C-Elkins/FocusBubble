import React, { useState, useEffect } from 'react';
import { generateTipFromStats, getRandomProductivityQuote } from '../utils/motivationalTips';

/**
 * MotivationalTip Component
 * Displays personalized motivational messages based on user's focus statistics
 */
export default function MotivationalTip({ stats }) {
  const [tip, setTip] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  // Generate tip when stats change
  useEffect(() => {
    if (stats) {
      const newTip = generateTipFromStats(stats);
      setTip(newTip);
    }
  }, [stats]);

  // Regenerate tip with animation
  const regenerateTip = () => {
    setIsAnimating(true);
    
    setTimeout(() => {
      if (stats) {
        const newTip = generateTipFromStats(stats);
        setTip(newTip);
      } else {
        setTip(getRandomProductivityQuote());
      }
      setIsAnimating(false);
    }, 300);
  };

  if (!tip) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern id="motivational-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="1" fill="white" />
          </pattern>
          <rect width="100" height="100" fill="url(#motivational-pattern)" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
            <h3 className="text-lg font-semibold">Daily Motivation</h3>
          </div>
          
          {/* Refresh button */}
          <button
            onClick={regenerateTip}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-200 group"
            aria-label="Get new tip"
            disabled={isAnimating}
          >
            <svg 
              className={`w-5 h-5 transition-transform duration-300 group-hover:rotate-180 ${
                isAnimating ? 'animate-spin' : ''
              }`} 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Tip message with animation */}
        <div
          className={`transition-all duration-300 ${
            isAnimating ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'
          }`}
        >
          <p className="text-lg leading-relaxed font-medium">
            {tip}
          </p>
        </div>

        {/* Stats preview (optional) */}
        {stats && stats.totalSessions > 0 && (
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="flex gap-4 text-sm opacity-90">
              <div>
                <span className="font-semibold">{stats.totalSessions}</span> sessions
              </div>
              <div>
                <span className="font-semibold">
                  {(stats.totalFocusTime / 3600).toFixed(1)}h
                </span> focused
              </div>
              <div>
                <span className="font-semibold">
                  {stats.totalSessions > 0 
                    ? (stats.totalDistractions / stats.totalSessions).toFixed(1) 
                    : 0}
                </span> avg distractions
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
