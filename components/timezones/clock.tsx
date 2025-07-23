"use client";

interface ClockProps {
  time: string; // Format: "HH:MM"
  timezone: string;
  baseTimezone?: string;
}

export function Clock({ time, timezone, baseTimezone }: ClockProps) {
  let isNextDay = false;
  if (baseTimezone) {
    try {
      const now = new Date();
      const baseZoneDay = new Date(
        now.toLocaleString("en-US", { timeZone: baseTimezone })
      ).getDate();
      const zoneDay = new Date(
        now.toLocaleString("en-US", { timeZone: timezone })
      ).getDate();
      isNextDay = zoneDay > baseZoneDay || (zoneDay === 1 && baseZoneDay > 25);
    } catch (e) {
      console.error("Error calculating next day for `Clock.tsx`:", e);
    }
  }

  const [hours, minutes] = time.split(":").map(Number);

  const minuteAngle = (minutes / 60) * 360;
  const hourAngle = ((hours % 12) / 12) * 360 + (minutes / 60) * 30;

  const clockSize = 15;
  const center = clockSize / 2;
  const radius = 8;

  return (
    <div
      className="relative inline-block overflow-hidden"
      style={{ width: clockSize, height: clockSize }}
    >
      <svg
        width={clockSize}
        height={clockSize}
        viewBox={`0 0 ${clockSize} ${clockSize}`}
        className="block"
      >
        {/* Notches */}
        {[0, 90, 180, 270].map((angle) => {
          if (angle === 180 && isNextDay) return null; // Skip bottom notch if next day
          return (
            <rect
              key={angle}
              x={center - 0.5}
              y={center - radius}
              width="1"
              height="2"
              fill="currentColor"
              opacity={0.4}
              transform={`rotate(${angle} ${center} ${center})`}
            />
          );
        })}

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
        <span
          className="absolute -bottom-[1px] -right-[1px] text-[7px] font-extrabold leading-none tracking-wider z-10"
          style={{ filter: "drop-shadow('2px 2px black')" }}
        >
          +1
        </span>
      )}
    </div>
  );
} 