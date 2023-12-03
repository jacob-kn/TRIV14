import React, { useState, useEffect } from "react";

const CountdownBar = ({ totalSeconds, onCountdownEnd }) => {
  const [secondsRemaining, setSecondsRemaining] = useState(totalSeconds);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (secondsRemaining > 0) {
        setSecondsRemaining(secondsRemaining - 1);
      } else {
        // Countdown reached 0, call the passed function
        if (onCountdownEnd) {
          onCountdownEnd();
        }
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [secondsRemaining, onCountdownEnd]);

  const barWidth = 100 - (1 - secondsRemaining / totalSeconds) * 100;

  return (
    <div className="max-w-md w-full md:w-1/2 rounded px-4">
      {/* Countdown Bar Container */}
      <div className="relative pt-1">
        {/* Countdown Bar */}
        <div className="flex mb-2 items-center justify-between">
          <div className="flex-1 relative">
            <div className="flex items-center justify-between bg-surface rounded-full">
              <div className="absolute left-2 text-white flex items-center justify-center">
                Time
              </div>
              <div className="absolute text-white flex items-center justify-center inset-0">
                {secondsRemaining} seconds
              </div>
              {/* Bar Filler (change the width dynamically based on the countdown) */}
              <div
                className="w-full bg-gradient-to-r from-[#e6b1ff] to-[#9773ff] rounded-full h-6"
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
