/**
 * FocusBubble - React Popup UI
 * 
 * Modern, animated popup interface for the FocusBubble extension
 * Features timer controls, session stats, and AI insights
 * 
 * Built with:
 * - React 18
 * - Tailwind CSS
 * - Framer Motion
 * 
 * @author Krubles Team
 * @version 1.0.0
 */

const { useState, useEffect, useCallback } = React;
const { motion, AnimatePresence } = Motion;

// ============================================================================
// BROWSER API HELPER
// ============================================================================

const api = typeof browser !== 'undefined' ? browser : chrome;

const sendMessage = (message) => {
  return new Promise((resolve) => {
    api.runtime.sendMessage(message, resolve);
  });
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const formatTime = (ms) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const formatDuration = (ms) => {
  const minutes = Math.floor(ms / 60000);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
};

// ============================================================================
// TIMER DISPLAY COMPONENT
// ============================================================================

const TimerDisplay = ({ state, onStart, onPause, onResume, onStop }) => {
  const progress = state.duration > 0 
    ? ((state.duration - state.remainingTime) / state.duration) * 100 
    : 0;
  
  const circumference = 2 * Math.PI * 85;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="relative flex flex-col items-center justify-center py-8"
    >
      {/* Timer Circle with Progress */}
      <div className="relative">
        <svg className="transform -rotate-90" width="200" height="200">
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r="85"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="8"
            fill="none"
          />
          {/* Progress circle */}
          <motion.circle
            cx="100"
            cy="100"
            r="85"
            stroke="white"
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.5 }}
          />
        </svg>
        
        {/* Time Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            key={state.remainingTime}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className="text-5xl font-bold text-white"
          >
            {formatTime(state.remainingTime || state.duration)}
          </motion.div>
          <div className="text-white/70 text-sm mt-2 uppercase tracking-wider">
            {state.mode || 'Focus'}
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex gap-3 mt-8">
        {!state.isActive ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
            className="px-8 py-3 bg-white text-bubble-600 rounded-full font-semibold shadow-bubble hover:shadow-bubble-lg flex items-center gap-2"
          >
            <span>▶</span> Start
          </motion.button>
        ) : state.isPaused ? (
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onResume}
              className="px-6 py-3 bg-white text-bubble-600 rounded-full font-semibold shadow-bubble"
            >
              ▶ Resume
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onStop}
              className="px-6 py-3 bg-white/20 text-white rounded-full font-semibold backdrop-blur-sm"
            >
              ⏹ Stop
            </motion.button>
          </>
        ) : (
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onPause}
              className="px-6 py-3 bg-white text-bubble-600 rounded-full font-semibold shadow-bubble"
            >
              ⏸ Pause
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onStop}
              className="px-6 py-3 bg-white/20 text-white rounded-full font-semibold backdrop-blur-sm"
            >
              ⏹ Stop
            </motion.button>
          </>
        )}
      </div>
    </motion.div>
  );
};

// ============================================================================
// DURATION PRESETS COMPONENT
// ============================================================================

const DurationPresets = ({ onSelectDuration, currentDuration, disabled }) => {
  const presets = [
    { label: '15m', value: 15 },
    { label: '25m', value: 25 },
    { label: '45m', value: 45 },
    { label: '60m', value: 60 },
  ];

  return (
    <div className="flex gap-2 justify-center">
      {presets.map((preset) => (
        <motion.button
          key={preset.value}
          whileHover={{ scale: disabled ? 1 : 1.05 }}
          whileTap={{ scale: disabled ? 1 : 0.95 }}
          onClick={() => !disabled && onSelectDuration(preset.value)}
          disabled={disabled}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            currentDuration === preset.value
              ? 'bg-white text-bubble-600 shadow-bubble'
              : 'bg-white/20 text-white backdrop-blur-sm hover:bg-white/30'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {preset.label}
        </motion.button>
      ))}
    </div>
  );
};

// ============================================================================
// SESSION STATS COMPONENT
// ============================================================================

const SessionStats = ({ stats }) => {
  const statItems = [
    { label: 'Today', value: stats.todaySessions || 0, icon: '📅' },
    { label: 'Focus Time', value: formatDuration(stats.totalFocusTime || 0), icon: '⏱️' },
    { label: 'Streak', value: `${stats.currentStreak || 0}d`, icon: '🔥' },
    { label: 'Completed', value: stats.completedSessions || 0, icon: '✅' },
  ];

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="bg-white/10 backdrop-blur-md rounded-2xl p-4"
    >
      <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
        <span>📊</span> Session Stats
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {statItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 + index * 0.05 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center"
          >
            <div className="text-2xl mb-1">{item.icon}</div>
            <div className="text-white font-bold text-lg">{item.value}</div>
            <div className="text-white/60 text-xs uppercase tracking-wide">{item.label}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// ============================================================================
// AI INSIGHT COMPONENT
// ============================================================================

const AIInsight = ({ insight, loading }) => {
  if (!insight && !loading) return null;

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -20, opacity: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white/10 backdrop-blur-md rounded-2xl p-4"
    >
      <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
        <span>✨</span> AI Insight
      </h3>
      
      {loading ? (
        <div className="flex items-center justify-center py-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
          />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-4"
        >
          <p className="text-white/90 text-sm leading-relaxed">
            {insight}
          </p>
          <div className="mt-2 text-white/50 text-xs">
            {new Date().toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

const App = () => {
  const [timerState, setTimerState] = useState({
    isActive: false,
    isPaused: false,
    remainingTime: 25 * 60 * 1000,
    duration: 25 * 60 * 1000,
    mode: 'focus',
    distractions: 0
  });
  
  const [selectedDuration, setSelectedDuration] = useState(25);
  const [stats, setStats] = useState({});
  const [aiInsight, setAiInsight] = useState(null);
  const [loadingInsight, setLoadingInsight] = useState(false);

  // Load initial state and stats
  useEffect(() => {
    loadTimerState();
    loadStats();
    loadAIInsight();
    
    // Listen for updates from background
    const messageListener = (message) => {
      if (message.type === 'TIMER_TICK' || message.type?.includes('TIMER_')) {
        loadTimerState();
      }
    };
    
    api.runtime.onMessage.addListener(messageListener);
    
    return () => {
      api.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  const loadTimerState = async () => {
    const response = await sendMessage({ type: 'GET_STATE' });
    if (response?.success) {
      setTimerState(response.state);
    }
  };

  const loadStats = async () => {
    const response = await sendMessage({ type: 'GET_STATS' });
    if (response?.success) {
      setStats(response.stats);
    }
  };

  const loadAIInsight = async () => {
    // For now, use a placeholder
    // In production, this would call the AI insights API
    const insights = [
      "Great focus today! You're building strong productivity habits. Keep up the consistent practice! 🌟",
      "Your completion rate is improving! Try tackling your hardest tasks during your peak focus hours. 💪",
      "You're on a roll! Consider taking short breaks to maintain this momentum throughout the day. ✨",
      "Excellent session! Your distraction management is getting better. Stay in the zone! 🎯"
    ];
    setAiInsight(insights[Math.floor(Math.random() * insights.length)]);
  };

  const handleStart = async () => {
    const response = await sendMessage({ 
      type: 'START_TIMER', 
      duration: selectedDuration,
      mode: 'focus'
    });
    if (response?.success) {
      setTimerState(response.state);
    }
  };

  const handlePause = async () => {
    const response = await sendMessage({ type: 'PAUSE_TIMER' });
    if (response?.success) {
      setTimerState(response.state);
    }
  };

  const handleResume = async () => {
    const response = await sendMessage({ type: 'RESUME_TIMER' });
    if (response?.success) {
      setTimerState(response.state);
    }
  };

  const handleStop = async () => {
    const response = await sendMessage({ type: 'STOP_TIMER', saveSession: true });
    if (response?.success) {
      setTimerState(response.state);
      loadStats();
      loadAIInsight();
    }
  };

  const handleSelectDuration = (duration) => {
    setSelectedDuration(duration);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bubble-500 to-purple-600 relative overflow-hidden">
      {/* Main Container */}
      <div className="relative z-10 p-6 custom-scrollbar overflow-y-auto max-h-screen">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-6"
        >
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-5xl mb-2"
          >
            🫧
          </motion.div>
          <h1 className="text-3xl font-bold text-white">FocusBubble</h1>
          <p className="text-white/70 text-sm mt-1">Stay focused, stay productive</p>
        </motion.div>

        {/* Timer Display */}
        <TimerDisplay
          state={timerState}
          onStart={handleStart}
          onPause={handlePause}
          onResume={handleResume}
          onStop={handleStop}
        />

        {/* Duration Presets */}
        {!timerState.isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mb-6"
          >
            <DurationPresets
              onSelectDuration={handleSelectDuration}
              currentDuration={selectedDuration}
              disabled={timerState.isActive}
            />
          </motion.div>
        )}

        {/* Session Stats */}
        <div className="mb-4">
          <SessionStats stats={stats} />
        </div>

        {/* AI Insight */}
        <AnimatePresence>
          <AIInsight insight={aiInsight} loading={loadingInsight} />
        </AnimatePresence>

        {/* Footer Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 flex justify-center gap-4 text-white/60 text-sm"
        >
          <button 
            onClick={() => {/* TODO: Open settings */}}
            className="hover:text-white transition-colors"
          >
            ⚙️ Settings
          </button>
          <span>•</span>
          <button 
            onClick={() => api.tabs.create({ url: 'dashboard/dashboard.html' })}
            className="hover:text-white transition-colors"
          >
            📊 Dashboard
          </button>
        </motion.div>
      </div>
    </div>
  );
};

// ============================================================================
// RENDER APP
// ============================================================================

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
