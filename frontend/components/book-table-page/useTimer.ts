import { useState, useEffect, useCallback } from 'react';

const useTimer = (initialTime: number) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [endTime, setEndTime] = useState<number | null>(null);

  useEffect(() => {
    if (endTime) {
      const interval = setInterval(() => {
        const remaining = Math.max(0, endTime - Date.now());
        setTimeLeft(Math.ceil(remaining / 1000));

        if (remaining <= 0) {
          clearInterval(interval);
          setEndTime(null);
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [endTime]);

  const startTimer = useCallback(() => {
    setEndTime(Date.now() + initialTime * 1000);
  }, [initialTime]);

  const stopTimer = useCallback(() => {
    setEndTime(null);
    setTimeLeft(initialTime);
  }, [initialTime]);

  const isRunning = endTime !== null;

  return { timeLeft, isRunning, startTimer, stopTimer };
};

export default useTimer;