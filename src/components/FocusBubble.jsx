import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTimer } from '../hooks/useTimer';
import { useFocusStats } from '../hooks/useFocusStats';

/**
 * FocusBubble - Minimal, Distraction-Free Focus Timer
 * Beautiful centered design with soft gradients and smooth animations
 */
export default function FocusBubble() {
  const presetDurations = [
    { label: '25', minutes: 25 },
    { label: '50', minutes: 50 },
    { label: '90', minutes: 90 }
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
  const [showControls, setShowControls] = useState(true);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [completionCelebration, setCompletionCelebration] = useState(false);

  // Track session for stats
  useEffect(() => {
    if (isRunning && !sessionStarted) {
      setSessionStarted(true);
    }
    
    if (time === 0 && sessionStarted) {
      // Session completed!
      addSession(duration, distractionCount);
      setSessionStarted(false);
      setCompletionCelebration(true);
      setTimeout(() => setCompletionCelebration(false), 5000);
    }
  }, [time, isRunning, sessionStarted, duration, distractionCount, addSession]);

  // Hide controls during focus
  useEffect(() => {
    if (isRunning) {
      const timer = setTimeout(() => setShowControls(false), 3000);
      return () => clearTimeout(timer);
    } else {
      setShowControls(true);
    }
  }, [isRunning]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return { hours, mins, secs };
  };

  const { hours, mins, secs } = formatTime(time);
  const progress = duration > 0 ? ((duration - time) / duration) * 100 : 0;

  const handlePresetClick = (minutes) => {
    setNewDuration(minutes * 60);
    setSessionStarted(false);
  };

  const handleReset = () => {
    reset();
    setSessionStarted(false);
    setCompletionCelebration(false);
  };

  // Breathing animation for the bubble
  const breathingVariants = {
    breathe: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Pulse for active timer
  const pulseVariants = {
    pulse: {
      boxShadow: [
        "0 0 40px rgba(99, 102, 241, 0.3)",
        "0 0 80px rgba(99, 102, 241, 0.5)",
        "0 0 40px rgba(99, 102, 241, 0.3)"
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
      onMouseMove={() => !isRunning && setShowControls(true)}
    >
      {/* Static Background Gradient - No animation for better performance */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50" />

      {/* Floating Orbs Background - CSS animations for GPU acceleration */}
      <div
        className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl will-change-transform"
        style={{
          animation: 'float-1 15s ease-in-out infinite',
          backfaceVisibility: 'hidden',
          perspective: 1000
        }}
      />
      <div
        className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-pink-200/30 to-indigo-200/30 rounded-full blur-3xl will-change-transform"
        style={{
          animation: 'float-2 18s ease-in-out infinite',
          backfaceVisibility: 'hidden',
          perspective: 1000
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Distraction Warning - Minimal */}
        <AnimatePresence>
          {wasRunningBeforeHidden && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute -top-32 bg-white/80 backdrop-blur-lg rounded-2xl px-6 py-4 shadow-xl border border-amber-200"
            >
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: 3 }}
                >
                  <svg className="w-6 h-6 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </motion.div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Focus interrupted</p>
                  <button
                    onClick={resumeAfterDistraction}
                    className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    Resume →
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Timer Bubble */}
        <motion.div
          className="relative"
          variants={breathingVariants}
          animate={!isRunning ? "breathe" : ""}
        >
          {/* Outer Ring */}
          <motion.div
            className="relative w-[500px] h-[500px] rounded-full bg-white/60 backdrop-blur-xl shadow-2xl flex items-center justify-center"
            variants={pulseVariants}
            animate={isRunning ? "pulse" : ""}
          >
            {/* Progress Ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 500 500">
              <circle
                cx="250"
                cy="250"
                r="240"
                fill="none"
                stroke="#e0e7ff"
                strokeWidth="8"
              />
              <motion.circle
                cx="250"
                cy="250"
                r="240"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 240}
                initial={{ strokeDashoffset: 2 * Math.PI * 240 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 240 * (1 - progress / 100) }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="50%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </svg>

            {/* Timer Display */}
            <div className="text-center">
              <motion.div
                className="flex items-center justify-center gap-3"
                key={`${hours}-${mins}-${secs}`}
              >
                {/* Hours (only show if > 0) */}
                {hours > 0 && (
                  <>
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-9xl font-light text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 tabular-nums"
                    >
                      {hours.toString().padStart(2, '0')}
                    </motion.div>

                    {/* Separator */}
                    <motion.div
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="text-7xl font-light text-indigo-400"
                    >
                      :
                    </motion.div>
                  </>
                )}

                {/* Minutes */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-9xl font-light text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 tabular-nums"
                >
                  {mins.toString().padStart(2, '0')}
                </motion.div>

                {/* Separator */}
                <motion.div
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-7xl font-light text-indigo-400"
                >
                  :
                </motion.div>

                {/* Seconds */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-9xl font-light text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 tabular-nums"
                >
                  {secs.toString().padStart(2, '0')}
                </motion.div>
              </motion.div>

              {/* Status Text */}
              <motion.p
                className="mt-8 text-lg text-gray-500 font-light tracking-wide"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {completionCelebration ? (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: [1, 1.2, 1] }}
                    className="text-2xl"
                  >
                    ✨ Session Complete! ✨
                  </motion.span>
                ) : isRunning ? (
                  'Deep Focus'
                ) : time === 0 ? (
                  'Ready to Begin'
                ) : (
                  'Paused'
                )}
              </motion.p>
            </div>
          </motion.div>
        </motion.div>

        {/* Controls - Fade In/Out */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="mt-16 space-y-8"
            >
              {/* Preset Duration Pills */}
              {!isRunning && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex gap-4 justify-center"
                >
                  {presetDurations.map((preset, index) => (
                    <motion.button
                      key={preset.minutes}
                      onClick={() => handlePresetClick(preset.minutes)}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative w-20 h-20 rounded-full font-light text-2xl transition-all duration-300 ${
                        duration === preset.minutes * 60
                          ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-xl'
                          : 'bg-white/60 backdrop-blur-lg text-gray-700 hover:bg-white/80 shadow-lg'
                      }`}
                    >
                      <span>{preset.label}</span>
                      <span className="text-xs block mt-1">min</span>
                      {duration === preset.minutes * 60 && (
                        <motion.div
                          className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500"
                          animate={{
                            scale: [1, 1.3, 1.3, 1],
                            opacity: [0.5, 0, 0, 0.5]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                      )}
                    </motion.button>
                  ))}
                </motion.div>
              )}

              {/* Main Control Buttons */}
              <div className="flex gap-6 justify-center">
                {!isRunning ? (
                  <motion.button
                    onClick={start}
                    disabled={time === 0}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative px-12 py-5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-full shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.6 }}
                    />
                    <span className="relative flex items-center gap-3 text-xl font-light">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                      Start Focus
                    </span>
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={pause}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-12 py-5 bg-white/60 backdrop-blur-lg text-gray-700 rounded-full shadow-xl"
                  >
                    <span className="flex items-center gap-3 text-xl font-light">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M5.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75A.75.75 0 007.25 3h-1.5zM12.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75a.75.75 0 00-.75-.75h-1.5z" />
                      </svg>
                      Pause
                    </span>
                  </motion.button>
                )}

                {/* Reset Button */}
                {(time !== duration || time === 0) && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05, rotate: 180 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleReset}
                    className="w-16 h-16 rounded-full bg-white/60 backdrop-blur-lg text-gray-600 shadow-xl flex items-center justify-center"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z" clipRule="evenodd" />
                    </svg>
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hover hint */}
        {isRunning && !showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}
            className="absolute bottom-8 text-sm text-gray-400 font-light"
          >
            Move mouse to show controls
          </motion.div>
        )}
      </div>

      {/* Completion Celebration Confetti */}
      <AnimatePresence>
        {completionCelebration && (
          <>
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  background: `hsl(${Math.random() * 360}, 70%, 60%)`,
                  left: '50%',
                  top: '50%',
                }}
                initial={{ scale: 0, x: 0, y: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  x: (Math.random() - 0.5) * 800,
                  y: (Math.random() - 0.5) * 800,
                  rotate: Math.random() * 360,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2, ease: "easeOut" }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
