import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";

const Plant = ({ floatY = 0, floatX = 0, scale = [10, 10, 10], ...props }) => {
  const { scene } = useGLTF("/Plant/scene.gltf");
  const plant = useMemo(() => scene.clone(true), [scene]);

  useFrame(() => {
    // Apply floating effect
    plant.position.y = floatY * 0.015;
    plant.position.x = floatX * 0.015;

    plant.rotation.x = Math.sin(floatY * 0.8) * 0.05;
  });

  return (
    <group {...props}>
      <primitive object={plant} scale={scale} />
    </group>
  );
};

export default Plant;
