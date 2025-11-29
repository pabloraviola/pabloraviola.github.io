import React, { useRef, useEffect, useState } from "react";
import Hero from "../components/new/sections/Hero";
import About from "../components/new/sections/About/About";

const New = () => {
  const heroSectionRef = useRef(null);
  const secondSectionRef = useRef(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [isInSecondSection, setIsInSecondSection] = useState(false);
  const [hasReachedSecondSection, setHasReachedSecondSection] = useState(false);

  const scrollToNextSection = () => {
    if (secondSectionRef.current) {
      secondSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      setCurrentSection(1);
    }
  };

  const scrollToPrevSection = () => {
    if (heroSectionRef.current) {
      heroSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      setCurrentSection(0);
    }
  };

  // TODO: Simplify Section scrolling behavior to be generic by section refs
  useEffect(() => {
    const handleScroll = () => {
      if (!heroSectionRef.current || !secondSectionRef.current) return;

      const heroRect = heroSectionRef.current.getBoundingClientRect();
      const secondRect = secondSectionRef.current.getBoundingClientRect();

      if (heroRect.top >= -100 && heroRect.top <= 100) {
        setCurrentSection(0);
        setIsInSecondSection(false);
      } else if (secondRect.top >= -100 && secondRect.top <= 100) {
        setCurrentSection(1);
        setIsInSecondSection(true);
        if (!hasReachedSecondSection) {
          setHasReachedSecondSection(true);
        }
      }
    };

    // Check position on mount (for refresh)
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="overflow-hidden">
      <link
        rel="stylesheet"
        href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css"
        integrity="sha384-AYmEC3Yw5cVb3ZcuHtOA93w35dYTsvhLPVnYs9eStHfGJvOvKxVfELGroGkvsg+p"
        crossOrigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins&display=swap"
        rel="stylesheet"
      ></link>
      <div ref={heroSectionRef}>
        <Hero onScrollToNext={scrollToNextSection} />
      </div>
      <div ref={secondSectionRef}>
        <About
          onScrollToPrev={scrollToPrevSection}
          showGuy={hasReachedSecondSection}
        />
      </div>
    </div>
  );
};

export default New;
