"use client";

import { useEffect, useState } from "react";

interface ClockProps {
  time: string; // Format: "HH:MM"
  timezone: string;
  userTimezone?: string;
}

export function Clock({ time, timezone, userTimezone }: ClockProps) {
  const [isNextDay, setIsNextDay] = useState(false);
  
  useEffect(() => {
    // Check if this timezone is showing next day compared to user's timezone
    if (userTimezone) {
      const now = new Date();
      const userDate = new Date(now.toLocaleString("en-US", { timeZone: userTimezone }));
      const zoneDate = new Date(now.toLocaleString("en-US", { timeZone: timezone }));
      
      // Get day of month for comparison
      const userDay = userDate.getDate();
      const zoneDay = zoneDate.getDate();
      
      setIsNextDay(zoneDay > userDay || (zoneDay === 1 && userDay > 25));
    }
  }, [timezone, userTimezone, time]);

  // Parse time
  const [hours, minutes] = time.split(':').map(Number);
  
  // Calculate angles (clock goes clockwise, but SVG rotation is also clockwise from 12 o'clock)
  const minuteAngle = (minutes / 60) * 360;
  const hourAngle = ((hours % 12) / 12) * 360 + (minutes / 60) * 30; // Add minute offset to hour hand
  
  const clockSize = 15;
  const center = clockSize / 2;
  const radius = 8;
  
  return (
    <div className="relative inline-block overflow-hidden" style={{ width: clockSize, height: clockSize }}>
      <svg
        width={clockSize}
        height={clockSize}
        viewBox={`0 0 ${clockSize} ${clockSize}`}
        className="block"
      > 
        {/* Cardinal direction notches */}
        <rect x={center - 0.5} y={center - radius} width="1" height="2" fill="currentColor" opacity={0.4} />
        <rect x={center + radius - 2} y={center - 0.5} width="2" height="1" fill="currentColor" opacity={0.4} />
        
        {!isNextDay && (
            <rect x={center - 0.5} y={center + radius - 2} width="1" height="2" fill="currentColor" opacity={0.4} />
        )}
        <rect x={center - radius} y={center - 0.5} width="2" height="1" fill="currentColor" opacity={0.4} />
        
        {/* Minute hand */}
        <line
          x1={center}
          y1={center}
          x2={center}
          y2={center - radius * 1}
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          transform={`rotate(${minuteAngle} ${center} ${center})`}
          className="relative opacity-60"
        />

        {/* Hour hand */}
        <line
          x1={center}
          y1={center}
          x2={center}
          y2={center - radius * 0.5}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          transform={`rotate(${hourAngle} ${center} ${center})`}
          className="relative"
        />
      </svg>
      
      {/* +1 indicator for next day */}
      {isNextDay && (
        <span className="absolute -bottom-[1px] -right-[1px] text-[7px] font-extrabold leading-none tracking-wider z-10" style={{ filter: "drop-shadow('2px 2px black')" }}>
          +1
        </span>
      )}
    </div>
  );
} 