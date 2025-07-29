"use client";

import { useEffect, useState } from "react";
import { useYouTubeLiveStatus } from "@/hooks/use-youtube-live-status";

export default function StreamDuration({ className }: { className?: string }) {
  const { isLive, startedAt } = useYouTubeLiveStatus();
  const [duration, setDuration] = useState("--:--:--");

  useEffect(() => {
    if (!isLive || !startedAt) {
      setDuration("--:--:--");
      return;
    }

    const updateDuration = () => {
      const now = Date.now();
      const elapsed = now - startedAt;
      
      const hours = Math.floor(elapsed / (1000 * 60 * 60));
      const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((elapsed % (1000 * 60)) / 1000);
      
      const formattedDuration = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      setDuration(formattedDuration);
    };

    // Update immediately
    updateDuration();

    // Update every second
    const interval = setInterval(updateDuration, 1000);

    return () => clearInterval(interval);
  }, [isLive, startedAt]);

  return (
    <div className={className}>
      {duration}
    </div>
  );
}