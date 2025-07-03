"use client"

import { useState, useEffect } from "react"

export default function CurrentTime() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    })
  }

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
      <div className="bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-lg border border-white/20">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="text-sm font-mono">
            {formatTime(currentTime)}
          </span>
        </div>
      </div>
    </div>
  )
} 