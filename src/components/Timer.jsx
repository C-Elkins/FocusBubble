import React, { useEffect, useRef, useState } from 'react';
import { useTimer } from '../hooks/useTimer';
import { useFocusStats } from '../hooks/useFocusStats';

// Timer Component
export default function Timer() {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customHours, setCustomHours] = useState(0);
  const [customMinutes, setCustomMinutes] = useState(25);

  const presetDurations = [
    { label: '25 min', minutes: 25 },
    { label: '50 min', minutes: 50 },
    { label: '90 min', minutes: 90 }
  ];

  const { 
    time, 
    isRunning, 
    start, 
    pause, 
    reset, 
    setNewDuration, 
    duration,
    wasRunningBeforeHidden,
    distractionCount,
    resumeAfterDistraction
  } = useTimer(25 * 60);

  const { addSession } = useFocusStats();
  const sessionStartTimeRef = useRef(null);
  const sessionDistractionsRef = useRef(0);

  // Track when session starts
  useEffect(() => {
    if (isRunning && sessionStartTimeRef.current === null) {
      sessionStartTimeRef.current = Date.now();
      sessionDistractionsRef.current = 0;
    }
  }, [isRunning]);

  // Track distractions during session
  useEffect(() => {
    if (isRunning) {
      sessionDistractionsRef.current = distractionCount;
    }
  }, [distractionCount, isRunning]);

  // Save session when timer completes
  useEffect(() => {
    if (time === 0 && sessionStartTimeRef.current !== null) {
      const sessionDuration = duration; // The full duration that was completed
      const sessionDistractions = sessionDistractionsRef.current;
      
      // Save the session
      addSession(sessionDuration, sessionDistractions);
      
      // Reset session tracking
      sessionStartTimeRef.current = null;
      sessionDistractionsRef.current = 0;
    }
  }, [time, duration, addSession]);

  const handleReset = () => {
    // Reset session tracking when user manually resets
    sessionStartTimeRef.current = null;
    sessionDistractionsRef.current = 0;
    reset();
  };

  const handlePresetClick = (minutes) => {
    // Reset session tracking when changing duration
    sessionStartTimeRef.current = null;
    sessionDistractionsRef.current = 0;
    setShowCustomInput(false);
    setNewDuration(minutes * 60);
  };

  const handleCustomClick = () => {
    setShowCustomInput(!showCustomInput);
  };

  const handleSetCustomTime = () => {
    const totalMinutes = customHours * 60 + customMinutes;

    // Validation: 5 min - 5 hours (300 minutes)
    if (totalMinutes < 5) {
      alert('Minimum time is 5 minutes');
      return;
    }
    if (totalMinutes > 300) {
      alert('Maximum time is 5 hours (300 minutes)');
      return;
    }

    // Reset session tracking when changing duration
    sessionStartTimeRef.current = null;
    sessionDistractionsRef.current = 0;
    setNewDuration(totalMinutes * 60);
    setShowCustomInput(false);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    // Format: HH:MM:SS or MM:SS if no hours
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? ((duration - time) / duration) * 100 : 0;

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-lg max-w-md mx-auto">
      {/* Distraction Warning */}
      {wasRunningBeforeHidden && (
        <div className="w-full mb-6 p-4 bg-amber-100 border-l-4 border-amber-500 rounded-lg shadow-md">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <h4 className="font-semibold text-amber-800 mb-1">Focus Interrupted!</h4>
              <p className="text-sm text-amber-700 mb-3">
                Timer paused - you switched tabs or minimized the window. 
                {distractionCount > 1 && ` (${distractionCount} distractions detected)`}
              </p>
              <button
                onClick={resumeAfterDistraction}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-md shadow transition-colors duration-200"
              >
                Resume Focus Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Timer Display */}
      <div className="relative mb-8">
        <div className="text-7xl font-bold text-indigo-900 tracking-wider font-mono">
          {formatTime(time)}
        </div>
        <div className="text-sm text-gray-500 text-center mt-2">
          {isRunning ? 'Focus Time' : time === 0 ? 'Time\'s Up!' : 'Ready to Focus'}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-8 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Preset Duration Buttons */}
      <div className="flex gap-3 mb-4">
        {presetDurations.map((preset) => (
          <button
            key={preset.minutes}
            onClick={() => handlePresetClick(preset.minutes)}
            disabled={isRunning}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-150 ${
              duration === preset.minutes * 60
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-indigo-600 hover:bg-indigo-50 border-2 border-indigo-200'
            } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {preset.label}
          </button>
        ))}
        <button
          onClick={handleCustomClick}
          disabled={isRunning}
          className={`px-4 py-2 rounded-lg font-medium transition-colors duration-150 ${
            showCustomInput
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white text-indigo-600 hover:bg-indigo-50 border-2 border-indigo-200'
          } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          ⏱️ Custom
        </button>
      </div>

      {/* Custom Time Input */}
      {showCustomInput && !isRunning && (
        <div className="w-full bg-white rounded-lg p-4 mb-8 border-2 border-indigo-200 shadow-sm">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="flex flex-col items-center">
              <input
                type="number"
                min="0"
                max="5"
                value={customHours}
                onChange={(e) => setCustomHours(Math.max(0, Math.min(5, parseInt(e.target.value) || 0)))}
                className="w-16 px-3 py-2 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
              />
              <span className="text-xs text-gray-500 mt-1">Hours</span>
            </div>
            <span className="text-2xl font-bold text-gray-400">:</span>
            <div className="flex flex-col items-center">
              <input
                type="number"
                min="0"
                max="59"
                value={customMinutes}
                onChange={(e) => setCustomMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                className="w-16 px-3 py-2 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
              />
              <span className="text-xs text-gray-500 mt-1">Minutes</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 text-center mb-3">5 min - 5 hours</p>
          <button
            onClick={handleSetCustomTime}
            className="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors duration-150"
          >
            Set Time
          </button>
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex gap-4">
        {!isRunning ? (
          <button
            onClick={start}
            disabled={time === 0}
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
              Start
            </span>
          </button>
        ) : (
          <button
            onClick={pause}
            className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-150"
          >
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75A.75.75 0 007.25 3h-1.5zM12.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75a.75.75 0 00-.75-.75h-1.5z" />
              </svg>
              Pause
            </span>
          </button>
        )}
        
        <button
          onClick={handleReset}
          className="px-8 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-150"
        >
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z" clipRule="evenodd" />
            </svg>
            Reset
          </span>
        </button>
      </div>

      {/* Timer Info */}
      <div className="mt-6 text-center text-sm text-gray-600">
        {time > 0 && !isRunning && time !== duration && (
          <p>Paused at {formatTime(time)}</p>
        )}
        {time === 0 && (
          <p className="text-purple-600 font-semibold">Great job! Take a break 🎉</p>
        )}
      </div>
    </div>
  );
}
