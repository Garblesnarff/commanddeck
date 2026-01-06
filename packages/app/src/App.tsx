import { useRef, useState, useCallback, useEffect } from 'react'
import { Application, extend, useApplication, useTick } from '@pixi/react'
import { Container, Graphics } from 'pixi.js'

extend({ Container, Graphics })

const CYAN = 0x00f3ff
const GREEN = 0x00ff88
const BACKGROUND = 0x0f172a
const LERP_SPEED = 0.08

interface UnitProps {
  targetX: number
  targetY: number
  onPositionUpdate: (x: number, y: number) => void
}

function Unit({ targetX, targetY, onPositionUpdate }: UnitProps) {
  const posRef = useRef({ x: 400, y: 300 })
  const graphicsRef = useRef<Graphics>(null)
  const selectionRef = useRef<Graphics>(null)
  const rotationRef = useRef(0)

  useTick((ticker) => {
    const pos = posRef.current
    const dx = targetX - pos.x
    const dy = targetY - pos.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance > 1) {
      pos.x += dx * LERP_SPEED
      pos.y += dy * LERP_SPEED
      onPositionUpdate(pos.x, pos.y)
    }

    rotationRef.current += ticker.deltaTime * 0.02

    if (graphicsRef.current) {
      const g = graphicsRef.current
      g.clear()
      g.position.set(pos.x, pos.y)

      // Unit body - hexagonal shape
      g.fill({ color: CYAN, alpha: 0.3 })
      g.stroke({ color: CYAN, width: 2 })
      const size = 20
      g.poly([
        size, 0,
        size * 0.5, size * 0.866,
        -size * 0.5, size * 0.866,
        -size, 0,
        -size * 0.5, -size * 0.866,
        size * 0.5, -size * 0.866
      ])
      g.fill()
      g.stroke()

      // Inner diamond
      g.fill({ color: CYAN, alpha: 0.8 })
      const innerSize = 8
      g.poly([
        0, -innerSize,
        innerSize, 0,
        0, innerSize,
        -innerSize, 0
      ])
      g.fill()

      // Direction indicator
      g.stroke({ color: CYAN, width: 2 })
      g.moveTo(0, -size - 5)
      g.lineTo(0, -size - 15)
      g.stroke()
    }

    if (selectionRef.current) {
      const s = selectionRef.current
      s.clear()
      s.position.set(pos.x, pos.y)
      s.rotation = rotationRef.current

      // Rotating selection ring
      s.stroke({ color: GREEN, width: 2, alpha: 0.8 })
      s.arc(0, 0, 35, 0, Math.PI * 0.5)
      s.stroke()

      s.stroke({ color: GREEN, width: 2, alpha: 0.6 })
      s.arc(0, 0, 35, Math.PI, Math.PI * 1.5)
      s.stroke()

      // Corner brackets
      const bracketSize = 8
      const offset = 40
      s.stroke({ color: GREEN, width: 1.5, alpha: 0.9 })

      // Top-left
      s.moveTo(-offset, -offset + bracketSize)
      s.lineTo(-offset, -offset)
      s.lineTo(-offset + bracketSize, -offset)
      s.stroke()

      // Top-right
      s.moveTo(offset - bracketSize, -offset)
      s.lineTo(offset, -offset)
      s.lineTo(offset, -offset + bracketSize)
      s.stroke()

      // Bottom-left
      s.moveTo(-offset, offset - bracketSize)
      s.lineTo(-offset, offset)
      s.lineTo(-offset + bracketSize, offset)
      s.stroke()

      // Bottom-right
      s.moveTo(offset - bracketSize, offset)
      s.lineTo(offset, offset)
      s.lineTo(offset, offset - bracketSize)
      s.stroke()
    }
  })

  return (
    <>
      <pixiGraphics ref={selectionRef} />
      <pixiGraphics ref={graphicsRef} />
    </>
  )
}

function MoveIndicator({ x, y, visible }: { x: number; y: number; visible: boolean }) {
  const graphicsRef = useRef<Graphics>(null)
  const alphaRef = useRef(1)

  useTick(() => {
    if (graphicsRef.current) {
      const g = graphicsRef.current
      g.clear()

      if (visible && alphaRef.current > 0) {
        alphaRef.current = Math.max(0, alphaRef.current - 0.02)

        g.position.set(x, y)
        const alpha = alphaRef.current

        // Pulsing ring
        g.stroke({ color: GREEN, width: 2, alpha: alpha * 0.8 })
        g.circle(0, 0, 15 + (1 - alpha) * 20)
        g.stroke()

        // Center cross
        g.stroke({ color: GREEN, width: 1, alpha })
        g.moveTo(-8, 0)
        g.lineTo(8, 0)
        g.moveTo(0, -8)
        g.lineTo(0, 8)
        g.stroke()
      }
    }
  })

  useEffect(() => {
    if (visible) {
      alphaRef.current = 1
    }
  }, [x, y, visible])

  return <pixiGraphics ref={graphicsRef} />
}

function GridBackground() {
  const graphicsRef = useRef<Graphics>(null)
  const { app } = useApplication()

  useEffect(() => {
    if (graphicsRef.current && app) {
      const g = graphicsRef.current
      g.clear()

      const width = app.screen.width
      const height = app.screen.height
      const gridSize = 50

      // Grid lines
      g.stroke({ color: CYAN, width: 1, alpha: 0.1 })

      for (let x = 0; x <= width; x += gridSize) {
        g.moveTo(x, 0)
        g.lineTo(x, height)
      }

      for (let y = 0; y <= height; y += gridSize) {
        g.moveTo(0, y)
        g.lineTo(width, y)
      }
      g.stroke()

      // Subtle gradient overlay from edges
      g.fill({ color: BACKGROUND, alpha: 0.5 })
      g.rect(0, 0, 100, height)
      g.rect(width - 100, 0, 100, height)
      g.fill()
    }
  }, [app])

  return <pixiGraphics ref={graphicsRef} />
}

function Scene() {
  const { app } = useApplication()
  const [target, setTarget] = useState({ x: 400, y: 300 })
  const [unitPos, setUnitPos] = useState({ x: 400, y: 300 })
  const [moveIndicator, setMoveIndicator] = useState({ x: 0, y: 0, visible: false, key: 0 })

  const handleClick = useCallback((e: PointerEvent) => {
    if (app) {
      const rect = app.canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      setTarget({ x, y })
      setMoveIndicator({ x, y, visible: true, key: Date.now() })
    }
  }, [app])

  useEffect(() => {
    if (app) {
      app.canvas.addEventListener('pointerdown', handleClick)
      return () => app.canvas.removeEventListener('pointerdown', handleClick)
    }
  }, [app, handleClick])

  return (
    <>
      <GridBackground />
      <MoveIndicator
        x={moveIndicator.x}
        y={moveIndicator.y}
        visible={moveIndicator.visible}
        key={moveIndicator.key}
      />
      <Unit
        targetX={target.x}
        targetY={target.y}
        onPositionUpdate={(x, y) => setUnitPos({ x, y })}
      />
    </>
  )
}

function App() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        })
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: '#0f172a',
      fontFamily: "'Orbitron', sans-serif"
    }}>
      {/* Header Bar */}
      <header style={{
        height: '48px',
        background: 'linear-gradient(180deg, rgba(0,243,255,0.1) 0%, rgba(15,23,42,0.95) 100%)',
        borderBottom: '1px solid rgba(0,243,255,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        backdropFilter: 'blur(8px)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            border: '2px solid #00f3ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            <span style={{
              fontWeight: 900,
              color: '#00f3ff',
              fontSize: '14px',
              fontStyle: 'italic'
            }}>CD</span>
          </div>
          <span style={{
            fontSize: '14px',
            fontWeight: 700,
            letterSpacing: '2px',
            color: '#fff'
          }}>
            COMMAND_DECK <span style={{ color: '#00f3ff' }}>//</span> SYSTEM_ONLINE
          </span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          fontSize: '10px',
          letterSpacing: '1px',
          color: 'rgba(255,255,255,0.5)'
        }}>
          <span>UNITS: <span style={{ color: '#00ff88' }}>1</span></span>
          <span>STATUS: <span style={{ color: '#00ff88' }}>NOMINAL</span></span>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#00ff88',
            boxShadow: '0 0 10px #00ff88',
            animation: 'pulse 2s infinite'
          }} />
        </div>
      </header>

      {/* Canvas Container */}
      <div
        ref={containerRef}
        style={{
          flex: 1,
          position: 'relative',
          cursor: 'crosshair'
        }}
      >
        <Application
          width={dimensions.width}
          height={dimensions.height}
          backgroundColor={BACKGROUND}
          antialias={true}
          resolution={window.devicePixelRatio || 1}
          autoDensity={true}
        >
          <Scene />
        </Application>
      </div>

      {/* Bottom Status Bar */}
      <footer style={{
        height: '32px',
        background: 'rgba(0,0,0,0.5)',
        borderTop: '1px solid rgba(0,243,255,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        fontSize: '9px',
        letterSpacing: '1px',
        color: 'rgba(255,255,255,0.4)'
      }}>
        <span>CLICK TO MOVE UNIT</span>
        <span>TACTICAL_INTERFACE v0.1.0</span>
      </footer>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}

export default App
