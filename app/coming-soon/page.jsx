"use client"
import Image from 'next/image';
import React, { useState, useEffect } from 'react';

const ComingSoon = () => {
  const calculateTimeLeft = () => {
    const targetDate = new Date('2024-06-19T19:00:00');
    const now = new Date();
    const difference = targetDate - now;

    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timerComponents = Object.keys(timeLeft).map((interval) => {
    if (!timeLeft[interval]) {
      return null;
    }

    return (
      <span key={interval}>
        {timeLeft[interval]} {interval}{' '}
      </span>
    );
  });

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-900 overflow-hidden">
      {/* Grid background */}
      <div className="grid-background absolute inset-0 p-2 grid grid-cols-12 gap-2 transform -skew-y-12 scale-150">
        {/* Row 1 */}
        <div className="col-span-2 bg-gray-800 rounded animate-pulse"></div>
        <div className="col-span-5 bg-gray-800 rounded animate-pulse"></div>
        <div className="col-span-1 bg-gray-800 rounded animate-pulse"></div>
        <div className="col-span-4 bg-gray-800 rounded animate-pulse"></div>
        {/* Row 2 */}
        <div className="col-span-5 bg-gray-800 rounded animate-pulse"></div>
        <div className="col-span-3 bg-gray-800 rounded animate-pulse"></div>
        <div className="col-span-2 bg-gray-800 rounded animate-pulse"></div>
        <div className="col-span-2 bg-gray-800 rounded animate-pulse"></div>
        {/* Row 3 */}
        <div className="col-span-4 bg-gray-800 rounded animate-pulse"></div>
        <div className="col-span-7 bg-gray-800 rounded animate-pulse"></div>
        <div className="col-span-1 bg-gray-800 rounded animate-pulse"></div>
        {/* Row 4 */}
        <div className="col-span-4 bg-gray-800 rounded animate-pulse"></div>
        <div className="col-span-2 bg-gray-800 rounded animate-pulse"></div>
        <div className="col-span-2 bg-gray-800 rounded animate-pulse"></div>
        <div className="col-span-2 bg-gray-800 rounded animate-pulse"></div>
        <div className="col-span-2 bg-gray-800 rounded animate-pulse"></div>
        {/* Row 5 */}
        <div className="col-span-2 bg-gray-800 rounded animate-pulse"></div>
        <div className="col-span-5 bg-gray-800 rounded animate-pulse"></div>
        <div className="col-span-1 bg-gray-800 rounded animate-pulse"></div>
        <div className="col-span-4 bg-gray-800 rounded animate-pulse"></div>
        {/* Row 6 */}
        <div className="col-span-4 bg-gray-800 rounded animate-pulse"></div>
        <div className="col-span-7 bg-gray-800 rounded animate-pulse"></div>
        <div className="col-span-1 bg-gray-800 rounded animate-pulse"></div>
        {/* Row 7 */}
        <div className="col-span-5 bg-gray-800 rounded animate-pulse"></div>
        <div className="col-span-1 bg-gray-800 rounded animate-pulse"></div>
        <div className="col-span-3 bg-gray-800 rounded animate-pulse"></div>
        <div className="col-span-3 bg-gray-800 rounded animate-pulse"></div>
        {/* Row 8 */}
        <div className="col-span-2 bg-gray-800 rounded animate-pulse"></div>
        <div className="col-span-5 bg-gray-800 rounded animate-pulse"></div>
        <div className="col-span-1 bg-gray-800 rounded animate-pulse"></div>
        <div className="col-span-4 bg-gray-800 rounded animate-pulse"></div>
      </div>

      {/* Content */}
      <div className="relative flex flex-col items-center">
         <div className='relative h-32 min-w-24'>
         <Image src={"/assets/images/dou2.png"} alt="Logo" fill className="mb-4" objectFit='contain' />
         </div>
        <h2 className="text-white text-4xl md:text-8xl font-bold flex flex-row items-center">
          Coming
          <div className="relative text-sm mx-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-up-fill text-blue-500" viewBox="0 0 16 16">
              <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
            </svg>
            <div className="absolute -top-12 transform -rotate-45 text-blue-500">
              <p className="font-light text-base text-white bg-blue-500 rounded-md px-2 py-0">super</p>
            </div>
          </div>
          Soon
        </h2>
        <div className="text-white text-2xl mt-4 mx-auto">
          <div className='mx-auto w-full'>
          {timerComponents.length ? timerComponents : <span>Time's up!</span>}
          </div>
        </div>
      </div>
    </div>
  );
};



export default ComingSoon;
