"use client";

import { cn } from "@/lib/utils";
import { useYouTubeLiveStatus } from "@/hooks/use-youtube-live-status";

export default function Logo({ className }: { className?: string }) {
  const { isLive } = useYouTubeLiveStatus();

  return (
    <div className={cn("flex items-center justify-center h-15", className)}>
      <h1 className="self-center font-extrabold">
        <span className="sr-only">Program Live</span>
        <span aria-hidden className="inline-flex gap-3 items-center text-15 leading-15">
          <span>PR0GRAM</span>
          <span className={cn(
            "font-extrabold italic tracking-tighter pl-2 pr-5 leading-15",
            isLive ? "animate-live-flash" : "bg-primary text-primary-foreground"
          )}>
            LIVE
          </span>
        </span>
      </h1>
    </div>
  );
}