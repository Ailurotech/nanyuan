import { useEffect, useState } from 'react';

const useTimer = (initialTime: number) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    
    const storedTime = sessionStorage.getItem('timeLeft');
    const storedIsRunning = sessionStorage.getItem('isRunning');

    if (storedTime) {
      setTimeLeft(Number(storedTime));
    }

    if (storedIsRunning === 'true') {
      setIsRunning(true);
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          const newTimeLeft = Math.max(prev - 1, 0);
          sessionStorage.setItem('timeLeft', String(newTimeLeft));
          return newTimeLeft;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }

    sessionStorage.setItem('isRunning', String(isRunning));

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft]);

  const startTimer = () => {
    setTimeLeft(initialTime);
    setIsRunning(true);
  };

  const resetTimer = () => {
    setTimeLeft(initialTime);
    setIsRunning(false);
    sessionStorage.removeItem('timeLeft');
    sessionStorage.removeItem('isRunning');
  };

  return {
    timeLeft,
    isRunning,
    startTimer,
    resetTimer,
  };
};

export default useTimer;
