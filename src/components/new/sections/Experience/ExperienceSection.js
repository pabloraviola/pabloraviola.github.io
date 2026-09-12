import React, { Suspense, useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Text,
  Line,
  PerspectiveCamera,
  useGLTF,
  useTexture,
} from "@react-three/drei";
import * as THREE from "three";
import Particles from "../../3d/Particles";
import { experiences } from "./experiences";
import { projects } from "./projects";
import {
  journey,
  experiencePosition,
  CAMERA_FOV,
} from "./journeyPath";
import { useDistanceFade, fadeProfiles } from "./useDistanceFade";
import ProjectCard from "./ProjectCard";

export { experiences };

// Color overrides for specific logos
const logoColorOverrides = {
  "vue.glb": ["#42b883", "#35495e"], // Vue.js brand colors (green, dark blue)
  "aws.glb": ["#FF9900", "white"], // AWS brand colors (orange, white)
  "docker.glb": ["#1D63ED"], // Docker brand colors (blue)
};

// 3D Logo component - loads a GLB model, normalizes size, and spins it
const Logo3D = ({
  modelPath,
  position = [0, 0, 0],
  targetSize = 0.3,
  speed = 1,
}) => {
  const groupRef = useRef();
  const { scene } = useGLTF(modelPath);

  // Get color overrides for this logo
  const colorOverride = useMemo(() => {
    const fileName = modelPath.split("/").pop();
    return logoColorOverrides[fileName] || null;
  }, [modelPath]);

  // Clone and normalize the scene
  const { normalizedScene, scale } = useMemo(() => {
    const cloned = scene.clone();

    // Compute bounding box to normalize size
    const box = new THREE.Box3().setFromObject(cloned);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    const normalizeScale = targetSize / maxDim;

    // Center the model
    const center = new THREE.Vector3();
    box.getCenter(center);
    cloned.position.sub(center.multiplyScalar(normalizeScale));

    return { normalizedScene: cloned, scale: normalizeScale };
  }, [scene, targetSize]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * speed;
    }
  });

  // Give every mesh its own transparent material (opacity is driven by the
  // parent's distance fade) and apply color overrides
  useEffect(() => {
    let meshIndex = 0;
    normalizedScene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material = child.material.clone();
        child.material.transparent = true;
        child.material.userData.baseOpacity = 1;

        if (colorOverride && colorOverride[meshIndex]) {
          child.material.color = new THREE.Color(colorOverride[meshIndex]);
        }
        meshIndex++;
      }
    });
  }, [normalizedScene, colorOverride]);

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <primitive object={normalizedScene} />
    </group>
  );
};

const ExperienceItem = ({ position, experience, align }) => {
  const groupRef = useRef();
  useDistanceFade(groupRef, position[2], fadeProfiles.experience);

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
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Text Card */}
      <group position={[align === "left" ? -1.5 : 1.5, 0, 0]}>
        <Text
          font="/fonts/Fareno.otf"
          fontSize={0.65}
          anchorX={align === "left" ? "right" : "left"}
          anchorY="middle"
          whiteSpace="nowrap"
        >
          {experience.company}
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.3}
            transparent
          />
        </Text>
        <Text
          font="/fonts/Fareno.otf"
          fontSize={0.38}
          anchorX={align === "left" ? "right" : "left"}
          anchorY="top"
          position={[0, -0.4, 0]}
          whiteSpace="nowrap"
        >
          {experience.position}
          <meshStandardMaterial
            color="#3b82f6"
            emissive="#2563eb"
            emissiveIntensity={0.6}
            transparent
          />
        </Text>
        <Text
          font="/fonts/Fareno.otf"
          fontSize={0.25}
          anchorX={align === "left" ? "right" : "left"}
          anchorY="top"
          position={[0, -1, 0]}
          whiteSpace="nowrap"
        >
          {experience.period}
          <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
        </Text>

        {/* Tech Logos - Spinning 3D, next to period text */}
        {experience.techLogos && experience.techLogos.length > 0 && (
          <group position={[align === "left" ? -2 : 2, -1.15, 0]}>
            {experience.techLogos.map((logo, index) => {
              // Fix alignment for specific logos
              const yOffset = logo.includes("aws") ? -0.09 : 0;

              return (
                <Logo3D
                  key={index}
                  modelPath={logo}
                  position={[
                    align === "left" ? -index * 0.55 : index * 0.55,
                    yOffset,
                    0,
                  ]}
                  targetSize={0.3}
                  speed={2}
                />
              );
            })}
          </group>
        )}
      </group>
    </group>
  );
};

// Floating "PORTFOLIO" label between the last experience and the first card
const PortfolioLabel = () => {
  const groupRef = useRef();
  useDistanceFade(groupRef, journey.portfolioLabel.z, fadeProfiles.label);

  return (
    <group ref={groupRef} position={journey.portfolioLabel.position}>
      <Text
        font="/fonts/Fareno.otf"
        fontSize={2.4}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.12}
        whiteSpace="nowrap"
        fillOpacity={0.05}
        strokeWidth={0.035}
        strokeColor="#ffffff"
        strokeOpacity={0.85}
      >
        PORTFOLIO
        <meshBasicMaterial color="#ffffff" transparent toneMapped={false} />
      </Text>
    </group>
  );
};

// Mounts children once the camera gets close enough (lazy texture loading)
const LazyMount = ({ z, distance = 90, children }) => {
  const [mounted, setMounted] = useState(false);
  useFrame((state) => {
    if (!mounted && state.camera.position.z - z < distance) setMounted(true);
  });
  return mounted ? children : null;
};

// The continuous line that is "drawn" as the user scrolls
const JourneyLine = ({ scrollRef }) => {
  const mainRef = useRef();
  const glowRef = useRef();
  const tipRef = useRef();
  const tipGlowRef = useRef();

  useFrame(() => {
    const s = scrollRef.current.current;
    const count = journey.segmentCountAt(s);
    if (mainRef.current) mainRef.current.geometry.instanceCount = count;
    if (glowRef.current) glowRef.current.geometry.instanceCount = count;
    if (tipRef.current) {
      journey.pointAt(s, tipRef.current.position);
      tipGlowRef.current.position.copy(tipRef.current.position);
    }
  });

  return (
    <>
      {/* Active timeline - bright and visible */}
      <Line
        ref={mainRef}
        points={journey.points}
        color="#38bdf8"
        lineWidth={6}
        transparent
        opacity={0.9}
      />

      {/* Glow line overlay */}
      <Line
        ref={glowRef}
        points={journey.points}
        color="#60a5fa"
        lineWidth={12}
        transparent
        opacity={0.3}
      />

      {/* Line tip */}
      <mesh ref={tipRef}>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshBasicMaterial color="#e0f2fe" toneMapped={false} />
      </mesh>
      <mesh ref={tipGlowRef}>
        <sphereGeometry args={[0.32, 16, 16]} />
        <meshBasicMaterial
          color="#60a5fa"
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </>
  );
};

const Timeline = ({ scrollRef }) => {
  return (
    <>
      <JourneyLine scrollRef={scrollRef} />

      {/* Experience items */}
      {experiences.map((exp, i) => (
        <ExperienceItem
          key={i}
          position={experiencePosition(i).toArray()}
          experience={exp}
          align={i % 2 === 0 ? "left" : "right"}
        />
      ))}

      <PortfolioLabel />

      {/* Portfolio cards */}
      {journey.cards.map((card) => (
        <LazyMount key={card.index} z={card.z}>
          <ProjectCard project={projects[card.index]} z={card.z} />
        </LazyMount>
      ))}
    </>
  );
};

// Smoothly moves the drawn distance towards the wheel target and reports
// coarse UI state (title opacity / hint) to the DOM overlay
const ScrollDriver = ({ scrollRef, onUiChange }) => {
  const lastUi = useRef({ titleOpacity: null, showHint: null });

  useFrame((state, delta) => {
    const scroll = scrollRef.current;
    const k = 1 - Math.exp(-delta * 5);
    scroll.current += (scroll.target - scroll.current) * k;
    if (Math.abs(scroll.target - scroll.current) < 0.001) {
      scroll.current = scroll.target;
    }

    const travelled = scroll.current - scroll.min;
    const titleOpacity =
      Math.round(THREE.MathUtils.clamp(1 - travelled / 4, 0, 1) * 40) / 40;
    const showHint = travelled < 12;
    if (
      titleOpacity !== lastUi.current.titleOpacity ||
      showHint !== lastUi.current.showHint
    ) {
      lastUi.current = { titleOpacity, showHint };
      onUiChange(lastUi.current);
    }
  });

  return null;
};

const CameraRig = ({ scrollRef }) => {
  const desired = useMemo(
    () => ({ position: new THREE.Vector3(), target: new THREE.Vector3() }),
    []
  );
  const current = useMemo(
    () => ({
      position: new THREE.Vector3(0, 1.5, 22),
      target: new THREE.Vector3(0, -0.5, 7),
    }),
    []
  );
  const timeRef = useRef(0);

  useFrame((state, delta) => {
    timeRef.current += delta;

    const aspect = state.size.width / Math.max(1, state.size.height);
    journey.getCameraPose(scrollRef.current.current, aspect, desired);

    // Jump straight to the pose after a section-level reposition
    if (scrollRef.current.snapCamera) {
      scrollRef.current.snapCamera = false;
      current.position.copy(desired.position);
      current.target.copy(desired.target);
    }

    // Smooth camera movement with easing
    const k = 1 - Math.exp(-delta * 4.5);
    current.position.lerp(desired.position, k);
    current.target.lerp(desired.target, k);

    // Subtle floating motion for organic feel
    const floatY = Math.sin(timeRef.current * 0.5) * 0.08;
    const floatX = Math.cos(timeRef.current * 0.3) * 0.05;

    state.camera.position.set(
      current.position.x + floatX,
      current.position.y + floatY,
      current.position.z
    );
    state.camera.lookAt(current.target);
  });

  return null;
};

// Scroll tuning
const LEAD = 6; // the line always starts a bit ahead of the camera
const UNITS_PER_PIXEL = 0.07; // world units of line per wheel pixel
const MAX_STEP = 3.5; // clamp per wheel event
const EXIT_THRESHOLD = 15; // extra scrolling needed at the edges to leave the section

const ExperienceSection = ({
  onScrollToPrev,
  onScrollToNext,
  isActive,
  entry = "start", // "start" | "end" - where the timeline resumes when activated
}) => {
  const scrollRef = useRef({
    min: LEAD,
    max: journey.totalLength,
    target: LEAD,
    current: LEAD,
  });
  const exitBufferRef = useRef(0);
  const containerRef = useRef(null);
  const [ui, setUi] = useState({ titleOpacity: 1, showHint: true });

  // Warm up the first card's textures while the user is still in the timeline
  useEffect(() => {
    const first = projects[0];
    if (!first) return;
    [first.mainImage, ...(first.images || [])].forEach((url) =>
      useTexture.preload(url)
    );
  }, []);

  useEffect(() => {
    // Jump to the start (coming from About) or the end (coming back from
    // Contact) when becoming active
    if (isActive) {
      const scroll = scrollRef.current;
      const resumeAt = entry === "end" ? scroll.max : scroll.min;
      scroll.target = resumeAt;
      scroll.current = resumeAt;
      scroll.snapCamera = true;
      exitBufferRef.current = 0;
    }
    // `entry` is intentionally read only at activation time
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;

    const handleWheel = (e) => {
      e.preventDefault();
      e.stopPropagation();

      const scroll = scrollRef.current;

      // Normalize wheel delta into path units and clamp to prevent huge jumps
      const rawDelta = THREE.MathUtils.clamp(
        e.deltaY * UNITS_PER_PIXEL,
        -MAX_STEP,
        MAX_STEP
      );
      // Slow down while painting a card border, speed up on the straight runs
      const delta = rawDelta * journey.speedFactorAt(scroll.target);

      const previous = scroll.target;
      let next = previous + delta;

      if (next < scroll.min) {
        // At the start and scrolling up: accumulate exit intent
        next = scroll.min;
        if (previous <= scroll.min + 0.5) {
          exitBufferRef.current += Math.abs(delta);
          if (exitBufferRef.current > EXIT_THRESHOLD) {
            exitBufferRef.current = 0;
            if (onScrollToPrev) onScrollToPrev();
            return;
          }
        }
      } else if (next > scroll.max) {
        // At the end and scrolling down
        next = scroll.max;
        if (previous >= scroll.max - 0.5) {
          exitBufferRef.current += Math.abs(delta);
          if (exitBufferRef.current > EXIT_THRESHOLD) {
            exitBufferRef.current = 0;
            if (onScrollToNext) onScrollToNext();
            return;
          }
        }
      } else {
        exitBufferRef.current = 0;
      }

      scroll.target = next;
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel);
      }
    };
  }, [isActive, onScrollToPrev, onScrollToNext]);

  // Particle clusters spread along the whole journey
  const particleDepths = useMemo(() => {
    const depths = [];
    for (let z = 0; z > journey.endZ - 20; z -= 45) depths.push(z);
    return depths;
  }, []);

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
      <Canvas>
        <Suspense fallback={null}>
          <PerspectiveCamera
            makeDefault
            position={[0, 1.5, 22]}
            fov={CAMERA_FOV}
            near={0.1}
            far={400}
          />
          <ScrollDriver scrollRef={scrollRef} onUiChange={setUi} />
          <CameraRig scrollRef={scrollRef} />

          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
          <pointLight
            position={[-10, 5, -10]}
            intensity={0.5}
            color="#38bdf8"
          />
          <pointLight position={[0, -3, 0]} intensity={0.3} color="#60a5fa" />

          <Timeline scrollRef={scrollRef} />

          {/* Particles at different Z depths for depth effect */}
          {particleDepths.map((z) => (
            <Particles key={z} position={[0, 0, z]} />
          ))}
        </Suspense>
      </Canvas>

      <div
        className="absolute top-48 left-0 right-0 transform -translate-y-1/2 z-20 pointer-events-none"
        style={{
          opacity: ui.titleOpacity,
          transition: "opacity 0.15s ease-out",
        }}
      >
        <svg
          viewBox="0 0 1200 200"
          style={{
            width: "100%",
            height: "auto",
            overflow: "visible",
          }}
        >
          <defs>
            <filter id="subtleGlow" x="-5%" y="-50%" width="110%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <text
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.85)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fontSize="160"
            fontWeight="100"
            letterSpacing="0.1em"
            fontFamily="Fareno, system-ui, sans-serif"
            filter="url(#subtleGlow)"
            style={{ paintOrder: "stroke" }}
          >
            EXPERIENCE
          </text>
        </svg>
      </div>

      {/* Scroll hint */}
      {ui.showHint && (
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 text-gray-500 text-sm animate-pulse">
          Scroll to explore
        </div>
      )}
    </div>
  );
};

export default ExperienceSection;
