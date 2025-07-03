"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

export default function StreamStatus() {
  const currentStatus = useQuery(api.streamStatus.getCurrentStatus)

  if (!currentStatus) return null

  const getTimeDifference = (timestamp: number) => {
    const diff = Date.now() - timestamp
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    return `${minutes}m ago`
  }

  const getDuration = (startTime: number) => {
    const diff = Date.now() - startTime
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))

    if (hours > 0) return `${hours}h ${minutes % 60}m`
    return `${minutes}m`
  }

  return (
    <div className="absolute top-4 right-4 z-10">
      <div className="bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-lg border border-white/20">
        {currentStatus.isLive ? (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">
              LIVE • {currentStatus.startedAt ? getDuration(currentStatus.startedAt) : '0m'}
            </span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
            <span className="text-sm">
              Last stream {getTimeDifference(currentStatus.timestamp)}
            </span>
          </div>
        )}
      </div>
    </div>
  )
} 