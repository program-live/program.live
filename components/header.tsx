"use client";

import { useEffect, useState } from "react";
import LiveStatus from "@/components/live-status";
import AudioWaveform from "@/components/audio-waveform/index";
import Logo from "@/components/logo";
import StreamDuration from "@/components/stream-duration";
import { GlobeIcon } from "@radix-ui/react-icons";

function DayDisplay({ mounted, time, className }: { mounted: boolean; time: Date; className?: string }) {
  return (
    <span className={className}>
      {mounted 
        ? time.toLocaleDateString('en-US', {weekday: 'short', month: 'short', day: '2-digit', year: 'numeric'}).replace(/,/g, '')
        : "MON JAN 01 2025"
      }
    </span>
  );
}

function TimeDisplay({ mounted, time, className }: { mounted: boolean; time: Date; className?: string }) {
  return (
    <span className={className}>
      {mounted 
        ? time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }) 
        : "12:00:00 AM"
      }
    </span>
  );
}



function ViewerCount({ count, className }: { count: number; className?: string; }) {
  return (
    <div className={`flex items-center gap-[3px] whitespace-nowrap ${className}`}>
      <GlobeIcon height={12} width={12} strokeWidth={1} />
      {count}
    </div>
  );
}


export default function Header({ className }: { className?: string } ) {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState(new Date(2024, 0, 1, 12, 0, 0));

  useEffect(() => {
    setMounted(true);
    
    // Initialize with client-side values
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
    <header className={`fixed xl:sticky top-0 left-0 right-0 z-50 bg-black w-full ${className}`}>
      <div className="relative grid grid-cols-12 gap-x-[15px]">
        <DayDisplay mounted={mounted} time={time} className="col-span-4" />

        <Logo className="col-span-4" />

        <TimeDisplay mounted={mounted} time={time} className="col-span-4 justify-self-end" />

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