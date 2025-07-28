"use client";

import { useEffect, useState } from "react";
import { Clock } from "@/components/timezones/clock";

const TIMEZONE = "America/Toronto";

// Global time zones. First entry is Toronto.
const timeZones = [
  { city: "TOR", tz: "America/Toronto", code: "EST" },
  { city: "LDN", tz: "Europe/London", code: "GMT" },
  { city: "PAR", tz: "Europe/Paris", code: "CET" },
  { city: "FRA", tz: "Europe/Berlin", code: "CET" },
  { city: "HKG", tz: "Asia/Hong_Kong", code: "HKT" },
  { city: "TOK", tz: "Asia/Tokyo", code: "JST" },
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
          <div className="flex justify-center">
            <Clock
              time={globalTimes[zone.city]}
              timezone={zone.tz}
              baseTimezone={TIMEZONE}
            />
          </div>
          <div>{zone.city}</div>
        </div>
      ))}
    </div>
  );
} 