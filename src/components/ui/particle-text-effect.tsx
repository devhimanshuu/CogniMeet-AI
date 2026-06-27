"use client"

import { useEffect, useRef } from "react"

interface Vector2D {
  x: number
  y: number
}

class Particle {
  pos: Vector2D = { x: 0, y: 0 }
  vel: Vector2D = { x: 0, y: 0 }
  acc: Vector2D = { x: 0, y: 0 }
  target: Vector2D = { x: 0, y: 0 }

  closeEnoughTarget = 100
  maxSpeed = 1.0
  maxForce = 0.1
  particleSize = 2
  alpha = 1.0
  isKilled = false
  isStar = Math.random() < 0.05
  twinkleOffset = Math.random() * Math.PI * 2

  startColor = { r: 0, g: 0, b: 0 }
  targetColor = { r: 0, g: 0, b: 0 }
  colorWeight = 0
  colorBlendRate = 0.01

  move(mouse: { x: number, y: number, isPressed: boolean, isHovered: boolean, canvasWidth: number }) {
    // 1. Calculate base target with subtle drift for organic feel
    const time = Date.now() * 0.001;
    const driftX = Math.sin(time * 1.5 + this.target.y * 0.05) * 2;
    const driftY = Math.cos(time * 1.2 + this.target.x * 0.05) * 2;
    
    const effectiveTarget = {
      x: this.target.x + driftX,
      y: this.target.y + driftY,
    };

    // Check if particle is close enough to its target to slow down
    let proximityMult = 1
    const distance = Math.sqrt(Math.pow(this.pos.x - effectiveTarget.x, 2) + Math.pow(this.pos.y - effectiveTarget.y, 2))

    if (distance < this.closeEnoughTarget) {
      proximityMult = distance / this.closeEnoughTarget
    }

    // Add force towards target
    const towardsTarget = {
      x: effectiveTarget.x - this.pos.x,
      y: effectiveTarget.y - this.pos.y,
    }

    const magnitude = Math.sqrt(towardsTarget.x * towardsTarget.x + towardsTarget.y * towardsTarget.y)
    
    let targetSteerX = 0;
    let targetSteerY = 0;
    
    if (magnitude > 0) {
      targetSteerX = (towardsTarget.x / magnitude) * this.maxSpeed * proximityMult
      targetSteerY = (towardsTarget.y / magnitude) * this.maxSpeed * proximityMult
      
      // Premium Vortex Effect: If particle is far from target (word transition), spiral in
      if (distance > 100) {
        const swirlStrength = Math.min((distance - 100) * 0.005, 1.5);
        // Add tangent vector (y, -x) to create a swirling tornado motion
        targetSteerX += (towardsTarget.y / magnitude) * swirlStrength * this.maxSpeed;
        targetSteerY -= (towardsTarget.x / magnitude) * swirlStrength * this.maxSpeed;
      }
    }

    const steer = {
      x: targetSteerX - this.vel.x,
      y: targetSteerY - this.vel.y,
    }

    const steerMagnitude = Math.sqrt(steer.x * steer.x + steer.y * steer.y)
    if (steerMagnitude > 0) {
      steer.x = (steer.x / steerMagnitude) * this.maxForce
      steer.y = (steer.y / steerMagnitude) * this.maxForce
    }

    this.acc.x += steer.x
    this.acc.y += steer.y

    // Mouse Repel Force (Premium Interaction)
    if (mouse.isHovered) {
      const dx = this.pos.x - mouse.x;
      const dy = this.pos.y - mouse.y;
      const mouseDistSq = dx * dx + dy * dy;
      
      const isMobile = mouse.canvasWidth < 768;
      // Explosive force on click, gentle repel on hover (scaled for screen size)
      const repelRadius = mouse.isPressed ? (isMobile ? 120 : 250) : (isMobile ? 60 : 100);
      const repelForce = mouse.isPressed ? (isMobile ? 15 : 25) : 3;
      
      if (mouseDistSq < repelRadius * repelRadius && mouseDistSq > 0) {
        const mouseDist = Math.sqrt(mouseDistSq);
        const force = (repelRadius - mouseDist) / repelRadius;
        this.acc.x += (dx / mouseDist) * force * repelForce;
        this.acc.y += (dy / mouseDist) * force * repelForce;
        
        // Flash colors on interaction
        this.colorWeight = 0;
        if (mouse.isPressed) {
          this.startColor = { r: 52, g: 211, b: 153 }; // Emerald
        } else {
          this.startColor = { r: 6, g: 182, b: 212 }; // Cyan
        }
      }
    }

    // Move particle with friction
    this.vel.x += this.acc.x
    this.vel.y += this.acc.y
    this.vel.x *= 0.92; // Friction for smooth settling
    this.vel.y *= 0.92;
    
    this.pos.x += this.vel.x
    this.pos.y += this.vel.y
    this.acc.x = 0
    this.acc.y = 0
  }

  draw(ctx: CanvasRenderingContext2D, drawAsPoints: boolean) {
    // Blend towards target color
    if (this.colorWeight < 1.0) {
      this.colorWeight = Math.min(this.colorWeight + this.colorBlendRate, 1.0)
    }

    // Calculate current color
    const currentColor = {
      r: Math.round(this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight),
      g: Math.round(this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight),
      b: Math.round(this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight),
    }

    let currentAlpha = this.alpha;
    let r = currentColor.r;
    let g = currentColor.g;
    let b = currentColor.b;
    
    // Premium Twinkle Effect
    if (this.isStar) {
      const twinkle = Math.sin(Date.now() * 0.003 + this.twinkleOffset);
      if (twinkle > 0.8) {
        // Pulse to pure white and full opacity
        currentAlpha = 1.0;
        r = 255; g = 255; b = 255;
      }
    }

    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${currentAlpha})`
    if (drawAsPoints) {
      ctx.fillRect(this.pos.x, this.pos.y, this.particleSize, this.particleSize)
    } else {
      ctx.beginPath()
      ctx.arc(this.pos.x, this.pos.y, this.particleSize / 2, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  kill(width: number, height: number) {
    if (!this.isKilled) {
      // Set target outside the scene
      const randomPos = this.generateRandomPos(width / 2, height / 2, (width + height) / 2)
      this.target.x = randomPos.x
      this.target.y = randomPos.y

      // Begin blending color to black
      this.startColor = {
        r: this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight,
        g: this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight,
        b: this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight,
      }
      this.targetColor = { r: 0, g: 0, b: 0 }
      this.colorWeight = 0

      this.isKilled = true
    }
  }

  private generateRandomPos(x: number, y: number, mag: number): Vector2D {
    const randomX = Math.random() * 1000
    const randomY = Math.random() * 500

    const direction = {
      x: randomX - x,
      y: randomY - y,
    }

    const magnitude = Math.sqrt(direction.x * direction.x + direction.y * direction.y)
    if (magnitude > 0) {
      direction.x = (direction.x / magnitude) * mag
      direction.y = (direction.y / magnitude) * mag
    }

    return {
      x: x + direction.x,
      y: y + direction.y,
    }
  }
}

interface ParticleTextEffectProps {
  words?: string[]
}

const DEFAULT_WORDS = ["HELLO", "21st.dev", "ParticleTextEffect", "BY", "KAINXU"]

export function ParticleTextEffect({ words = DEFAULT_WORDS }: ParticleTextEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const particlesRef = useRef<Particle[]>([])
  const frameCountRef = useRef(0)
  const wordIndexRef = useRef(0)
  const wordsRef = useRef(words)
  useEffect(() => {
    wordsRef.current = words
  }, [words])

  const mouseRef = useRef({ x: -1000, y: -1000, isPressed: false, isHovered: false })
  const drawAsPoints = true

  const generateRandomPos = (x: number, y: number, mag: number): Vector2D => {
    const randomX = Math.random() * 1000
    const randomY = Math.random() * 500

    const direction = {
      x: randomX - x,
      y: randomY - y,
    }

    const magnitude = Math.sqrt(direction.x * direction.x + direction.y * direction.y)
    if (magnitude > 0) {
      direction.x = (direction.x / magnitude) * mag
      direction.y = (direction.y / magnitude) * mag
    }

    return {
      x: x + direction.x,
      y: y + direction.y,
    }
  }

  const nextWord = (word: string, canvas: HTMLCanvasElement) => {
    // const ctx = canvas.getContext("2d")!

    // Create off-screen canvas for text rendering
    const offscreenCanvas = document.createElement("canvas")
    offscreenCanvas.width = canvas.width
    offscreenCanvas.height = canvas.height
    const offscreenCtx = offscreenCanvas.getContext("2d", { willReadFrequently: true })!

    // Draw text
    offscreenCtx.fillStyle = "white"
    
    // Responsive base font size
    let fontSize = Math.min(canvas.width * 0.15, 180)
    offscreenCtx.font = `bold ${fontSize}px Arial`
    const textWidth = offscreenCtx.measureText(word).width
    
    const maxWidth = canvas.width * 0.85
    if (textWidth > maxWidth) {
      fontSize = Math.floor(fontSize * (maxWidth / textWidth))
      fontSize = Math.max(fontSize, 24) // Ensure it doesn't get too small on mobile
      offscreenCtx.font = `bold ${fontSize}px Arial`
    }
    
    offscreenCtx.textAlign = "center"
    offscreenCtx.textBaseline = "middle"
    offscreenCtx.fillText(word, canvas.width / 2, canvas.height / 2)

    const imageData = offscreenCtx.getImageData(0, 0, canvas.width, canvas.height)
    const pixels = imageData.data

    // Generate new color
    const newColor = {
      r: Math.random() * 255,
      g: Math.random() * 255,
      b: Math.random() * 255,
    }

    const particles = particlesRef.current
    let particleIndex = 0

    const isMobile = canvas.width < 768
    const currentPixelSteps = isMobile ? 3 : 2

    // Collect coordinates
    const coordsIndexes: number[] = []
    for (let y = 0; y < canvas.height; y += currentPixelSteps) {
      for (let x = 0; x < canvas.width; x += currentPixelSteps) {
        const i = (y * canvas.width + x) * 4
        coordsIndexes.push(i)
      }
    }

    // Shuffle coordinates for fluid motion
    for (let i = coordsIndexes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
        ;[coordsIndexes[i], coordsIndexes[j]] = [coordsIndexes[j], coordsIndexes[i]]
    }

    for (const coordIndex of coordsIndexes) {
      const pixelIndex = coordIndex
      const alpha = pixels[pixelIndex + 3]

      if (alpha > 128) {
        const x = (pixelIndex / 4) % canvas.width
        const y = Math.floor(pixelIndex / 4 / canvas.width)

        let particle: Particle

        if (particleIndex < particles.length) {
          particle = particles[particleIndex]
          particle.isKilled = false
          particleIndex++
        } else {
          particle = new Particle()

          const randomPos = generateRandomPos(canvas.width / 2, canvas.height / 2, (canvas.width + canvas.height) / 2)
          particle.pos.x = randomPos.x
          particle.pos.y = randomPos.y

          particle.maxSpeed = Math.random() * 6 + 4
          particle.maxForce = particle.maxSpeed * 0.05
          particle.particleSize = Math.random() * (isMobile ? 1.5 : 2) + (isMobile ? 0.5 : 1)
          particle.alpha = Math.random() * 0.5 + 0.5
          particle.isStar = Math.random() < 0.05
          particle.twinkleOffset = Math.random() * Math.PI * 2
          particle.colorBlendRate = Math.random() * 0.0275 + 0.0025

          particles.push(particle)
        }

        // Set color transition
        particle.startColor = {
          r: particle.startColor.r + (particle.targetColor.r - particle.startColor.r) * particle.colorWeight,
          g: particle.startColor.g + (particle.targetColor.g - particle.startColor.g) * particle.colorWeight,
          b: particle.startColor.b + (particle.targetColor.b - particle.startColor.b) * particle.colorWeight,
        }
        particle.targetColor = newColor
        particle.colorWeight = 0

        particle.target.x = x
        particle.target.y = y
      }
    }

    // Kill remaining particles
    for (let i = particleIndex; i < particles.length; i++) {
      particles[i].kill(canvas.width, canvas.height)
    }
  }

  const animate = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")!
    const particles = particlesRef.current

    // Background with motion blur (dark theme background)
    ctx.fillStyle = "rgba(10, 14, 26, 0.1)" // #0a0e1a matches --background
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const mouseState = { ...mouseRef.current, canvasWidth: canvas.width }

    // Premium Mouse Glow Aura
    if (mouseState.isHovered) {
      const glowRadius = mouseState.isPressed ? 300 : 150;
      const gradient = ctx.createRadialGradient(
        mouseState.x, mouseState.y, 0,
        mouseState.x, mouseState.y, glowRadius
      );
      
      if (mouseState.isPressed) {
        gradient.addColorStop(0, "rgba(52, 211, 153, 0.15)"); // Emerald glow
      } else {
        gradient.addColorStop(0, "rgba(6, 182, 212, 0.1)"); // Cyan glow
      }
      gradient.addColorStop(1, "rgba(10, 14, 26, 0)");
      
      ctx.globalCompositeOperation = "screen";
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "source-over";
    }

    // Update and draw particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const particle = particles[i]
      particle.move(mouseState)
      particle.draw(ctx, drawAsPoints)

      // Remove dead particles that are out of bounds
      if (particle.isKilled) {
        if (
          particle.pos.x < 0 ||
          particle.pos.x > canvas.width ||
          particle.pos.y < 0 ||
          particle.pos.y > canvas.height
        ) {
          particles.splice(i, 1)
        }
      }
    }

    // Auto-advance words
    frameCountRef.current++
    if (frameCountRef.current % 240 === 0) {
      wordIndexRef.current = (wordIndexRef.current + 1) % wordsRef.current.length
      nextWord(wordsRef.current[wordIndexRef.current], canvas)
    }

    animationRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      // Re-initialize word on resize to ensure it stays centered
      nextWord(wordsRef.current[wordIndexRef.current], canvas)
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    // Start animation
    animate()

    // Mouse event handlers
    const handleMouseDown = (e: MouseEvent) => {
      mouseRef.current.isPressed = true
      const rect = canvas.getBoundingClientRect()
      mouseRef.current.x = e.clientX - rect.left
      mouseRef.current.y = e.clientY - rect.top
    }

    const handleMouseUp = () => {
      mouseRef.current.isPressed = false
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.isHovered = true
      const rect = canvas.getBoundingClientRect()
      mouseRef.current.x = e.clientX - rect.left
      mouseRef.current.y = e.clientY - rect.top
    }

    const handleMouseLeave = () => {
      mouseRef.current.isHovered = false
      mouseRef.current.isPressed = false
    }

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
    }

    canvas.addEventListener("mousedown", handleMouseDown)
    canvas.addEventListener("mouseup", handleMouseUp)
    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("mouseleave", handleMouseLeave)
    canvas.addEventListener("contextmenu", handleContextMenu)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener("resize", handleResize)
      canvas.removeEventListener("mousedown", handleMouseDown)
      canvas.removeEventListener("mouseup", handleMouseUp)
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("mouseleave", handleMouseLeave)
      canvas.removeEventListener("contextmenu", handleContextMenu)
    }
  }, [])

  return (
    <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-auto">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
    </div>
  )
}
