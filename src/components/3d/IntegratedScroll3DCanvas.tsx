import React, { useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// Palette for pixel blocks & lighting
const PALETTE = [
  '#00d2ff', // Cyan
  '#ec4899', // Pink / Magenta
  '#f97316', // Neon Orange
  '#8b5cf6', // Electric Purple
  '#10b981', // Emerald
  '#3b82f6', // Royal Blue
  '#fbbf24', // Warm Gold
];

interface SceneRigProps {
  scrollFraction: React.MutableRefObject<number>;
  mousePos: React.MutableRefObject<{ x: number; y: number }>;
}

const SceneRig: React.FC<SceneRigProps> = ({ scrollFraction, mousePos }) => {
  const { camera } = useThree();
  const mainGroupRef = useRef<THREE.Group>(null);
  const ringsRef = useRef<THREE.Group>(null);
  const layersGroupRef = useRef<THREE.Group>(null);
  const pMonumentRef = useRef<THREE.Group>(null);
  const servicesGroupRef = useRef<THREE.Group>(null);

  // 36 Pixel Cubes Data
  const pixelData = useMemo(() => {
    const list = [];
    const count = 36;
    for (let i = 0; i < count; i++) {
      const color = PALETTE[i % PALETTE.length];

      // State 0: Hero Assembled Architectural Cube
      const col = (i % 6) - 2.5;
      const row = Math.floor(i / 6) - 2.5;
      const depth = Math.floor(i / 12) - 1;
      const heroPos = new THREE.Vector3(col * 0.72, row * 0.72, depth * 0.72);

      // State 1: About Us - Slightly opened, geometric alignment
      const aboutPos = new THREE.Vector3(
        col * 1.05 + (col > 0 ? 0.3 : -0.3),
        row * 1.05,
        depth * 1.05
      );

      // State 2: Ordering Workflow - 5 Steps conveyor alignment
      const stepIdx = i % 5;
      const orderPos = new THREE.Vector3(
        -3.5 + stepIdx * 1.75 + ((i % 3) - 1) * 0.45,
        ((Math.floor(i / 5) % 3) - 1) * 0.6,
        ((i % 2) - 0.5) * 0.6
      );

      // State 3: Services - Orbiting ring
      const orbitA = (i / count) * Math.PI * 2;
      const servicePos = new THREE.Vector3(
        Math.cos(orbitA) * 4.6,
        Math.sin(orbitA) * 2.5 + Math.sin(orbitA * 3) * 0.4,
        Math.sin(orbitA) * 2.8
      );

      // State 4: Portfolio - Wide ambient constellation backdrop
      const portPos = new THREE.Vector3(
        ((i * 13) % 17 - 8) * 0.9,
        ((i * 7) % 11 - 5) * 0.8,
        -2.5 + ((i * 5) % 7 - 3) * 0.8
      );

      // State 5: Final Iconic "P" Monument
      const finalP = new THREE.Vector3();
      if (i < 12) {
        // Vertical stem
        finalP.set(-1.1, 2.3 - i * 0.42, 0);
      } else if (i < 24) {
        // Curved loop of P
        const loopA = ((i - 12) / 12) * Math.PI * 1.85 - Math.PI * 0.42;
        finalP.set(-1.1 + Math.cos(loopA) * 1.5 + 1.2, 1.15 + Math.sin(loopA) * 1.25, 0);
      } else {
        // Detached floating pixels breaking off to top-left (the official brand mark!)
        const scI = i - 24;
        finalP.set(-2.4 - (scI % 4) * 0.7, 1.9 + Math.floor(scI / 4) * 0.65, (scI % 3) * 0.35);
      }

      list.push({
        id: i,
        color,
        heroPos,
        aboutPos,
        orderPos,
        servicePos,
        portPos,
        finalP,
        rotSpeed: new THREE.Vector3(
          ((i * 3) % 7 - 3) * 0.004,
          ((i * 5) % 7 - 3) * 0.004,
          ((i * 2) % 7 - 3) * 0.004
        ),
      });
    }
    return list;
  }, []);

  const pixelMeshRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((state) => {
    const rawProgress = scrollFraction.current; // 0.0 at top to 1.0 at bottom
    const t = state.clock.getElapsedTime();

    // Responsive position: Shift 3D object slightly to the right on wide viewports during hero,
    // and float dynamically to balance the layout as the user scrolls.
    const isMobile = window.innerWidth < 768;
    const baseOffsetX = isMobile ? 0 : 2.5;

    // Smooth camera orbit & subtle parallax
    const mx = mousePos.current.x * 0.7;
    const my = mousePos.current.y * 0.5;

    // Choreographed camera waypoint based on scrollProgress
    // 0.0 (Hero): Framed nicely on assembled monolith
    // 0.15 (About Us): Gentle rotation, closer zoom
    // 0.35 (Ordering Steps): Wide horizontal composition
    // 0.55 (Services): Slightly elevated view
    // 0.75 (Portfolio): Deep atmospheric view
    // 0.90+ (Orders / Chat / CTA): Dramatic heroic framing of the Pencil-P monument
    const camTarget = new THREE.Vector3();
    const lookTarget = new THREE.Vector3();

    if (rawProgress < 0.18) {
      // Hero
      const frac = rawProgress / 0.18;
      camTarget.set(baseOffsetX + mx, 1.2 + my, 11.5 - frac * 1.5);
      lookTarget.set(baseOffsetX * 0.5, 0, 0);
    } else if (rawProgress < 0.38) {
      // About Us -> Order Steps
      const frac = (rawProgress - 0.18) / 0.2;
      camTarget.set(baseOffsetX * (1 - frac) + mx, 0.8 + my, 10.0 + frac * 1.5);
      lookTarget.set(0, 0, 0);
    } else if (rawProgress < 0.60) {
      // Services
      const frac = (rawProgress - 0.38) / 0.22;
      camTarget.set(2.0 * Math.sin(frac * Math.PI) + mx, 1.8 + my, 11.0);
      lookTarget.set(0, 0, 0);
    } else if (rawProgress < 0.82) {
      // Portfolio & Client Orders
      const frac = (rawProgress - 0.60) / 0.22;
      camTarget.set(-baseOffsetX * 0.7 + mx, 0.5 + my, 12.0 - frac * 1.0);
      lookTarget.set(0, 0, 0);
    } else {
      // Final CTA & Monument
      const frac = (rawProgress - 0.82) / 0.18;
      camTarget.set(baseOffsetX * 0.5 * (1 - frac) + mx, 0.8 + my, 10.0);
      lookTarget.set(0, 0.2, 0);
    }

    camera.position.lerp(camTarget, 0.08);
    const currentDir = new THREE.Vector3();
    camera.getWorldDirection(currentDir);
    const targetDir = lookTarget.clone().sub(camera.position).normalize();
    camera.lookAt(camera.position.clone().add(currentDir.lerp(targetDir, 0.1)));

    // Animate Pixel Cubes smoothly between states
    pixelData.forEach((item, idx) => {
      const mesh = pixelMeshRefs.current[idx];
      if (!mesh) return;

      const pPos = new THREE.Vector3();

      if (rawProgress < 0.2) {
        // Hero -> About Us
        const f = rawProgress / 0.2;
        pPos.lerpVectors(item.heroPos, item.aboutPos, f);
      } else if (rawProgress < 0.42) {
        // About Us -> Order Process Steps
        const f = (rawProgress - 0.2) / 0.22;
        pPos.lerpVectors(item.aboutPos, item.orderPos, f);
      } else if (rawProgress < 0.65) {
        // Order Process -> Services Orbit
        const f = (rawProgress - 0.42) / 0.23;
        pPos.lerpVectors(item.orderPos, item.servicePos, f);
      } else if (rawProgress < 0.84) {
        // Services -> Portfolio Atmosphere
        const f = (rawProgress - 0.65) / 0.19;
        pPos.lerpVectors(item.servicePos, item.portPos, f);
      } else {
        // Final Convergence -> 3D Pencil-P Monument
        const f = Math.min(1, (rawProgress - 0.84) / 0.16);
        pPos.lerpVectors(item.portPos, item.finalP, f);
      }

      // Gentle organic float
      pPos.y += Math.sin(t * 1.4 + idx * 0.3) * 0.06;

      mesh.position.copy(pPos);
      mesh.rotation.x += item.rotSpeed.x + rawProgress * 0.005;
      mesh.rotation.y += item.rotSpeed.y + rawProgress * 0.008;
    });

    // Animate Precision Rings
    if (ringsRef.current) {
      ringsRef.current.children.forEach((ring, i) => {
        ring.rotation.x = rawProgress * Math.PI * 4 * (i + 1) * 0.3 + t * 0.15;
        ring.rotation.y = -rawProgress * Math.PI * 3 * (i % 2 === 0 ? 1 : -1) + t * 0.1;
        ring.rotation.z = rawProgress * Math.PI * 2;
        // Expand ring scale slightly in middle sections
        const ringScale = 1 + Math.sin(rawProgress * Math.PI) * 0.35;
        ring.scale.setScalar(ringScale);
      });
    }

    // Exploded Artwork Layers (Active primarily in Services & Orders sections)
    if (layersGroupRef.current) {
      const isLayerActive = rawProgress > 0.25 && rawProgress < 0.85;
      const sepProgress = Math.sin(Math.max(0, Math.min(1, (rawProgress - 0.25) / 0.6)) * Math.PI);
      const layers = layersGroupRef.current.children;
      if (layers[0]) layers[0].position.z = -sepProgress * 1.8;
      if (layers[1]) layers[1].position.z = -sepProgress * 0.6;
      if (layers[2]) layers[2].position.z = sepProgress * 0.7;
      if (layers[3]) layers[3].position.z = sepProgress * 1.9;
      layersGroupRef.current.scale.setScalar(isLayerActive ? sepProgress : 0.001);
    }

    // Final Pencil-P monument visibility
    if (pMonumentRef.current) {
      const pFactor = Math.max(0, Math.min(1, (rawProgress - 0.82) / 0.18));
      pMonumentRef.current.scale.setScalar(pFactor);
      pMonumentRef.current.visible = pFactor > 0.02;
      pMonumentRef.current.rotation.y = (1 - pFactor) * 1.5 + Math.sin(t * 0.8) * 0.1;
    }

    // Services pedestals
    if (servicesGroupRef.current) {
      const sFactor = Math.sin(Math.max(0, Math.min(1, (rawProgress - 0.4) / 0.35)) * Math.PI);
      servicesGroupRef.current.scale.setScalar(sFactor);
      servicesGroupRef.current.rotation.y = t * 0.18 + rawProgress * Math.PI * 2;
    }

    // Global subtle drift
    if (mainGroupRef.current) {
      mainGroupRef.current.rotation.y = Math.sin(t * 0.3) * 0.04;
    }
  });

  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight position={[10, 15, 10]} intensity={2.5} color="#ffffff" />
      <pointLight position={[-8, 6, 6]} intensity={5.0} distance={25} color="#00d2ff" />
      <pointLight position={[8, -5, 6]} intensity={5.5} distance={25} color="#ec4899" />
      <pointLight position={[0, 9, -4]} intensity={4.0} distance={20} color="#f97316" />
      <pointLight position={[0, -8, 2]} intensity={3.5} distance={18} color="#8b5cf6" />

      {/* Atmospheric Micro Star Field */}
      <AmbientParticles />

      <group ref={mainGroupRef}>
        {/* 1. 36 Pixel Cubes */}
        <group>
          {pixelData.map((item, idx) => (
            <mesh
              key={item.id}
              ref={(el) => (pixelMeshRefs.current[idx] = el)}
              castShadow
              receiveShadow
            >
              <boxGeometry args={[0.68, 0.68, 0.68]} />
              <meshPhysicalMaterial
                color={item.color}
                metalness={0.25}
                roughness={0.15}
                transmission={0.35}
                thickness={0.8}
                reflectivity={0.9}
                clearcoat={0.95}
                clearcoatRoughness={0.1}
                emissive={item.color}
                emissiveIntensity={0.2}
              />
            </mesh>
          ))}
        </group>

        {/* 2. Precision Gyroscopic Rings */}
        <group ref={ringsRef}>
          <mesh>
            <torusGeometry args={[2.5, 0.04, 16, 120]} />
            <meshStandardMaterial
              color="#00d2ff"
              metalness={0.9}
              roughness={0.15}
              emissive="#00d2ff"
              emissiveIntensity={0.6}
            />
          </mesh>
          <mesh>
            <torusGeometry args={[1.8, 0.03, 16, 100]} />
            <meshStandardMaterial
              color="#ec4899"
              metalness={0.9}
              roughness={0.15}
              emissive="#ec4899"
              emissiveIntensity={0.5}
            />
          </mesh>
          <mesh>
            <torusGeometry args={[1.2, 0.025, 16, 80]} />
            <meshStandardMaterial
              color="#fbbf24"
              metalness={0.95}
              roughness={0.2}
              emissive="#fbbf24"
              emissiveIntensity={0.4}
            />
          </mesh>
        </group>

        {/* 3. Exploded Dimensional Artwork Layers */}
        <group ref={layersGroupRef} position={[0, 0, 0]}>
          {/* Wireframe layer */}
          <mesh>
            <planeGeometry args={[4.2, 3.0]} />
            <meshBasicMaterial color="#00d2ff" wireframe transparent opacity={0.3} side={THREE.DoubleSide} />
          </mesh>
          {/* Typographic blueprint */}
          <mesh>
            <planeGeometry args={[3.8, 2.6]} />
            <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.3} transparent opacity={0.75} side={THREE.DoubleSide} />
          </mesh>
          {/* Color artwork canvas */}
          <mesh>
            <boxGeometry args={[4.0, 2.8, 0.06]} />
            <meshPhysicalMaterial
              color="#1e1b4b"
              emissive="#6366f1"
              emissiveIntensity={0.25}
              metalness={0.3}
              roughness={0.2}
              clearcoat={0.9}
            />
          </mesh>
          {/* Clearcoat optical lens */}
          <mesh>
            <boxGeometry args={[4.3, 3.1, 0.1]} />
            <meshPhysicalMaterial
              color="#ffffff"
              metalness={0.1}
              roughness={0.05}
              transmission={0.85}
              thickness={1.0}
              clearcoat={1.0}
              transparent
              opacity={0.6}
            />
          </mesh>
        </group>

        {/* 4. Orbiting Service Pedestals */}
        <group ref={servicesGroupRef}>
          {[
            { label: 'Posters', color: '#00d2ff', angle: 0 },
            { label: 'Invitations', color: '#ec4899', angle: (Math.PI * 2) / 6 },
            { label: 'Ads', color: '#f97316', angle: (Math.PI * 4) / 6 },
            { label: 'Logos', color: '#8b5cf6', angle: Math.PI },
            { label: 'Social Media', color: '#10b981', angle: (Math.PI * 8) / 6 },
            { label: 'Motion Film', color: '#fbbf24', angle: (Math.PI * 10) / 6 },
          ].map((disc) => {
            const px = Math.cos(disc.angle) * 4.5;
            const pz = Math.sin(disc.angle) * 4.5;
            return (
              <group key={disc.label} position={[px, 0, pz]}>
                <mesh rotation={[-Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.75, 0.75, 0.1, 32]} />
                  <meshStandardMaterial color="#090d16" metalness={0.8} roughness={0.2} />
                </mesh>
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
                  <ringGeometry args={[0.68, 0.76, 32]} />
                  <meshBasicMaterial color={disc.color} side={THREE.DoubleSide} />
                </mesh>
                <mesh position={[0, 0.45, 0]}>
                  <octahedronGeometry args={[0.32, 0]} />
                  <meshPhysicalMaterial
                    color={disc.color}
                    emissive={disc.color}
                    emissiveIntensity={0.6}
                    metalness={0.2}
                    roughness={0.1}
                    clearcoat={1}
                  />
                </mesh>
              </group>
            );
          })}
        </group>

        {/* 5. The Finished Iconic 3D Pencil-P Monument */}
        <group ref={pMonumentRef} position={[-0.4, 0.2, 0]}>
          {/* Graphite Lead Tip */}
          <mesh position={[-1.1, -1.8, 0]} rotation={[0, 0, Math.PI]}>
            <coneGeometry args={[0.22, 0.5, 6]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.15} />
          </mesh>
          {/* Cedar wood collar */}
          <mesh position={[-1.1, -1.35, 0]} rotation={[0, 0, Math.PI]}>
            <cylinderGeometry args={[0.38, 0.22, 0.45, 6]} />
            <meshStandardMaterial color="#d97706" metalness={0.1} roughness={0.8} />
          </mesh>
          {/* Rainbow body */}
          <mesh position={[-1.1, 0.35, 0]}>
            <cylinderGeometry args={[0.38, 0.38, 3.0, 6]} />
            <meshPhysicalMaterial
              color="#0284c7"
              emissive="#0369a1"
              emissiveIntensity={0.3}
              metalness={0.4}
              roughness={0.2}
              clearcoat={0.9}
            />
          </mesh>
          {/* Curved P Loop */}
          <mesh position={[0.2, 0.9, 0]} rotation={[0, 0, -Math.PI / 2]}>
            <torusGeometry args={[1.15, 0.38, 16, 48, Math.PI * 1.05]} />
            <meshPhysicalMaterial
              color="#ec4899"
              emissive="#db2777"
              emissiveIntensity={0.3}
              metalness={0.4}
              roughness={0.2}
              clearcoat={0.9}
            />
          </mesh>
          {/* Halo */}
          <mesh position={[0, 0.5, -0.6]}>
            <ringGeometry args={[2.2, 2.35, 64]} />
            <meshBasicMaterial color="#fbbf24" transparent opacity={0.65} side={THREE.DoubleSide} />
          </mesh>
        </group>
      </group>
    </>
  );
};

// Subtle ambient particle dust
const AmbientParticles: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 140;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 26;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 16;

      const c = new THREE.Color(PALETTE[i % PALETTE.length]);
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.012;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" count={count} args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.12} vertexColors transparent opacity={0.6} blending={THREE.AdditiveBlending} />
    </points>
  );
};

export const IntegratedScroll3DCanvas: React.FC = () => {
  const scrollFraction = useRef<number>(0);
  const mousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        scrollFraction.current = Math.max(0, Math.min(1, window.scrollY / docHeight));
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: -(e.clientY / window.innerHeight - 0.5) * 2,
      };
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <Canvas
        shadows
        dpr={[1, 1.75]}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.25,
        }}
      >
        <PerspectiveCamera makeDefault position={[0, 1.2, 11.5]} fov={45} />
        <SceneRig scrollFraction={scrollFraction} mousePos={mousePos} />
      </Canvas>
    </div>
  );
};
