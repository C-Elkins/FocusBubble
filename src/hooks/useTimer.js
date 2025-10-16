// useTimer Hook
import { useState, useEffect, useCallback } from 'react';

export function useTimer(initialTime = 0) {
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const [duration, setDuration] = useState(initialTime);
  const [isVisible, setIsVisible] = useState(true);
  const [wasRunningBeforeHidden, setWasRunningBeforeHidden] = useState(false);
  const [distractionCount, setDistractionCount] = useState(0);

  // Page Visibility API
  useEffect(() => {
    const handleVisibilityChange = () => {
      const visible = !document.hidden;
      setIsVisible(visible);

      if (!visible && isRunning) {
        // User switched tabs/minimized - pause timer
        setWasRunningBeforeHidden(true);
        setIsRunning(false);
        setDistractionCount(prev => prev + 1);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isRunning]);

  useEffect(() => {
    let interval;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, time]);

  const start = useCallback(() => {
    if (time > 0) {
      setIsRunning(true);
    }
  }, [time]);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setTime(duration);
    setWasRunningBeforeHidden(false);
    setDistractionCount(0);
  }, [duration]);

  const setNewDuration = useCallback((newDuration) => {
    setDuration(newDuration);
    setTime(newDuration);
    setIsRunning(false);
    setWasRunningBeforeHidden(false);
    setDistractionCount(0);
  }, []);

  const resumeAfterDistraction = useCallback(() => {
    if (wasRunningBeforeHidden && time > 0) {
      setIsRunning(true);
      setWasRunningBeforeHidden(false);
    }
  }, [wasRunningBeforeHidden, time]);

  return { 
    time, 
    isRunning, 
    start, 
    pause, 
    reset, 
    setNewDuration,
    duration,
    isVisible,
    wasRunningBeforeHidden,
    distractionCount,
    resumeAfterDistraction
  };
}
