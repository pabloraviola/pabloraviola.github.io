import React, { Suspense, useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, Line, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import Particles from "../../3d/Particles";

export const experiences = [
  {
    period: "[2022-NOW]",
    position: "SOFTWARE ENGINEER",
    company: "WHITE PROMPT",
    description:
      "Working on scalable web applications using React, Node.js and AWS.",
  },
  {
    period: "[2021-2022]",
    position: "TECH LEAD",
    company: "CENCOSUD S.A",
    description:
      "Leading technical teams and architectural decisions for e-commerce platforms.",
  },
  {
    period: "[2021-2022]",
    position: "FULLSTACK WEB DEVELOPER",
    company: "SIMTLIX S.R.L",
    description: "Full stack development for international clients.",
  },
  {
    period: "[2019-2021]",
    position: "FULLSTACK WEB DEVELOPER",
    company: "SANCOR SEGUROS",
    description: "Developing internal tools and insurance management systems.",
  },
  {
    period: "[2019-2021]",
    position: "FULLSTACK WEB DEVELOPER",
    company: "E-PARTNERS S.R.L",
    description: "Web development using modern JavaScript frameworks.",
  },
  {
    period: "[2017-2018]",
    position: "WORK AND TRAVEL USA",
    company: "VAIL RESORTS",
    description: "International work experience in Keystone, Colorado.",
  },
];

// Spacing between experience items
const ITEM_SPACING = 15;
const TOTAL_DEPTH = experiences.length * ITEM_SPACING;

const ExperienceItem = ({ position, experience, align }) => {
  const groupRef = useRef();
  const opacityRef = useRef(0);
  const [, forceUpdate] = useState(0);

  useFrame((state) => {
    if (!groupRef.current) return;
    const itemZ = position[2];
    const camZ = state.camera.position.z;
    const dist = camZ - itemZ;

    // Fade in when camera approaches, stay visible when passing
    let targetOpacity = 0;
    if (dist > 5 && dist < 40) {
      // Approaching - fade in
      targetOpacity = THREE.MathUtils.mapLinear(dist, 40, 15, 0, 1);
      targetOpacity = THREE.MathUtils.clamp(targetOpacity, 0, 1);
    } else if (dist >= -5 && dist <= 5) {
      // Right at the item
      targetOpacity = 1;
    } else if (dist < -5 && dist > -30) {
      // Passed it - fade out slowly
      targetOpacity = THREE.MathUtils.mapLinear(dist, -5, -30, 1, 0);
      targetOpacity = THREE.MathUtils.clamp(targetOpacity, 0, 1);
    }

    // Smooth lerp
    opacityRef.current = THREE.MathUtils.lerp(
      opacityRef.current,
      targetOpacity,
      0.08
    );

    // Force re-render for opacity changes
    if (Math.abs(opacityRef.current - targetOpacity) > 0.01) {
      forceUpdate((n) => n + 1);
    }
  });

  const opacity = opacityRef.current;

  return (
    <group position={position} ref={groupRef}>
      {/* Glowing node on timeline */}
      <mesh position={[align === "left" ? 0.8 : -0.8, 0, 0]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial
          color="#60a5fa"
          emissive="#60a5fa"
          emissiveIntensity={3}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Glow ring */}
      <mesh
        position={[align === "left" ? 0.8 : -0.8, 0, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[0.3, 0.5, 32]} />
        <meshBasicMaterial
          color="#60a5fa"
          transparent
          opacity={opacity * 0.5}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Text Card */}
      <group position={[align === "left" ? -1.5 : 1.5, 0, 0]}>
        <Text
          fontSize={0.6}
          anchorX={align === "left" ? "right" : "left"}
          anchorY="middle"
          maxWidth={5}
          fillOpacity={opacity}
        >
          {experience.company}
          <meshStandardMaterial
            color="#60a5fa"
            emissive="#38bdf8"
            emissiveIntensity={0.6}
            transparent
            opacity={opacity}
          />
        </Text>
        <Text
          fontSize={0.35}
          anchorX={align === "left" ? "right" : "left"}
          anchorY="top"
          position={[0, -0.5, 0]}
          maxWidth={4}
          fillOpacity={opacity * 0.8}
        >
          {experience.position}
          <meshBasicMaterial
            color="#94a3b8"
            transparent
            opacity={opacity * 0.8}
          />
        </Text>
        <Text
          fontSize={0.25}
          anchorX={align === "left" ? "right" : "left"}
          anchorY="top"
          position={[0, -1, 0]}
          maxWidth={4}
          fillOpacity={opacity * 0.6}
        >
          {experience.period}
          <meshBasicMaterial
            color="#64748b"
            transparent
            opacity={opacity * 0.6}
          />
        </Text>
      </group>
    </group>
  );
};

const Timeline = ({ scrollProgress }) => {
  const lineRef = useRef();

  // Generate zig-zag path points
  const { fullPath, pathLength } = useMemo(() => {
    const points = [];
    // Start point - in front of camera
    points.push(new THREE.Vector3(0, 0, 15));

    experiences.forEach((_, i) => {
      const x = i % 2 === 0 ? -3 : 3;
      const z = -i * ITEM_SPACING;
      points.push(new THREE.Vector3(x, 0, z));
    });

    // End point
    points.push(
      new THREE.Vector3(
        experiences.length % 2 === 0 ? -3 : 3,
        0,
        -TOTAL_DEPTH - 10
      )
    );

    const curve = new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.3);
    return {
      fullPath: curve.getPoints(500),
      pathLength: curve.getLength(),
    };
  }, []);

  // Calculate how many points to show based on scroll
  const visiblePoints = useMemo(() => {
    // Always show at least a starting segment
    const minPoints = 10;
    const totalPoints = fullPath.length;
    // Progress determines how much of the line is drawn
    const count = Math.max(
      minPoints,
      Math.floor((scrollProgress + 0.05) * totalPoints)
    );
    return fullPath.slice(0, Math.min(count, totalPoints));
  }, [scrollProgress, fullPath]);

  return (
    <>
      {/* Background trace - full path faintly visible */}
      {/* <Line
        points={fullPath}
        color="#1e3a5f"
        lineWidth={2}
        transparent
        opacity={0.15}
      /> */}

      {/* Active timeline - bright and visible */}
      <Line
        ref={lineRef}
        points={visiblePoints}
        color="#38bdf8"
        lineWidth={6}
        transparent
        opacity={0.9}
      />

      {/* Glow line overlay */}
      <Line
        points={visiblePoints}
        color="#60a5fa"
        lineWidth={12}
        transparent
        opacity={0.3}
      />

      {/* Experience items */}
      {experiences.map((exp, i) => (
        <ExperienceItem
          key={i}
          position={[i % 2 === 0 ? -3 : 3, 0, -i * ITEM_SPACING]}
          experience={exp}
          align={i % 2 === 0 ? "left" : "right"}
        />
      ))}
    </>
  );
};

const CameraController = ({ scrollProgress }) => {
  const cameraPositionRef = useRef(new THREE.Vector3(0, 1.5, 20));
  const timeRef = useRef(0);

  useFrame((state, delta) => {
    timeRef.current += delta;

    // Target camera Z based on scroll progress
    const startZ = 20;
    const endZ = -TOTAL_DEPTH + 5;
    const targetZ = startZ + scrollProgress * (endZ - startZ);

    // Calculate which "segment" we're in for subtle horizontal following
    const segmentIndex = Math.abs(targetZ - startZ) / ITEM_SPACING;
    const targetX = Math.sin(segmentIndex * Math.PI * 0.5) * 0.8;

    // Fixed camera height - just slightly elevated
    const targetY = 1.5;

    // Smooth camera movement with easing
    cameraPositionRef.current.x = THREE.MathUtils.lerp(
      cameraPositionRef.current.x,
      targetX,
      0.04
    );
    cameraPositionRef.current.z = THREE.MathUtils.lerp(
      cameraPositionRef.current.z,
      targetZ,
      0.06
    );

    // Subtle floating motion for organic feel
    const floatY = Math.sin(timeRef.current * 0.5) * 0.08;
    const floatX = Math.cos(timeRef.current * 0.3) * 0.05;

    state.camera.position.x = cameraPositionRef.current.x + floatX;
    state.camera.position.y = targetY + floatY;
    state.camera.position.z = cameraPositionRef.current.z;

    // Fixed look-ahead - always look straight ahead with slight downward angle
    const lookAheadZ = cameraPositionRef.current.z - 15;
    state.camera.lookAt(0, -0.5, lookAheadZ);
  });

  return null;
};

const ExperienceSection = ({ onScrollToPrev, onScrollToNext, isActive }) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const targetProgressRef = useRef(0);
  const exitBufferRef = useRef(0);
  const containerRef = useRef(null);

  useEffect(() => {
    // Reset when becoming active
    if (isActive) {
      targetProgressRef.current = 0;
      setScrollProgress(0);
      exitBufferRef.current = 0;
    }
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;

    const handleWheel = (e) => {
      e.preventDefault();
      e.stopPropagation();

      // Calculate scroll delta - normalized for different devices
      const rawDelta = e.deltaY;
      const normalizedDelta = rawDelta * 0.0006;

      // Clamp to prevent huge jumps
      const delta = Math.max(-0.03, Math.min(0.03, normalizedDelta));

      const currentProgress = targetProgressRef.current;
      let newProgress = currentProgress + delta;

      // Handle boundaries
      if (newProgress < 0) {
        // User is scrolling UP and we're at the start
        // First, clamp progress to 0
        newProgress = 0;

        // Accumulate exit intent (only when already at 0)
        if (currentProgress <= 0.01) {
          exitBufferRef.current += Math.abs(delta);

          // Need significant scroll to exit
          if (exitBufferRef.current > 0.15) {
            if (onScrollToPrev) {
              onScrollToPrev();
            }
            exitBufferRef.current = 0;
            return;
          }
        }
      } else if (newProgress > 1) {
        newProgress = 1;
        // Could add exit forward logic here if needed
      } else {
        // Normal scrolling - reset exit buffer
        exitBufferRef.current = 0;
      }

      targetProgressRef.current = newProgress;
    };

    // Animation loop for smooth progress updates
    let animationFrame;
    const animate = () => {
      setScrollProgress((prev) => {
        const target = targetProgressRef.current;
        const diff = target - prev;

        // Smooth interpolation
        return prev + diff * 0.08;
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel);
      }
      cancelAnimationFrame(animationFrame);
    };
  }, [isActive, onScrollToPrev, onScrollToNext]);

  return (
    <div
      ref={containerRef}
      style={{
        height: "100vh",
        width: "100vw",
        position: "relative",
        overflow: "hidden",
        background:
          "radial-gradient(circle at center, #0f1419 0%, #050810 40%, #000000 70%)",
      }}
    >
      {/* Vignette - always visible */}
      {/* <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle, transparent 50%, rgba(0,0,0,0.6) 100%)",
          pointerEvents: "none",
          zIndex: 10,
        }}
      /> */}

      <Canvas>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 1.5, 20]} fov={55} />
          <CameraController scrollProgress={scrollProgress} />

          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
          <pointLight
            position={[-10, 5, -10]}
            intensity={0.5}
            color="#38bdf8"
          />
          <pointLight position={[0, -3, 0]} intensity={0.3} color="#60a5fa" />

          <Timeline scrollProgress={scrollProgress} />

          {/* Particles at different Z depths for depth effect */}
          <Particles position={[0, 0, 0]} />
          <Particles position={[0, 0, -TOTAL_DEPTH / 2]} />
          <Particles position={[0, 0, -TOTAL_DEPTH]} />
        </Suspense>
      </Canvas>

      {/* Title with progress indicator */}
      <div className="absolute top-10 left-1/2 transform -translate-x-1/2 z-20">
        <h1
          className="text-6xl font-bold text-white tracking-widest mb-4"
          style={{ fontFamily: "Fareno, system-ui, sans-serif" }}
        >
          EXPERIENCE
        </h1>
      </div>

      {/* Scroll hint */}
      {scrollProgress < 0.1 && (
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 text-gray-500 text-sm animate-pulse">
          Scroll to explore
        </div>
      )}
    </div>
  );
};

export default ExperienceSection;
