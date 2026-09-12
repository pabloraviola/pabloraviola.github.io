import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const MOBILE_QUERY = "(hover: none) and (pointer: coarse), (max-width: 767px)";

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(
    () =>
      typeof window !== "undefined" && window.matchMedia(MOBILE_QUERY).matches
  );

  useEffect(() => {
    const media = window.matchMedia(MOBILE_QUERY);
    const onChange = (e) => setIsMobile(e.matches);
    setIsMobile(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return isMobile;
};

const optionClass = (active) =>
  [
    "px-3.5 py-1.5 rounded-full text-[11px] tracking-[0.18em] uppercase transition-colors duration-300",
    active
      ? "bg-white text-black"
      : "text-white/65 hover:text-white",
  ].join(" ");

const SiteSwitcher = () => {
  const { pathname } = useLocation();
  const isMobile = useIsMobile();
  const is3D = pathname !== "/2d";

  if (isMobile) return null;

  return (
    <nav
      aria-label="Switch site version"
      className="fixed top-5 right-5 z-[9999] flex items-center gap-0.5 rounded-full border border-white/15 bg-black/55 p-1 shadow-[0_10px_40px_rgba(0,0,0,0.35)] backdrop-blur-md isolate"
      style={{ fontFamily: "Poppins, system-ui, sans-serif" }}
    >
      <Link
        to="/"
        className={optionClass(is3D)}
        aria-current={is3D ? "page" : undefined}
      >
        3D
      </Link>
      <Link
        to="/2d"
        className={optionClass(!is3D)}
        aria-current={!is3D ? "page" : undefined}
      >
        2D
      </Link>
    </nav>
  );
};

export default SiteSwitcher;
