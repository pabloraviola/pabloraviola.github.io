import React from "react";

export const TextFlameDefs = () => (
  <>
    {/* Animated blue flame gradient for outline */}
    <linearGradient id="flameGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.9">
        <animate
          attributeName="stopColor"
          values="#0ea5e9; #38bdf8; #7dd3fc; #38bdf8; #0ea5e9"
          dur="2s"
          repeatCount="indefinite"
        />
      </stop>
      <stop offset="30%" stopColor="#0284c7" stopOpacity="0.95">
        <animate
          attributeName="stopColor"
          values="#0284c7; #0ea5e9; #38bdf8; #0ea5e9; #0284c7"
          dur="2.3s"
          repeatCount="indefinite"
        />
      </stop>
      <stop offset="60%" stopColor="#1e40af" stopOpacity="1">
        <animate
          attributeName="stopColor"
          values="#1e40af; #1e3a8a; #1d4ed8; #1e3a8a; #1e40af"
          dur="1.8s"
          repeatCount="indefinite"
        />
      </stop>
      <stop offset="100%" stopColor="#1e3a8a" stopOpacity="1">
        <animate
          attributeName="stopColor"
          values="#1e3a8a; #1e40af; #1d4ed8; #1e40af; #1e3a8a"
          dur="2.1s"
          repeatCount="indefinite"
        />
      </stop>
    </linearGradient>

    {/* Flame turbulence filter for subtle distortion */}
    <filter id="flameFilter" x="-50%" y="-50%" width="200%" height="200%">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.02 0.08"
        numOctaves="2"
        seed="1"
      >
        <animate
          attributeName="baseFrequency"
          values="0.02 0.08; 0.025 0.09; 0.018 0.075; 0.022 0.085; 0.02 0.08"
          dur="3s"
          repeatCount="indefinite"
        />
      </feTurbulence>
      <feDisplacementMap in="SourceGraphic" scale="2">
        <animate
          attributeName="scale"
          values="2; 2.5; 1.8; 2.3; 2"
          dur="2.5s"
          repeatCount="indefinite"
        />
      </feDisplacementMap>
    </filter>

    {/* Glow filter for flame effect */}
    <filter id="flameGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="1" result="blur">
        <animate
          attributeName="stdDeviation"
          values="1; 1.5; 0.8; 1.3; 1"
          dur="2s"
          repeatCount="indefinite"
        />
      </feGaussianBlur>
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </>
);

// CSS Styles for Line Glow Effect
export const LineGlowStyles = () => (
  <style>
    {`
      @keyframes lineGlow {
        0% { 
          stroke: #0ea5e9;
          filter: drop-shadow(0 0 3px #0ea5e9) drop-shadow(0 0 6px rgba(14, 165, 233, 0.5));
        }
        25% { 
          stroke: #38bdf8;
          filter: drop-shadow(0 0 4px #38bdf8) drop-shadow(0 0 8px rgba(56, 189, 248, 0.5));
        }
        50% { 
          stroke: #0ea5e9;
          filter: drop-shadow(0 0 3.5px #0ea5e9) drop-shadow(0 0 7px rgba(14, 165, 233, 0.5));
        }
        75% { 
          stroke: #1e40af;
          filter: drop-shadow(0 0 2.5px #1e40af) drop-shadow(0 0 5px rgba(30, 64, 175, 0.5));
        }
        100% { 
          stroke: #0ea5e9;
          filter: drop-shadow(0 0 3px #0ea5e9) drop-shadow(0 0 6px rgba(14, 165, 233, 0.5));
        }
      }
      .line-glow-animated {
        animation: lineGlow 3s ease-in-out infinite;
      }
    `}
  </style>
);

export default { TextFlameDefs, LineGlowStyles };
