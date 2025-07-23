"use client"

import { useYouTubeLiveStatus } from "@/hooks/use-youtube-live-status";
import { cn } from "@/lib/utils";

const liveStatuses = [
  { name: "S0URCE", status: "T0R0NT0", srName: "Source" },
  { name: "CAMERA", status: "ON", srName: "Camera" },
  { name: "AUDI0", status: "ACTIVE", srName: "Audio" },
  { name: "BITRATE", status: "4.2MB/S", srName: "Bitrate" },
];

const offlineStatuses = [
  { name: "S0URCE", status: "T0R0NT0", srName: "Source" },
  { name: "CAMERA", status: "OFF", srName: "Camera" },
  { name: "AUDI0", status: "INACTIVE", srName: "Audio" },
  { name: "BITRATE", status: "0MB/S", srName: "Bitrate" },
];

export default function Diagnostics({ className }: { className?: string }) {
  const { isLive } = useYouTubeLiveStatus();
    const statuses = isLive ? liveStatuses : offlineStatuses;
  
  return (
    <div className={cn("relative flex flex-col border-t border-r rounded-tr bg-black xl:sticky bottom-0 pt-10", className)}>
      <h2 className="font-extrabold whitespace-nowrap uppercase absolute -top-5 -left-2 z-[1] bg-black px-2">Diagnostics</h2>
      {statuses.slice(0, 5).map((status, i) => (
        <div key={i} className="flex w-full gap-15">
          <span className="w-full" aria-hidden={!!status.srName}>{status.name}:</span>
          {status.srName && <span className="sr-only">{status.srName}</span>}
          <span className="w-full">{status.status}</span>
        </div>
      ))}
    </div>
  );
} 