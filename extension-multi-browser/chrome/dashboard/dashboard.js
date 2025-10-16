// Dashboard.js - FocusBubble Analytics Dashboard
// Uses React, Recharts, and Tailwind CSS

// Browser API detection
const api = typeof browser !== 'undefined' ? browser : chrome;

// Utility function to format time
const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
};

// Utility function to format date
const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
        return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
    }
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Get day name
const getDayName = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', { weekday: 'short' });
};

// Statistics Card Component
const StatCard = ({ icon, label, value, subtext, trend }) => {
    const { motion } = Motion;
    
    return (
        <motion.div
            className="glass-card rounded-2xl p-6 hover:shadow-bubble-lg transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
        >
            <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{icon}</div>
                {trend && (
                    <div className={`text-sm font-medium px-2 py-1 rounded-full ${
                        trend > 0 ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'
                    }`}>
                        {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
                    </div>
                )}
            </div>
            <div className="text-white/60 text-sm font-medium mb-2">{label}</div>
            <div className="text-white text-3xl font-bold mb-1">{value}</div>
            {subtext && <div className="text-white/40 text-xs">{subtext}</div>}
        </motion.div>
    );
};

// Focus Time Chart Component
const FocusTimeChart = ({ data }) => {
    const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } = Recharts;
    
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="glass-card rounded-lg p-3 border border-white/20">
                    <p className="text-white font-medium">{payload[0].payload.day}</p>
                    <p className="text-bubble-300 text-sm">{formatTime(payload[0].value)}</p>
                </div>
            );
        }
        return null;
    };
    
    return (
        <div className="glass-card rounded-2xl p-6">
            <h3 className="text-white text-xl font-bold mb-6 flex items-center">
                <span className="mr-2">📊</span>
                Daily Focus Time (Last 7 Days)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                        dataKey="day" 
                        stroke="rgba(255,255,255,0.5)"
                        tick={{ fill: 'rgba(255,255,255,0.7)' }}
                    />
                    <YAxis 
                        stroke="rgba(255,255,255,0.5)"
                        tick={{ fill: 'rgba(255,255,255,0.7)' }}
                        tickFormatter={(value) => `${Math.floor(value / 60)}m`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                        dataKey="focusTime" 
                        fill="#667eea" 
                        radius={[8, 8, 0, 0]}
                        animationDuration={1000}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

// Distraction Chart Component
const DistractionChart = ({ data }) => {
    const { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } = Recharts;
    
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="glass-card rounded-lg p-3 border border-white/20">
                    <p className="text-white font-medium">{payload[0].payload.day}</p>
                    <p className="text-red-300 text-sm">{payload[0].value} distractions</p>
                </div>
            );
        }
        return null;
    };
    
    return (
        <div className="glass-card rounded-2xl p-6">
            <h3 className="text-white text-xl font-bold mb-6 flex items-center">
                <span className="mr-2">⚠️</span>
                Distraction Trend (Last 7 Days)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                        dataKey="day" 
                        stroke="rgba(255,255,255,0.5)"
                        tick={{ fill: 'rgba(255,255,255,0.7)' }}
                    />
                    <YAxis 
                        stroke="rgba(255,255,255,0.5)"
                        tick={{ fill: 'rgba(255,255,255,0.7)' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                        type="monotone" 
                        dataKey="distractions" 
                        stroke="#f87171" 
                        strokeWidth={3}
                        dot={{ fill: '#ef4444', r: 5 }}
                        activeDot={{ r: 8 }}
                        animationDuration={1000}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

// Session Mode Pie Chart Component
const SessionModeChart = ({ data }) => {
    const { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } = Recharts;
    
    const COLORS = {
        focus: '#667eea',
        break: '#48bb78',
        longBreak: '#ed8936'
    };
    
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="glass-card rounded-lg p-3 border border-white/20">
                    <p className="text-white font-medium capitalize">{payload[0].name}</p>
                    <p className="text-bubble-300 text-sm">{payload[0].value} sessions</p>
                    <p className="text-white/60 text-xs">{payload[0].payload.percent}%</p>
                </div>
            );
        }
        return null;
    };
    
    return (
        <div className="glass-card rounded-2xl p-6">
            <h3 className="text-white text-xl font-bold mb-6 flex items-center">
                <span className="mr-2">🎯</span>
                Session Types Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${percent}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        animationDuration={1000}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[entry.mode]} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

// Streak Calendar Component
const StreakCalendar = ({ streakData }) => {
    const { motion } = Motion;
    
    return (
        <div className="glass-card rounded-2xl p-6">
            <h3 className="text-white text-xl font-bold mb-6 flex items-center">
                <span className="mr-2">🔥</span>
                Focus Streak
            </h3>
            <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-white/60 text-sm">Current Streak</div>
                        <div className="text-white text-4xl font-bold">{streakData.current} days</div>
                    </div>
                    <div className="text-6xl">🔥</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="glass-card rounded-lg p-4">
                        <div className="text-white/60 text-xs mb-1">Longest Streak</div>
                        <div className="text-white text-2xl font-bold">{streakData.longest} days</div>
                    </div>
                    <div className="glass-card rounded-lg p-4">
                        <div className="text-white/60 text-xs mb-1">Total Active Days</div>
                        <div className="text-white text-2xl font-bold">{streakData.totalDays}</div>
                    </div>
                </div>
                
                {/* Mini calendar view */}
                <div className="mt-4">
                    <div className="text-white/60 text-xs mb-3">Last 28 Days</div>
                    <div className="grid grid-cols-7 gap-2">
                        {streakData.last28Days.map((day, index) => (
                            <motion.div
                                key={index}
                                className={`aspect-square rounded-lg ${
                                    day.active 
                                        ? 'bg-bubble-500' 
                                        : 'bg-white/10'
                                }`}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.02 }}
                                title={day.date}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// AI Insights Component
const AIInsightsPanel = ({ insights }) => {
    const { motion } = Motion;
    
    return (
        <div className="glass-card rounded-2xl p-6">
            <h3 className="text-white text-xl font-bold mb-6 flex items-center">
                <span className="mr-2">🤖</span>
                Latest AI Insights
            </h3>
            <div className="space-y-4">
                {insights.length === 0 ? (
                    <div className="text-white/50 text-center py-8">
                        No insights yet. Complete a session to get personalized insights!
                    </div>
                ) : (
                    insights.slice(0, 5).map((insight, index) => (
                        <motion.div
                            key={index}
                            className="glass-card rounded-lg p-4 hover:bg-white/15 transition-all"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className="text-white/90 text-sm leading-relaxed mb-2">
                                {insight.message}
                            </div>
                            <div className="text-white/40 text-xs">
                                {formatDate(insight.timestamp)}
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

// Main Dashboard Component
const Dashboard = () => {
    const { motion } = Motion;
    const [loading, setLoading] = React.useState(true);
    const [stats, setStats] = React.useState(null);
    const [chartData, setChartData] = React.useState({
        focusTime: [],
        distractions: [],
        sessionModes: []
    });
    const [streakData, setStreakData] = React.useState({
        current: 0,
        longest: 0,
        totalDays: 0,
        last28Days: []
    });
    const [aiInsights, setAIInsights] = React.useState([]);
    
    React.useEffect(() => {
        loadDashboardData();
    }, []);
    
    const loadDashboardData = async () => {
        try {
            // Load all data from chrome.storage
            const result = await api.storage.local.get([
                'stats',
                'sessionHistory',
                'aiInsights'
            ]);
            
            const statsData = result.stats || {
                totalSessions: 0,
                completedSessions: 0,
                totalFocusTime: 0,
                currentStreak: 0,
                longestStreak: 0
            };
            
            const history = result.sessionHistory || [];
            const insights = result.aiInsights || [];
            
            setStats(statsData);
            setAIInsights(insights);
            
            // Process chart data
            processChartData(history);
            processStreakData(history, statsData);
            
            setLoading(false);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            setLoading(false);
        }
    };
    
    const processChartData = (history) => {
        // Get last 7 days
        const last7Days = [];
        const today = new Date();
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);
            last7Days.push(date.getTime());
        }
        
        // Aggregate data by day
        const dailyData = last7Days.map(dayTimestamp => {
            const nextDay = dayTimestamp + 24 * 60 * 60 * 1000;
            const daySessions = history.filter(session => 
                session.endTime >= dayTimestamp && session.endTime < nextDay
            );
            
            const totalFocusTime = daySessions.reduce((sum, session) => {
                return sum + (session.duration || 0);
            }, 0);
            
            const totalDistractions = daySessions.reduce((sum, session) => {
                return sum + (session.distractions || 0);
            }, 0);
            
            return {
                day: getDayName(dayTimestamp),
                date: dayTimestamp,
                focusTime: totalFocusTime,
                distractions: totalDistractions,
                sessions: daySessions.length
            };
        });
        
        // Count session modes
        const modeCounts = history.reduce((acc, session) => {
            const mode = session.mode || 'focus';
            acc[mode] = (acc[mode] || 0) + 1;
            return acc;
        }, {});
        
        const totalSessions = history.length || 1;
        const modeData = Object.entries(modeCounts).map(([mode, count]) => ({
            name: mode.charAt(0).toUpperCase() + mode.slice(1),
            mode: mode,
            value: count,
            percent: Math.round((count / totalSessions) * 100)
        }));
        
        setChartData({
            focusTime: dailyData,
            distractions: dailyData,
            sessionModes: modeData
        });
    };
    
    const processStreakData = (history, stats) => {
        // Generate last 28 days
        const last28Days = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        for (let i = 27; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dayTimestamp = date.getTime();
            const nextDay = dayTimestamp + 24 * 60 * 60 * 1000;
            
            const hasSession = history.some(session => 
                session.endTime >= dayTimestamp && session.endTime < nextDay
            );
            
            last28Days.push({
                date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                active: hasSession
            });
        }
        
        // Count total active days
        const activeDays = last28Days.filter(day => day.active).length;
        
        setStreakData({
            current: stats.currentStreak || 0,
            longest: stats.longestStreak || 0,
            totalDays: activeDays,
            last28Days: last28Days
        });
    };
    
    const calculateTrend = (current, previous) => {
        if (previous === 0) return 0;
        return Math.round(((current - previous) / previous) * 100);
    };
    
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mb-4"></div>
                    <div className="text-white text-xl">Loading your dashboard...</div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen p-6 lg:p-12 relative z-10">
            {/* Header */}
            <motion.div 
                className="mb-12"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex items-center justify-between mb-2">
                    <h1 className="text-white text-4xl lg:text-5xl font-bold flex items-center">
                        <span className="mr-4">🫧</span>
                        FocusBubble Dashboard
                    </h1>
                    <button
                        onClick={() => window.close()}
                        className="glass-card px-6 py-3 rounded-xl text-white hover:bg-white/20 transition-all"
                    >
                        Close
                    </button>
                </div>
                <p className="text-white/60 text-lg">Track your productivity and focus patterns</p>
            </motion.div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    icon="🎯"
                    label="Total Sessions"
                    value={stats?.totalSessions || 0}
                    subtext={`${stats?.completedSessions || 0} completed`}
                />
                <StatCard
                    icon="⏱️"
                    label="Total Focus Time"
                    value={formatTime(stats?.totalFocusTime || 0)}
                    subtext="All time"
                />
                <StatCard
                    icon="🔥"
                    label="Current Streak"
                    value={`${stats?.currentStreak || 0} days`}
                    subtext={`Best: ${stats?.longestStreak || 0} days`}
                />
                <StatCard
                    icon="✅"
                    label="Completion Rate"
                    value={`${stats?.totalSessions > 0 ? Math.round((stats?.completedSessions / stats?.totalSessions) * 100) : 0}%`}
                    subtext={`${stats?.completedSessions || 0} / ${stats?.totalSessions || 0}`}
                />
            </div>
            
            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <FocusTimeChart data={chartData.focusTime} />
                <DistractionChart data={chartData.distractions} />
            </div>
            
            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <SessionModeChart data={chartData.sessionModes} />
                <StreakCalendar streakData={streakData} />
                <AIInsightsPanel insights={aiInsights} />
            </div>
            
            {/* Footer */}
            <motion.div 
                className="text-center text-white/40 text-sm mt-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <p>Last updated: {new Date().toLocaleString()}</p>
                <p className="mt-2">Keep focused, keep growing! 🚀</p>
            </motion.div>
        </div>
    );
};

// Render the dashboard
ReactDOM.render(<Dashboard />, document.getElementById('root'));
