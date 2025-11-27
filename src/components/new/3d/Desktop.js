import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";

const Desktop = ({
  floatY = 0,
  floatX = 0,
  scale = [10, 10, 10],
  ...props
}) => {
  const { scene } = useGLTF("/Desktop3D/scene.gltf");
  const desktop = useMemo(() => {
    const clonedScene = scene.clone(true);
    
    // Collect all chair objects to remove
    const chairsToRemove = [];
    clonedScene.traverse((child) => {
      if (child.name && child.name.toLowerCase().includes('chair')) {
        chairsToRemove.push(child);
      }
    });
    
    // Remove all collected chair objects
    chairsToRemove.forEach((chair) => {
      if (chair.parent) {
        chair.parent.remove(chair);
      }
    });
    
    return clonedScene;
  }, [scene]);

  useFrame(() => {
    // Apply floating effect
    desktop.position.y = floatY * 0.015;
    desktop.position.x = floatX * 0.015;

    desktop.rotation.x = Math.sin(floatY * 0.8) * 0.05;
  });

  return (
    <group {...props}>
      <primitive object={desktop} scale={scale} />
    </group>
  );
};

export default Desktop;
