import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";

const Mouse = ({ floatY = 0, floatX = 0, scale = [10, 10, 10], ...props }) => {
  const { scene } = useGLTF("/LogitechMouse/scene.gltf");
  const mouse = useMemo(() => scene.clone(true), [scene]);

  useFrame(() => {
    // Apply floating effect
    mouse.position.y = floatY * 0.015;
    mouse.position.x = floatX * 0.015;

    mouse.rotation.y = Math.sin(floatX * 0.8) * 0.5;
    mouse.position.y = Math.cos(floatX * 0.5) * 0.05;
  });

  return (
    <group {...props}>
      <primitive object={mouse} scale={scale} />
    </group>
  );
};

export default Mouse;
