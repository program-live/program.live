"use client"

import { useEffect } from "react"
import Link from "next/link"

export default function LandingPage() {
  const redirectUrl = "https://lu.ma/program"
  const redirectDelay = 5000 // 5 seconds

  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = redirectUrl
    }, redirectDelay)

    return () => clearTimeout(timer) // Cleanup the timer if the component unmounts
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-custom-dark-gray p-4">
      <video
        className="max-w-[90vw] max-h-[80vh] mb-8" // Adjusted max-height and added margin-bottom
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/videos/program.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="text-center">
        <p className="text-neutral-400 mb-2 text-sm">If you're not redirected automatically, you can</p>
        <Link
          href={redirectUrl}
          className="inline-block px-6 py-3 bg-neutral-700 text-white rounded-lg hover:bg-neutral-600 transition-colors text-base font-medium"
        >
          PROGRAM EVENTS
        </Link>
      </div>
    </div>
  )
}
