"use client"
import { useEffect, useRef, useState } from 'react';

function TimerComponent() {
  const [timer, setTimer] = useState(300); // Initial timer value in seconds

  const handleTimeOut = () => {
    // Function to handle timeout when timer reaches 0
    console.log('Timer expired!');
    // Add any additional logic here when timer expires
  };

  let countdownRef = useRef(null);
  useEffect(() => {
    let startTime = Date.now();
    let intervalId;

    const tick = () => {
      const elapsedTime = Date.now() - startTime;
      let remainingTime = timer * 1000 - elapsedTime;

      if (remainingTime <= 0) {
        clearInterval(intervalId);
        handleTimeOut();
        return;
      }

      setTimer(Math.ceil(remainingTime / 1000));
    };

    // Initial start of timer
    intervalId = setInterval(tick, 1000);

    // Clear interval on component unmount
    return () => {
      clearInterval(intervalId);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        clearInterval(intervalId.current); // Pause timer
      } else {
        startTime = Date.now(); // Reset start time when tab is visible again
        intervalId.current = setInterval(tick, 1000); // Resume timer
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div>
      <p>Timer: {timer} seconds</p>
    </div>
  );
}

export default TimerComponent;
