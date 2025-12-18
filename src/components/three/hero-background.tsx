"use client";

import { useRef, useMemo, useState, useCallback, useEffect } from "react";
import { Canvas, useFrame, ThreeEvent } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { useTheme } from "next-themes";
import * as THREE from "three";

// ============================================================================
// TYPES
// ============================================================================

interface AsteroidData {
  id: number;
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: number;
  velocity: THREE.Vector3;
  rotationSpeed: THREE.Vector3;
  exploding: boolean;
  explodeProgress: number;
}

interface CometData {
  id: number;
  progress: number;
  speed: number;
  active: boolean;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const ASTEROID_COUNT = 10;
const STAR_COUNT = 350;
const EXPLOSION_PARTICLE_COUNT = 14;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function createAsteroid(id: number, width: number, height: number): AsteroidData {
  // Avoid center area where text/buttons are
  // Spawn asteroids only in outer regions
  const isHorizontalEdge = Math.random() > 0.5;
  
  let x: number;
  let y: number;
  
  if (isHorizontalEdge) {
    // Spawn on left or right edges
    const isLeft = Math.random() > 0.5;
    x = isLeft 
      ? -width * 0.3 - Math.random() * width * 0.15  // Left edge
      : width * 0.3 + Math.random() * width * 0.15;   // Right edge
    y = (Math.random() - 0.5) * height * 0.75;
  } else {
    // Spawn on top or bottom edges
    const isTop = Math.random() > 0.5;
    y = isTop
      ? height * 0.25 + Math.random() * height * 0.25  // Top edge
      : -height * 0.25 - Math.random() * height * 0.25; // Bottom edge
    x = (Math.random() - 0.5) * width * 0.75;
  }
  
  return {
    id,
    position: new THREE.Vector3(
      x,
      y,
      -1.5 - Math.random() * 1.5
    ),
    rotation: new THREE.Euler(
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2
    ),
    scale: 0.15 + Math.random() * 0.12,
    velocity: new THREE.Vector3(
      (Math.random() - 0.5) * 0.004,
      (Math.random() - 0.5) * 0.004,
      0
    ),
    rotationSpeed: new THREE.Vector3(
      (Math.random() - 0.5) * 0.008,
      (Math.random() - 0.5) * 0.008,
      (Math.random() - 0.5) * 0.008
    ),
    exploding: false,
    explodeProgress: 0,
  };
}

// ============================================================================
// BUCKMINSTERFULLERENE ASTEROID - Beautiful wireframe geodesic style
// ============================================================================

function AsteroidMesh({
  data,
  isDark,
  onDestroy,
}: {
  data: AsteroidData;
  isDark: boolean;
  onDestroy: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (meshRef.current && !data.exploding) {
      meshRef.current.rotation.x += data.rotationSpeed.x;
      meshRef.current.rotation.y += data.rotationSpeed.y;
      meshRef.current.rotation.z += data.rotationSpeed.z;
    }
  });

  if (data.exploding) {
    return (
      <ExplosionEffect
        position={data.position}
        progress={data.explodeProgress}
        isDark={isDark}
      />
    );
  }

  // Buckminsterfullerene style - neon wireframe
  const baseColor = isDark ? "#00f3ff" : "#1f2937";
  const hoverColor = isDark ? "#ff00ff" : "#000000";

  return (
    <mesh
      ref={meshRef}
      position={data.position}
      scale={hovered ? data.scale * 1.2 : data.scale}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        onDestroy();
      }}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "crosshair";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "default";
      }}
    >
      {/* Icosahedron for buckminsterfullerene-like appearance */}
      <icosahedronGeometry args={[1, 1]} />
      <meshBasicMaterial
        color={hovered ? hoverColor : baseColor}
        wireframe
        transparent
        opacity={hovered ? 1 : 0.85}
      />
    </mesh>
  );
}

// ============================================================================
// EXPLOSION EFFECT
// ============================================================================

function ExplosionEffect({
  position,
  progress,
  isDark,
}: {
  position: THREE.Vector3;
  progress: number;
  isDark: boolean;
}) {
  const particles = useMemo(
    () =>
      Array.from({ length: EXPLOSION_PARTICLE_COUNT }, () => ({
        direction: new THREE.Vector3(
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2
        ).normalize(),
        speed: 0.4 + Math.random() * 0.5,
        size: 0.02 + Math.random() * 0.02,
      })),
    []
  );

  const color = isDark ? "#ff00ff" : "#374151";

  return (
    <group position={position}>
      {particles.map((p, i) => {
        const particlePos = p.direction.clone().multiplyScalar(progress * p.speed);
        return (
          <mesh
            key={i}
            position={[particlePos.x, particlePos.y, particlePos.z]}
            scale={p.size * (1 - progress * 0.6)}
          >
            <icosahedronGeometry args={[1, 0]} />
            <meshBasicMaterial
              color={color}
              wireframe
              transparent
              opacity={(1 - progress) * 0.9}
            />
          </mesh>
        );
      })}
      {/* Central flash */}
      <mesh scale={0.1 * (1 - progress)}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={(1 - progress) * 0.8} />
      </mesh>
    </group>
  );
}

// ============================================================================
// ASTEROIDS SCENE
// ============================================================================

function AsteroidsScene({
  asteroids,
  setAsteroids,
  isDark,
}: {
  asteroids: AsteroidData[];
  setAsteroids: React.Dispatch<React.SetStateAction<AsteroidData[]>>;
  isDark: boolean;
}) {
  useFrame((state) => {
    const viewport = state.viewport;
    setAsteroids((prev) =>
      prev.map((asteroid) => {
        if (asteroid.exploding) {
          const newProgress = asteroid.explodeProgress + 0.035;
          if (newProgress >= 1) {
            return createAsteroid(asteroid.id, viewport.width, viewport.height);
          }
          return { ...asteroid, explodeProgress: newProgress };
        }

        const newPosition = asteroid.position.clone().add(asteroid.velocity);
        const hw = viewport.width / 2 + 0.5;
        const hh = viewport.height / 2 + 0.5;
        if (newPosition.x > hw) newPosition.x = -hw;
        if (newPosition.x < -hw) newPosition.x = hw;
        if (newPosition.y > hh) newPosition.y = -hh;
        if (newPosition.y < -hh) newPosition.y = hh;

        return { ...asteroid, position: newPosition };
      })
    );
  });

  const handleDestroy = useCallback(
    (id: number) => {
      setAsteroids((prev) =>
        prev.map((asteroid) =>
          asteroid.id === id
            ? { ...asteroid, exploding: true, explodeProgress: 0 }
            : asteroid
        )
      );
      // Dispatch custom event for game tracking
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("asteroid-destroyed"));
      }
    },
    [setAsteroids]
  );

  return (
    <>
      {asteroids.map((asteroid) => (
        <AsteroidMesh
          key={asteroid.id}
          data={asteroid}
          isDark={isDark}
          onDestroy={() => handleDestroy(asteroid.id)}
        />
      ))}
    </>
  );
}

// ============================================================================
// STAR FIELD WITH TWINKLING
// ============================================================================

function StarField({ isDark }: { isDark: boolean }) {
  const starsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(STAR_COUNT * 3);
    for (let i = 0; i < STAR_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 2] = -5 - Math.random() * 4;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (starsRef.current) {
      starsRef.current.rotation.z = state.clock.elapsedTime * 0.001;
      const material = starsRef.current.material as THREE.PointsMaterial;
      const baseOpacity = isDark ? 0.8 : 0.3;
      const twinkle = Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
      material.opacity = baseOpacity + twinkle;
    }
  });

  const starColor = isDark ? "#ffffff" : "#6b7280";

  return (
    <Points ref={starsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={starColor}
        size={isDark ? 0.012 : 0.008}
        sizeAttenuation
        opacity={isDark ? 0.8 : 0.3}
        depthWrite={false}
      />
    </Points>
  );
}

// ============================================================================
// DIAGONAL COMET - Works in both themes
// ============================================================================

function DiagonalComet({ isDark }: { isDark: boolean }) {
  const [comet, setComet] = useState<CometData | null>(null);

  useEffect(() => {
    const spawnComet = () => {
      setComet({
        id: Date.now(),
        progress: 0,
        speed: 0.004 + Math.random() * 0.003,
        active: true,
      });
    };

    // Initial delay
    const initialTimeout = setTimeout(spawnComet, 2000);
    // Respawn every 8-12 seconds
    const interval = setInterval(spawnComet, 8000 + Math.random() * 4000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  useFrame(() => {
    if (comet && comet.active) {
      setComet((prev) => {
        if (!prev) return null;
        const newProgress = prev.progress + prev.speed;
        if (newProgress >= 1) {
          return { ...prev, active: false };
        }
        return { ...prev, progress: newProgress };
      });
    }
  });

  if (!comet || !comet.active) return null;

  // Diagonal path from top-left to bottom-right
  const startPos = new THREE.Vector3(-7, 4, -4);
  const endPos = new THREE.Vector3(7, -4, -4);
  const currentPos = new THREE.Vector3().lerpVectors(startPos, endPos, comet.progress);

  // Theme-appropriate colors
  const headColor = isDark ? "#00f3ff" : "#1f2937";
  const tailColor = isDark ? "#bc13fe" : "#6b7280";

  return (
    <group>
      {/* Comet head */}
      <mesh position={currentPos} scale={0.06}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshBasicMaterial color={headColor} transparent opacity={0.95} />
      </mesh>
      
      {/* Comet tail */}
      {[0.02, 0.04, 0.07, 0.11, 0.16, 0.22, 0.29, 0.37].map((offset, i) => {
        const trailPos = new THREE.Vector3().lerpVectors(
          startPos,
          endPos,
          Math.max(0, comet.progress - offset)
        );
        const size = 0.05 * (1 - i * 0.1);
        const opacity = 0.7 * (1 - i * 0.12);
        
        return (
          <mesh key={i} position={trailPos} scale={size}>
            <sphereGeometry args={[1, 8, 8]} />
            <meshBasicMaterial color={tailColor} transparent opacity={opacity} />
          </mesh>
        );
      })}
    </group>
  );
}

// ============================================================================
// DARK MODE EXCLUSIVE: Nebula Glow Orbs
// ============================================================================

function NebulaGlow() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.002;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -8]}>
      {/* Subtle nebula patches */}
      <mesh position={[-4, 2, 0]} scale={2}>
        <circleGeometry args={[1, 32]} />
        <meshBasicMaterial color="#1e1b4b" transparent opacity={0.15} />
      </mesh>
      <mesh position={[3, -1.5, 0]} scale={1.5}>
        <circleGeometry args={[1, 32]} />
        <meshBasicMaterial color="#312e81" transparent opacity={0.12} />
      </mesh>
      <mesh position={[0, 3, 0]} scale={1.8}>
        <circleGeometry args={[1, 32]} />
        <meshBasicMaterial color="#4c1d95" transparent opacity={0.1} />
      </mesh>
    </group>
  );
}

// ============================================================================
// LIGHT MODE EXCLUSIVE: Subtle Sun Rays
// ============================================================================

function SunRays() {
  const raysRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (raysRef.current) {
      raysRef.current.rotation.z = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <group ref={raysRef} position={[5, 3, -7]}>
      {/* Central sun glow */}
      <mesh scale={0.8}>
        <circleGeometry args={[1, 32]} />
        <meshBasicMaterial color="#fef3c7" transparent opacity={0.15} />
      </mesh>
      {/* Outer glow */}
      <mesh scale={1.5}>
        <circleGeometry args={[1, 32]} />
        <meshBasicMaterial color="#fef9c3" transparent opacity={0.08} />
      </mesh>
      {/* Rays */}
      {[0, 45, 90, 135].map((angle, i) => (
        <mesh
          key={i}
          rotation={[0, 0, (angle * Math.PI) / 180]}
          position={[0, 0, 0.1]}
        >
          <planeGeometry args={[0.05, 3]} />
          <meshBasicMaterial color="#fcd34d" transparent opacity={0.06} />
        </mesh>
      ))}
    </group>
  );
}

// ============================================================================
// MAIN SCENE
// ============================================================================

function Scene({
  asteroids,
  setAsteroids,
  isDark,
  isGameActive,
}: {
  asteroids: AsteroidData[];
  setAsteroids: React.Dispatch<React.SetStateAction<AsteroidData[]>>;
  isDark: boolean;
  isGameActive: boolean;
}) {
  return (
    <>
      {/* Common elements */}
      <StarField isDark={isDark} />
      <DiagonalComet isDark={isDark} />
      
      {/* Asteroids only visible during game */}
      {isGameActive && <AsteroidsScene asteroids={asteroids} setAsteroids={setAsteroids} isDark={isDark} />}
    </>
  );
}

// ============================================================================
// HERO BACKGROUND EXPORT
// ============================================================================

export function HeroBackground() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [isGameActive, setIsGameActive] = useState(false);

  const [asteroids, setAsteroids] = useState<AsteroidData[]>(() => {
    const initialAsteroids: AsteroidData[] = [];
    for (let i = 0; i < ASTEROID_COUNT; i++) {
      initialAsteroids.push(createAsteroid(i, 10, 6));
    }
    return initialAsteroids;
  });

  // Listen for game state changes
  useEffect(() => {
    const handleGameStateChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ isPlaying: boolean }>;
      setIsGameActive(customEvent.detail.isPlaying);
    };

    window.addEventListener("game-state-changed", handleGameStateChange);
    return () => {
      window.removeEventListener("game-state-changed", handleGameStateChange);
    };
  }, []);

  return (
    <div
      id="hero-canvas"
      className="absolute inset-0"
      style={{ zIndex: 1 }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ cursor: "default", pointerEvents: "auto" }}
      >
        <Scene asteroids={asteroids} setAsteroids={setAsteroids} isDark={isDark} isGameActive={isGameActive} />
      </Canvas>

      <div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background"
        style={{ pointerEvents: "none" }}
      />

      {/* Hint text - only visible during game */}
      {isGameActive && (
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-muted-foreground/50 font-mono"
          style={{ pointerEvents: "none" }}
        >
          ✦ Click asteroids to destroy ✦
        </div>
      )}
    </div>
  );
}
