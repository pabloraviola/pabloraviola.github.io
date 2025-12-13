import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Boop from "../../../animations/Boop";
import resume from "../../../../assets/resume.pdf";
import fce from "../../../../assets/fce.pdf";
import cae from "../../../../assets/cae.pdf";

export const ANIMATION_PHASE = {
  IDLE: "idle",
  MOVING_OUT: "moving-out",
  MOVING_IN: "moving-in",
};

const InfoBox = ({ icon, text = "", link = "" }) => {
  const handleClick = (e) => {
    if (link) {
      e.stopPropagation(); // Prevent card switching
    }
  };

  const content = (
    <div className="group flex flex-col gap-y-4 items-center justify-center p-4 rounded-xl border border-white/10 hover:border-[#1e3a8a] bg-white/5 hover:bg-white/10 transition-all duration-300 aspect-square w-full">
      <i
        className={`${icon} text-5xl text-white group-hover:text-[#1e3a8a] transition-colors duration-300`}
      ></i>
      <p className="text-xs text-white text-center transition-colors duration-300">
        {text}
      </p>
    </div>
  );

  return (
    <Boop scale={1.05} timing={150}>
      {link ? (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
        >
          {content}
        </a>
      ) : (
        <div onClick={handleClick}>{content}</div>
      )}
    </Boop>
  );
};

const cards = [
  {
    title: "About Me",
    content: (
      <div className="flex flex-col gap-y-6">
        <p>
          I'm a full-stack web developer and systems engineer based in San
          Francisco, Córdoba, Argentina. I'm passionate about creating
          thoughtful, user-focused digital experiences and building reliable
          systems behind them. I like to keep up to date with the latest trends
          in web development and learning new technologies, exploring fresh
          ideas, and taking on challenges that help me become a better
          developer.
        </p>
        <a
          // href={`https://resume.io/r/v4cH6A1Oa`}
          href={resume}
          target="_blank"
          className="flex items-center space-x-2 bg-[#1e3a8a] hover:bg-[#1e3a8a]/80 transition-all duration-300 rounded-lg p-2 items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <p style={{ fontFamily: "Poppins" }} className="font-bold">
            Resume
          </p>
          <i class="fas fa-file-download"></i>
        </a>
      </div>
    ),
  },
  {
    title: "Personal Info",
    content: (
      <div className="hidden lg:grid lg:grid-cols-2 lg:gap-4 lg:p-4 lg:mt-3">
        <InfoBox icon="fas fa-envelope" text="pablo.raviola@gmail.com" />
        <InfoBox icon="fas fa-birthday-cake" text="30/04/1992" />
        <InfoBox icon="fas fa-phone" text="+54 3564561315" />
        <InfoBox icon="fas fa-map-marker-alt" text="San francisco, CBA - ARG" />
      </div>
    ),
  },
  {
    title: "Education",
    content: (
      <div className="hidden lg:grid lg:grid-cols-2 lg:gap-4 lg:p-4 lg:mt-3">
        <InfoBox
          icon="fas fa-file-contract"
          text="FIRST CERTIFICATE IN ENGLISH (FCE)"
          link={fce}
        />
        <InfoBox
          icon="fas fa-file-contract"
          link={cae}
          text="CERTIFICATE IN ADVANCED ENGLISH (CAE)"
        />
        <InfoBox icon="fas fa-graduation-cap" text="SYSTEMS ENGINEERING" />
      </div>
    ),
  },
  {
    title: "Social",
    content: (
      <div className="hidden lg:grid lg:grid-cols-2 lg:gap-4 lg:p-4 lg:mt-3">
        <InfoBox
          icon="fab fa-linkedin"
          link="https://www.linkedin.com/in/pablo-raviola-9a833b164/"
        />
        <InfoBox icon="fab fa-github" link="https://github.com/pabloraviola" />
        <InfoBox
          icon="fab fa-instagram"
          link="https://www.instagram.com/pabloraviola/"
        />
        <InfoBox
          icon="fab fa-facebook"
          link="https://www.facebook.com/pablo.raviola/"
        />
      </div>
    ),
  },
];

const InformationCards = ({ floatX = 0, floatY = 0 }) => {
  const [isDeckHovered, setIsDeckHovered] = useState(false);
  const [activeCard, setActiveCard] = useState(cards[0]);
  const [cardOrder, setCardOrder] = useState(cards.map((_, index) => index));
  const [animatingCard, setAnimatingCard] = useState(null);
  const [animationPhase, setAnimationPhase] = useState(ANIMATION_PHASE.IDLE);

  const handleDeckClick = () => {
    if (animationPhase !== ANIMATION_PHASE.IDLE) return;

    const currentIndex = cards.findIndex((c) => c.title === activeCard.title);
    const nextIndex = (currentIndex + 1) % cards.length;

    // Phase 1: Move current active card to the side
    setAnimatingCard(activeCard.title);
    setAnimationPhase(ANIMATION_PHASE.MOVING_OUT);

    // Phase 2: Start moving-in early with heavy overlap for seamless flow
    setTimeout(() => {
      setActiveCard(cards[nextIndex]);
      setAnimationPhase(ANIMATION_PHASE.MOVING_IN);

      setCardOrder((prev) => {
        const newOrder = [...prev];
        newOrder.splice(newOrder.indexOf(nextIndex), 1);
        newOrder.unshift(nextIndex);
        newOrder.splice(newOrder.indexOf(currentIndex), 1);
        newOrder.push(currentIndex);
        return newOrder;
      });

      // Phase 3: Reset animation state after slide-in
      setTimeout(() => {
        setAnimatingCard(null);
        setAnimationPhase(ANIMATION_PHASE.IDLE);
      }, 200);
    }, 150);
  };

  return (
    <div
      className="absolute top-0 left-0 w-full h-full cursor-pointer"
      onMouseEnter={() => setIsDeckHovered(true)}
      onMouseLeave={() => setIsDeckHovered(false)}
      onClick={handleDeckClick}
    >
      <AnimatePresence mode="popLayout">
        {cardOrder.map((originalIndex, stackPosition) => {
          const card = cards[originalIndex];
          const isActive = card.title === activeCard.title;
          const isAnimating = animatingCard === card.title;

          // Calculate card position based on animation state
          const getCardTransform = () => {
            if (isAnimating) {
              if (animationPhase === ANIMATION_PHASE.MOVING_OUT) {
                return { x: -800, y: -50, rotate: -15, zIndex: 99 };
              } else {
                return {
                  x: (cards.length - 1) * 20,
                  y: (cards.length - 1) * 10,
                  rotate: (cards.length - 1) * 2,
                  zIndex: 1,
                };
              }
            }

            // Normal card position
            const hoverOffset = isDeckHovered ? stackPosition * 50 : 0;
            return {
              x: (isActive ? 0 : stackPosition * 20) + floatX + hoverOffset,
              y:
                (isActive ? 0 : stackPosition * 10) +
                floatY +
                (isDeckHovered ? stackPosition * 10 : 0),
              rotate:
                (isActive ? 0 : stackPosition * 2) +
                (isDeckHovered ? stackPosition * 2 : 0),
              zIndex: isActive ? 99 : cards.length - stackPosition,
            };
          };

          const transform = getCardTransform();

          return (
            <motion.div
              key={card.title}
              className="bg-[#0f1419] bg-opacity-50 rounded-2xl p-10 absolute backdrop-blur-md flex flex-col gap-5 border border-white/10 shadow-lg shadow-white/10 h-full w-full hover:border-[#1e3a8a] hover:bg-opacity-80 hover:shadow-blue-500/20 select-none"
              animate={transform}
              transition={{
                type: "spring",
                stiffness: isAnimating ? 80 : 200,
                damping: isAnimating ? 12 : 25,
                duration: isAnimating ? 0.3 : 0.6,
              }}
              style={{
                transformOrigin: "top left",
                pointerEvents:
                  animationPhase !== ANIMATION_PHASE.IDLE ? "none" : "auto",
              }}
              whileHover={!isAnimating ? { scale: isActive ? 1 : 1.02 } : {}}
            >
              <motion.h2
                className="text-5xl font-extrabold italic text-white text-center text-shadow-xl text-shadow-[#0ea5e9]"
                style={{ fontFamily: "Fareno, system-ui, sans-serif" }}
                animate={{ opacity: isActive && !isAnimating ? 1 : 0.8 }}
              >
                {card.title}
              </motion.h2>
              <motion.p
                className="text-2xl text-gray-300"
                animate={{ opacity: isActive && !isAnimating ? 1 : 0.6 }}
                transition={{ duration: 0.3 }}
                style={{ fontFamily: "Poppins" }}
              >
                {card.content}
              </motion.p>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default InformationCards;
