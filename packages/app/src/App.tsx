import { useRef, useState, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Grid } from '@react-three/drei'
import * as THREE from 'three'

const CYAN = '#00f3ff'
const GREEN = '#00ff88'
const BACKGROUND = '#0f172a'
const LERP_SPEED = 0.08

// Unit component - a sci-fi styled cylinder with glow
function Unit({ targetPosition }: { targetPosition: THREE.Vector3 }) {
  const groupRef = useRef<THREE.Group>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  const positionRef = useRef(new THREE.Vector3(0, 0.5, 0))

  useFrame((_, delta) => {
    if (!groupRef.current) return

    // Smoothly lerp to target position
    const target = new THREE.Vector3(targetPosition.x, 0.5, targetPosition.z)
    positionRef.current.lerp(target, LERP_SPEED)
    groupRef.current.position.copy(positionRef.current)

    // Rotate selection ring
    if (ringRef.current) {
      ringRef.current.rotation.y += delta * 0.5
    }
  })

  return (
    <group ref={groupRef} position={[0, 0.5, 0]}>
      {/* Main unit body - hexagonal prism */}
      <mesh castShadow>
        <cylinderGeometry args={[0.4, 0.5, 0.8, 6]} />
        <meshStandardMaterial
          color={CYAN}
          emissive={CYAN}
          emissiveIntensity={0.3}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Top cap with glow */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.35, 0.15, 6]} />
        <meshStandardMaterial
          color={CYAN}
          emissive={CYAN}
          emissiveIntensity={0.6}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Inner core light */}
      <pointLight color={CYAN} intensity={2} distance={3} />

      {/* Selection ring - rotates around unit */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]} position={[0, -0.4, 0]}>
        <ringGeometry args={[0.7, 0.75, 32]} />
        <meshBasicMaterial color={GREEN} transparent opacity={0.8} side={THREE.DoubleSide} />
      </mesh>

      {/* Selection brackets - 4 corner indicators */}
      <SelectionBrackets />
    </group>
  )
}

// Corner bracket indicators for selection
function SelectionBrackets() {
  const size = 0.9
  const bracketLength = 0.2
  const material = <meshBasicMaterial color={GREEN} transparent opacity={0.9} />

  const Bracket = ({ position, rotation }: { position: [number, number, number]; rotation: number }) => (
    <group position={position} rotation={[Math.PI / 2, rotation, 0]}>
      <mesh position={[bracketLength / 2, 0, 0]}>
        <boxGeometry args={[bracketLength, 0.02, 0.02]} />
        {material}
      </mesh>
      <mesh position={[0, bracketLength / 2, 0]}>
        <boxGeometry args={[0.02, bracketLength, 0.02]} />
        {material}
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
function MoveIndicator({ position, visible }: { position: THREE.Vector3; visible: boolean }) {
  const ringRef = useRef<THREE.Mesh>(null)
  const outerRingRef = useRef<THREE.Mesh>(null)
  const scaleRef = useRef(1)
  const opacityRef = useRef(1)

  useFrame((_, delta) => {
    if (!visible || !ringRef.current || !outerRingRef.current) return

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

  if (!visible) return null

  return (
    <group position={[position.x, 0.02, position.z]}>
      {/* Static inner ring */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.15, 0.2, 32]} />
        <meshBasicMaterial color={GREEN} transparent opacity={0.8} />
      </mesh>

      {/* Pulsing outer ring */}
      <mesh ref={outerRingRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.3, 0.35, 32]} />
        <meshBasicMaterial color={GREEN} transparent opacity={0.6} />
      </mesh>

      {/* Center cross */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.3, 0.03]} />
        <meshBasicMaterial color={GREEN} transparent opacity={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
        <planeGeometry args={[0.3, 0.03]} />
        <meshBasicMaterial color={GREEN} transparent opacity={0.9} />
      </mesh>
    </group>
  )
}

// Ground plane with click detection
function Ground({ onGroundClick }: { onGroundClick: (point: THREE.Vector3) => void }) {
  const meshRef = useRef<THREE.Mesh>(null)

  const handlePointerDown = useCallback((e: THREE.Event & { point: THREE.Vector3 }) => {
    e.stopPropagation()
    onGroundClick(e.point)
  }, [onGroundClick])

  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0]}
      receiveShadow
      onPointerDown={handlePointerDown}
    >
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial
        color={BACKGROUND}
        metalness={0.1}
        roughness={0.9}
      />
    </mesh>
  )
}

// Main 3D scene
function Scene() {
  const [targetPosition, setTargetPosition] = useState(new THREE.Vector3(0, 0, 0))
  const [moveIndicator, setMoveIndicator] = useState({
    position: new THREE.Vector3(),
    visible: false,
    key: 0
  })

  const handleGroundClick = useCallback((point: THREE.Vector3) => {
    setTargetPosition(new THREE.Vector3(point.x, 0, point.z))
    setMoveIndicator({
      position: point.clone(),
      visible: true,
      key: Date.now()
    })
  }, [])

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
      <pointLight position={[0, 10, 0]} color={CYAN} intensity={0.5} />

      {/* Ground */}
      <Ground onGroundClick={handleGroundClick} />

      {/* Grid overlay */}
      <Grid
        position={[0, 0.01, 0]}
        args={[100, 100]}
        cellSize={1}
        cellThickness={0.5}
        cellColor={CYAN}
        sectionSize={5}
        sectionThickness={1}
        sectionColor={CYAN}
        fadeDistance={50}
        fadeStrength={1}
        followCamera={false}
        infiniteGrid={true}
      />

      {/* Unit */}
      <Unit targetPosition={targetPosition} />

      {/* Move indicator */}
      <MoveIndicator
        key={moveIndicator.key}
        position={moveIndicator.position}
        visible={moveIndicator.visible}
      />

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
        <span>CLICK GROUND TO MOVE UNIT • DRAG TO ORBIT • SCROLL TO ZOOM</span>
        <span>TACTICAL_INTERFACE v0.2.0</span>
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
