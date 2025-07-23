"use client";

import { useYouTubeLiveStatus } from "@/hooks/use-youtube-live-status";
import AudioWaveformOffline from "./audio-waveform-offline";
import AudioWaveformLive from "./audio-waveform-live";

interface AudioWaveformProps {
  className?: string;
}

export default function AudioWaveform({ className }: AudioWaveformProps) {
  const { isLive } = useYouTubeLiveStatus();

  if (isLive) {
    return <AudioWaveformLive className={className} />;
  }

  return <AudioWaveformOffline className={className} />;
}