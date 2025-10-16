// useFocusStats Hook - Manages focus session statistics
import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

export function useFocusStats() {
  const [sessions, setSessions] = useLocalStorage('focusSessions', []);
  const [stats, setStats] = useState({
    totalFocusTime: 0,
    totalSessions: 0,
    totalDistractions: 0,
    averageSessionLength: 0,
    last7Days: []
  });

  // Calculate statistics
  useEffect(() => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Filter sessions from last 7 days
    const recentSessions = sessions.filter(session => {
      const sessionDate = new Date(session.date);
      return sessionDate >= sevenDaysAgo;
    });

    // Calculate total metrics
    const totalFocusTime = recentSessions.reduce((sum, s) => sum + s.duration, 0);
    const totalSessions = recentSessions.length;
    const totalDistractions = recentSessions.reduce((sum, s) => sum + s.distractions, 0);
    const averageSessionLength = totalSessions > 0 ? Math.round(totalFocusTime / totalSessions) : 0;

    // Group by day for the last 7 days
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const dayStr = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      const daySessions = recentSessions.filter(session => {
        const sessionDate = new Date(session.date);
        sessionDate.setHours(0, 0, 0, 0);
        return sessionDate.getTime() === date.getTime();
      });

      last7Days.push({
        date: dayStr,
        day: dayName,
        sessions: daySessions.length,
        focusTime: daySessions.reduce((sum, s) => sum + s.duration, 0),
        distractions: daySessions.reduce((sum, s) => sum + s.distractions, 0)
      });
    }

    setStats({
      totalFocusTime,
      totalSessions,
      totalDistractions,
      averageSessionLength,
      last7Days
    });
  }, [sessions]);

  // Add a new completed session
  const addSession = useCallback((duration, distractions) => {
    const newSession = {
      id: Date.now(),
      date: new Date().toISOString(),
      duration, // in seconds
      distractions
    };
    setSessions(prev => [...prev, newSession]);
  }, [setSessions]);

  // Clear all sessions
  const clearSessions = useCallback(() => {
    setSessions([]);
  }, [setSessions]);

  return {
    stats,
    sessions,
    addSession,
    clearSessions
  };
}
