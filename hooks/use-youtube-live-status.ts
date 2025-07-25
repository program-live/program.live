"use client"

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function useYouTubeLiveStatus() {
  // Get current status from Convex database
  const streamData = useQuery(api.streamStatus.getCurrentStatus);
  
  return {
    isLive: streamData?.isLive || false,
    startedAt: streamData?.startedAt || null,
    isLoading: streamData === undefined
  };
} 