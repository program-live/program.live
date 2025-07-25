"use client";

import { useYouTubeLiveStatus } from "@/hooks/use-youtube-live-status";
import AudioWaveformOffline from "./audio-waveform-offline";
import AudioWaveformLive from "./audio-waveform-live";

interface AudioWaveformProps {
  className?: string;
}

export default function AudioWaveform({ className }: AudioWaveformProps) {
  const { isLive, isLoading } = useYouTubeLiveStatus();

  if (isLoading) {
    return <AudioWaveformOffline className={className} isLoading />;
  }

  if (isLive) {
    return <AudioWaveformLive className={className} />;
  }

  return <AudioWaveformOffline className={className} />;
}