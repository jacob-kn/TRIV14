import React, { useState, useEffect } from "react";

const CountdownBar = ({ totalSeconds, onCountdownEnd, startCountdown }) => {
  const [secondsRemaining, setSecondsRemaining] = useState(totalSeconds);
  
  useEffect(() => {
    let intervalId;

    if (startCountdown) {
      // Reset the countdown when startCountdown is true
      setSecondsRemaining(totalSeconds);

      // Start the countdown
      intervalId = setInterval(() => {
        setSecondsRemaining(prevSeconds => {
          if (prevSeconds > 0) {
            return prevSeconds - 1;
          } else {
            // Countdown reached 0, call the function
            clearInterval(intervalId);
            if (onCountdownEnd) {
              onCountdownEnd();
            }
            return 0;
          }
        });
      }, 1000);
    } else {
      // If startCountdown is false, clear the interval
      clearInterval(intervalId);
    }

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, [startCountdown, onCountdownEnd, totalSeconds]);

  const barWidth = 100 - (1 - secondsRemaining / totalSeconds) * 100;

  return (
    <div className="max-w-md w-full md:w-1/2 rounded px-4">
      {/* Countdown Bar Container */}
      <div className="relative pt-1">
        {/* Countdown Bar */}
        <div className="flex mb-2 items-center justify-between">
          <div className="flex-1 relative">
            <div className="flex items-center justify-between bg-surface rounded-full">
              <div className="pl-2 absolute left-2 text-white flex items-center justify-center">
                Time
              </div>
              <div className="absolute text-white flex items-center justify-center inset-0">
                {secondsRemaining} seconds
              </div>
              {/* Bar Filler (change the width dynamically based on the countdown) */}
              <div
                className="w-full bg-gradient-to-r from-[#e6b1ff] to-[#9773ff] rounded-full h-8"
                style={{ width: `${barWidth}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountdownBar;
