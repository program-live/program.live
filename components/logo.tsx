"use client";

import { cn } from "@/lib/utils";
import { useYouTubeLiveStatus } from "@/hooks/use-youtube-live-status";

export default function Logo({ className }: { className?: string }) {
  const { isLive } = useYouTubeLiveStatus();

  return (
    <div className={cn("flex items-center justify-center text-[15px]/[15px] h-[15px]", className)}>
      <h1 className="text-[15px]/[15px] self-center font-extrabold">
        <span className="sr-only">Program Live</span>
        <span aria-hidden className="inline-flex gap-[3px] items-center">
          <span>PR0GRAM</span>
          <span className={cn(
            "font-extrabold italic tracking-tighter pl-0.5 pr-[5px]",
            isLive ? "animate-live-flash" : "bg-white text-black"
          )}>
            LIVE
          </span>
        </span>
      </h1>
    </div>
  );
}