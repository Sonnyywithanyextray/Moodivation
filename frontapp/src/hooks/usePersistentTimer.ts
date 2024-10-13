import { useState, useEffect } from 'react';

interface TimerData {
  activityName: string;
  endTime: number;
}

export const usePersistentTimer = () => {
  const [activeActivity, setActiveActivity] = useState<TimerData | null>(null);
  const [remainingTime, setRemainingTime] = useState<number>(0);

  useEffect(() => {
    const storedTimer = localStorage.getItem('activityTimer');
    if (storedTimer) {
      const timerData: TimerData = JSON.parse(storedTimer);
      const now = new Date().getTime();
      if (now < timerData.endTime) {
        setActiveActivity(timerData);
        setRemainingTime(Math.floor((timerData.endTime - now) / 1000));
      } else {
        localStorage.removeItem('activityTimer');
      }
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeActivity && remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval);
            localStorage.removeItem('activityTimer');
            setActiveActivity(null);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeActivity, remainingTime]);

  const startTimer = (activityName: string, duration: number) => {
    const endTime = new Date().getTime() + duration * 1000;
    const timerData: TimerData = { activityName, endTime };
    localStorage.setItem('activityTimer', JSON.stringify(timerData));
    setActiveActivity(timerData);
    setRemainingTime(duration);
  };

  return { activeActivity, remainingTime, startTimer };
};