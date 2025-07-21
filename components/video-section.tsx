"use client"

import Link from "next/link";
import WarpDriveSatelliteEffect from "./warp-drive-satellite-effect";
import Sponsors from "./sponsors";
import { useYouTubeLiveStatus } from "@/hooks/use-youtube-live-status";
import { TriangleRightIcon } from "@radix-ui/react-icons";

export default function VideoSection({ className }: { className?: string }) {
  const { isLive } = useYouTubeLiveStatus();
  
  return (
    <div className={`flex-1 h-full flex flex-col pb-[15px] xl:pb-0 ${className}`}>
      {/* Video Player Area */}
      <div className="relative flex w-full overflow-hidden flex-shrink-0" style={{ aspectRatio: '16/9' }}>
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
      
      <div className="flex flex-col justify-between gap-[15px] h-full">
        <div className="flex flex-col gap-[10px]">
          <div className="col-span-8">
            <div className="text-[15px]/[20px]">PROGRAM 09: MEDIAPIPE</div>
            <div className="text-pretty">
            Creative technologist Ben Lapalan leads a hands-on MediaPipe workshop covering face detection, gesture recognition, image segmentation, and more. Build during open creator time, then project demos.
            </div>
          </div>

          <Link href="https://www.youtube.com/@PROGRAMISLIVE" className="inline-flex items-center justify-center gap-0.5 w-full bg-white hover:bg-black hover:text-white text-black hover:border font-extrabold h-[15px]">
            SUBSCRIBE T0 LIVE FEED
            <TriangleRightIcon className="w-3 h-3" />
            <span className="sr-only">Subscribe to live feed</span>
          </Link>
        </div>

        <Sponsors />
      </div>
    </div>
  );
} 