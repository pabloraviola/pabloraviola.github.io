import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";

const MacbookModel = ({
  scrollY,
  floatY = 0,
  floatX = 0,
  floatRotate = 0,
  position = [0, 0, 0],
}) => {
  const { scene, materials } = useGLTF("/MacBookProM3/scene.gltf");
  console.log({ materials });
  const modelRef = useRef();

  // Clone scene to avoid conflicts
  const clonedScene = React.useMemo(() => {
    const cloned = scene.clone();

    // cloned.traverse((child) => {
    //   // Remove screen texture by targeting the specific material
    //   if (child.material) {
    //     if (Array.isArray(child.material)) {
    //       child.material.forEach((mat) => {
    //         if (mat.name === "sfCQkHOWyrsLmor") {
    //           mat.emissiveMap = null;
    //           mat.emissive.setHex(0x000000);
    //           mat.needsUpdate = true;
    //         }
    //       });
    //     } else if (child.material.name === "sfCQkHOWyrsLmor") {
    //       child.material.emissiveMap = null;
    //       child.material.emissive.setHex(0x000000);
    //       child.material.needsUpdate = true;
    //     }
    //   }
    // });

    return cloned;
  }, [scene, materials]);

  useFrame(() => {
    if (modelRef.current) {
      // Smooth rotation based on scroll
      const targetRotation = scrollY * 0.01;
      modelRef.current.rotation.y +=
        (targetRotation - modelRef.current.rotation.y) * 0.1;

      // Add subtle floating rotation
      modelRef.current.rotation.z = floatRotate * 0.02;

      // // Update scale based on scroll
      const maxScroll = 1000;
      const scrollProgress = Math.min(scrollY / maxScroll, 1);
      const targetScale = 0.03 + scrollProgress * 0.02; // Scale from 0.03 to 0.05
      modelRef.current.scale.setScalar(targetScale);

      // Update position with float effect
      modelRef.current.position.y = -0.3 + floatY * 0.005;
      modelRef.current.position.x = floatX * 0.01;
    }
  });

  return (
    <primitive
      ref={modelRef}
      object={clonedScene}
      scale={0.05}
      position={[0, 0, 0]}
    />
  );
};

export default MacbookModel;
