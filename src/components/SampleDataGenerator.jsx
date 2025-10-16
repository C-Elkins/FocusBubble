import React from 'react';
import { useFocusStats } from '../hooks/useFocusStats';

// Component to generate sample data for testing the dashboard
export default function SampleDataGenerator() {
  const { clearSessions, sessions } = useFocusStats();

  const generateSampleData = () => {
    // Clear existing data first
    clearSessions();

    // Generate data for the last 7 days
    const now = new Date();
    
    for (let daysAgo = 6; daysAgo >= 0; daysAgo--) {
      const date = new Date(now);
      date.setDate(date.getDate() - daysAgo);
      
      // Random number of sessions per day (0-4)
      const sessionsPerDay = Math.floor(Math.random() * 5);
      
      for (let i = 0; i < sessionsPerDay; i++) {
        // Random session duration (15-90 minutes)
        const durations = [15, 25, 50, 90];
        const duration = durations[Math.floor(Math.random() * durations.length)] * 60;
        
        // Random distractions (0-5)
        const distractions = Math.floor(Math.random() * 6);
        
        // Create session with past date
        const session = {
          id: Date.now() + Math.random(),
          date: date.toISOString(),
          duration,
          distractions
        };
        
        // Add session to storage
        setTimeout(() => {
          const currentSessions = JSON.parse(localStorage.getItem('focusSessions') || '[]');
          currentSessions.push(session);
          localStorage.setItem('focusSessions', JSON.stringify(currentSessions));
        }, i * 10);
      }
    }
    
    // Reload page to see changes
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-xl shadow-lg">
      <h3 className="text-lg font-bold text-gray-800 mb-2">Developer Tools</h3>
      <p className="text-sm text-gray-600 mb-4">
        Generate sample data to test the dashboard visualizations
      </p>
      
      <div className="flex gap-3">
        <button
          onClick={generateSampleData}
          className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg shadow hover:shadow-lg hover:scale-105 transition-all duration-200"
        >
          Generate Sample Data
        </button>
        
        <button
          onClick={() => {
            clearSessions();
            window.location.reload();
          }}
          className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-lg shadow hover:shadow-lg hover:scale-105 transition-all duration-200"
        >
          Clear All Data
        </button>
      </div>
      
      <div className="mt-4 text-xs text-gray-500 text-center">
        Current sessions: {sessions.length}
      </div>
    </div>
  );
}
