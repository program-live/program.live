'use client'

import { Suspense, useState, useEffect } from 'react'
import { useHydration } from '@/hooks/use-hydration'

function TimeContent({ className }: { className?: string }) {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000) // Update every second

    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      timeZone: 'America/Toronto',
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  return (
    <div className={className}>
      <time dateTime={currentTime.toISOString()}>
        {formatTime(currentTime)}
      </time>
    </div>
  )
}

export default function TimeDisplay({ className }: { className?: string }) {
  const hydrated = useHydration()
  
  return (
    <Suspense key={hydrated ? 'local' : 'utc'}>
      <TimeContent className={className} />
    </Suspense>
  )
} 