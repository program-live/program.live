"use client"

import type React from "react"

import { useCallback, useEffect, useRef, useState } from "react"
import * as THREE from 'three'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import type { Font } from 'three/examples/jsm/loaders/FontLoader.js'

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

export default function WarpDriveSatelliteEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const threejsContainerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | undefined>(undefined)
  const [dimensions, setDimensions] = useState({ width: 800, height: 450 })
  const [isInitialized, setIsInitialized] = useState(false)
  
  // Three.js refs
  const threeSceneRef = useRef<THREE.Scene | null>(null)
  const threeRendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const satelliteGroupRef = useRef<THREE.Group | null>(null)
  const leftWingTextRef = useRef<THREE.Mesh | null>(null)
  const rightWingTextRef = useRef<THREE.Mesh | null>(null)
  const threeCameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const raycastRef = useRef<THREE.Raycaster>(new THREE.Raycaster())
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2())
  const signalPulseGroupRef = useRef<THREE.Group | null>(null)

  // Animation state
  const stateRef = useRef({
    mouseActive: false,
    mouseDown: false,
    mousePos: { x: 0, y: 0 } as MousePos,
    center: { x: 0, y: 0 },
    // rotationSpeed & rotationSpeedFactor were unused – removed to simplify state
    fov: 300,
    fovMin: 210,
    fovMax: 300,
    starHolderCount: 2000, // Reduced from 6666 to 2000
    starHolder: [] as Particle[],
    starBgHolder: [] as Particle[],
    starSpeed: 10,
    starSpeedMin: 10,
    starSpeedMax: 35,
    starDistance: 8000,
    starRotation: 0,
    backgroundColor: { r: 0, g: 0, b: 0, a: 0 },
    imageData: null as ImageData | null,
    pix: null as Uint8ClampedArray | null,
    ctx: null as CanvasRenderingContext2D | null,
    // Satellite drag state
    isDragging: false,
    dragStart: { x: 0, y: 0 },
    satelliteRotation: { x: 0, y: Math.PI, z: 0 }, // Start with 180 degree Y rotation
    satelliteVelocity: { x: 0, y: 0, z: 0 }, // Rotation velocity for momentum
    lastMouseTime: 0,
    lastMousePos: { x: 0, y: 0 },
    isOverSatellite: false,
    autoRotationSpeed: { x: 0.002, y: 0.001, z: 0.0005 }, // Default automatic rotation speeds
    isAutoRotating: true, // Whether automatic rotation is active
    // Acceleration tracking for pulse triggering
    previousVelocity: { x: 0, y: 0, z: 0 },
    acceleration: { x: 0, y: 0, z: 0 },
    accelerationThreshold: 0.15, // Threshold for pulse triggering (higher = harder to trigger)
    lastPulseAcceleration: 0,

  })

  const addParticles = useCallback(() => {
    const state = stateRef.current
    let i, x, y, z, colorValue, particle

    // Background stars - smaller but bright
    for (i = 0; i < state.starHolderCount / 3; i++) { // Increased from /4 to /3
      x = Math.random() * 24000 - 12000
      y = Math.random() * 4500 - 2255
      z = Math.round(Math.random() * state.starDistance)
      colorValue = Math.floor(Math.random() * 35) + 175 // Fixed range (220-254)
      particle = {
        x,
        y,
        z,
        ox: x,
        oy: y,
        x2d: 0,
        y2d: 0,
        color: { r: colorValue, g: colorValue, b: colorValue, a: 255 },
      }
      state.starBgHolder.push(particle)
    }

    // Main stars - smaller but very bright
    for (i = 0; i < state.starHolderCount; i++) {
      x = Math.random() * 10000 - 5000
      y = Math.random() * 10000 - 5000
      z = Math.round(Math.random() * state.starDistance)
      colorValue = Math.floor(Math.random() * 25) + 350 // Fixed range (230-254)
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
  }, [])

  // Handle responsive sizing while maintaining 16:9 aspect ratio
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth
        const aspectRatio = 16 / 9
        const width = Math.min(containerWidth, 1200)
        const height = width / aspectRatio

        // Only update dimensions if they actually changed to prevent unnecessary re-renders
        setDimensions(prev => {
          if (prev.width !== width || prev.height !== height) {
            return { width, height }
          }
          return prev
        })
      }
    }

    // Set initial dimensions immediately to prevent layout shift
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Initialize canvas and particles
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { willReadFrequently: true })
    if (!ctx) return

    // Set canvas size immediately to prevent layout shift
    canvas.width = dimensions.width
    canvas.height = dimensions.height
    canvas.style.width = `${dimensions.width}px`
    canvas.style.height = `${dimensions.height}px`

    const state = stateRef.current
    state.ctx = ctx
    state.center = { x: dimensions.width / 2, y: dimensions.height / 2 }
    state.mousePos = { x: state.center.x, y: state.center.y }
    // rotationSpeedFactor removed – no longer needed

    // Initialize image data
    state.imageData = ctx.getImageData(0, 0, dimensions.width, dimensions.height)
    state.pix = state.imageData.data

    // Clear existing particles
    state.starHolder = []
    state.starBgHolder = []

    // Add particles
    addParticles()

    // Mark as initialized immediately after canvas setup
    setIsInitialized(true)

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
  }, [dimensions, addParticles])

  // Three.js setup for satellite and text
  useEffect(() => {
    if (!threejsContainerRef.current || !isInitialized) return

    let collisionGeometry: THREE.BoxGeometry | null = null
    let collisionMaterial: THREE.MeshBasicMaterial | null = null

    try {
      // Scene setup
      const scene = new THREE.Scene()
      threeSceneRef.current = scene

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      dimensions.width / dimensions.height,
      0.1,
      1000
    )
    camera.position.z = 5
    threeCameraRef.current = camera

    // Renderer setup - optimized for memory
    const renderer = new THREE.WebGLRenderer({ 
      antialias: false, // Disable antialiasing to save memory
      alpha: true,
      powerPreference: "high-performance"
    })
    renderer.setSize(dimensions.width, dimensions.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)) // Limit pixel ratio
    renderer.setClearColor(0x000000, 0)
    
    // Set explicit size to prevent layout shift
    renderer.domElement.style.width = `${dimensions.width}px`
    renderer.domElement.style.height = `${dimensions.height}px`
    renderer.domElement.style.position = 'absolute'
    renderer.domElement.style.top = '0'
    renderer.domElement.style.left = '0'
    
    threeRendererRef.current = renderer
    threejsContainerRef.current.appendChild(renderer.domElement)

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
    scene.add(ambientLight)
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(0, 1, 1)
    directionalLight.castShadow = false // Disable shadows to save memory
    scene.add(directionalLight)

    // Create satellite using Three.js primitives instead of loading GLB
    const satelliteGroup = new THREE.Group()
    satelliteGroupRef.current = satelliteGroup
    
    // Satellite body (central cylinder)
    const bodyGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.8, 8)
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0xc0c0c0,
      metalness: 0.8,
      roughness: 0.2
    })
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
    body.rotation.z = Math.PI / 2
    satelliteGroup.add(body)
    
    // Solar panels (wings)
    const panelGeometry = new THREE.BoxGeometry(2.4, 0.8, 0.02) // Reduced width to avoid cylinder overlap
    const panelMaterial = new THREE.MeshStandardMaterial({
      color: 0x808080, // Changed from blue (0x1a237e) to gray
      metalness: 0.6,
      roughness: 0.4
    })
    
    // Left panel - front side (gray)
    const leftPanel = new THREE.Mesh(panelGeometry, panelMaterial)
    leftPanel.position.set(-1.4, 0, 0.01) // Moved outward to start at cylinder edge, slightly forward
    satelliteGroup.add(leftPanel)
    
    // Left panel - back side (gray)
    const leftPanelBack = new THREE.Mesh(panelGeometry.clone(), panelMaterial)
    leftPanelBack.position.set(-1.4, 0, -0.01) // Moved outward to start at cylinder edge, slightly back
    satelliteGroup.add(leftPanelBack)
    
    // Right panel - front side (gray)
    const rightPanel = new THREE.Mesh(panelGeometry, panelMaterial)
    rightPanel.position.set(1.4, 0, 0.01) // Moved outward to start at cylinder edge, slightly forward
    satelliteGroup.add(rightPanel)
    
    // Right panel - back side (gray)
    const rightPanelBack = new THREE.Mesh(panelGeometry.clone(), panelMaterial)
    rightPanelBack.position.set(1.4, 0, -0.01) // Moved outward to start at cylinder edge, slightly back
    satelliteGroup.add(rightPanelBack)
    
    // Solar panel grid lines
    const gridMaterial = new THREE.MeshBasicMaterial({ color: 0x404040 }) // Made darker gray for better contrast
    const gridLineGeometry = new THREE.BoxGeometry(0.01, 0.8, 0.01)
    
    // Add grid lines to panels - both front and back sides
    // Left panel grid lines (start where cylinder ends at x = -0.2)
    for (let i = -0.2; i >= -2.6; i -= 0.2) {
      // Left panel grid - front side
      const leftGridFront = new THREE.Mesh(gridLineGeometry, gridMaterial)
      leftGridFront.position.set(i, 0, 0.02)
      satelliteGroup.add(leftGridFront)
      
      // Left panel grid - back side
      const leftGridBack = new THREE.Mesh(gridLineGeometry, gridMaterial)
      leftGridBack.position.set(i, 0, -0.02)
      satelliteGroup.add(leftGridBack)
    }
    
    // Right panel grid lines (start where cylinder ends at x = 0.2)
    for (let i = 0.2; i <= 2.6; i += 0.2) {
      // Right panel grid - front side
      const rightGridFront = new THREE.Mesh(gridLineGeometry, gridMaterial)
      rightGridFront.position.set(i, 0, 0.02)
      satelliteGroup.add(rightGridFront)
      
      // Right panel grid - back side
      const rightGridBack = new THREE.Mesh(gridLineGeometry, gridMaterial)
      rightGridBack.position.set(i, 0, -0.02)
      satelliteGroup.add(rightGridBack)
    }
    
    // Add horizontal grid lines for more realistic solar panel look
    const leftHorizontalGridGeometry = new THREE.BoxGeometry(2.4, 0.005, 0.01) // Width from cylinder edge to panel edge
    const rightHorizontalGridGeometry = new THREE.BoxGeometry(2.4, 0.005, 0.01) // Width from cylinder edge to panel edge
    for (let j = -0.3; j <= 0.3; j += 0.15) {
      // Left panel horizontal grid - front side
      const leftHGridFront = new THREE.Mesh(leftHorizontalGridGeometry, gridMaterial)
      leftHGridFront.position.set(-1.4, j, 0.02) // Center between cylinder edge (-0.2) and panel edge (-2.6)
      satelliteGroup.add(leftHGridFront)
      
      // Left panel horizontal grid - back side
      const leftHGridBack = new THREE.Mesh(leftHorizontalGridGeometry, gridMaterial)
      leftHGridBack.position.set(-1.4, j, -0.02) // Center between cylinder edge (-0.2) and panel edge (-2.6)
      satelliteGroup.add(leftHGridBack)
      
      // Right panel horizontal grid - front side
      const rightHGridFront = new THREE.Mesh(rightHorizontalGridGeometry, gridMaterial)
      rightHGridFront.position.set(1.4, j, 0.02) // Center between cylinder edge (0.2) and panel edge (2.6)
      satelliteGroup.add(rightHGridFront)
      
      // Right panel horizontal grid - back side
      const rightHGridBack = new THREE.Mesh(rightHorizontalGridGeometry, gridMaterial)
      rightHGridBack.position.set(1.4, j, -0.02) // Center between cylinder edge (0.2) and panel edge (2.6)
      satelliteGroup.add(rightHGridBack)
    }
    
    // Antenna
    const antennaGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.4, 6)
    const antennaMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.9,
      roughness: 0.1
    })
    const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial)
    antenna.position.y = 0.6
    satelliteGroup.add(antenna)
    
    // Dish
    const dishGeometry = new THREE.ConeGeometry(0.15, 0.1, 16)
    const dish = new THREE.Mesh(dishGeometry, antennaMaterial)
    dish.position.y = 0.45
    dish.rotation.z = Math.PI
    satelliteGroup.add(dish)
    
    // Create signal pulse effect at antenna tip
    const signalPulseGroup = new THREE.Group()
    signalPulseGroupRef.current = signalPulseGroup
    
    // Position at the very tip of the antenna (antenna position + antenna height/2)
    signalPulseGroup.position.y = 0.82 // Slightly above the antenna tip for better visual effect
    
    // Create single 3D spherical pulse ring for wave animation
    const sphereGeometry = new THREE.SphereGeometry(1, 16, 8)
    const edges = new THREE.EdgesGeometry(sphereGeometry)
    const ringMaterial = new THREE.LineBasicMaterial({
      color: 0x00ff44,
      transparent: true,
      opacity: 0,
      linewidth: 2
    })
    const pulseRing = new THREE.LineSegments(edges, ringMaterial)
    
    // Set up pulse ring properties
    pulseRing.userData = {
      phase: 0,
      initialScale: 0.05,
      maxScale: 15.0, // Large 3D expansion
      speed: 0.012, // Moderate speed for visible ripple effect
      active: false,
      waveStartTime: 0
    }
    
    pulseRing.scale.setScalar(pulseRing.userData.initialScale)
    pulseRing.material.opacity = 0
    signalPulseGroup.add(pulseRing)
    
    // Clean up sphere geometry since we only need edges
    sphereGeometry.dispose()
    
    // Store pulse ring and timing for animation
    signalPulseGroup.userData = { 
      pulseRing,
      lastPulseTime: 0
    }
    
    // Create a larger invisible collision mesh for easier touch/drag interaction
    collisionGeometry = new THREE.BoxGeometry(6, 2.5, 2)
    collisionMaterial = new THREE.MeshBasicMaterial({ 
      transparent: true, 
      opacity: 0, // Completely invisible
      side: THREE.DoubleSide,
      colorWrite: false, // Don't write to color buffer
      depthWrite: false, // Don't write to depth buffer
      depthTest: false, // Don't test depth
    })
    const collisionMesh = new THREE.Mesh(collisionGeometry, collisionMaterial)
    collisionMesh.name = 'satelliteCollision' // Name it for easier identification
    collisionMesh.renderOrder = -1 // Render before other objects
    collisionMesh.castShadow = false // Don't cast shadows
    collisionMesh.receiveShadow = false // Don't receive shadows
    satelliteGroup.add(collisionMesh)
    
    // Scale the entire satellite
    satelliteGroup.scale.setScalar(1.3) // Increased from 1.0 to 1.3 (30% bigger)
    
    // Set initial rotation from state
    satelliteGroup.rotation.x = stateRef.current.satelliteRotation.x
    satelliteGroup.rotation.y = stateRef.current.satelliteRotation.y
    satelliteGroup.rotation.z = stateRef.current.satelliteRotation.z
    
    // Add signal pulse to satellite so it rotates with it
    satelliteGroup.add(signalPulseGroup)
    
    scene.add(satelliteGroup)

    // Load the font and add text to the satellite wings
    const fontLoader = new FontLoader()
    fontLoader.load('/jetbrains_mono_ extrabold_regular.json', (font: Font) => {
      // Create text geometry for "N0 SIGNAL" - reduced detail for memory optimization
      const leftWingTextGeometry = new TextGeometry('N0 SIGNAL', {
        font: font,
        size: 0.2425,
        depth: 0.04,
        curveSegments: 6, // Reduced from 12 to 6
        bevelEnabled: true,
        bevelThickness: 0.005,
        bevelSize: 0.005,
        bevelOffset: 0,
        bevelSegments: 3 // Reduced from 5 to 3
      })

      // Create text geometry for "N0 SIGNAL" for right wing
      const rightWingTextGeometry = new TextGeometry('N0 SIGNAL', {
        font: font,
        size: 0.2425,
        depth: 0.04,
        curveSegments: 6, // Reduced from 12 to 6
        bevelEnabled: true,
        bevelThickness: 0.005,
        bevelSize: 0.005,
        bevelOffset: 0,
        bevelSegments: 3 // Reduced from 5 to 3
      })

      // Center the text geometries
      leftWingTextGeometry.computeBoundingBox()
      if (leftWingTextGeometry.boundingBox) {
        const centerOffsetX = -0.5 * (leftWingTextGeometry.boundingBox.max.x - leftWingTextGeometry.boundingBox.min.x)
        const centerOffsetY = -0.5 * (leftWingTextGeometry.boundingBox.max.y - leftWingTextGeometry.boundingBox.min.y)
        leftWingTextGeometry.translate(centerOffsetX, centerOffsetY, 0)
      }

      rightWingTextGeometry.computeBoundingBox()
      if (rightWingTextGeometry.boundingBox) {
        const centerOffsetX = -0.5 * (rightWingTextGeometry.boundingBox.max.x - rightWingTextGeometry.boundingBox.min.x)
        const centerOffsetY = -0.5 * (rightWingTextGeometry.boundingBox.max.y - rightWingTextGeometry.boundingBox.min.y)
        rightWingTextGeometry.translate(centerOffsetX, centerOffsetY, 0)
      }

      // Create material with metallic finish to match satellite
      const textMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff,
        metalness: 0.5,
        roughness: 0.5,
        side: THREE.DoubleSide
      })

      // Create left wing text meshes (front and back)
      const leftWingTextFront = new THREE.Mesh(leftWingTextGeometry, textMaterial)
      const leftWingTextBack = new THREE.Mesh(leftWingTextGeometry.clone(), textMaterial)
      leftWingTextRef.current = leftWingTextFront // Keep reference to front text
      
      // Position left wing text - front side
      leftWingTextFront.position.set(-1.51, 0, 0.015) // Slightly in front of wing surface
      leftWingTextFront.rotation.y = 0 // Face forward
      
      // Position left wing text - back side
      leftWingTextBack.position.set(-1.48, 0, -0.015) // Slightly behind wing surface
      leftWingTextBack.rotation.y = Math.PI // Face backward
      
      // Create right wing text meshes (front and back)
      const rightWingTextFront = new THREE.Mesh(rightWingTextGeometry, textMaterial)
      const rightWingTextBack = new THREE.Mesh(rightWingTextGeometry.clone(), textMaterial)
      rightWingTextRef.current = rightWingTextFront // Keep reference to front text
      
      // Position right wing text - front side
      rightWingTextFront.position.set(1.48, 0, 0.015) // Slightly in front of wing surface
      rightWingTextFront.rotation.y = 0 // Face forward (same as left wing)
      
      // Position right wing text - back side
      rightWingTextBack.position.set(1.51, 0, -0.015) // Slightly behind wing surface
      rightWingTextBack.rotation.y = Math.PI // Face backward (same as left wing)
      
      // Attach all text to satellite (inherits animation/rotation)
      satelliteGroup.add(leftWingTextFront)
      satelliteGroup.add(leftWingTextBack)
      satelliteGroup.add(rightWingTextFront)
      satelliteGroup.add(rightWingTextBack)
    }, undefined, (error) => {
      console.error('Error loading font:', error)
    })

    } catch (error) {
      console.error('Error initializing Three.js scene:', error)
      // Clean up any partially created objects
      if (threeRendererRef.current) {
        threeRendererRef.current.dispose()
        threeRendererRef.current = null
      }
      if (threeSceneRef.current) {
        threeSceneRef.current.clear()
        threeSceneRef.current = null
      }
    }

    // Cleanup function with proper memory management
    return () => {
      if (threejsContainerRef.current && threeRendererRef.current?.domElement) {
        try {
          threejsContainerRef.current.removeChild(threeRendererRef.current.domElement)
        } catch (error) {
          console.error('Error removing renderer DOM element:', error)
        }
      }
      
      // Clean up signal pulse references
      if (signalPulseGroupRef.current) {
        try {
          const pulseRing = signalPulseGroupRef.current.userData.pulseRing
          if (pulseRing) {
            if (pulseRing.geometry) pulseRing.geometry.dispose()
            if (pulseRing.material) {
              if (Array.isArray(pulseRing.material)) {
                pulseRing.material.forEach((material: THREE.Material) => material.dispose())
              } else {
                pulseRing.material.dispose()
              }
            }
          }
        } catch (error) {
          console.error('Error cleaning up signal pulse:', error)
        }
        signalPulseGroupRef.current = null
      }
      
      // Clean up collision mesh geometry that was created
      try {
        if (collisionGeometry) {
          collisionGeometry.dispose()
        }
        if (collisionMaterial) {
          collisionMaterial.dispose()
        }
      } catch (error) {
        console.error('Error cleaning up collision mesh:', error)
      }
      
      if (threeSceneRef.current) {
        // Dispose of all geometries and materials in the scene
        threeSceneRef.current.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            if (child.geometry) {
              child.geometry.dispose()
            }
            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach((material: THREE.Material) => material.dispose())
              } else {
                child.material.dispose()
              }
            }
          }
        })
        threeSceneRef.current.clear()
      }
      
      if (threeRendererRef.current) {
        threeRendererRef.current.dispose()
      }
    }
  }, [dimensions, isInitialized])

  // Faster zero-fill since background is transparent black
  const clearImageData = useCallback(() => {
    const { pix } = stateRef.current
    if (pix) pix.fill(0)
  }, [])

  const setPixel = useCallback((x: number, y: number, r: number, g: number, b: number, a: number) => {
    const state = stateRef.current
    if (!state.pix) return

    const i = (x + y * dimensions.width) * 4
    state.pix[i] = r
    state.pix[i + 1] = g
    state.pix[i + 2] = b
    state.pix[i + 3] = a
  }, [dimensions.width])

  const setPixelAdditive = useCallback((x: number, y: number, r: number, g: number, b: number, a: number) => {
    const state = stateRef.current
    if (!state.pix) return

    const i = (x + y * dimensions.width) * 4
    state.pix[i] = state.pix[i] + r
    state.pix[i + 1] = state.pix[i + 1] + g
    state.pix[i + 2] = state.pix[i + 2] + b
    state.pix[i + 3] = a
  }, [dimensions.width])

  const drawLine = useCallback((x1: number, y1: number, x2: number, y2: number, r: number, g: number, b: number, a: number) => {
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
  }, [dimensions.width, dimensions.height, setPixel])

  const render = () => {
    const state = stateRef.current
    if (!state.ctx || !state.imageData) return

    clearImageData()

    // Adjust star speed based on mouse activity
    if (state.mouseActive) {
      state.starSpeed += 0.5
      if (state.starSpeed > state.starSpeedMax) {
        state.starSpeed = state.starSpeedMax
      }
    } else {
      state.starSpeed -= 0.3
      if (state.starSpeed < state.starSpeedMin) {
        state.starSpeed = state.starSpeedMin
      }
    }

    // Adjust FOV
    if (!state.mouseActive) {
      state.fov += 0.2
      if (state.fov > state.fovMax) {
        state.fov = state.fovMax
      }
    } else {
      state.fov -= 0.3
      if (state.fov < state.fovMin) {
        state.fov = state.fovMin
      }
    }

    // Calculate warp speed
    const warpSpeedValue = state.starSpeed * (state.starSpeed / (state.starSpeedMax / 1.5))

    // Render background stars - same size as main stars
    for (let i = 0, l = state.starBgHolder.length; i < l; i++) {
      const star = state.starBgHolder[i]
      const scale = state.fov / (state.fov + star.z)
      star.x2d = star.x * scale + state.center.x
      star.y2d = star.y * scale + state.center.y

      if (star.x2d > 0 && star.x2d < dimensions.width && star.y2d > 0 && star.y2d < dimensions.height) {
        const x = star.x2d | 0
        const y = star.y2d | 0
        
        // Main pixel - same size as foreground stars
        setPixelAdditive(x, y, star.color.r, star.color.g, star.color.b, 255)
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

      // Star color based on distance and warp speed - maximum brightness for moving stars
      const distancePercent = star.distance! / star.distanceTotal!
      const warpBrightness = Math.min(1.2, 1 + (state.starSpeed - state.starSpeedMin) / (state.starSpeedMax - state.starSpeedMin) * 0.9) // Much brighter multiplier
      star.color.r = Math.min(255, Math.floor(star.oColor!.r * distancePercent * warpBrightness))
      star.color.g = Math.min(255, Math.floor(star.oColor!.g * distancePercent * warpBrightness))
      star.color.b = Math.min(255, Math.floor(star.oColor!.b * distancePercent * warpBrightness))

      // Draw star - tiny bit bigger with subtle glow
      const scale = state.fov / (state.fov + star.z)
      star.x2d = star.x * scale + state.center.x
      star.y2d = star.y * scale + state.center.y

      if (star.x2d > 0 && star.x2d < dimensions.width && star.y2d > 0 && star.y2d < dimensions.height) {
        const x = star.x2d | 0
        const y = star.y2d | 0
        
        // Main pixel - same size as background stars
        setPixelAdditive(x, y, star.color.r, star.color.g, star.color.b, 255)
      }

      // Draw warp lines
      if (state.starSpeed !== state.starSpeedMin) {
        const nz = star.z + warpSpeedValue * 0.3
        const lineScale = state.fov / (state.fov + nz)
        const x2d = star.x * lineScale + state.center.x
        const y2d = star.y * lineScale + state.center.y

        if (x2d > 0 && x2d < dimensions.width && y2d > 0 && y2d < dimensions.height) {
          drawLine(
            star.x2d | 0,
            star.y2d | 0,
            x2d | 0,
            y2d | 0,
            star.color.r * 0.6,
            star.color.g * 0.6,
            star.color.b * 0.6,
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

    // Handle satellite rotation logic
    if (!state.isDragging) {
      const velocityThreshold = 0.0005 // Threshold to determine if momentum is significant
      const hasMomentum = Math.abs(state.satelliteVelocity.x) > velocityThreshold || Math.abs(state.satelliteVelocity.y) > velocityThreshold
      
      if (hasMomentum) {
        // Apply momentum-based rotation
        state.satelliteRotation.x += state.satelliteVelocity.x
        state.satelliteRotation.y += state.satelliteVelocity.y
        
        // Apply damping to gradually slow down
        const dampingFactor = 0.98
        state.satelliteVelocity.x *= dampingFactor
        state.satelliteVelocity.y *= dampingFactor
        state.satelliteVelocity.z *= dampingFactor
        
        // Stop very small velocities
        if (Math.abs(state.satelliteVelocity.x) < 0.0001) state.satelliteVelocity.x = 0
        if (Math.abs(state.satelliteVelocity.y) < 0.0001) state.satelliteVelocity.y = 0
        if (Math.abs(state.satelliteVelocity.z) < 0.0001) state.satelliteVelocity.z = 0
        
        state.isAutoRotating = false
      } else {
        // Transition to automatic rotation
        if (!state.isAutoRotating) {
          // When transitioning from momentum to auto rotation, 
          // adjust auto rotation direction based on the last momentum direction
          if (state.satelliteVelocity.x !== 0) {
            state.autoRotationSpeed.x = Math.sign(state.satelliteVelocity.x) * Math.abs(state.autoRotationSpeed.x)
          }
          if (state.satelliteVelocity.y !== 0) {
            state.autoRotationSpeed.y = Math.sign(state.satelliteVelocity.y) * Math.abs(state.autoRotationSpeed.y)
          }
          state.isAutoRotating = true
        }
        
        // Apply automatic rotation
        state.satelliteRotation.x += state.autoRotationSpeed.x
        state.satelliteRotation.y += state.autoRotationSpeed.y
        state.satelliteRotation.z += state.autoRotationSpeed.z
      }
    } else {
      // When dragging, disable auto rotation
      state.isAutoRotating = false
    }

    // Render satellite and text
    if (satelliteGroupRef.current && threeRendererRef.current && threeCameraRef.current && threeSceneRef.current) {
      // Apply current rotation state to satellite
      satelliteGroupRef.current.rotation.x = state.satelliteRotation.x
      satelliteGroupRef.current.rotation.y = state.satelliteRotation.y
      satelliteGroupRef.current.rotation.z = state.satelliteRotation.z
      
              // Animate signal pulse wave
        if (signalPulseGroupRef.current) {
          const currentTime = Date.now()
          const groupData = signalPulseGroupRef.current.userData
          const pulseRing = groupData.pulseRing
          
          if (pulseRing) {
            // Calculate rotation acceleration
            const currentVelocity = state.satelliteVelocity
            const previousVelocity = state.previousVelocity
            
            // Calculate acceleration (change in velocity)
            state.acceleration.x = currentVelocity.x - previousVelocity.x
            state.acceleration.y = currentVelocity.y - previousVelocity.y
            state.acceleration.z = currentVelocity.z - previousVelocity.z
            
            // Calculate total acceleration magnitude
            const totalAcceleration = Math.sqrt(
              state.acceleration.x * state.acceleration.x +
              state.acceleration.y * state.acceleration.y +
              state.acceleration.z * state.acceleration.z
            )
            
            // Check if acceleration exceeds threshold and enough time has passed since last pulse
            const timeSinceLastPulse = currentTime - groupData.lastPulseTime
            
            // Reset lastPulseAcceleration after 3 seconds to prevent getting stuck
            if (timeSinceLastPulse > 3000) {
              state.lastPulseAcceleration = 0
            }
            
            // Pulse triggering logic with better sensitivity control
            const shouldPulse = totalAcceleration > state.accelerationThreshold && 
                              timeSinceLastPulse > 500 && // Minimum 500ms between pulses
                              (totalAcceleration > state.lastPulseAcceleration * 1.2 || // Require 20% increase in acceleration
                               (state.lastPulseAcceleration === 0 && totalAcceleration > state.accelerationThreshold * 1.1)) // Slightly higher threshold for first pulse
            
            if (shouldPulse) {
              groupData.lastPulseTime = currentTime
              state.lastPulseAcceleration = totalAcceleration
              
              // Reset pulse ring before starting new pulse
              const userData = pulseRing.userData
              userData.active = true
              userData.phase = 0
              userData.waveStartTime = currentTime
              pulseRing.scale.setScalar(userData.initialScale)
              if (pulseRing.material instanceof THREE.LineBasicMaterial) {
                pulseRing.material.opacity = 0
              }
            }
            
            // Update previous velocity for next frame
            state.previousVelocity.x = currentVelocity.x
            state.previousVelocity.y = currentVelocity.y
            state.previousVelocity.z = currentVelocity.z
            
            // Animate active pulse ring
            const userData = pulseRing.userData
            
            if (userData.active && currentTime >= userData.waveStartTime) {
              // Update phase
              userData.phase += userData.speed
              
              // Calculate scale based on phase - exponential growth for ripple effect
              const scale = userData.initialScale + Math.pow(userData.phase, 0.8) * (userData.maxScale - userData.initialScale)
              
              // Apply scale
              pulseRing.scale.setScalar(scale)
              
              // Fade out as it expands - ripple-like fade
              let opacity = 0
              if (userData.phase < 0.05) {
                // Quick fade in
                opacity = 1.0 * (userData.phase / 0.05)
              } else if (userData.phase < 0.2) {
                // Stay bright for ripple effect
                opacity = 1.0
              } else {
                // Gradual fade out (very slow fade)
                opacity = 1.0 * (1 - ((userData.phase - 0.2) / 0.8))
              }
              
              if (pulseRing.material instanceof THREE.LineBasicMaterial) {
                pulseRing.material.opacity = Math.max(0, opacity)
              }
              
              // Deactivate when fully expanded
              if (userData.phase >= 1) {
                userData.active = false
                userData.phase = 0
                pulseRing.scale.setScalar(userData.initialScale)
                if (pulseRing.material instanceof THREE.LineBasicMaterial) {
                  pulseRing.material.opacity = 0
                }
              }
            }
          }
        }
      
      // Render the 3D scene
      if (threeRendererRef.current && threeSceneRef.current && threeCameraRef.current) {
        try {
          threeRendererRef.current.render(threeSceneRef.current, threeCameraRef.current)
        } catch (error) {
          console.error('Error rendering Three.js scene:', error)
        }
      }
    }

    // Smooth center movement
    if (state.mouseActive) {
      state.center.x += (state.mousePos.x - state.center.x) * 0.015
    } else {
      state.center.x += (dimensions.width / 2 - state.center.x) * 0.015
    }

    // Rotation
    if (state.mouseDown) {
      state.starRotation -= 0.5
    }
  }

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    stateRef.current.mousePos = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    }

    // Check if mouse is over satellite for cursor changes
    const isOverSatellite = checkSatelliteIntersection(event)
    stateRef.current.isOverSatellite = isOverSatellite
    
    // Update canvas cursor
    if (isOverSatellite) {
      canvas.style.cursor = stateRef.current.isDragging ? 'grabbing' : 'grab'
    } else {
      canvas.style.cursor = 'pointer'
    }

    // Handle satellite dragging
    handleDragMove(event.clientX, event.clientY)
  }

  const handleDragMove = (clientX: number, clientY: number) => {
    const state = stateRef.current
    if (state.isDragging) {
      const deltaX = clientX - state.dragStart.x
      const deltaY = clientY - state.dragStart.y
      
      // Convert movement to rotation - adjust sensitivity
      const rotationSensitivity = 0.005
      state.satelliteRotation.y += deltaX * rotationSensitivity
      state.satelliteRotation.x += deltaY * rotationSensitivity
      
      // Calculate velocity for momentum
      const currentTime = Date.now()
      const timeDelta = currentTime - state.lastMouseTime
      if (timeDelta > 0) {
        const velocityX = (clientX - state.lastMousePos.x) / timeDelta * rotationSensitivity * 16 // Scale for smooth momentum
        const velocityY = (clientY - state.lastMousePos.y) / timeDelta * rotationSensitivity * 16
        state.satelliteVelocity.x = velocityY
        state.satelliteVelocity.y = velocityX
      }
      
      // Update tracking for next frame
      state.dragStart = { x: clientX, y: clientY }
      state.lastMousePos = { x: clientX, y: clientY }
      state.lastMouseTime = currentTime
    }
  }

  const handleMouseEnter = () => {
    stateRef.current.mouseActive = true
  }

  const handleMouseLeave = () => {
    stateRef.current.mouseActive = false
    stateRef.current.mouseDown = false
    stateRef.current.isDragging = false
    
    // Reset acceleration tracking when mouse leaves to prevent stuck states
    const state = stateRef.current
    state.previousVelocity = { x: 0, y: 0, z: 0 }
    state.acceleration = { x: 0, y: 0, z: 0 }
    // Only reset lastPulseAcceleration if it's been more than 1 second since last pulse
    const timeSinceLastPulse = Date.now() - (signalPulseGroupRef.current?.userData.lastPulseTime || 0)
    if (timeSinceLastPulse > 1000) {
      state.lastPulseAcceleration = 0
    }
    

  }

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    stateRef.current.mouseDown = true
    
    // Only start satellite dragging if mouse is over the satellite
    if (stateRef.current.isOverSatellite) {
      const state = stateRef.current
      state.isDragging = true
      state.dragStart = { x: event.clientX, y: event.clientY }
      state.lastMousePos = { x: event.clientX, y: event.clientY }
      state.lastMouseTime = Date.now()
      state.satelliteVelocity = { x: 0, y: 0, z: 0 } // Reset velocity when starting new drag
      
      // Reset acceleration tracking when starting new drag to prevent pulse issues
      state.previousVelocity = { x: 0, y: 0, z: 0 }
      state.acceleration = { x: 0, y: 0, z: 0 }
      // Don't reset lastPulseAcceleration here - let it decay naturally
    }
    

  }

  const handleMouseUp = () => {
    stateRef.current.mouseDown = false
    stateRef.current.isDragging = false
  }

  // Touch event handlers for mobile support
  const handleTouchStart = (event: React.TouchEvent<HTMLCanvasElement>) => {
    const touch = event.touches[0]
    if (!touch) return

    stateRef.current.mouseActive = true
    stateRef.current.mouseDown = true

    // Update mouse position for star field effects
    const canvas = canvasRef.current
    if (canvas) {
      const rect = canvas.getBoundingClientRect()
      stateRef.current.mousePos = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      }
    }

    // Only start satellite dragging if touch is over the satellite
    const isOverSatellite = checkSatelliteIntersectionTouch(event)
    stateRef.current.isOverSatellite = isOverSatellite
    
    if (isOverSatellite) {
      const state = stateRef.current
      state.isDragging = true
      state.dragStart = { x: touch.clientX, y: touch.clientY }
      state.lastMousePos = { x: touch.clientX, y: touch.clientY }
      state.lastMouseTime = Date.now()
      state.satelliteVelocity = { x: 0, y: 0, z: 0 } // Reset velocity when starting new drag
      
      // Reset acceleration tracking when starting new drag to prevent pulse issues
      state.previousVelocity = { x: 0, y: 0, z: 0 }
      state.acceleration = { x: 0, y: 0, z: 0 }
    }
    

  }

  const handleTouchMove = (event: React.TouchEvent<HTMLCanvasElement>) => {
    const touch = event.touches[0]
    if (!touch) return

    // Update mouse position for star field effects
    const canvas = canvasRef.current
    if (canvas) {
      const rect = canvas.getBoundingClientRect()
      stateRef.current.mousePos = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      }
    }

    // Handle satellite dragging
    handleDragMove(touch.clientX, touch.clientY)
    

  }

  const handleTouchEnd = () => {
    stateRef.current.mouseDown = false
    stateRef.current.isDragging = false
    stateRef.current.mouseActive = false
    
    // Reset acceleration tracking when touch ends to prevent stuck states
    const state = stateRef.current
    state.previousVelocity = { x: 0, y: 0, z: 0 }
    state.acceleration = { x: 0, y: 0, z: 0 }
    // Only reset lastPulseAcceleration if it's been more than 1 second since last pulse
    const timeSinceLastPulse = Date.now() - (signalPulseGroupRef.current?.userData.lastPulseTime || 0)
    if (timeSinceLastPulse > 1000) {
      state.lastPulseAcceleration = 0
    }
  }

  // Helper function to check if mouse is over satellite
  const checkSatelliteIntersection = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    const threejsContainer = threejsContainerRef.current
    if (!canvas || !threejsContainer || !satelliteGroupRef.current || !threeCameraRef.current) return false

    const rect = canvas.getBoundingClientRect()
    const mouse = mouseRef.current
    const raycaster = raycastRef.current

    // Convert mouse coordinates to normalized device coordinates (-1 to +1)
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

    // Update the raycaster with the camera and mouse position
    raycaster.setFromCamera(mouse, threeCameraRef.current)

    // Calculate objects intersecting the ray
    const intersects = raycaster.intersectObject(satelliteGroupRef.current, true)
    
    return intersects.length > 0
  }

  // Helper function to check if touch is over satellite
  const checkSatelliteIntersectionTouch = (event: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    const threejsContainer = threejsContainerRef.current
    if (!canvas || !threejsContainer || !satelliteGroupRef.current || !threeCameraRef.current) return false

    const touch = event.touches[0]
    if (!touch) return false

    const rect = canvas.getBoundingClientRect()
    const mouse = mouseRef.current
    const raycaster = raycastRef.current

    // Convert touch coordinates to normalized device coordinates (-1 to +1)
    mouse.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1

    // Update the raycaster with the camera and mouse position
    raycaster.setFromCamera(mouse, threeCameraRef.current)

    // Calculate objects intersecting the ray
    const intersects = raycaster.intersectObject(satelliteGroupRef.current, true)
    
    return intersects.length > 0
  }





  return (
    <div
      ref={containerRef}
      className="w-full relative overflow-hidden flex items-center justify-center touch-none select-none"
      style={{ 
        aspectRatio: "16/9",
        backgroundColor: "#000000" // Inline style to ensure black background loads immediately
      }}
    >
      {/* Canvas with fixed dimensions to prevent layout shift */}
      <canvas
        ref={canvasRef}
        className="cursor-pointer touch-none select-none"
        width={dimensions.width}
        height={dimensions.height}
        style={{
          width: `${dimensions.width}px`,
          height: `${dimensions.height}px`,
          backgroundColor: '#000000', // Ensure black background always
          opacity: isInitialized ? 1 : 0.95, // Show almost immediately
          transition: 'opacity 0.05s ease-out' // Very fast transition
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onContextMenu={(e) => e.preventDefault()}
      />
      {/* Three.js container with fixed dimensions */}
      <div
        ref={threejsContainerRef}
        className="absolute pointer-events-none"
                  style={{
            width: dimensions.width,
            height: dimensions.height,
            opacity: isInitialized ? 1 : 0,
            transition: 'opacity 0.2s ease-in-out'
          }}
      />
      {/* Loading placeholder to prevent layout shift */}
      {!isInitialized && (
        <div 
          className="absolute inset-0 bg-background"
          style={{
            width: dimensions.width,
            height: dimensions.height,
            backgroundColor: "#000000", // Ensure loading placeholder is black
          }}
        />
      )}
    </div>
  )
} 