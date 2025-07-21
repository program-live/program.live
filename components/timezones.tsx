"use client";

import { useEffect, useState } from "react";
import { Clock } from "@/components/clock";

const USER_TIMEZONE = "America/Toronto";

// Global time zones with speed multipliers
const timeZones = [
  { city: "T0R", tz: "America/New_York", code: "EST" },
  { city: "L0N", tz: "Europe/London", code: "GMT" },
  { city: "PAR", tz: "Europe/Paris", code: "CET" },
  { city: "FRA", tz: "Europe/Berlin", code: "CET" },
  { city: "HKG", tz: "Asia/Hong_Kong", code: "HKT" },
  { city: "T0K", tz: "Asia/Tokyo", code: "JST" },
  { city: "AUS", tz: "Australia/Sydney", code: "AEDT" },
];

export default function Timezones() {
  const [globalTimes, setGlobalTimes] = useState<{[key: string]: string}>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Initialize global times with seconds
    const times: {[key: string]: string} = {};
    timeZones.forEach(zone => {
      try {
        const zoneTime = new Date().toLocaleTimeString("en-US", {
          timeZone: zone.tz,
          hour12: false,
          hour: '2-digit',
          minute: '2-digit'
        });
        times[zone.city] = zoneTime;
      } catch {
        times[zone.city] = "00:00";
      }
    });
    setGlobalTimes(times);

    const timer = setInterval(() => {
      // Update global times with different speeds
      const times: {[key: string]: string} = {};
      
      timeZones.forEach(zone => {
        try {
          const zoneTime = new Date().toLocaleTimeString("en-US", {
            timeZone: zone.tz,
            hour12: false,
            hour: '2-digit',
            minute: '2-digit'
          });
          times[zone.city] = zoneTime;
        } catch {
          times[zone.city] = "00:00";
        }
      });
      setGlobalTimes(times);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  if (!mounted) {
    return (
      <div className="flex justify-between">
        {timeZones.map((zone, i) => (
          <div key={i} className="text-center">
            <div className="flex justify-center">
              <Clock 
                time="00:00" 
                timezone={zone.tz}
                userTimezone="America/Toronto"
              />
            </div>
            <div>{zone.city}</div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex justify-between">
      {timeZones.map((zone, i) => (
        <div key={i} className="text-center">
          <div className="flex justify-center">
            <Clock 
              time={globalTimes[zone.city] || "00:00"} 
              timezone={zone.tz}
              userTimezone={USER_TIMEZONE}
            />
          </div>
          <div>{zone.city}</div>
        </div>
      ))}
    </div>
  );
} 