"use client"

import { cn } from "@/lib/utils";
import { useYouTubeLiveStatus } from "@/hooks/use-youtube-live-status";

// Live stream statuses
const liveStatuses = [
  { name: "S0URCE", status: "T0R0NT0", srName: "Source" },
  { name: "CAMERA", status: "ON", srName: "Camera" },
  { name: "AUDI0", status: "ACTIVE", srName: "Audio" },
  { name: "BITRATE", status: "4.2MB/S", srName: "Bitrate" },
];

// Offline statuses
const offlineStatuses = [
  { name: "S0URCE", status: "T0R0NT0", srName: "Source" },
  { name: "CAMERA", status: "OFF", srName: "Camera" },
  { name: "AUDI0", status: "INACTIVE", srName: "Audio" },
  { name: "BITRATE", status: "0MB/S", srName: "Bitrate" },
];

export default function Diagnostics({ className }: { className?: string }) {
  const { isLive } = useYouTubeLiveStatus();
    const currentStatuses = isLive ? liveStatuses : offlineStatuses;
  
  return (
    <div className={cn("relative flex flex-col border-t border-r rounded-tr bg-black xl:sticky bottom-0 pt-[10px]", className)}>
      <h2 className="font-extrabold whitespace-nowrap uppercase absolute -top-[5px] -left-0.5 z-[1] bg-black px-0.5">Diagnostics</h2>
      {currentStatuses.slice(0, 5).map((status, i) => (
        <div key={i} className="flex w-full gap-[15px]">
          <span className="w-full" aria-hidden={!!status.srName}>{status.name}:</span>
          {status.srName && <span className="sr-only">{status.srName}</span>}
          <span className="w-full">{status.status}</span>
        </div>
      ))}
    </div>
  );
} 