import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Timer from '../components/Timer';
import Dashboard from '../components/Dashboard';
import SampleDataGenerator from '../components/SampleDataGenerator';
import AIInsightsTester from '../components/AIInsightsTester';
import FocusBubble from '../components/FocusBubble';
import MotivationalTipTester from '../components/MotivationalTipTester';
import AIInsightDemo from '../components/AIInsightDemo';

/**
 * FocusApp - Main Application Component
 * Provides tabbed navigation between Timer and Dashboard views
 * Uses Framer Motion for smooth page transitions
 */
export default function FocusApp() {
  const [activeTab, setActiveTab] = useState('bubble');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Navigation Tabs */}
      <motion.div
        className="bg-white shadow-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center space-x-8">
            {/* Logo - Small and Subtle */}
            <div className="flex items-center space-x-2 pr-4 border-r border-gray-200">
              <svg 
                width="32" 
                height="32" 
                viewBox="0 0 128 128" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="opacity-80 hover:opacity-100 transition-opacity"
              >
                <defs>
                  <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="1" />
                    <stop offset="50%" stopColor="#a855f7" stopOpacity="1" />
                    <stop offset="100%" stopColor="#ec4899" stopOpacity="1" />
                  </linearGradient>
                </defs>
                <circle cx="64" cy="64" r="60" fill="url(#iconGradient)"/>
                <ellipse cx="48" cy="48" rx="18" ry="26" fill="white" opacity="0.25" transform="rotate(-30 48 48)"/>
                <circle cx="64" cy="64" r="35" fill="white" opacity="0.95"/>
                <circle cx="64" cy="64" r="28" stroke="#6366f1" strokeWidth="3.5" fill="none"/>
                <line x1="64" y1="64" x2="64" y2="45" stroke="#6366f1" strokeWidth="5" strokeLinecap="round"/>
                <line x1="64" y1="64" x2="80" y2="64" stroke="#a855f7" strokeWidth="4" strokeLinecap="round"/>
                <circle cx="64" cy="64" r="4" fill="#6366f1"/>
              </svg>
              <span className="text-sm font-semibold text-gray-700 hidden sm:block">
                FocusBubble
              </span>
            </div>
            <button
              onClick={() => setActiveTab('bubble')}
              className={`py-4 px-3 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'bubble'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Focus Bubble
              </span>
            </button>
            <button
              onClick={() => setActiveTab('timer')}
              className={`py-4 px-3 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'timer'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                Focus Timer
              </span>
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-4 px-3 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'dashboard'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
                Dashboard
              </span>
            </button>
            <button
              onClick={() => setActiveTab('ai-insights')}
              className={`py-4 px-3 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'ai-insights'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                </svg>
                AI Insights
              </span>
            </button>
          </nav>
        </div>
      </motion.div>

      {/* Content with Page Transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, ease: "easeInOut" }}
          className="py-8"
        >
          {activeTab === 'bubble' && <FocusBubble />}

          {activeTab === 'timer' && (
            <div className="max-w-2xl mx-auto px-4">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Focus Timer</h1>
                <p className="text-gray-600">Stay focused, track your productivity</p>
              </div>
              <Timer />
              <div className="mt-8 text-center text-sm text-gray-500">
                <p>💡 Tip: Complete focus sessions to see your stats in the Dashboard</p>
              </div>
            </div>
          )}

          {activeTab === 'dashboard' && <Dashboard />}

          {activeTab === 'ai-insights' && <AIInsightDemo />}

          {activeTab === 'motivational-test' && <MotivationalTipTester />}

          {activeTab === 'ai-test' && <AIInsightsTester />}

          {activeTab === 'dev' && (
            <div className="max-w-2xl mx-auto px-4">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Developer Tools</h1>
                <p className="text-gray-600">Test the dashboard with sample data</p>
              </div>
              <SampleDataGenerator />
              <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
                <h3 className="font-bold text-blue-900 mb-2">ℹ️ How to Use</h3>
                <ul className="text-sm text-blue-800 space-y-2">
                  <li>• Click "Generate Sample Data" to populate the dashboard with random sessions</li>
                  <li>• View the Dashboard tab to see the visualizations</li>
                  <li>• Click "Clear All Data" to remove all sessions and start fresh</li>
                  <li>• Complete real focus sessions using the Timer to add authentic data</li>
                </ul>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Footer - Krubles Team Branding */}
      <footer className="py-6 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-sm text-gray-500">
            Made with <span className="text-red-500">♥</span> by the{' '}
            <a
              href="https://github.com/C-Elkins"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              Krubles Team
            </a>
            {' '}🫧
          </p>
        </div>
      </footer>
    </div>
  );
}
