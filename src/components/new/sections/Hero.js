import React, { Suspense, useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import MacbookModel from "../3d/MacbookModel";
import Particles from "../3d/Particles";
import { TextFlameDefs, LineGlowStyles } from "../../animations/Flame";
import { Environment } from "@react-three/drei";

const Hero = () => {
  const [scrollY, setScrollY] = useState(0);
  const [displayRotation, setDisplayRotation] = useState(0);
  const [lineRotation, setLineRotation] = useState(0);
  const [floatTime, setFloatTime] = useState(0);
  const animationFrameRef = useRef();
  const targetScrollRef = useRef(0);
  const startTimeRef = useRef(Date.now());
  const [viewport, setViewport] = useState({
    w: typeof window !== "undefined" ? window.innerWidth : 1200,
    h: typeof window !== "undefined" ? window.innerHeight : 800,
  });

  useEffect(() => {
    const onResize = () => {
      setViewport({ w: window.innerWidth, h: window.innerHeight });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault();
      targetScrollRef.current = Math.max(
        0,
        Math.min(2000, targetScrollRef.current + e.deltaY * 0.3)
      );
    };

    // Smooth animation loop
    const animate = () => {
      // Update floating animation time
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      setFloatTime(elapsed);

      setScrollY((prev) => {
        const newScroll = prev + (targetScrollRef.current - prev) * 0.08;
        return newScroll;
      });

      setDisplayRotation((prev) => {
        const target = targetScrollRef.current * 0.2;
        return prev + (target - prev) * 0.08;
      });

      setLineRotation((prev) => {
        // Counter-clockwise rotation at a different pace (negative for opposite direction)
        const target = -targetScrollRef.current * 0.04;
        return prev + (target - prev) * 0.08;
      });

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
  }, []);

  // Calculate rotation for text (clockwise)
  const textRotation = displayRotation;

  // Calculate floating offsets
  const floatY = Math.sin(floatTime * 0.8) * 15; // Vertical float
  const floatX = Math.cos(floatTime * 0.6) * 10; // Horizontal float
  const floatRotate = Math.sin(floatTime * 0.5) * 2; // Slight rotation

  const topText = "PABLO RAVIOLA";
  const bottomText = "SOFTWARE ENGINEER";
  const cx = 250;
  const cy = 250;
  const r = 200;

  const fontFamily = "Fareno";
  const letterSpacing = "12";
  const fontSize = "40";

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background:
          "radial-gradient(circle at center, #0f1419 0%, #050810 40%, #000000 70%)",
        margin: 0,
        padding: 0,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Circular Text Overlay */}
      <svg
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(calc(-50% + ${floatX}px), calc(-50% + ${floatY}px)) rotate(${
            textRotation + floatRotate
          }deg)`,
          width: "min(90vh, 90vw)",
          height: "min(90vh, 90vw)",
          pointerEvents: "none",
          zIndex: 10,
          willChange: "transform",
          overflow: "visible",
        }}
        viewBox="0 0 500 500"
      >
        <defs>
          {/* Top semicircle path (left → right, above center) */}
          <path
            id="topArc"
            d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
            fill="none"
          />
          {/* Bottom semicircle path (right → left, below center) */}
          <path
            id="bottomArc"
            d={`M ${cx + r} ${cy} A ${r} ${r} 0 0 1 ${cx - r} ${cy}`}
            fill="none"
          />

          {/* Clip path for left side (outline) - rotates to stay aligned with 45° line */}
          <clipPath id="leftClip">
            <rect
              x="0"
              y="0"
              width="250"
              height="500"
              transform={`rotate(${
                45 + lineRotation - textRotation
              } ${cx} ${cy})`}
            />
          </clipPath>

          {/* Clip path for right side (solid) - rotates to stay aligned with 45° line */}
          <clipPath id="rightClip">
            <rect
              x="250"
              y="0"
              width="250"
              height="500"
              transform={`rotate(${
                45 + lineRotation - textRotation
              } ${cx} ${cy})`}
            />
          </clipPath>

          {/* Dark blue gradient for text color */}
          <linearGradient
            id="darkBlueGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#1e40af" stopOpacity="1" />
            <stop offset="50%" stopColor="#1e3a8a" stopOpacity="1" />
            <stop offset="100%" stopColor="#0c1844" stopOpacity="1" />
          </linearGradient>

          {/* Flame effects for text */}
          <TextFlameDefs />
        </defs>

        {/* Group for text with outline (right side) */}
        <g clipPath="url(#rightClip)">
          <text
            fill="transparent"
            stroke="url(#flameGradient)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fontSize={fontSize}
            fontWeight="100"
            letterSpacing={letterSpacing}
            fontFamily={`${fontFamily}, system-ui, -apple-system, sans-serif`}
            filter="url(#flameFilter) url(#flameGlow)"
            style={{ paintOrder: "stroke" }}
          >
            <textPath href="#topArc" startOffset="50%" textAnchor="middle">
              {topText}
            </textPath>
          </text>

          <text
            fill="transparent"
            stroke="url(#flameGradient)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fontSize={fontSize}
            fontWeight="100"
            letterSpacing={letterSpacing}
            fontFamily={`${fontFamily}, system-ui, -apple-system, sans-serif`}
            filter="url(#flameFilter) url(#flameGlow)"
            style={{ paintOrder: "stroke" }}
          >
            <textPath href="#bottomArc" startOffset="50%" textAnchor="middle">
              {bottomText}
            </textPath>
          </text>
        </g>

        {/* Group for text with solid fill (left side) */}
        <g clipPath="url(#leftClip)">
          <text
            fill="url(#darkBlueGradient)"
            fontSize={fontSize}
            fontWeight="900"
            letterSpacing={letterSpacing}
            fontFamily={`${fontFamily}, system-ui, -apple-system, sans-serif`}
          >
            <textPath href="#topArc" startOffset="50%" textAnchor="middle">
              {topText}
            </textPath>
          </text>

          <text
            fill="url(#darkBlueGradient)"
            fontSize={fontSize}
            fontWeight="900"
            letterSpacing={letterSpacing}
            fontFamily={`${fontFamily}, system-ui, -apple-system, sans-serif`}
          >
            <textPath href="#bottomArc" startOffset="50%" textAnchor="middle">
              {bottomText}
            </textPath>
          </text>
        </g>
      </svg>

      {/*45 Degrees line through the circle - rotates counter-clockwise*/}
      <svg
        viewBox="0 0 500 500"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(calc(-50% + ${floatX}px), calc(-50% + ${floatY}px)) rotate(${
            45 + lineRotation + floatRotate
          }deg)`,
          width: "min(90vh, 90vw)",
          height: "min(90vh, 90vw)",
          pointerEvents: "none",
          zIndex: 1,
          opacity: 1,
          willChange: "transform",
        }}
      >
        <LineGlowStyles />

        <path
          d="M 250 500 L 250 0"
          stroke="#0ea5e9"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="line-glow-animated"
        />
      </svg>

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

          {/* Particles in background */}
          <Particles scrollY={scrollY} floatY={floatY} floatX={floatX} />

          <MacbookModel
            scrollY={scrollY}
            floatY={floatY}
            floatX={floatX}
            floatRotate={floatRotate}
          />

          <Environment preset="night" />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Hero;
