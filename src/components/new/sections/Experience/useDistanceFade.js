import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const { mapLinear, clamp } = THREE.MathUtils;

/**
 * Opacity profiles. `dist` is camera.z - object.z (positive = camera is in
 * front of / before the object, negative = camera already passed it).
 */
export const fadeProfiles = {
  // Experience items: fade in while approaching, fade out after passing
  experience: (dist) => {
    if (dist > 5 && dist < 40) return clamp(mapLinear(dist, 40, 15, 0, 1), 0, 1);
    if (dist >= -5 && dist <= 5) return 1;
    if (dist < -5 && dist > -30) return clamp(mapLinear(dist, -5, -30, 1, 0), 0, 1);
    return 0;
  },
  // Project cards: appear while the camera dollies towards them, disappear once passed
  // (the camera flies through the card plane on its way to the next one, so
  // the card must be gone before the camera reaches it)
  card: (dist) => {
    if (dist >= 44) return 0;
    if (dist > 26) return clamp(mapLinear(dist, 44, 26, 0, 1), 0, 1);
    if (dist >= 8) return 1;
    if (dist > 3) return clamp(mapLinear(dist, 8, 3, 1, 0), 0, 1);
    return 0;
  },
  // Floating labels
  label: (dist) => {
    if (dist >= 42) return 0;
    if (dist > 20) return clamp(mapLinear(dist, 42, 20, 0, 1), 0, 1);
    if (dist >= 14) return 1;
    if (dist > 8) return clamp(mapLinear(dist, 14, 8, 1, 0), 0, 1);
    return 0;
  },
};

const applyOpacity = (root, opacity) => {
  root.traverse((obj) => {
    const material = obj.material;
    if (!material || material.opacity === undefined) return;
    if (material.userData.baseOpacity === undefined) {
      material.userData.baseOpacity = material.opacity;
    }
    material.opacity = material.userData.baseOpacity * opacity;
  });
};

/**
 * Smoothly fades every material inside `groupRef` based on the camera's z
 * distance to `z`, without triggering React re-renders. Returns a ref with the
 * current opacity (useful to gate pointer interactions).
 */
export function useDistanceFade(groupRef, z, profile = fadeProfiles.experience) {
  const opacityRef = useRef(0);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const dist = state.camera.position.z - z;
    const target = profile(dist);
    const k = 1 - Math.exp(-delta * 6);
    let next = opacityRef.current + (target - opacityRef.current) * k;
    if (Math.abs(next - target) < 0.002) next = target;
    opacityRef.current = next;

    group.visible = next > 0.004;
    if (group.visible) applyOpacity(group, next);
  });

  return opacityRef;
}
