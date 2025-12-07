import React, { Suspense, useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/cannon";
import Particles from "../../3d/Particles";
import { Guy } from "../../3d/Guy";
import { Cursor } from "../../3d/helpers/Drag";
import Keyboard from "../../3d/Keyboard";
import Mouse from "../../3d/Mouse";
import Monitor from "../../3d/Monitor";
import InformationCards from "./InformationCards";
import Desktop from "../../3d/Desktop";
import CoffeeMug from "../../3d/CoffeeMug";
import Plant from "../../3d/Plant";
const About = ({
  onScrollToPrev,
  onScrollToNext,
  showGuy,
  isActive = true,
}) => {
  const [floatTime, setFloatTime] = useState(0);
  const startTimeRef = useRef(Date.now());
  const animationFrameRef = useRef();
  const containerRef = useRef(null);
  const scrollBufferRef = useRef({ up: 0, down: 0 });

  useEffect(() => {
    if (!isActive) {
      scrollBufferRef.current = { up: 0, down: 0 };
      return;
    }

    const handleWheel = (e) => {
      e.preventDefault();
      e.stopPropagation();

      const delta = e.deltaY;
      const threshold = 150; // Accumulated scroll needed to trigger navigation

      if (delta < 0) {
        // Scrolling up
        scrollBufferRef.current.up += Math.abs(delta);
        scrollBufferRef.current.down = 0; // Reset opposite direction

        if (scrollBufferRef.current.up > threshold && onScrollToPrev) {
          onScrollToPrev();
          scrollBufferRef.current.up = 0;
        }
      } else if (delta > 0) {
        // Scrolling down
        scrollBufferRef.current.down += Math.abs(delta);
        scrollBufferRef.current.up = 0; // Reset opposite direction

        if (scrollBufferRef.current.down > threshold && onScrollToNext) {
          onScrollToNext();
          scrollBufferRef.current.down = 0;
        }
      }
    };

    const animate = () => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      setFloatTime(elapsed);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
    }
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [onScrollToPrev, onScrollToNext, isActive]);

  const floatY = Math.sin(floatTime * 0.8) * 15;
  const floatX = Math.cos(floatTime * 0.6) * 10;

  return (
    <div
      ref={containerRef}
      className="h-screen"
      style={{
        background:
          "radial-gradient(circle at center, #0f1419 0%, #050810 40%, #000000 70%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 35 }}
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          zIndex: 5,
        }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <spotLight
            position={[10, 10, 10]}
            angle={0.15}
            penumbra={1}
            intensity={1}
          />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />

          <Physics allowSleep={false} iterations={15} gravity={[0, 0, 0]}>
            <Cursor />
            {showGuy && <Guy rotation={[0, 0.5, 0]} position={[-12, 0, -30]} />}
            <group position={[floatX * 0.003, 0.6 + floatY * 0.003, 0]}>
              <Keyboard
                rotation={[1, -2, 0.3]}
                position={[-1.5, -0.8, 0.5]}
                scale={[2.5, 3.5, 3.5]}
                // floatY={floatY}
                // floatX={floatX}
              />
              <Mouse
                rotation={[1, -2, 0.4]}
                position={[-1.3, -1.1, 3]}
                scale={[2, 2, 2]}
                // floatY={floatY}
                floatX={Math.sin(floatX) * 0.3}
              />
              <Monitor
                rotation={[1, -2, 0.5]}
                position={[-1, -0.9, 1]}
                scale={[0.3, 0.3, 0.3]}
                // floatY={floatY}
                // floatX={floatX}
              />
              <Plant
                rotation={[0, 2, 0.5]}
                position={[-0.9, -1.8, -0.8]}
                scale={[3.5, 3.5, 3.5]}
              />
              <CoffeeMug
                rotation={[0, 2, 0.5]}
                position={[-1, -1.2, 2.5]}
                scale={[0.0015, 0.0015, 0.0015]}
              />
              <Desktop
                rotation={[1, -2, 0.5]}
                position={[-3.5, -1, -1.5]}
                scale={[0.9, 0.9, 1]}
                // floatY={floatY}
                // floatX={floatX}
              />
            </group>
          </Physics>

          <Particles scrollY={0} floatY={floatY} floatX={floatX} />
        </Suspense>
      </Canvas>

      <div className="absolute top-[15%] right-[10%] z-10 w-1/4 h-[650px] transition-all duration-300 ease-in-out hover:scale-105">
        <InformationCards floatX={floatX} floatY={floatY} />
      </div>
    </div>
  );
};

export default About;
