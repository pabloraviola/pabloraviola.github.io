import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../views/Home";
import New from "../views/New";

// Phones / tablets (touch-first devices) and very narrow windows get the
// classic 2D site: the 3D scenes are built for a wide screen and a mouse wheel.
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

// "/" -> 3D site on desktop, 2D site on mobile
const Landing = () => (useIsMobile() ? <Home /> : <New />);

export default function router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        {/* Explicit versions, regardless of device */}
        <Route path="/new" element={<New />} />
        <Route path="/old" element={<Home />} />
        <Route path="*" element={<Landing />} />
      </Routes>
    </BrowserRouter>
  );
}
