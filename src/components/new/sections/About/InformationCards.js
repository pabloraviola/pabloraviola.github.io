import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const ANIMATION_PHASE = {
  IDLE: "idle",
  MOVING_OUT: "moving-out",
  MOVING_IN: "moving-in",
};

const cards = [
  {
    title: "About Me",
    content:
      "I'm a fullstack web developer and a systems engineer from San Francisco, Córdoba - ARG. I'm building my career as a developer learning as much as I can about the new technologies that come across. I consider myself as a proactive person who's always willing to take new challenges in order to improve his skills. On my spare time, I like listening to music and playing drums, I also love travelling whenever I have the chance, whether it is going on a short trip or taking a journey abroad for a couple of months.",
  },
  {
    title: "Personal Info",
    content: (
      <div className="hidden lg:flex lg:flex-col lg:p-4 lg:mt-3 lg:space-y-5">
        <div className="flex items-center text-white space-x-2">
          <i className="fas fa-envelope"></i>
          <p className="text-sm">pablo.raviola@gmail.com</p>
        </div>
        <div className="flex items-center text-white space-x-2">
          <i className="fas fa-birthday-cake"></i>
          <p className="text-sm">30/04/1992</p>
        </div>
        <div className="flex items-center text-white space-x-2">
          <i className="fas fa-phone"></i>
          <p className="text-sm">+54 3564561315</p>
        </div>
        <div className="flex items-center text-white space-x-2">
          <i className="fas fa-map-marker-alt"></i>
          <p className="text-sm">San francisco, CBA - ARG</p>
        </div>
      </div>
    ),
  },
  {
    title: "Projects",
    content:
      "I'm a fullstack web developer and a systems engineer from San Francisco, Córdoba - ARG. I'm building my career as a developer learning as much as I can about the new technologies that come across. I consider myself as a proactive person who's always willing to take new challenges in order to improve his skills. On my spare time, I like listening to music and playing drums, I also love travelling whenever I have the chance, whether it is going on a short trip or taking a journey abroad for a couple of months.",
  },
];

const InformationCards = ({ floatX = 0, floatY = 0 }) => {
  const [isDeckHovered, setIsDeckHovered] = useState(false);
  const [activeCard, setActiveCard] = useState(cards[0]);
  const [cardOrder, setCardOrder] = useState(cards.map((_, index) => index));
  const [animatingCard, setAnimatingCard] = useState(null);
  const [animationPhase, setAnimationPhase] = useState(ANIMATION_PHASE.IDLE);

  return (
    <div
      className="absolute top-0 left-0 w-full h-full"
      onMouseEnter={() => setIsDeckHovered(true)}
      onMouseLeave={() => setIsDeckHovered(false)}
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

          const handleCardClick = (clickedCard) => {
            if (animationPhase !== ANIMATION_PHASE.IDLE) return;

            const oldActiveIndex = cards.findIndex(
              (c) => c.title === activeCard.title
            );
            // if clicked already active card, move to the next one
            const newActiveIndex = isActive
              ? (oldActiveIndex + 1) % cards.length
              : cards.findIndex((c) => c?.title === clickedCard?.title);

            // Phase 1: Move current active card to the side
            setAnimatingCard(activeCard.title);
            setAnimationPhase(ANIMATION_PHASE.MOVING_OUT);

            // Phase 2: Start moving-in early with heavy overlap for seamless flow
            setTimeout(() => {
              setActiveCard(cards[newActiveIndex]);
              setAnimationPhase(ANIMATION_PHASE.MOVING_IN);

              setCardOrder((prev) => {
                const newOrder = [...prev];
                newOrder.splice(newOrder.indexOf(newActiveIndex), 1);
                newOrder.unshift(newActiveIndex);
                newOrder.splice(newOrder.indexOf(oldActiveIndex), 1);
                newOrder.push(oldActiveIndex);
                return newOrder;
              });

              // Phase 3: Reset animation state after slide-in
              setTimeout(() => {
                setAnimatingCard(null);
                setAnimationPhase(ANIMATION_PHASE.IDLE);
              }, 200);
            }, 150);
          };

          const transform = getCardTransform();

          return (
            <motion.div
              key={card.title}
              className="bg-[#0f1419] bg-opacity-50 rounded-2xl p-10 absolute backdrop-blur-md flex flex-col gap-5 border border-white/10 shadow-lg shadow-white/10 h-full w-full hover:border-[#1e3a8a] hover:bg-opacity-80 hover:cursor-pointer hover:shadow-blue-500/20 select-none"
              onClick={() => handleCardClick(card)}
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
                style={{ fontFamily: "Fareno, system-ui, sans-serif" }}
                animate={{ opacity: isActive && !isAnimating ? 1 : 0.6 }}
                transition={{ duration: 0.3 }}
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
