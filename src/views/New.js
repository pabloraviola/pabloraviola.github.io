import React, { useRef, useEffect, useState } from "react";
import Hero from "../components/new/sections/Hero";
import About from "../components/new/sections/About/About";
import ExperienceSection from "../components/new/sections/Experience/ExperienceSection";

const New = () => {
  const heroSectionRef = useRef(null);
  const secondSectionRef = useRef(null);
  const experienceSectionRef = useRef(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [isInSecondSection, setIsInSecondSection] = useState(false);
  const [hasReachedSecondSection, setHasReachedSecondSection] = useState(false);

  const scrollToHeroSection = () => {
    if (heroSectionRef.current) {
      heroSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      setCurrentSection(0);
    }
  };

  const scrollToAboutSection = () => {
    if (secondSectionRef.current) {
      secondSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      setCurrentSection(1);
    }
  };

  const scrollToExperienceSection = () => {
    if (experienceSectionRef.current) {
      experienceSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      setCurrentSection(2);
    }
  };

  // TODO: Simplify Section scrolling behavior to be generic by section refs
  useEffect(() => {
    const handleScroll = () => {
      if (
        !heroSectionRef.current ||
        !secondSectionRef.current ||
        !experienceSectionRef.current
      )
        return;

      const heroRect = heroSectionRef.current.getBoundingClientRect();
      const secondRect = secondSectionRef.current.getBoundingClientRect();
      const experienceRect =
        experienceSectionRef.current.getBoundingClientRect();

      if (heroRect.top >= -100 && heroRect.top <= 100) {
        setCurrentSection(0);
        setIsInSecondSection(false);
      } else if (secondRect.top >= -100 && secondRect.top <= 100) {
        setCurrentSection(1);
        setIsInSecondSection(true);
        if (!hasReachedSecondSection) {
          setHasReachedSecondSection(true);
        }
      } else if (experienceRect.top >= -100 && experienceRect.top <= 100) {
        setCurrentSection(2);
        setIsInSecondSection(false);
      }
    };

    // Check position on mount (for refresh)
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasReachedSecondSection]);

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
        <Hero
          onScrollToNext={scrollToAboutSection}
          isActive={currentSection === 0}
        />
      </div>
      <div ref={secondSectionRef}>
        <About
          onScrollToPrev={scrollToHeroSection}
          onScrollToNext={scrollToExperienceSection}
          showGuy={hasReachedSecondSection}
          isActive={currentSection === 1}
        />
      </div>
      <div ref={experienceSectionRef}>
        <ExperienceSection
          onScrollToPrev={scrollToAboutSection}
          isActive={currentSection === 2}
        />
      </div>
    </div>
  );
};

export default New;
