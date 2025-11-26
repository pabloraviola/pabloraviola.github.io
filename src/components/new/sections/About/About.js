import React, { Suspense, useState, useEffect, useRef, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics, usePlane, useBox } from "@react-three/cannon";
import Particles from "../../3d/Particles";
import { Guy } from "../../3d/Guy";
import { Cursor } from "../../3d/helpers/Drag";
import Keyboard from "../../3d/Keyboard";
import Mouse from "../../3d/Mouse";
import Monitor from "../../3d/Monitor";
import { Environment } from "@react-three/drei";
import InformationCards from "./InformationCards";

const About = ({ onScrollToPrev, showGuy }) => {
  const [floatTime, setFloatTime] = useState(0);
  const startTimeRef = useRef(Date.now());
  const animationFrameRef = useRef();

  useEffect(() => {
    const handleWheel = (e) => {
      if (e.deltaY < 0 && onScrollToPrev) {
        // Scrolling up - go back to previous section
        e.preventDefault();
        onScrollToPrev();
      }
    };

    const animate = () => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      setFloatTime(elapsed);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [onScrollToPrev]);

  const floatY = Math.sin(floatTime * 0.8) * 15;
  const floatX = Math.cos(floatTime * 0.6) * 10;

  return (
    <div
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
            <Keyboard
              rotation={[1, -2, 0.3]}
              position={[-1.5, -0.5, 0]}
              scale={[4, 5, 5]}
              floatY={floatY}
              floatX={floatX}
            />
            <Mouse
              rotation={[1, -2, 0.4]}
              position={[-1.5, -0.8, 3]}
              scale={[3, 3, 3]}
              floatY={floatY}
              floatX={floatX}
            />
            <Monitor
              rotation={[1, -2, 0.5]}
              position={[-1, -0.8, 1]}
              scale={[0.4, 0.4, 0.4]}
              floatY={floatY}
              floatX={floatX}
            />
          </Physics>

          <Particles scrollY={0} floatY={floatY} floatX={floatX} />
        </Suspense>
        {/* <Environment preset="night" /> */}
      </Canvas>

      <div className="absolute top-[15%] right-[10%] z-10 w-1/4 h-[650px] transition-all duration-300 ease-in-out hover:scale-105">
        <InformationCards floatX={floatX} floatY={floatY} />
      </div>
    </div>
  );
};

export default About;
