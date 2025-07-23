"use client";

import { useEffect, useState } from "react";

interface AudioWaveformOfflineProps {
  className?: string;
}

export default function AudioWaveformOffline({ className }: AudioWaveformOfflineProps) {
  const [tappingIndex, setTappingIndex] = useState(0);

  useEffect(() => {
    // Finger tapping animation when not live
    const tappingTimer = setInterval(() => {
      setTappingIndex((prev) => (prev + 1) % 5);
    }, 150);
    
    return () => {
      clearInterval(tappingTimer);
    };
  }, []);

  return (
    <div className={`flex items-center gap-2 h-10 justify-center ${className}`}>
      {Array(5).fill(0).map((_, i) => (
        <div
          key={i}
          className={`w-1 transition-all duration-150 ease-out bg-primary/60 ${
            i === tappingIndex ? 'h-4' : 'h-1'
          }`}
        />
      ))}
    </div>
  );
}