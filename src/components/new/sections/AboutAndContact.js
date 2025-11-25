import React, { Suspense, useState, useEffect, useRef, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics, usePlane, useBox } from "@react-three/cannon";
import Particles from "../3d/Particles";
import { Guy } from "../3d/Guy";
import { Cursor } from "../3d/helpers/Drag";
import Keyboard from "../3d/Keyboard";
import Mouse from "../3d/Mouse";
import Monitor from "../3d/Monitor";
import { Environment } from "@react-three/drei";

function Floor(props) {
  const [ref] = usePlane(() => ({ type: "Static", ...props }));
  return (
    <mesh ref={ref}>
      <planeGeometry args={[100, 100]} />
      <meshBasicMaterial transparent opacity={0} />
    </mesh>
  );
}

const AboutAndContact = ({ onScrollToPrev, showGuy }) => {
  const [floatTime, setFloatTime] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const aboutMeRef = useRef(null);
  const startTimeRef = useRef(Date.now());
  const animationFrameRef = useRef();
  const lastMouseUpdateRef = useRef(0);

  useEffect(() => {
    const handleWheel = (e) => {
      if (e.deltaY < 0 && onScrollToPrev) {
        // Scrolling up - go back to previous section
        e.preventDefault();
        onScrollToPrev();
      }
    };

    const handleMouseMove = (e) => {
      const now = Date.now();
      if (now - lastMouseUpdateRef.current < 16) return; // Throttle to ~60fps
      lastMouseUpdateRef.current = now;

      if (aboutMeRef.current && isHovering) {
        const rect = aboutMeRef.current.getBoundingClientRect();

        // Calculate relative position within the panel (0 to 1 range)
        const relativeX = (e.clientX - rect.left) / rect.width;
        const relativeY = (e.clientY - rect.top) / rect.height;

        // Convert to -1 to 1 range for tilt calculation
        const mouseX = (relativeX - 0.5) * 2;
        const mouseY = (relativeY - 0.5) * 2;

        // Clamp to ensure we stay within bounds
        const clampedX = Math.max(-1, Math.min(1, mouseX));
        const clampedY = Math.max(-1, Math.min(1, mouseY));

        setMousePosition({ x: clampedX, y: clampedY });
      }
    };

    const animate = () => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      setFloatTime(elapsed);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("mousemove", handleMouseMove);
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [onScrollToPrev, isHovering]);

  const floatY = Math.sin(floatTime * 0.8) * 15;
  const floatX = Math.cos(floatTime * 0.6) * 10;

  // Calculate panel transforms
  const panelFloatY = Math.sin(floatTime * 0.5) * 10;
  const panelFloatX = Math.cos(floatTime * 0.3) * 5;
  // For natural "pressure" effect, panel should tilt AWAY from cursor
  // rotateX: positive = tilt backward (top edge goes back), negative = tilt forward
  // rotateY: positive = tilt left (left edge goes back), negative = tilt right
  const tiltX = isHovering ? mousePosition.y * 15 : 0; // Cursor down = positive Y = tilt backward
  const tiltY = isHovering ? mousePosition.x * 15 : 0; // Cursor right = positive X = tilt left

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
            <Floor position={[0, -15, 0]} rotation={[-Math.PI / 2, 0, 0]} />
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

      {/* About Me Panel */}
      <div
        ref={aboutMeRef}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => {
          setIsHovering(false);
        }}
        style={{
          position: "absolute",
          right: "2%",
          top: "50%",
          transform: `translate(0%, -50%) translate(${panelFloatX}px, ${panelFloatY}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
          width: "45vw",
          padding: "40px 50px",
          background: "rgba(15, 20, 25, 0.85)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "25px",
          color: "#ffffff",
          zIndex: 15,
          cursor: "pointer",
          transition: "box-shadow 0.3s ease, color 0.3s ease",
          transformStyle: "preserve-3d",
          boxShadow: isHovering
            ? "0 30px 80px rgba(14, 165, 233, 0.4), 0 0 50px rgba(255, 255, 255, 0.15)"
            : "0 20px 50px rgba(0, 0, 0, 0.6)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <h2
          style={{
            fontSize: "3.5rem",
            fontWeight: "bold",
            fontStyle: "italic",
            marginBottom: "40px",
            color: isHovering ? "#0ea5e9" : "#ffffff",
            fontFamily: "Fareno, system-ui, -apple-system, sans-serif",
            textShadow: "0 0 20px rgba(14, 165, 233, 0.7)",
            transition: "color 0.3s ease",
            textAlign: "center",
          }}
        >
          ABOUT ME
        </h2>
        <p
          style={{
            fontSize: "1.3rem",
            lineHeight: "1.8",
            color: "#d1d5db",
            fontFamily: "Fareno, system-ui, sans-serif",
            margin: 0,
            textAlign: "justify",
          }}
        >
          I'm a fullstack web developer and a systems engineer from San
          Francisco, Córdoba - ARG. I'm building my career as a developer
          learning as much as I can about the new technologies that come across.
          I consider myself as a proactive person who's always willing to take
          new challenges in order to improve his skills. On my spare time, I
          like listening to music and playing drums, I also love travelling
          whenever I have the chance, whether it is going on a short trip or
          taking a journey abroad for a couple of months.
        </p>
      </div>
    </div>
  );
};

export default AboutAndContact;
