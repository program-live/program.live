"use client"

import WarpDriveSatelliteEffect from "@/components/warp-drive-satellite-effect";
import { useYouTubeLiveStatus } from "@/hooks/use-youtube-live-status";
import { cn } from "@/lib/utils";

export default function Video() {
  const { isLive } = useYouTubeLiveStatus();
  return (
    <div 
      className="relative flex w-full overflow-hidden flex-shrink-0"
      style={{ aspectRatio: '16/9' }}
    >
      {isLive ? (
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src="https://www.youtube.com/embed/live_stream?channel=UCbEmN5Nw2p6yFsaak0sHPpg"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      ) : (
        <WarpDriveSatelliteEffect />
      )}
    </div>
  );
} 