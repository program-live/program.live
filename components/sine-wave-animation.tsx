"use client"

import { cn } from "@/lib/utils"
import { useEffect, useState, useRef, useCallback, useMemo } from "react"

export default function SineWaveAnimation({ className }: { className?: string }) {
  // Responsive configuration - will be calculated based on container dimensions
  const [containerWidth, setContainerWidth] = useState(800) // Default fallback
  const [containerHeight, setContainerHeight] = useState(200) // Default fallback
  const baseAmplitude1 = 0.2 // Ratio of container height (20%)
  const baseAmplitude2 = 0.15 // Ratio of container height (15%)
  const frequency = 0.2
  const animationSpeed = 0.8

  // Calculate responsive values based on container dimensions
  const dotSpacing = Math.max(0.5, containerWidth / 120) // Adjust dot density based on width
  const width = containerWidth - 20 // Account for padding
  const height = containerHeight - 20 // Account for padding
  const amplitude1 = (height / 2) * baseAmplitude1 // Scale amplitude to height
  const amplitude2 = (height / 2) * baseAmplitude2 // Scale amplitude to height

  const [currentDistance, setCurrentDistance] = useState(0)
  const [animationProgress, setAnimationProgress] = useState(0)
  const [disappearDistance, setDisappearDistance] = useState(0)

  // Steeper easing function (more dramatic ease-in-out)
  const easeInOut = (t: number) => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
  }

  // Generate sine wave points with cumulative distances - memoized
  const sineWaveData = useMemo(() => {
    const points = []
    const distances = [0]
    let totalDistance = 0

    for (let x = 0; x < width; x += dotSpacing) {
      // Gradually reduce amplitude as x approaches width to converge to middle
      const convergeFactor = 1 - x / width
      const y = height / 2 + amplitude1 * Math.sin(frequency * x) * convergeFactor
      points.push({ x, y })

      if (points.length > 1) {
        const prevPoint = points[points.length - 2]
        const dx = x - prevPoint.x
        const dy = y - prevPoint.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        totalDistance += distance
      }

      distances.push(totalDistance)
    }

    return { points, distances, totalDistance }
  }, [width, height, dotSpacing, amplitude1, frequency])

  // Generate inverse sine wave points (opposite direction) - memoized
  const inverseWaveData = useMemo(() => {
    const points = []
    const distances = [0]
    let totalDistance = 0

    for (let x = 0; x < width; x += dotSpacing) {
      // Gradually reduce amplitude as x approaches width to converge to middle
      const convergeFactor = 1 - x / width
      const y = height / 2 - amplitude2 * Math.sin(frequency * x) * convergeFactor
      points.push({ x, y })

      if (points.length > 1) {
        const prevPoint = points[points.length - 2]
        const dx = x - prevPoint.x
        const dy = y - prevPoint.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        totalDistance += distance
      }

      distances.push(totalDistance)
    }

    return { points, distances, totalDistance }
  }, [width, height, dotSpacing, amplitude2, frequency])

  // Extract values from memoized data
  const sineWavePoints = sineWaveData.points
  const sineDistances = sineWaveData.distances
  const sineTotalDistance = sineWaveData.totalDistance

  const inverseWavePoints = inverseWaveData.points
  const inverseDistances = inverseWaveData.distances
  const inverseTotalDistance = inverseWaveData.totalDistance

  // Find the active index based on current distance for both waves
  const getActiveIndex = (currentDist: number, distances: number[]) => {
    for (let i = 0; i < distances.length - 1; i++) {
      if (currentDist >= distances[i] && currentDist <= distances[i + 1]) {
        return i
      }
    }
    return distances.length - 1
  }

  const sineActiveIndex = getActiveIndex(currentDistance, sineDistances)
  const inverseActiveIndex = getActiveIndex(currentDistance, inverseDistances)

  // Find disappear index (how many dots should be hidden from the start)
  const sineDisappearIndex = getActiveIndex(disappearDistance, sineDistances)
  const inverseDisappearIndex = getActiveIndex(disappearDistance, inverseDistances)

  // Animation effect with linear progress
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationProgress((prev) => {
        if (prev >= 100) {
          return 0 // Reset to 0 to loop instead of stopping
        }
        return prev + animationSpeed
      })
    }, 16)

    return () => clearInterval(interval)
  }, [animationSpeed])

  // Update distances based on eased progress applied to entire animation
  useEffect(() => {
    const maxDistance = Math.max(sineTotalDistance, inverseTotalDistance)

    // Apply easing to the entire animation progress (0-100%)
    const normalizedProgress = animationProgress / 100
    const easedProgress = easeInOut(normalizedProgress)

    // Map eased progress to the full animation timeline (0-200% equivalent)
    const fullAnimationProgress = easedProgress * 200

    if (fullAnimationProgress <= 100) {
      // Phase 1: Appearing
      const appearProgress = fullAnimationProgress / 100
      setCurrentDistance(appearProgress * maxDistance)
      setDisappearDistance(0)
    } else {
      // Phase 2: Disappearing
      const disappearProgress = (fullAnimationProgress - 100) / 100
      setCurrentDistance(maxDistance) // Keep all dots appeared
      setDisappearDistance(disappearProgress * maxDistance)
    }
  }, [animationProgress, sineTotalDistance, inverseTotalDistance])

  const containerRef = useRef<HTMLDivElement>(null)

  // Memoize the updateDimensions function to prevent infinite re-renders
  const updateDimensions = useCallback(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth)
      setContainerHeight(containerRef.current.offsetHeight)
    }
  }, [])

  // Handle responsive resizing
  useEffect(() => {
    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [updateDimensions])

  const isDotVisible = (index: number, activeIndex: number, disappearIndex: number) => {
    return index <= activeIndex && index > disappearIndex
  }

  return (
    <div
      ref={containerRef}
      className={cn("w-full relative", className)}
    >
      <svg width="100%" height="100%" className="absolute inset-0">
        {/* Sine wave dots (green) */}
        {sineWavePoints.map((point, index) => (
          <circle
            key={`sine-${index}`}
            cx={point.x + 10}
            cy={point.y + 10}
            r="0.75"
            fill={isDotVisible(index, sineActiveIndex, sineDisappearIndex) ? "#999" : "#222"}
          />
        ))}

        {/* Inverse sine wave dots (red) */}
        {inverseWavePoints.map((point, index) => (
          <circle
            key={`inverse-${index}`}
            cx={point.x + 10}
            cy={point.y + 10}
            r="0.75"
            fill={isDotVisible(index, inverseActiveIndex, inverseDisappearIndex) ? "#fff" : "#333"}
          />
        ))}
      </svg>
    </div>
  )
}
