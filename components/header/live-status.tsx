"use client";

import { useYouTubeLiveStatus } from "@/hooks/use-youtube-live-status";

export default function LiveStatus({ className }: { className?: string }) {
  const { isLive } = useYouTubeLiveStatus();

  if (isLive) {
    return (
      <div className={`flex items-center gap-[5px] ${className}`}>
        <div className="size-[7px] bg-[#FF0066]" />
        <span>LIVE</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-[5px] ${className}`}>
      <div className="size-[7px] bg-neutral-600" />
      <span>OFFLINE</span>
    </div>
  );
} 