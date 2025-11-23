import React, { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";

const MacbookModel = ({
  scrollY,
  floatY = 0,
  floatX = 0,
  floatRotate = 0,
  position = [0, 0, 0],
}) => {
  const { scene, materials, animations } = useGLTF(
    "/MacBookPro132020/scene.gltf"
  );

  const modelRef = useRef();

  // Clone scene to avoid conflicts
  const clonedScene = useMemo(() => {
    const cloned = scene.clone();
    return cloned;
  }, [scene, materials]);

  const { actions, mixer } = useAnimations(animations, clonedScene);

  // Set up animation action
  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      const actionName = Object.keys(actions)[0]; // Get first animation
      const action = actions[actionName];

      if (action) {
        action.play();
        action.paused = true;
        action.time = 0; // Start closed
      }
    }
  }, [actions]);

  useFrame(() => {
    if (modelRef.current) {
      // Smooth rotation based on scroll
      const targetRotation = scrollY * 0.01;
      modelRef.current.rotation.y +=
        (targetRotation - modelRef.current.rotation.y) * 0.1;

      // Add subtle floating rotation
      modelRef.current.rotation.z = floatRotate * 0.02;

      // Update scale based on scroll
      const maxScroll = 1000;
      const scrollProgress = Math.min(scrollY / maxScroll, 1);
      const targetScale = 4 + scrollProgress * 2; // Scale from 4 to 6
      modelRef.current.scale.setScalar(targetScale);

      // Update position with float effect
      modelRef.current.position.y = -0.3 + floatY * 0.005;
      modelRef.current.position.x = floatX * 0.01;

      // Start X rotation at 1, gradually decrease to 0 as scrollY increases
      const targetXRotation = 1 - scrollProgress;
      modelRef.current.rotation.x = Math.max(0, Math.min(targetXRotation, 1));
    }

    // Handle scroll-based animation (Macbook Opening Animation)
    if (actions && mixer && Object.keys(actions).length > 0) {
      const actionName = Object.keys(actions)[0];
      const action = actions[actionName];

      if (action) {
        const animationStartScroll = 500; // Start opening at 500px scroll
        const maxAnimationScroll = 2000; // Complete animation at 2000px scroll

        // Calculate animation progress only within the animation range
        const effectiveScroll = Math.max(0, scrollY - animationStartScroll);
        const animationRange = maxAnimationScroll - animationStartScroll;
        const animationProgress = Math.max(
          0,
          Math.min(effectiveScroll / animationRange, 1)
        );

        // Set animation time based on scroll progress
        const animationDuration = action.getClip().duration;
        // Only use the first half of the animation (opening part)
        const halfDuration = animationDuration * 0.5;
        const targetTime = animationProgress * halfDuration;

        // Directly set the animation time based on scroll position
        action.time = targetTime;

        // Update the mixer to apply the time change
        mixer.update(0);
      }
    }
  });

  return (
    <primitive
      ref={modelRef}
      object={clonedScene}
      scale={4.0}
      position={[0, 0, 0]}
    />
  );
};

export default MacbookModel;
