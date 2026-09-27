import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Pixel3DSceneProps {
  interactive?: boolean;
  className?: string;
  intensity?: 'ambient' | 'hero' | 'minimal';
}

export const Pixel3DScene: React.FC<Pixel3DSceneProps> = ({
  interactive = true,
  className = '',
  intensity = 'hero',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Dimensions
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 500;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x08090d, 0.035);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 14);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: window.devicePixelRatio < 2,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    container.appendChild(renderer.domElement);

    // Group for objects
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x00d2ff, 4, 30);
    cyanLight.position.set(-8, 6, 8);
    scene.add(cyanLight);

    const magentaLight = new THREE.PointLight(0xec4899, 4.5, 30);
    magentaLight.position.set(8, -4, 6);
    scene.add(magentaLight);

    const amberLight = new THREE.PointLight(0xf97316, 3, 25);
    amberLight.position.set(0, 8, -2);
    scene.add(amberLight);

    // Palette of Brand Pixel Cubes
    const colors = [
      0x00d2ff, // Cyan
      0xec4899, // Magenta
      0x8b5cf6, // Purple
      0xf97316, // Orange
      0x10b981, // Emerald/Lime
      0x3b82f6, // Royal Blue
    ];

    const count = intensity === 'hero' ? 24 : intensity === 'ambient' ? 12 : 6;
    const cubes: {
      mesh: THREE.Mesh;
      initialPos: THREE.Vector3;
      rotSpeed: THREE.Vector3;
      floatSpeed: number;
      floatOffset: number;
    }[] = [];

    // Shared geometry
    const boxGeometry = new THREE.BoxGeometry(0.85, 0.85, 0.85);

    for (let i = 0; i < count; i++) {
      const color = colors[i % colors.length];
      const material = new THREE.MeshPhysicalMaterial({
        color: color,
        metalness: 0.15,
        roughness: 0.2,
        transmission: 0.25,
        thickness: 0.5,
        reflectivity: 0.8,
        clearcoat: 0.8,
        clearcoatRoughness: 0.1,
      });

      const mesh = new THREE.Mesh(boxGeometry, material);

      // Distribute in a structured sculptural cloud
      const angle = (i / count) * Math.PI * 2;
      const radius = 2.2 + Math.random() * 3.8;
      const x = Math.cos(angle) * radius + (Math.random() - 0.5) * 1.5;
      const y = Math.sin(angle) * (radius * 0.6) + (Math.random() - 0.5) * 2;
      const z = (Math.random() - 0.5) * 5;

      mesh.position.set(x, y, z);
      const scale = 0.5 + Math.random() * 0.8;
      mesh.scale.set(scale, scale, scale);
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);

      mainGroup.add(mesh);
      cubes.push({
        mesh,
        initialPos: mesh.position.clone(),
        rotSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 0.008,
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.005
        ),
        floatSpeed: 0.8 + Math.random() * 0.8,
        floatOffset: Math.random() * Math.PI * 2,
      });
    }

    // Microscopic Pixel Particles (Constellation sparks)
    const particleCount = intensity === 'hero' ? 120 : 50;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 24;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 14;

      const c = new THREE.Color(colors[i % colors.length]);
      particleColors[i * 3] = c.r;
      particleColors[i * 3 + 1] = c.g;
      particleColors[i * 3 + 2] = c.b;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Mouse Tracking with smooth spring damping
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;
      targetX = ((clientX / rect.width) * 2 - 1) * 1.5;
      targetY = -((clientY / rect.height) * 2 - 1) * 1.2;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Handle Resize
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight || 500;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse follow
      mouseX += (targetX - mouseX) * 0.04;
      mouseY += (targetY - mouseY) * 0.04;

      if (!prefersReducedMotion) {
        mainGroup.rotation.y = mouseX * 0.4 + elapsedTime * 0.03;
        mainGroup.rotation.x = -mouseY * 0.3;

        // Animate individual cubes
        cubes.forEach((cube) => {
          cube.mesh.rotation.x += cube.rotSpeed.x;
          cube.mesh.rotation.y += cube.rotSpeed.y;
          cube.mesh.position.y = cube.initialPos.y + Math.sin(elapsedTime * cube.floatSpeed + cube.floatOffset) * 0.35;
        });

        // Slow particle drift
        particles.rotation.y = elapsedTime * 0.015;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      // Cleanup WebGL resources
      boxGeometry.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      cubes.forEach((c) => {
        (c.mesh.material as THREE.Material).dispose();
      });
      renderer.dispose();
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [interactive, intensity]);

  return (
    <div
      ref={mountRef}
      className={`relative w-full h-full pointer-events-none overflow-hidden ${className}`}
      aria-hidden="true"
    />
  );
};
