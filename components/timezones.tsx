"use client";

import { useEffect, useState } from "react";
// Switched to digital time display; removed Clock component.

// Global time zones. First entry is Toronto.
const timeZones = [
  { city: "TOR", tz: "America/Toronto", code: "EST" },
  { city: "LDN", tz: "Europe/London", code: "GMT" },
  { city: "FRA", tz: "Europe/Berlin", code: "CET" },
  { city: "HKG", tz: "Asia/Hong_Kong", code: "HKT" },
  { city: "SYD", tz: "Australia/Sydney", code: "AEDT" },
];

export default function Timezones() {
  const getGlobalTimes = () => {
    const times: { [key: string]: string } = {};
    for (const zone of timeZones) {
      try {
        times[zone.city] = new Date().toLocaleTimeString("en-US", {
          timeZone: zone.tz,
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        });
      } catch {
        times[zone.city] = "00:00";
      }
    }
    return times;
  };

  const [globalTimes, setGlobalTimes] = useState<{ [key: string]: string }>(getGlobalTimes);

  useEffect(() => {
    const timerId = setInterval(() => {
      setGlobalTimes(getGlobalTimes());
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  return (
    <div className="flex justify-between">
      {timeZones.map((zone) => (
        <div key={zone.city} className="text-center">
          <div className="flex justify-center text-[9px] font-medium leading-15 tracking-wider">
            {globalTimes[zone.city] || "00:00"}
          </div>
          <div className="leading-10">{zone.city}</div>
        </div>
      ))}
    </div>
  );
} 