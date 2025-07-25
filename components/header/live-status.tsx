"use client";

import { useYouTubeLiveStatus } from "@/hooks/use-youtube-live-status";

export default function LiveStatus({ className }: { className?: string }) {
  const { isLive, isLoading } = useYouTubeLiveStatus();

  if (isLoading) {
    return (
      <div className={`flex items-center gap-5 ${className}`}>
        <div className="size-7 bg-muted-foreground/60" />
        <span>PINGING</span>
      </div>
    );
  }

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