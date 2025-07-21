"use client"

import dynamic from "next/dynamic"
import StreamStatus from "@/components/stream-status"

// Dynamic import with no SSR to prevent hydration mismatch
const CurrentTime = dynamic(() => import("@/components/current-time"), {
  ssr: false,
})

export default function LandingPage() {
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-custom-dark-gray">
      <CurrentTime />
      <StreamStatus /> 
      <div className="w-full max-w-4xl mx-auto px-4">
        <div className="relative w-full h-0 pb-[56.25%]"> {/* 16:9 aspect ratio */}
          {/* <iframe  
            className="absolute top-0 left-0 w-full h-full rounded-lg"
            src="https://www.youtube.com/embed/live_stream?channel=UCbEmN5Nw2p6yFsaak0sHPpg"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />  */}
        
        </div>
      </div>
    </div>
  )
}
