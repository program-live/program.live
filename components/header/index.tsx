"use client";

import { useEffect, useState } from "react";
import LiveStatus from "@/components/header/live-status";
import AudioWaveform from "@/components/header/audio-waveform/index";
import Logo from "@/components/header/logo";
import StreamDuration from "@/components/header/stream-duration";
import DayDisplay from "@/components/header/day-display";
import TimeDisplay from "@/components/header/time-display";

export default function Header({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState(new Date(2024, 0, 1, 12, 0, 0));

  useEffect(() => {
    setMounted(true);

    const now = new Date();
    setTime(now);

    const timer = setInterval(() => {
      const now = new Date();
      setTime(now);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <header
      className={`fixed xl:sticky top-0 left-0 right-0 z-50 bg-black w-full ${className}`}
    >
      <div className="relative grid grid-cols-12 gap-x-[15px]">
        <DayDisplay mounted={mounted} time={time} className="col-span-4" />

        <Logo className="col-span-4" />

        <TimeDisplay
          mounted={mounted}
          time={time}
          className="col-span-4 justify-self-end"
        />

        <div className="col-span-full relative flex items-center justify-between gap-[15px]">
          <LiveStatus />

          <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex items-center h-[15px]">
            <AudioWaveform />
          </div>

          <StreamDuration />
        </div>
      </div>
    </header>
  );
} 