"use client";

import { useYouTubeLiveStatus } from "@/hooks/use-youtube-live-status";

export default function LiveStatus({ className }: { className?: string }) {
  const { isLive } = useYouTubeLiveStatus();

  if (isLive) {
    return (
      <div className={`flex items-center gap-5 ${className}`}>
        <div className="size-7 bg-destructive" />
        <span>LIVE</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-5 ${className}`}>
      <div className="size-7 bg-muted-foreground" />
      <span>OFFLINE</span>
    </div>
  );
} 