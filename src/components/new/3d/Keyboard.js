import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";

const Keyboard = ({
  floatY = 0,
  floatX = 0,
  scale = [10, 10, 10],
  ...props
}) => {
  const { scene } = useGLTF("/LogitechKeyboard/scene.gltf");
  const keyboard = useMemo(() => scene.clone(true), [scene]);

  useFrame(() => {
    // Apply floating effect
    keyboard.position.y = floatY * 0.015;
    keyboard.position.x = floatX * 0.015;

    keyboard.rotation.x = Math.sin(floatY * 0.8) * 0.05;
  });

  return (
    <group {...props}>
      <primitive object={keyboard} scale={scale} />
    </group>
  );
};

export default Keyboard;
