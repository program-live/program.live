"use client"

import { useEffect, useRef, useState } from "react"

interface Particle {
  x: number
  y: number
  z: number
  ox: number
  oy: number
  x2d: number
  y2d: number
  color: { r: number; g: number; b: number; a: number }
  oColor?: { r: number; g: number; b: number; a: number }
  w?: number
  distance?: number
  distanceTotal?: number
}

interface MousePos {
  x: number
  y: number
}

interface WarpEffectProps {
  width?: number
  height?: number
  maxWidth?: number
  maxHeight?: number
  particleCount?: number
  particleBrightness?: number // 0-1 scale
  warpBrightness?: number // 0-1 scale for warp lines
  className?: string
  children?: React.ReactNode
}

export default function WarpEffect({
  width,
  height,
  maxWidth = 400,
  maxHeight = 200,
  particleCount = 800,
  particleBrightness = 0.8,
  warpBrightness = 0.5,
  className = "",
  children
}: WarpEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | undefined>(undefined)
  const [dimensions, setDimensions] = useState({ width: maxWidth, height: maxHeight })

  // Animation state
  const stateRef = useRef({
    mouseActive: false,
    mouseDown: false,
    mousePos: { x: 0, y: 0 } as MousePos,
    center: { x: 0, y: 0 },
    rotationSpeed: -0.5,
    rotationSpeedFactor: { x: 0, y: 0 },
    fov: 300,
    fovMin: 210,
    fovMax: 300,
    starHolderCount: particleCount,
    starHolder: [] as Particle[],
    starBgHolder: [] as Particle[],
    starSpeed: 5,
    starSpeedMin: 5,
    starSpeedMax: 20,
    starDistance: 4000,
    starRotation: 0,
    backgroundColor: { r: 0, g: 0, b: 0, a: 0 },
    imageData: null as ImageData | null,
    pix: null as Uint8ClampedArray | null,
    ctx: null as CanvasRenderingContext2D | null,
    brightness: particleBrightness,
    warpBrightness: warpBrightness
  })

  // Handle responsive sizing
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth
        const containerHeight = containerRef.current.clientHeight
        
        // Use provided dimensions or fill the container
        const finalWidth = width || containerWidth || maxWidth
        const finalHeight = height || containerHeight || maxHeight

        setDimensions({ width: finalWidth, height: finalHeight })
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [width, height, maxWidth, maxHeight])

  // Update particle count when prop changes
  useEffect(() => {
    stateRef.current.starHolderCount = particleCount
  }, [particleCount])

  // Update brightness when prop changes
  useEffect(() => {
    stateRef.current.brightness = particleBrightness
  }, [particleBrightness])

  // Update warp brightness when prop changes
  useEffect(() => {
    stateRef.current.warpBrightness = warpBrightness
  }, [warpBrightness])

  // Initialize canvas and particles
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { willReadFrequently: true })
    if (!ctx) return

    // Set canvas size
    canvas.width = dimensions.width
    canvas.height = dimensions.height

    const state = stateRef.current
    state.ctx = ctx
    state.center = { x: dimensions.width / 2, y: dimensions.height / 2 }
    state.mousePos = { x: state.center.x, y: state.center.y }
    state.rotationSpeedFactor.x = state.rotationSpeed / state.center.x
    state.rotationSpeedFactor.y = state.rotationSpeed / state.center.y

    // Initialize image data
    state.imageData = ctx.getImageData(0, 0, dimensions.width, dimensions.height)
    state.pix = state.imageData.data

    // Clear existing particles
    state.starHolder = []
    state.starBgHolder = []

    // Add particles
    addParticles()

    // Start animation loop
    const animloop = () => {
      animationRef.current = requestAnimationFrame(animloop)
      render()
    }
    animloop()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [dimensions])

  const addParticles = () => {
    const state = stateRef.current
    let i, x, y, z, colorValue, particle

    // Calculate brightness values based on prop
    const baseBrightness = Math.floor(state.brightness * 255)
    const brightnesVariation = Math.floor(state.brightness * 80) // Increased variation

    // Background stars
    for (i = 0; i < state.starHolderCount / 3; i++) {
      x = Math.random() * (dimensions.width * 6) - (dimensions.width * 3)
      y = Math.random() * (dimensions.height * 3) - (dimensions.height * 1.5)
      z = Math.round(Math.random() * state.starDistance)
      colorValue = Math.floor(Math.random() * brightnesVariation) + Math.max(100, baseBrightness - 50) // Increased minimum brightness
      particle = {
        x,
        y,
        z,
        ox: x,
        oy: y,
        x2d: 0,
        y2d: 0,
        color: { r: colorValue, g: colorValue, b: colorValue, a: 255 },
        oColor: { r: colorValue, g: colorValue, b: colorValue, a: 255 }, // Store original color
      }
      state.starBgHolder.push(particle)
    }

    // Main stars
    for (i = 0; i < state.starHolderCount; i++) {
      x = Math.random() * (dimensions.width * 4) - (dimensions.width * 2)
      y = Math.random() * (dimensions.height * 4) - (dimensions.height * 2)
      z = Math.round(Math.random() * state.starDistance)
      colorValue = Math.floor(Math.random() * brightnesVariation) + Math.max(150, baseBrightness) // Much higher minimum brightness
      particle = {
        x,
        y,
        z,
        ox: x,
        oy: y,
        x2d: 0,
        y2d: 0,
        color: { r: colorValue, g: colorValue, b: colorValue, a: 255 },
        oColor: { r: colorValue, g: colorValue, b: colorValue, a: 255 },
        w: 1,
        distance: state.starDistance - z,
        distanceTotal: Math.round(state.starDistance + state.fov - 1),
      }
      state.starHolder.push(particle)
    }
  }

  const clearImageData = () => {
    const state = stateRef.current
    if (!state.pix) return

    for (let i = 0, l = state.pix.length; i < l; i += 4) {
      state.pix[i] = state.backgroundColor.r
      state.pix[i + 1] = state.backgroundColor.g
      state.pix[i + 2] = state.backgroundColor.b
      state.pix[i + 3] = state.backgroundColor.a
    }
  }

  const setPixel = (x: number, y: number, r: number, g: number, b: number, a: number) => {
    const state = stateRef.current
    if (!state.pix) return

    const i = (x + y * dimensions.width) * 4
    state.pix[i] = r
    state.pix[i + 1] = g
    state.pix[i + 2] = b
    state.pix[i + 3] = a
  }

  const setPixelAdditive = (x: number, y: number, r: number, g: number, b: number, a: number) => {
    const state = stateRef.current
    if (!state.pix) return

    const i = (x + y * dimensions.width) * 4
    state.pix[i] = state.pix[i] + r
    state.pix[i + 1] = state.pix[i + 1] + g
    state.pix[i + 2] = state.pix[i + 2] + b
    state.pix[i + 3] = a
  }

  const drawLine = (x1: number, y1: number, x2: number, y2: number, r: number, g: number, b: number, a: number) => {
    const dx = Math.abs(x2 - x1)
    const dy = Math.abs(y2 - y1)
    const sx = x1 < x2 ? 1 : -1
    const sy = y1 < y2 ? 1 : -1
    let err = dx - dy
    let lx = x1
    let ly = y1

    while (true) {
      if (lx > 0 && lx < dimensions.width && ly > 0 && ly < dimensions.height) {
        setPixel(lx, ly, r, g, b, a)
      }
      if (lx === x2 && ly === y2) break
      const e2 = 2 * err
      if (e2 > -dx) {
        err -= dy
        lx += sx
      }
      if (e2 < dy) {
        err += dx
        ly += sy
      }
    }
  }

  const render = () => {
    const state = stateRef.current
    if (!state.ctx || !state.imageData) return

    clearImageData()

    // Adjust star speed based on mouse activity
    if (state.mouseActive) {
      state.starSpeed += 0.3
      if (state.starSpeed > state.starSpeedMax) {
        state.starSpeed = state.starSpeedMax
      }
    } else {
      state.starSpeed -= 0.2
      if (state.starSpeed < state.starSpeedMin) {
        state.starSpeed = state.starSpeedMin
      }
    }

    // Adjust FOV
    if (!state.mouseActive) {
      state.fov += 0.1
      if (state.fov > state.fovMax) {
        state.fov = state.fovMax
      }
    } else {
      state.fov -= 0.2
      if (state.fov < state.fovMin) {
        state.fov = state.fovMin
      }
    }

    // Calculate warp speed
    const warpSpeedValue = state.starSpeed * (state.starSpeed / (state.starSpeedMax / 1.5))

    // Render background stars
    for (let i = 0, l = state.starBgHolder.length; i < l; i++) {
      const star = state.starBgHolder[i]
      const scale = state.fov / (state.fov + star.z)
      star.x2d = star.x * scale + state.center.x
      star.y2d = star.y * scale + state.center.y

      if (star.x2d > 0 && star.x2d < dimensions.width && star.y2d > 0 && star.y2d < dimensions.height) {
        const x = star.x2d | 0
        const y = star.y2d | 0
        
        // Apply brightness adjustment to background stars too
        const bgBrightness = state.brightness * 0.8 // Slightly dimmer than main stars
        const adjustedR = Math.min(255, Math.floor(star.oColor!.r * bgBrightness))
        const adjustedG = Math.min(255, Math.floor(star.oColor!.g * bgBrightness))
        const adjustedB = Math.min(255, Math.floor(star.oColor!.b * bgBrightness))
        
        setPixelAdditive(x, y, adjustedR, adjustedG, adjustedB, 255)
      }
    }

    // Render main stars
    for (let i = 0, l = state.starHolder.length; i < l; i++) {
      const star = state.starHolder[i]
      star.z -= state.starSpeed
      star.distance! += state.starSpeed

      if (star.z < -state.fov + star.w!) {
        star.z = state.starDistance
        star.distance = 0
      }

      // Star color based on distance and warp speed
      const distancePercent = star.distance! / star.distanceTotal!
      const warpBrightness = Math.min(1.2, 1 + (state.starSpeed - state.starSpeedMin) / (state.starSpeedMax - state.starSpeedMin) * 0.6)
      const brightnessMultiplier = state.brightness * warpBrightness
      star.color.r = Math.min(255, Math.floor(star.oColor!.r * distancePercent * brightnessMultiplier))
      star.color.g = Math.min(255, Math.floor(star.oColor!.g * distancePercent * brightnessMultiplier))
      star.color.b = Math.min(255, Math.floor(star.oColor!.b * distancePercent * brightnessMultiplier))

      // Draw star
      const scale = state.fov / (state.fov + star.z)
      star.x2d = star.x * scale + state.center.x
      star.y2d = star.y * scale + state.center.y

      if (star.x2d > 0 && star.x2d < dimensions.width && star.y2d > 0 && star.y2d < dimensions.height) {
        const x = star.x2d | 0
        const y = star.y2d | 0
        setPixelAdditive(x, y, star.color.r, star.color.g, star.color.b, 255)
      }

      // Draw warp lines
      if (state.starSpeed !== state.starSpeedMin) {
        const nz = star.z + warpSpeedValue * 0.2
        const lineScale = state.fov / (state.fov + nz)
        const x2d = star.x * lineScale + state.center.x
        const y2d = star.y * lineScale + state.center.y

        if (x2d > 0 && x2d < dimensions.width && y2d > 0 && y2d < dimensions.height) {
          drawLine(
            star.x2d | 0,
            star.y2d | 0,
            x2d | 0,
            y2d | 0,
            star.color.r * state.warpBrightness,
            star.color.g * state.warpBrightness,
            star.color.b * state.warpBrightness,
            255,
          )
        }
      }

      // Rotation on mouse down
      if (state.mouseDown) {
        const radians = (Math.PI / 180) * state.starRotation
        const cos = Math.cos(radians)
        const sin = Math.sin(radians)
        star.x = cos * (star.ox - state.center.x) + sin * (star.oy - state.center.y) + state.center.x
        star.y = cos * (star.oy - state.center.y) - sin * (star.ox - state.center.x) + state.center.y
      }
    }

    state.ctx.putImageData(state.imageData, 0, 0)

    // Smooth center movement
    if (state.mouseActive) {
      state.center.x += (state.mousePos.x - state.center.x) * 0.01
    } else {
      state.center.x += (dimensions.width / 2 - state.center.x) * 0.01
    }

    // Rotation
    if (state.mouseDown) {
      state.starRotation -= 0.3
    }
  }

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current
    if (!container) return

    const rect = container.getBoundingClientRect()
    stateRef.current.mousePos = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    }
  }

  const handleMouseEnter = () => {
    stateRef.current.mouseActive = true
  }

  const handleMouseLeave = () => {
    stateRef.current.mouseActive = false
    stateRef.current.mouseDown = false
  }

  const handleMouseDown = () => {
    stateRef.current.mouseDown = true
  }

  const handleMouseUp = () => {
    stateRef.current.mouseDown = false
  }

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden w-full h-full ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        width={dimensions.width}
        height={dimensions.height}
      />
      {children && (
        <div className="relative z-10 w-full h-full">
          {children}
        </div>
      )}
    </div>
  )
} 