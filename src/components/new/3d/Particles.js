import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Create a circular texture with subtle glow
const createCircleTexture = () => {
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext("2d");

  // Create radial gradient for soft circular shape with glow
  const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
  gradient.addColorStop(0.3, "rgba(255, 255, 255, 0.8)");
  gradient.addColorStop(0.6, "rgba(255, 255, 255, 0.3)");
  gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 32, 32);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
};

const Particles = ({
  scrollY = 0,
  floatY = 0,
  floatX = 0,
  position = [0, 0, 0],
}) => {
  const particlesRef = useRef();
  const groupRef = useRef();
  const particleCount = 2000;
  const targetRotation = useRef(0);
  const currentRotation = useRef(0);
  const prevScrollY = useRef(0);

  // Create circular texture once
  const circleTexture = useMemo(() => createCircleTexture(), []);

  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      // Random positions in a larger sphere around the scene
      const radius = 8 + Math.random() * 20;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }

    return positions;
  }, []);

  useFrame(() => {
    if (groupRef.current) {
      // Calculate scroll delta
      const scrollDelta = scrollY - prevScrollY.current;
      prevScrollY.current = scrollY;

      // Update target rotation based on scroll delta
      targetRotation.current += scrollDelta * 0.001;

      // Smooth interpolation to target rotation
      const rotationDiff = targetRotation.current - currentRotation.current;
      currentRotation.current += rotationDiff * 0.1;

      // Apply rotation to the entire particle group
      groupRef.current.rotation.y = currentRotation.current;

      // Apply floating effect to particles
      groupRef.current.position.y = floatY * 0.015;
      groupRef.current.position.x = floatX * 0.015;
    }
  });

  return (
    <group position={position}>
      <group ref={groupRef}>
        <points ref={particlesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={particleCount}
              array={particles}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.06}
            map={circleTexture}
            color="#4a9eff"
            transparent
            opacity={0.9}
            sizeAttenuation
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            alphaTest={0.01}
          />
        </points>
      </group>
    </group>
  );
};

export default Particles;
