import { useEffect, useState } from 'react';

const useTimer = (initialTime: number) => {
  const [timeLeft, setTimeLeft] = useState<number>(initialTime);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false); 
    }

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
  };

  return {
    timeLeft,
    isRunning,
    startTimer,
    resetTimer,
  };
};

export default useTimer;
