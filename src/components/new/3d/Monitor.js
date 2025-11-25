import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";

const Monitor = ({
  floatY = 0,
  floatX = 0,
  scale = [10, 10, 10],
  ...props
}) => {
  const { scene } = useGLTF("/Monitor/scene.gltf");
  const monitor = useMemo(() => scene.clone(true), [scene]);

  useFrame(() => {
    // Apply floating effect
    monitor.position.y = floatY * 0.015;
    monitor.position.x = floatX * 0.015;

    monitor.rotation.y = Math.sin(floatX * 0.8) * 0.1;
  });

  return (
    <group {...props}>
      <primitive object={monitor} scale={scale} />
    </group>
  );
};

export default Monitor;
