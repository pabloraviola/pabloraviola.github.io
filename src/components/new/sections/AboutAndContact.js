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

const AboutAndContact = ({ onScrollToPrev, showGuy }) => {
  const [floatTime, setFloatTime] = useState(0);
  const startTimeRef = useRef(Date.now());
  const animationFrameRef = useRef();
  const [isDeckHovered, setIsDeckHovered] = useState(false);

  const cards = [
    {
      title: "About Me",
      description:
        "I'm a fullstack web developer and a systems engineer from San Francisco, Córdoba - ARG. I'm building my career as a developer learning as much as I can about the new technologies that come across. I consider myself as a proactive person who's always willing to take new challenges in order to improve his skills. On my spare time, I like listening to music and playing drums, I also love travelling whenever I have the chance, whether it is going on a short trip or taking a journey abroad for a couple of months.",
    },
    {
      title: "Contact",
      description:
        "If you want to get in touch with me, you can do so by sending an email to contact@juanfranco.com.ar. You can also find me on LinkedIn, GitHub and Instagram.",
    },
    {
      title: "Projects",
      description:
        "I'm a fullstack web developer and a systems engineer from San Francisco, Córdoba - ARG. I'm building my career as a developer learning as much as I can about the new technologies that come across. I consider myself as a proactive person who's always willing to take new challenges in order to improve his skills. On my spare time, I like listening to music and playing drums, I also love travelling whenever I have the chance, whether it is going on a short trip or taking a journey abroad for a couple of months.",
    },
  ];

  const [activeCard, setActiveCard] = useState(cards[0]);

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

      <div
        className="absolute top-[15%] right-[10%] z-10 w-1/3 h-[600px] transition-all duration-300 ease-in-out hover:scale-105"
        onMouseEnter={() => setIsDeckHovered(true)}
        onMouseLeave={() => setIsDeckHovered(false)}
      >
        {cards.map((card, index) => {
          const isActive = card.title === activeCard.title;
          const rotation = isActive ? 0 : (index - 1) * 2;
          const translateX = isActive ? 0 : index * 20;
          const translateY = isActive ? 0 : index * 10;
          const zIndex = isActive ? cards.length + 10 : cards.length - index;

          const hoverTranslateX = isDeckHovered ? index * 50 : 0;

          const hoverTranslateY = isDeckHovered ? index * 10 : 0;

          const hoverRotation = isDeckHovered ? index * 2 : 0;

          const handleCardClick = (card) => {
            if (isActive) return;
            setActiveCard(card);
          };

          return (
            <div
              id={`card-${index}`}
              key={index}
              className="bg-[#0f1419] bg-opacity-50 rounded-2xl p-10 absolute backdrop-blur-md flex flex-col gap-5 border border-white/10 shadow-lg shadow-white/10 h-full transition-all duration-150 ease-in-out hover:border-[#1e3a8a]  hover:bg-opacity-80 hover:cursor-pointer hover:shadow-blue-500/20"
              onClick={() => handleCardClick(card)}
              style={{
                transform: `translate(${
                  translateX + floatX + hoverTranslateX
                }px, ${translateY + floatY + hoverTranslateY}px) rotate(${
                  rotation + hoverRotation
                }deg)`,
                transformOrigin: "top left",
                zIndex: zIndex,
                top: 0,
                left: 0,
              }}
            >
              <h2
                className="text-5xl font-extrabold italic text-white text-center text-shadow-xl text-shadow-[#0ea5e9]"
                style={{
                  fontFamily: "Fareno, system-ui, sans-serif",
                }}
              >
                {card.title}
              </h2>
              <p
                className="text-2xl text-gray-300"
                style={{
                  fontFamily: "Fareno, system-ui, sans-serif",
                }}
              >
                {card.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AboutAndContact;
