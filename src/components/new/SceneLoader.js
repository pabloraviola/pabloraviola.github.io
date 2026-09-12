import React, { useEffect, useRef, useState } from "react";

const RING = 2 * Math.PI * 118;
const HOLD_AT = 92;
const MS_PER_PERCENT = 42;

const formatPct = (n) => String(n).padStart(2, "0");

const SceneLoader = ({ fading = false, onComplete }) => {
  const [finished, setFinished] = useState(false);
  const rootRef = useRef(null);
  const pctRef = useRef(null);
  const arcRef = useRef(null);
  const beamRef = useRef(null);
  const dotRef = useRef(null);
  const fadingRef = useRef(fading);
  const onCompleteRef = useRef(onComplete);
  fadingRef.current = fading;
  onCompleteRef.current = onComplete;

  useEffect(() => {
    let value = 0;
    let shown = 0;
    let last = performance.now();
    let frame = 0;
    let completed = false;

    const paint = (next) => {
      const t = next / 100;
      if (arcRef.current) {
        arcRef.current.setAttribute(
          "stroke-dasharray",
          `${RING * t} ${RING}`
        );
      }
      if (beamRef.current) {
        beamRef.current.style.strokeDashoffset = String(125 * (1 - t));
      }
      if (dotRef.current) {
        dotRef.current.setAttribute(
          "transform",
          `rotate(${t * 360 - 90} 160 160)`
        );
      }

      const targetInt = Math.min(100, Math.floor(next));
      if (targetInt > shown && pctRef.current) {
        shown += 1;
        pctRef.current.textContent = formatPct(shown);
        if (rootRef.current) {
          rootRef.current.setAttribute(
            "aria-label",
            `Loading 3D experience, ${shown} percent`
          );
        }
      }
    };

    const step = (now) => {
      if (completed) return false;
      const dt = Math.min(Math.max(0, now - last), MS_PER_PERCENT);
      last = now;
      const cap = fadingRef.current ? 100 : HOLD_AT;
      value = Math.min(cap, value + dt / MS_PER_PERCENT);
      paint(value);

      if (fadingRef.current && value >= 100) {
        completed = true;
        setFinished(true);
        if (onCompleteRef.current) onCompleteRef.current();
        return false;
      }
      return true;
    };

    const onFrame = (now) => {
      if (step(now)) frame = requestAnimationFrame(onFrame);
    };

    const onVisible = () => {
      last = performance.now();
    };

    paint(0);
    frame = requestAnimationFrame(onFrame);
    const interval = window.setInterval(() => {
      step(performance.now());
    }, MS_PER_PERCENT);
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      cancelAnimationFrame(frame);
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={`scene-loader ${finished ? "scene-loader--out" : ""}`}
      role="status"
      aria-live="polite"
      aria-label="Loading 3D experience, 0 percent"
    >
      <svg
        className="scene-loader__mark"
        viewBox="0 0 320 320"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="loaderLine" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="55%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#7dd3fc" />
          </linearGradient>
          <filter id="loaderGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle
          cx="160"
          cy="160"
          r="118"
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1"
        />

        <circle
          ref={arcRef}
          className="scene-loader__arc"
          cx="160"
          cy="160"
          r="118"
          fill="none"
          stroke="url(#loaderLine)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeDasharray={`0 ${RING}`}
          transform="rotate(-90 160 160)"
          filter="url(#loaderGlow)"
        />

        <line
          x1="72"
          y1="248"
          x2="248"
          y2="72"
          stroke="rgba(14,165,233,0.18)"
          strokeWidth="1"
        />
        <line
          ref={beamRef}
          className="scene-loader__beam"
          x1="160"
          y1="160"
          x2={160 + 88 * Math.cos((-45 * Math.PI) / 180)}
          y2={160 + 88 * Math.sin((-45 * Math.PI) / 180)}
          stroke="url(#loaderLine)"
          strokeWidth="1.6"
          strokeLinecap="round"
          filter="url(#loaderGlow)"
          style={{
            strokeDasharray: 125,
            strokeDashoffset: 125,
          }}
        />

        <g ref={dotRef} transform="rotate(-90 160 160)" filter="url(#loaderGlow)">
          <circle cx="278" cy="160" r="3.2" fill="#7dd3fc" />
        </g>
      </svg>

      <div className="scene-loader__readout">
        <span ref={pctRef} className="scene-loader__pct">
          {formatPct(0)}
        </span>
        <span className="scene-loader__label">Loading</span>
      </div>
    </div>
  );
};

export default SceneLoader;
