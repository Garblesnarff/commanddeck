import { useRef, useEffect, useCallback } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Grid } from '@react-three/drei'
import * as THREE from 'three'
import { useWebSocket } from './hooks/useWebSocket'
import { useAgentStore, useAgents, useMoveIndicators, type Agent, type AgentType } from './stores/agentStore'

const BACKGROUND = '#0f172a'
const LERP_SPEED = 0.06

// Agent type colors
const AGENT_COLORS: Record<AgentType, { primary: string; emissive: string }> = {
  scout: { primary: '#00f3ff', emissive: '#00f3ff' },    // Cyan
  worker: { primary: '#f59e0b', emissive: '#f59e0b' },   // Amber
  coder: { primary: '#8b5cf6', emissive: '#8b5cf6' },    // Purple
  architect: { primary: '#3b82f6', emissive: '#3b82f6' }, // Blue
  debugger: { primary: '#ef4444', emissive: '#ef4444' }   // Red
}

// Status colors
const STATUS_COLORS = {
  idle: '#00ff88',
  moving: '#00ff88',
  working: '#f59e0b',
  error: '#ef4444'
}

// Unit component - renders a single agent
function Unit({ agent }: { agent: Agent }) {
  const groupRef = useRef<THREE.Group>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  const positionRef = useRef(new THREE.Vector3(...agent.position))
  const flashRef = useRef(0)

  const colors = AGENT_COLORS[agent.type]
  const statusColor = STATUS_COLORS[agent.status]

  useFrame((_, delta) => {
    if (!groupRef.current) return

    // Smoothly lerp to target position
    const target = agent.targetPosition
      ? new THREE.Vector3(agent.targetPosition[0], 0.5, agent.targetPosition[2])
      : new THREE.Vector3(positionRef.current.x, 0.5, positionRef.current.z)

    positionRef.current.lerp(target, LERP_SPEED)
    groupRef.current.position.copy(positionRef.current)

    // Update agent position in store when close enough to target
    if (agent.targetPosition) {
      const dist = positionRef.current.distanceTo(target)
      if (dist < 0.1) {
        // Arrived at destination
        useAgentStore.getState().updateAgent(agent.id, {
          position: [positionRef.current.x, positionRef.current.y, positionRef.current.z],
          status: agent.status === 'moving' ? 'idle' : agent.status
        })
      }
    }

    // Rotate selection ring
    if (ringRef.current) {
      ringRef.current.rotation.y += delta * (agent.status === 'working' ? 2 : 0.5)
    }

    // Flash effect decay
    if (flashRef.current > 0) {
      flashRef.current = Math.max(0, flashRef.current - delta * 2)
    }
  })

  return (
    <group ref={groupRef} position={[agent.position[0], 0.5, agent.position[2]]}>
      {/* Main unit body - hexagonal prism */}
      <mesh castShadow>
        <cylinderGeometry args={[0.4, 0.5, 0.8, 6]} />
        <meshStandardMaterial
          color={colors.primary}
          emissive={colors.emissive}
          emissiveIntensity={agent.status === 'working' ? 0.6 : 0.3}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Top cap with glow */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.35, 0.15, 6]} />
        <meshStandardMaterial
          color={colors.primary}
          emissive={colors.emissive}
          emissiveIntensity={agent.status === 'error' ? 1.0 : 0.6}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Inner core light */}
      <pointLight
        color={agent.status === 'error' ? '#ef4444' : colors.primary}
        intensity={agent.status === 'working' ? 4 : 2}
        distance={3}
      />

      {/* Selection ring - rotates around unit */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]} position={[0, -0.4, 0]}>
        <ringGeometry args={[0.7, 0.75, 32]} />
        <meshBasicMaterial color={statusColor} transparent opacity={0.8} side={THREE.DoubleSide} />
      </mesh>

      {/* Selection brackets */}
      <SelectionBrackets color={statusColor} />

      {/* Progress ring for working status */}
      {agent.status === 'working' && agent.progress !== undefined && (
        <ProgressRing progress={agent.progress} />
      )}

      {/* Agent type label (floating text would need troika-three-text, using simple indicator instead) */}
      <mesh position={[0, 1.2, 0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color={colors.primary} />
      </mesh>
    </group>
  )
}

// Progress ring for working agents
function ProgressRing({ progress }: { progress: number }) {
  const ringRef = useRef<THREE.Mesh>(null)
  const progressAngle = (progress / 100) * Math.PI * 2

  return (
    <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
      <ringGeometry args={[0.9, 0.95, 32, 1, 0, progressAngle]} />
      <meshBasicMaterial color="#f59e0b" transparent opacity={0.9} side={THREE.DoubleSide} />
    </mesh>
  )
}

// Corner bracket indicators for selection
function SelectionBrackets({ color }: { color: string }) {
  const size = 0.9
  const bracketLength = 0.2

  const Bracket = ({ position, rotation }: { position: [number, number, number]; rotation: number }) => (
    <group position={position} rotation={[Math.PI / 2, rotation, 0]}>
      <mesh position={[bracketLength / 2, 0, 0]}>
        <boxGeometry args={[bracketLength, 0.02, 0.02]} />
        <meshBasicMaterial color={color} transparent opacity={0.9} />
      </mesh>
      <mesh position={[0, bracketLength / 2, 0]}>
        <boxGeometry args={[0.02, bracketLength, 0.02]} />
        <meshBasicMaterial color={color} transparent opacity={0.9} />
      </mesh>
    </group>
  )

  return (
    <group position={[0, -0.4, 0]}>
      <Bracket position={[-size, 0, -size]} rotation={0} />
      <Bracket position={[size, 0, -size]} rotation={Math.PI / 2} />
      <Bracket position={[size, 0, size]} rotation={Math.PI} />
      <Bracket position={[-size, 0, size]} rotation={-Math.PI / 2} />
    </group>
  )
}

// Move target indicator - pulsing ring on the ground
function MoveIndicator({ position, agentType }: { position: [number, number, number]; agentType?: AgentType }) {
  const ringRef = useRef<THREE.Mesh>(null)
  const outerRingRef = useRef<THREE.Mesh>(null)
  const scaleRef = useRef(1)
  const opacityRef = useRef(1)

  const color = agentType ? AGENT_COLORS[agentType].primary : '#00ff88'

  useFrame((_, delta) => {
    if (!ringRef.current || !outerRingRef.current) return

    // Pulse animation
    scaleRef.current += delta * 2
    opacityRef.current = Math.max(0, 1 - scaleRef.current * 0.3)

    const scale = 1 + scaleRef.current * 0.5
    outerRingRef.current.scale.set(scale, scale, 1)

    const mat = outerRingRef.current.material as THREE.MeshBasicMaterial
    mat.opacity = opacityRef.current * 0.6

    // Reset after fade
    if (opacityRef.current <= 0) {
      scaleRef.current = 1
      opacityRef.current = 1
    }
  })

  return (
    <group position={[position[0], 0.02, position[2]]}>
      {/* Static inner ring */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.15, 0.2, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.8} />
      </mesh>

      {/* Pulsing outer ring */}
      <mesh ref={outerRingRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.3, 0.35, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} />
      </mesh>

      {/* Center cross */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.3, 0.03]} />
        <meshBasicMaterial color={color} transparent opacity={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
        <planeGeometry args={[0.3, 0.03]} />
        <meshBasicMaterial color={color} transparent opacity={0.9} />
      </mesh>
    </group>
  )
}

// Ground plane
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color={BACKGROUND} metalness={0.1} roughness={0.9} />
    </mesh>
  )
}

// All move indicators
function MoveIndicators() {
  const indicators = useMoveIndicators()
  const agents = useAgentStore((state) => state.agents)

  // Auto-clear old indicators
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      indicators.forEach(([id, indicator]) => {
        if (now - indicator.timestamp > 3000) {
          useAgentStore.getState().clearMoveIndicator(id)
        }
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [indicators])

  return (
    <>
      {indicators.map(([agentId, indicator]) => (
        <MoveIndicator
          key={`${agentId}-${indicator.timestamp}`}
          position={indicator.position}
          agentType={agents.get(agentId)?.type}
        />
      ))}
    </>
  )
}

// Main 3D scene
function Scene() {
  const agents = useAgents()

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />

      {/* Subtle cyan accent light */}
      <pointLight position={[0, 10, 0]} color="#00f3ff" intensity={0.5} />

      {/* Ground */}
      <Ground />

      {/* Grid overlay */}
      <Grid
        position={[0, 0.01, 0]}
        args={[100, 100]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#00f3ff"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#00f3ff"
        fadeDistance={50}
        fadeStrength={1}
        followCamera={false}
        infiniteGrid={true}
      />

      {/* Render all agents */}
      {agents.map((agent) => (
        <Unit key={agent.id} agent={agent} />
      ))}

      {/* Move indicators */}
      <MoveIndicators />

      {/* Camera controls */}
      <OrbitControls
        makeDefault
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.5}
        minDistance={5}
        maxDistance={50}
        target={[0, 0, 0]}
      />
    </>
  )
}

function App() {
  const handleEvent = useAgentStore((state) => state.handleEvent)
  const agents = useAgents()

  const onEvent = useCallback((event: Parameters<typeof handleEvent>[0]) => {
    handleEvent(event)
  }, [handleEvent])

  const { connected } = useWebSocket(onEvent)

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: BACKGROUND,
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
        backdropFilter: 'blur(8px)',
        zIndex: 10
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
          <span>UNITS: <span style={{ color: '#00ff88' }}>{agents.length}</span></span>
          <span>UPLINK: <span style={{ color: connected ? '#00ff88' : '#ef4444' }}>
            {connected ? 'CONNECTED' : 'OFFLINE'}
          </span></span>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: connected ? '#00ff88' : '#ef4444',
            boxShadow: `0 0 10px ${connected ? '#00ff88' : '#ef4444'}`,
            animation: connected ? 'pulse 2s infinite' : 'none'
          }} />
        </div>
      </header>

      {/* 3D Canvas */}
      <div style={{ flex: 1, cursor: 'crosshair' }}>
        <Canvas
          shadows
          camera={{
            position: [15, 15, 15],
            fov: 50,
            near: 0.1,
            far: 1000
          }}
          gl={{ antialias: true }}
        >
          <color attach="background" args={[BACKGROUND]} />
          <fog attach="fog" args={[BACKGROUND, 30, 80]} />
          <Scene />
        </Canvas>
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
        color: 'rgba(255,255,255,0.4)',
        zIndex: 10
      }}>
        <span>
          {connected
            ? 'RECEIVING TELEMETRY • DRAG TO ORBIT • SCROLL TO ZOOM'
            : 'WAITING FOR SERVER CONNECTION...'}
        </span>
        <span>TACTICAL_INTERFACE v0.3.0</span>
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
