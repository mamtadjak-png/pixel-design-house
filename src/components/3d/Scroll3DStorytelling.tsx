import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Sparkles, 
  Layers, 
  Compass, 
  ArrowDown, 
  Eye, 
  Zap, 
  RotateCcw,
  Palette,
  Maximize2,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { PixelLogo } from '../common/PixelLogo';

gsap.registerPlugin(ScrollTrigger);

interface Scroll3DStorytellingProps {
  onNavigate: (view: string, extraParam?: string) => void;
  onOpenAuth: () => void;
}

// 6 Core Narrative Chapters: Pixels -> Ideas -> Design -> Creation -> Disciplines -> Finished Work
export interface StoryChapter {
  id: string;
  step: string;
  title: string;
  subtitle: string;
  concept: string;
  body: string;
  badge: string;
  accentColor: string;
  ctaText?: string;
  ctaAction?: () => void;
}

const CHAPTERS: StoryChapter[] = [
  {
    id: 'pixels',
    step: '01 / 06',
    title: 'THE FLOATING PIXEL SWARM',
    subtitle: 'Pixels in Unbound Space',
    concept: 'Pixels',
    body: 'Every digital masterwork begins with unformed potential. Chromatic pixel units hover suspended in obsidian space, pulsating with kinetic energy and awaiting mathematical coordinate alignment.',
    badge: 'Stage 01 · Raw Pixels',
    accentColor: '#00d2ff',
  },
  {
    id: 'ideas',
    step: '02 / 06',
    title: 'MATHEMATICAL COORDINATION',
    subtitle: 'The Architectural Idea Takes Form',
    concept: 'Ideas',
    body: 'Intention is introduced. The floating pixels accelerate along Swiss golden-ratio axes, snapping into an interlocking geometric monolith with laser-calibrated alignment.',
    badge: 'Stage 02 · Assembly & Ideas',
    accentColor: '#ec4899',
  },
  {
    id: 'design',
    step: '03 / 06',
    title: 'THE EMERGING ARTIFACT',
    subtitle: 'Structure, Geometry & Visual Layout',
    concept: 'Design',
    body: 'From the assembled core, a dimensional design slab materializes: typographic coordinate grids, luminous glass surfaces, and chromatic gradients forming a cohesive visual identity.',
    badge: 'Stage 03 · Design Canvas',
    accentColor: '#f97316',
  },
  {
    id: 'creation',
    step: '04 / 06',
    title: 'EXPLODED CRAFT ARCHITECTURE',
    subtitle: 'The Mechanism Revealed',
    concept: 'Creation',
    body: 'Like a luxury mechanical timepiece opening its outer titanium chassis, the design explodes into physical Z-space layers: structural wireframes, typographic blueprint, gradient artwork, and optical clearcoat.',
    badge: 'Stage 04 · Internal Craft',
    accentColor: '#8b5cf6',
  },
  {
    id: 'disciplines',
    step: '05 / 06',
    title: 'SEVEN DISCIPLINE PEDESTALS',
    subtitle: 'Specialized Creative Execution',
    concept: 'Services',
    body: 'The exploded components realign into orbiting discipline hubs: Poster Art, Luxury Invitations, High-Impact Advertising, Logomarks, Social Systems, Motion Film, and Custom Design.',
    badge: 'Stage 05 · Disciplines',
    accentColor: '#10b981',
    ctaText: 'Explore Studio Services',
  },
  {
    id: 'finished',
    step: '06 / 06',
    title: 'PIXELS WITH PURPOSE',
    subtitle: 'The Finished Master Monument',
    concept: 'Finished Work',
    body: 'In a triumphant radial implosion, all separated elements fuse together into the iconic Pixel Design House 3D Pencil-P monument. High art direction meets digital mastery.',
    badge: 'Stage 06 · Finished Work',
    accentColor: '#fbbf24',
    ctaText: 'Start Your Commission',
  },
];

// Color palette for pixel blocks
const PALETTE = [
  '#00d2ff', // Cyan
  '#ec4899', // Pink / Magenta
  '#f97316', // Neon Orange
  '#8b5cf6', // Electric Purple
  '#10b981', // Emerald
  '#3b82f6', // Royal Blue
  '#fbbf24', // Warm Gold
];

// Animated timeline state shared between GSAP and R3F
interface TimelineState {
  progress: number;
  cameraPos: THREE.Vector3;
  cameraLook: THREE.Vector3;
  pixelAssembly: number;   // 0: scattered, 1: assembled
  explosionFactor: number; // 0: closed, 1: exploded wide
  layerSeparation: number; // 0: flat, 1: separated in Z
  serviceFormation: number;// 0: normal, 1: orbiting pedestals
  finalConvergence: number;// 0: separated, 1: Pencil-P monument
  ringsSpeed: number;
}

// ============================================================================
// 3D SCENE RIG (React Three Fiber Components)
// ============================================================================

interface SceneRigProps {
  timelineState: React.MutableRefObject<TimelineState>;
  isInspectMode: boolean;
  mousePos: React.MutableRefObject<{ x: number; y: number }>;
}

const SceneRig: React.FC<SceneRigProps> = ({ timelineState, isInspectMode, mousePos }) => {
  const { camera } = useThree();
  const mainGroupRef = useRef<THREE.Group>(null);
  const ringsRef = useRef<THREE.Group>(null);
  const layersGroupRef = useRef<THREE.Group>(null);
  const servicesGroupRef = useRef<THREE.Group>(null);
  const pMonumentRef = useRef<THREE.Group>(null);
  const outerPanelsRef = useRef<THREE.Group>(null);

  // 36 Pixel Cubes Data
  const pixelData = useMemo(() => {
    const list = [];
    const count = 36;
    for (let i = 0; i < count; i++) {
      const color = PALETTE[i % PALETTE.length];
      
      // Stage 1: Scatter position
      const angle = (i / count) * Math.PI * 2;
      const radius = 3.6 + (i % 5) * 1.3;
      const scatter = new THREE.Vector3(
        Math.cos(angle) * radius + ((i * 7) % 5 - 2) * 0.9,
        Math.sin(angle) * (radius * 0.65) + ((i * 3) % 5 - 2) * 0.8,
        ((i * 11) % 9 - 4) * 0.9
      );

      // Stage 2: Assembled Grid Monolith
      const col = (i % 6) - 2.5;
      const row = Math.floor(i / 6) - 2.5;
      const depth = Math.floor(i / 12) - 1;
      const assembled = new THREE.Vector3(col * 0.82, row * 0.82, depth * 0.75);

      // Stage 4: Exploded Position
      const exploded = new THREE.Vector3(
        col * 2.4 + (col > 0 ? 1.6 : -1.6),
        row * 2.2 + (row > 0 ? 1.4 : -1.4),
        depth * 3.8
      );

      // Stage 5: Services Orbit
      const orbitA = (i / count) * Math.PI * 2;
      const service = new THREE.Vector3(
        Math.cos(orbitA) * 5.2,
        Math.sin(orbitA) * 2.8 + Math.sin(orbitA * 3) * 0.6,
        Math.sin(orbitA) * 3.2
      );

      // Stage 6: Final Iconic "P" Monument formation
      const finalP = new THREE.Vector3();
      if (i < 12) {
        // Vertical stem of P
        finalP.set(-1.1, 2.4 - i * 0.44, 0);
      } else if (i < 24) {
        // Curved loop of P
        const loopA = ((i - 12) / 12) * Math.PI * 1.85 - Math.PI * 0.42;
        finalP.set(
          -1.1 + Math.cos(loopA) * 1.6 + 1.25,
          1.15 + Math.sin(loopA) * 1.35,
          0
        );
      } else {
        // Disintegrating floating pixels towards top-left (signature of the official brand logo!)
        const scI = i - 24;
        finalP.set(
          -2.4 - (scI % 4) * 0.75,
          1.9 + Math.floor(scI / 4) * 0.7,
          (scI % 3) * 0.35
        );
      }

      list.push({
        id: i,
        color,
        scatter,
        assembled,
        exploded,
        service,
        finalP,
        rotSpeed: new THREE.Vector3(
          ((i * 3) % 7 - 3) * 0.003,
          ((i * 5) % 7 - 3) * 0.003,
          ((i * 2) % 7 - 3) * 0.003
        ),
      });
    }
    return list;
  }, []);

  // Pixel Mesh Refs
  const pixelMeshRefs = useRef<(THREE.Mesh | null)[]>([]);

  // Frame Loop: Smooth camera & mesh choreography driven by GSAP timeline state
  useFrame((state, delta) => {
    const s = timelineState.current;
    const t = state.clock.getElapsedTime();

    // 1. Camera Choreography (unless in inspect mode where OrbitControls handles it)
    if (!isInspectMode) {
      // Subtle mouse parallax
      const mx = mousePos.current.x * 0.6;
      const my = mousePos.current.y * 0.4;

      const targetCamX = s.cameraPos.x + mx;
      const targetCamY = s.cameraPos.y + my;
      const targetCamZ = s.cameraPos.z;

      camera.position.lerp(new THREE.Vector3(targetCamX, targetCamY, targetCamZ), 0.1);
      
      const currentLook = new THREE.Vector3();
      camera.getWorldDirection(currentLook);
      const targetDir = s.cameraLook.clone().sub(camera.position).normalize();
      
      // Smooth lookAt
      const tempTarget = camera.position.clone().add(currentLook.lerp(targetDir, 0.12));
      camera.lookAt(tempTarget);
    }

    // 2. Animate Pixel Cubes
    pixelData.forEach((item, idx) => {
      const mesh = pixelMeshRefs.current[idx];
      if (!mesh) return;

      const pPos = new THREE.Vector3();

      if (s.finalConvergence > 0.05) {
        // Interpolate towards Final Iconic P
        const basePos = item.service.clone().lerp(item.exploded, 1 - s.serviceFormation);
        pPos.lerpVectors(basePos, item.finalP, s.finalConvergence);
      } else if (s.serviceFormation > 0.05) {
        // Interpolate towards Service Pedestals
        pPos.lerpVectors(item.exploded, item.service, s.serviceFormation);
      } else if (s.explosionFactor > 0.05) {
        // Interpolate towards Exploded Watch chassis
        pPos.lerpVectors(item.assembled, item.exploded, s.explosionFactor);
      } else {
        // Interpolate from Scatter to Assembled Monolith
        pPos.lerpVectors(item.scatter, item.assembled, s.pixelAssembly);
      }

      // Add gentle organic floating wave
      const wave = Math.sin(t * 1.5 + idx * 0.4) * (0.08 * (1 - s.pixelAssembly * 0.7));
      pPos.y += wave;

      mesh.position.copy(pPos);
      
      // Rotations
      mesh.rotation.x += item.rotSpeed.x + s.progress * 0.01;
      mesh.rotation.y += item.rotSpeed.y + s.progress * 0.015;
    });

    // 3. Animate Internal Precision Rings
    if (ringsRef.current) {
      ringsRef.current.children.forEach((ring, i) => {
        const speedMultiplier = (i + 1) * 0.4;
        ring.rotation.x = s.progress * Math.PI * 4 * speedMultiplier + t * 0.2 * speedMultiplier;
        ring.rotation.y = s.progress * Math.PI * 3 * (i % 2 === 0 ? 1 : -1) + t * 0.15;
        ring.rotation.z = s.progress * Math.PI * 2 * (i % 2 === 0 ? -1 : 1);
        
        // Scale with explosion
        const scaleVal = 1 + s.explosionFactor * 0.35 + s.finalConvergence * 0.2;
        ring.scale.setScalar(scaleVal);
      });
    }

    // 4. Animate Exploded Design Layers (The Luxury Watch separation effect)
    if (layersGroupRef.current) {
      const layers = layersGroupRef.current.children;
      // Layer 0: Wireframe (-Z)
      // Layer 1: Typographic Blueprint
      // Layer 2: Graphic Artwork Canvas (+Z)
      // Layer 3: Protective Clearcoat Glass Lens (+Z farther)
      const sep = s.layerSeparation * 2.2;
      
      if (layers[0]) layers[0].position.z = -sep * 1.1;
      if (layers[1]) layers[1].position.z = -sep * 0.35;
      if (layers[2]) layers[2].position.z = sep * 0.45;
      if (layers[3]) layers[3].position.z = sep * 1.25;

      // Opacity / Visibility based on design phase
      const layerVisibility = Math.min(1, Math.max(0, (s.progress - 0.25) / 0.15)) * (1 - s.finalConvergence * 0.85);
      layersGroupRef.current.scale.setScalar(layerVisibility);
    }

    // 5. Outer Protective Chassis Panels (Casing that splits open)
    if (outerPanelsRef.current) {
      const panels = outerPanelsRef.current.children;
      const openAmount = s.explosionFactor;

      // Left Panel
      if (panels[0]) {
        panels[0].position.set(-1.8 - openAmount * 3.4, openAmount * 0.6, openAmount * 1.2);
        panels[0].rotation.y = openAmount * 0.5;
      }
      // Right Panel
      if (panels[1]) {
        panels[1].position.set(1.8 + openAmount * 3.4, -openAmount * 0.6, openAmount * 1.2);
        panels[1].rotation.y = -openAmount * 0.5;
      }
      // Top Visor
      if (panels[2]) {
        panels[2].position.set(0, 1.4 + openAmount * 2.8, -openAmount * 1.5);
        panels[2].rotation.x = -openAmount * 0.45;
      }
      // Back Plate
      if (panels[3]) {
        panels[3].position.set(0, -openAmount * 1.2, -1.2 - openAmount * 3.2);
        panels[3].rotation.z = openAmount * 0.2;
      }

      // Hide panels as final monument converges
      outerPanelsRef.current.visible = s.finalConvergence < 0.9;
    }

    // 6. Services Orbit Group
    if (servicesGroupRef.current) {
      servicesGroupRef.current.rotation.y = t * 0.2 + s.progress * Math.PI * 2;
      const sVis = Math.max(0, Math.min(1, (s.progress - 0.6) / 0.15)) * (1 - s.finalConvergence * 0.9);
      servicesGroupRef.current.scale.setScalar(sVis);
    }

    // 7. Iconic Pencil-P Monument
    if (pMonumentRef.current) {
      pMonumentRef.current.scale.setScalar(s.finalConvergence);
      pMonumentRef.current.rotation.y = (1 - s.finalConvergence) * 1.5 + Math.sin(t * 0.8) * 0.1;
      pMonumentRef.current.visible = s.finalConvergence > 0.05;
    }

    // Subtle idle drift on whole rig
    if (mainGroupRef.current) {
      mainGroupRef.current.rotation.y = Math.sin(t * 0.4) * 0.05;
      mainGroupRef.current.position.y = Math.cos(t * 0.6) * 0.05;
    }
  });

  return (
    <>
      {/* Studio Multi-Point Chromatic Lighting */}
      <ambientLight intensity={0.85} />
      <directionalLight position={[10, 15, 10]} intensity={2.4} color="#ffffff" castShadow />
      
      {/* Chromatic Studio Rim Lights */}
      <pointLight position={[-8, 6, 6]} intensity={5.5} distance={25} color="#00d2ff" />
      <pointLight position={[8, -5, 6]} intensity={6.0} distance={25} color="#ec4899" />
      <pointLight position={[0, 9, -4]} intensity={4.5} distance={20} color="#f97316" />
      <pointLight position={[0, -8, 2]} intensity={3.5} distance={18} color="#8b5cf6" />

      {/* Atmospheric Star Dust */}
      <StarField />

      {/* Main Interactive World Rig */}
      <group ref={mainGroupRef}>
        
        {/* ========================================================= */}
        {/* 1. 36 FLOATING/ASSEMBLING CHROMATIC PIXEL CUBES           */}
        {/* ========================================================= */}
        <group>
          {pixelData.map((item, idx) => (
            <mesh
              key={item.id}
              ref={(el) => (pixelMeshRefs.current[idx] = el)}
              castShadow
              receiveShadow
            >
              <boxGeometry args={[0.72, 0.72, 0.72]} />
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

        {/* ========================================================= */}
        {/* 2. CONCENTRIC CALIBRATED GYROSCOPIC MECHANISM RINGS       */}
        {/* ========================================================= */}
        <group ref={ringsRef}>
          {/* Ring 1 - Cyan Outer Orbit */}
          <mesh>
            <torusGeometry args={[2.5, 0.045, 16, 120]} />
            <meshStandardMaterial
              color="#00d2ff"
              metalness={0.9}
              roughness={0.15}
              emissive="#00d2ff"
              emissiveIntensity={0.6}
            />
          </mesh>
          {/* Ring 2 - Magenta Center Core */}
          <mesh>
            <torusGeometry args={[1.8, 0.035, 16, 100]} />
            <meshStandardMaterial
              color="#ec4899"
              metalness={0.9}
              roughness={0.15}
              emissive="#ec4899"
              emissiveIntensity={0.5}
            />
          </mesh>
          {/* Ring 3 - Gold Swiss Precision Axis */}
          <mesh>
            <torusGeometry args={[1.2, 0.03, 16, 80]} />
            <meshStandardMaterial
              color="#fbbf24"
              metalness={0.95}
              roughness={0.2}
              emissive="#fbbf24"
              emissiveIntensity={0.4}
            />
          </mesh>
        </group>

        {/* ========================================================= */}
        {/* 3. EXPLODING DESIGN ARTIFACT LAYERS (Z-Plane Separation)  */}
        {/* ========================================================= */}
        <group ref={layersGroupRef} position={[0, 0, 0]}>
          
          {/* Layer 0: Swiss Coordinate Grid & Wireframe */}
          <group position={[0, 0, 0]}>
            <mesh>
              <planeGeometry args={[4.4, 3.2]} />
              <meshBasicMaterial
                color="#00d2ff"
                wireframe
                transparent
                opacity={0.35}
                side={THREE.DoubleSide}
              />
            </mesh>
            {/* Grid corner markers */}
            {[-2.1, 2.1].map((x) =>
              [-1.5, 1.5].map((y) => (
                <mesh key={`grid-${x}-${y}`} position={[x, y, 0.02]}>
                  <boxGeometry args={[0.15, 0.15, 0.05]} />
                  <meshBasicMaterial color="#00d2ff" />
                </mesh>
              ))
            )}
          </group>

          {/* Layer 1: Typographic Blueprint Planes */}
          <group position={[0, 0, 0]}>
            <mesh>
              <planeGeometry args={[4.0, 2.8]} />
              <meshStandardMaterial
                color="#0f172a"
                metalness={0.6}
                roughness={0.3}
                transparent
                opacity={0.8}
                side={THREE.DoubleSide}
              />
            </mesh>
            {/* Golden Ratio Spiral / Blueprint Rings */}
            <mesh position={[0, 0, 0.02]}>
              <ringGeometry args={[0.4, 0.44, 48]} />
              <meshBasicMaterial color="#fbbf24" side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[0, 0, 0.02]}>
              <ringGeometry args={[0.9, 0.94, 64]} />
              <meshBasicMaterial color="#fbbf24" transparent opacity={0.6} side={THREE.DoubleSide} />
            </mesh>
          </group>

          {/* Layer 2: Graphic Artwork Canvas (Chromatic Gradient Slab) */}
          <group position={[0, 0, 0]}>
            <mesh>
              <boxGeometry args={[4.2, 3.0, 0.08]} />
              <meshPhysicalMaterial
                color="#1e1b4b"
                emissive="#6366f1"
                emissiveIntensity={0.25}
                metalness={0.3}
                roughness={0.2}
                clearcoat={0.9}
                clearcoatRoughness={0.1}
              />
            </mesh>
            {/* Chromatic color swatches embedded on the canvas */}
            {PALETTE.map((c, i) => (
              <mesh key={`swatch-${c}`} position={[-1.5 + i * 0.5, -1.1, 0.06]}>
                <boxGeometry args={[0.36, 0.15, 0.02]} />
                <meshBasicMaterial color={c} />
              </mesh>
            ))}
          </group>

          {/* Layer 3: Optical Clearcoat Glass Lens with Bevels */}
          <group position={[0, 0, 0]}>
            <mesh>
              <boxGeometry args={[4.5, 3.3, 0.12]} />
              <meshPhysicalMaterial
                color="#ffffff"
                metalness={0.1}
                roughness={0.05}
                transmission={0.88}
                thickness={1.2}
                ior={1.52}
                reflectivity={0.95}
                clearcoat={1.0}
                clearcoatRoughness={0.05}
                transparent
                opacity={0.75}
              />
            </mesh>
            {/* Neon border highlight */}
            <mesh position={[0, 0, 0.07]}>
              <planeGeometry args={[4.52, 3.32]} />
              <meshBasicMaterial color="#ec4899" wireframe transparent opacity={0.4} />
            </mesh>
          </group>

        </group>

        {/* ========================================================= */}
        {/* 4. OUTER PROTECTIVE CHASSIS PANELS (The Luxury Casing)    */}
        {/* ========================================================= */}
        <group ref={outerPanelsRef}>
          {/* Left Shell */}
          <mesh position={[-1.8, 0, 0]}>
            <boxGeometry args={[3.4, 2.4, 0.15]} />
            <meshPhysicalMaterial
              color="#0d111c"
              metalness={0.7}
              roughness={0.25}
              clearcoat={0.8}
              transparent
              opacity={0.85}
            />
          </mesh>
          {/* Right Shell */}
          <mesh position={[1.8, 0, 0]}>
            <boxGeometry args={[3.4, 2.4, 0.15]} />
            <meshPhysicalMaterial
              color="#0d111c"
              metalness={0.7}
              roughness={0.25}
              clearcoat={0.8}
              transparent
              opacity={0.85}
            />
          </mesh>
          {/* Top Visor */}
          <mesh position={[0, 1.4, 0]}>
            <boxGeometry args={[3.2, 0.14, 2.2]} />
            <meshPhysicalMaterial
              color="#111827"
              metalness={0.8}
              roughness={0.2}
              clearcoat={0.9}
            />
          </mesh>
          {/* Back Core Plate */}
          <mesh position={[0, 0, -1.2]}>
            <boxGeometry args={[4.0, 3.0, 0.18]} />
            <meshPhysicalMaterial
              color="#080c14"
              metalness={0.85}
              roughness={0.3}
            />
          </mesh>
        </group>

        {/* ========================================================= */}
        {/* 5. SEVEN DISCIPLINE ORBITING PEDESTALS                     */}
        {/* ========================================================= */}
        <group ref={servicesGroupRef}>
          {[
            { label: 'Posters', color: '#00d2ff', angle: 0 },
            { label: 'Invitations', color: '#ec4899', angle: (Math.PI * 2) / 6 },
            { label: 'Ads', color: '#f97316', angle: (Math.PI * 4) / 6 },
            { label: 'Logos', color: '#8b5cf6', angle: Math.PI },
            { label: 'Social Media', color: '#10b981', angle: (Math.PI * 8) / 6 },
            { label: 'Motion Film', color: '#fbbf24', angle: (Math.PI * 10) / 6 },
          ].map((disc, idx) => {
            const px = Math.cos(disc.angle) * 5.0;
            const pz = Math.sin(disc.angle) * 5.0;
            const py = Math.sin(idx) * 0.8;
            return (
              <group key={disc.label} position={[px, py, pz]}>
                {/* Pedestal disc */}
                <mesh rotation={[-Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.9, 0.9, 0.12, 32]} />
                  <meshStandardMaterial
                    color="#090d16"
                    metalness={0.8}
                    roughness={0.2}
                  />
                </mesh>
                {/* Glowing neon halo */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.08, 0]}>
                  <ringGeometry args={[0.82, 0.92, 32]} />
                  <meshBasicMaterial color={disc.color} side={THREE.DoubleSide} />
                </mesh>
                {/* Floating crystal prism */}
                <mesh position={[0, 0.6, 0]}>
                  <octahedronGeometry args={[0.42, 0]} />
                  <meshPhysicalMaterial
                    color={disc.color}
                    emissive={disc.color}
                    emissiveIntensity={0.6}
                    metalness={0.2}
                    roughness={0.1}
                    transmission={0.4}
                    thickness={0.5}
                    clearcoat={1}
                  />
                </mesh>
              </group>
            );
          })}
        </group>

        {/* ========================================================= */}
        {/* 6. THE FINISHED MASTER MONUMENT: 3D PENCIL-P EMBLEM        */}
        {/* ========================================================= */}
        <group ref={pMonumentRef} position={[-0.4, 0.2, 0]}>
          
          {/* Graphite Lead Tip (Point of creation) */}
          <mesh position={[-1.1, -1.8, 0]} rotation={[0, 0, Math.PI]}>
            <coneGeometry args={[0.22, 0.5, 6]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.15} />
          </mesh>

          {/* Wooden Sharpened Collar */}
          <mesh position={[-1.1, -1.35, 0]} rotation={[0, 0, Math.PI]}>
            <cylinderGeometry args={[0.38, 0.22, 0.45, 6]} />
            <meshStandardMaterial color="#d97706" metalness={0.1} roughness={0.8} />
          </mesh>

          {/* Hexagonal Pencil Shaft with Rainbow Gradient body */}
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

          {/* Curved P Loop Arc */}
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

          {/* Triumphant Halo behind Monument */}
          <mesh position={[0, 0.5, -0.6]}>
            <ringGeometry args={[2.2, 2.35, 64]} />
            <meshBasicMaterial color="#fbbf24" transparent opacity={0.65} side={THREE.DoubleSide} />
          </mesh>

        </group>

      </group>
    </>
  );
};

// ============================================================================
// COSMIC STAR/PARTICLE FIELD
// ============================================================================
const StarField: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 180;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 28;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 18;

      const c = new THREE.Color(PALETTE[i % PALETTE.length]);
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.015;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.14}
        vertexColors
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// ============================================================================
// MAIN EXPORTED COMPONENT (React Three Fiber + GSAP ScrollTrigger)
// ============================================================================
export const Scroll3DStorytelling: React.FC<Scroll3DStorytellingProps> = ({
  onNavigate,
  onOpenAuth,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [isInspectMode, setIsInspectMode] = useState(false);

  // Mouse coordinates for interactive parallax
  const mousePos = useRef({ x: 0, y: 0 });

  // GSAP Animated Timeline State
  const timelineState = useRef<TimelineState>({
    progress: 0,
    cameraPos: new THREE.Vector3(0, 1.8, 14),
    cameraLook: new THREE.Vector3(0, 0, 0),
    pixelAssembly: 0,
    explosionFactor: 0,
    layerSeparation: 0,
    serviceFormation: 0,
    finalConvergence: 0,
    ringsSpeed: 1,
  });

  // Track mouse move for parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: -(e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // GSAP ScrollTrigger Master Timeline Setup
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      timelineState.current.pixelAssembly = 1;
      timelineState.current.finalConvergence = 1;
      return;
    }

    const state = timelineState.current;

    // Cinematic Camera Waypoints across the 6 narrative stages:
    // 0: Raw Pixels (Wide dynamic view)
    // 1: Assembly / Ideas (Dolly in, snap to structure)
    // 2: Emerging Design Canvas (Orbit to 3/4 isometric perspective)
    // 3: Exploded Creation Architecture (Extreme macro tilt inside the separated watch layers)
    // 4: Seven Disciplines (Elevated spatial overview of orbiting service pedestals)
    // 5: Finished Work (Frontal heroic framing of the iconic Pencil-P monument)
    const waypoints = [
      { pos: new THREE.Vector3(0, 1.8, 14), look: new THREE.Vector3(0, 0, 0) },
      { pos: new THREE.Vector3(2.2, 1.2, 9.5), look: new THREE.Vector3(0, 0, 0) },
      { pos: new THREE.Vector3(4.2, 2.0, 7.8), look: new THREE.Vector3(0, 0.2, 0) },
      { pos: new THREE.Vector3(0.5, 0.2, 4.4), look: new THREE.Vector3(0, 0.2, 0) },
      { pos: new THREE.Vector3(-3.6, 2.5, 9.2), look: new THREE.Vector3(0, 0, 0) },
      { pos: new THREE.Vector3(0, 0.6, 8.8), look: new THREE.Vector3(-0.2, 0.4, 0) },
    ];

    // Master GSAP scrub timeline pinned to scroll container
    const ctx = gsap.context(() => {
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: track,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.2,
          onUpdate: (self) => {
            const p = self.progress;
            state.progress = p;
            setScrollProgress(p);

            // Determine active chapter (0 to 5)
            const chapterIdx = Math.min(5, Math.floor(p * 6));
            setActiveChapterIndex(chapterIdx);

            // Interpolate Camera Waypoints smoothly
            const scaledP = p * (waypoints.length - 1);
            const idx = Math.min(waypoints.length - 2, Math.floor(scaledP));
            const frac = scaledP - idx;
            
            const wpCurrent = waypoints[idx];
            const wpNext = waypoints[idx + 1];

            state.cameraPos.lerpVectors(wpCurrent.pos, wpNext.pos, frac);
            state.cameraLook.lerpVectors(wpCurrent.look, wpNext.look, frac);
          },
        },
      });

      // Chapter 1 -> 2: Floating Pixels assemble into geometric monolith
      masterTl.to(state, {
        pixelAssembly: 1,
        duration: 0.2,
        ease: 'power2.inOut',
      }, 0);

      // Chapter 2 -> 3: Design Canvas & Layout grid emerges
      masterTl.to(state, {
        layerSeparation: 0.3,
        duration: 0.2,
        ease: 'power1.inOut',
      }, 0.2);

      // Chapter 3 -> 4: Explosion of watch chassis and Z-axis layers (The Luxury Watch deconstruction)
      masterTl.to(state, {
        explosionFactor: 1,
        layerSeparation: 1,
        ringsSpeed: 2.5,
        duration: 0.25,
        ease: 'power2.out',
      }, 0.38);

      // Chapter 4 -> 5: Service Pedestals expand into orbit
      masterTl.to(state, {
        serviceFormation: 1,
        duration: 0.2,
        ease: 'power2.inOut',
      }, 0.62);

      // Chapter 5 -> 6: Triumphant Radial Implosion into the Finished 3D Pencil-P monument
      masterTl.to(state, {
        finalConvergence: 1,
        explosionFactor: 0,
        layerSeparation: 0,
        serviceFormation: 0,
        duration: 0.25,
        ease: 'power3.inOut',
      }, 0.78);

    }, track);

    return () => ctx.revert();
  }, []);

  // Jump to specific chapter
  const handleJumpToChapter = (index: number) => {
    if (!trackRef.current) return;
    const track = trackRef.current;
    const scrollTarget = track.offsetTop + (index / 5) * (track.offsetHeight - window.innerHeight);
    window.scrollTo({ top: scrollTarget, behavior: 'smooth' });
  };

  const activeChapter = CHAPTERS[activeChapterIndex] || CHAPTERS[0];

  return (
    <div ref={trackRef} className="relative w-full h-[600vh] bg-[#08090d]">
      
      {/* ========================================================= */}
      {/* STICKY FULLSCREEN VIEWPORT FOR REACT THREE FIBER CANVAS  */}
      {/* ========================================================= */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between">
        
        {/* WebGL Canvas Mount */}
        <div className="absolute inset-0 z-0">
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
            <PerspectiveCamera makeDefault position={[0, 1.8, 14]} fov={45} />
            <SceneRig
              timelineState={timelineState}
              isInspectMode={isInspectMode}
              mousePos={mousePos}
            />
            {isInspectMode && <OrbitControls enablePan={false} maxDistance={20} minDistance={3} />}
          </Canvas>
        </div>

        {/* Ambient Subtle Studio Grid Texture */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-20 z-[1]"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(0, 210, 255, 0.08) 0%, transparent 65%), linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
            backgroundSize: '100% 100%, 48px 48px, 48px 48px',
          }}
        />

        {/* ========================================================= */}
        {/* TOP HUD: BRAND & 3D CONTROLS                              */}
        {/* ========================================================= */}
        <header className="relative z-10 p-6 sm:p-8 flex items-center justify-between w-full pointer-events-auto">
          
          {/* Studio Brand Flag */}
          <div className="flex items-center gap-3.5 backdrop-blur-md bg-black/40 border border-white/10 px-4 py-2 rounded-2xl shadow-xl">
            <PixelLogo variant="mark" size="sm" />
            <div>
              <span className="text-xs font-bold text-white tracking-wider block font-display">
                PIXEL DESIGN HOUSE
              </span>
              <span className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase">
                Scroll-Driven 3D Film
              </span>
            </div>
          </div>

          {/* Right Controls: 3D Inspect Mode Toggle & Progress Pill */}
          <div className="flex items-center gap-3">
            
            {/* Free Orbit / Inspect 3D Toggle */}
            <button
              onClick={() => setIsInspectMode(!isInspectMode)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all cursor-pointer shadow-lg backdrop-blur-md ${
                isInspectMode
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                  : 'bg-black/50 border-white/10 text-slate-300 hover:text-white hover:border-white/25'
              }`}
              title={isInspectMode ? 'Return to Cinematic Scroll' : 'Inspect 3D Object with Free Orbit'}
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isInspectMode ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">
                {isInspectMode ? 'Cinematic Mode' : 'Free 3D Orbit'}
              </span>
            </button>

            {/* Scroll Progress Meter */}
            <div className="hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-black/50 border border-white/10 text-xs font-mono text-slate-300 backdrop-blur-md">
              <span className="text-[10px] text-slate-500 uppercase">TIMELINE</span>
              <span className="text-cyan-400 font-bold">{Math.round(scrollProgress * 100)}%</span>
            </div>

          </div>

        </header>

        {/* ========================================================= */}
        {/* CENTER / BOTTOM: NARRATIVE CHAPTER CARD & CONTROLS        */}
        {/* ========================================================= */}
        <div className="relative z-10 px-6 sm:px-12 pb-8 sm:pb-12 pointer-events-auto max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          
          {/* Main Story Narrative Card (Left Column) */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Chapter Step Pill */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1 rounded-full text-xs font-mono tracking-wider font-semibold border backdrop-blur-md shadow-lg"
              style={{
                borderColor: `${activeChapter.accentColor}44`,
                backgroundColor: `${activeChapter.accentColor}15`,
                color: activeChapter.accentColor,
              }}
            >
              <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: activeChapter.accentColor }} />
              <span>{activeChapter.badge}</span>
            </div>

            {/* Title & Subtitle */}
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display text-white tracking-tight leading-none drop-shadow-2xl">
                {activeChapter.title}
              </h1>
              <p className="text-sm sm:text-base font-semibold text-slate-400 font-display">
                {activeChapter.subtitle}
              </p>
            </div>

            {/* Explanatory Body */}
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed drop-shadow-md backdrop-blur-sm bg-black/20 p-3 rounded-xl border border-white/[0.04]">
              {activeChapter.body}
            </p>

            {/* Interactive Actions for Current Chapter */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              {activeChapter.ctaText && (
                <button
                  onClick={() => {
                    if (activeChapter.id === 'disciplines') onNavigate('services');
                    else if (activeChapter.id === 'finished') onNavigate('contact');
                  }}
                  className="px-5 py-2.5 rounded-xl font-bold font-display text-xs sm:text-sm text-black transition-all transform hover:scale-105 active:scale-95 shadow-xl flex items-center gap-2 cursor-pointer"
                  style={{ backgroundColor: activeChapter.accentColor }}
                >
                  <span>{activeChapter.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={onOpenAuth}
                className="px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-white/10 hover:bg-white/15 text-white border border-white/10 backdrop-blur-md transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Client Access</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>

          </div>

          {/* Chapter Scrubber Navigation (Right Column) */}
          <div className="lg:col-span-4 flex flex-col items-start lg:items-end space-y-3">
            
            <div className="text-[11px] font-mono text-slate-400 tracking-wider uppercase flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>Chapter Timeline (Click to scrub)</span>
            </div>

            {/* 6 Chapter Step Badges */}
            <div className="grid grid-cols-6 lg:flex lg:flex-col gap-2 w-full max-w-xs">
              {CHAPTERS.map((ch, idx) => {
                const isActive = idx === activeChapterIndex;
                return (
                  <button
                    key={ch.id}
                    onClick={() => handleJumpToChapter(idx)}
                    className={`px-3 py-2 rounded-xl text-left transition-all border flex items-center justify-between cursor-pointer ${
                      isActive
                        ? 'bg-white/15 border-white/30 text-white shadow-lg'
                        : 'bg-black/40 border-white/[0.06] text-slate-400 hover:text-slate-200 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: ch.accentColor }}
                      />
                      <span className="text-xs font-semibold font-display truncate">
                        {ch.concept}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono opacity-60 hidden lg:inline">
                      {ch.step.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Scroll Down Prompt */}
            <div className="pt-2 flex items-center gap-2 text-slate-500 text-xs font-mono">
              <ArrowDown className="w-3.5 h-3.5 animate-bounce text-cyan-400" />
              <span>Scroll down to control 3D timeline</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
