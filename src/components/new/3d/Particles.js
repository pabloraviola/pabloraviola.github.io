import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Particles = ({ scrollY, floatY = 0, floatX = 0 }) => {
  const particlesRef = useRef();
  const groupRef = useRef();
  const particleCount = 1000;
  const targetRotation = useRef(0);
  const currentRotation = useRef(0);
  const prevScrollY = useRef(0);

  const particles = React.useMemo(() => {
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
          size={0.04}
          color="#4a9eff"
          transparent
          opacity={0.7}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};

export default Particles;
