import React, { useRef, useEffect, useState } from "react";
import Hero from "../components/new/sections/Hero";
import About from "../components/new/sections/About/About";
import ExperienceSection from "../components/new/sections/Experience/ExperienceSection";
import ContactSection from "../components/new/sections/Contact/ContactSection";

const New = () => {
  const heroSectionRef = useRef(null);
  const secondSectionRef = useRef(null);
  const experienceSectionRef = useRef(null);
  const contactSectionRef = useRef(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [isInSecondSection, setIsInSecondSection] = useState(false);
  const [hasReachedSecondSection, setHasReachedSecondSection] = useState(false);
  // Where the experience timeline should resume when it becomes active
  // ("start" when coming from About, "end" when coming back from Contact)
  const [experienceEntry, setExperienceEntry] = useState("start");

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

  const scrollToExperienceSection = (entry = "start") => {
    if (experienceSectionRef.current) {
      setExperienceEntry(entry);
      experienceSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      setCurrentSection(2);
    }
  };

  const scrollToContactSection = () => {
    if (contactSectionRef.current) {
      contactSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      setCurrentSection(3);
    }
  };

  // TODO: Simplify Section scrolling behavior to be generic by section refs
  useEffect(() => {
    const handleScroll = () => {
      if (
        !heroSectionRef.current ||
        !secondSectionRef.current ||
        !experienceSectionRef.current ||
        !contactSectionRef.current
      )
        return;

      const heroRect = heroSectionRef.current.getBoundingClientRect();
      const secondRect = secondSectionRef.current.getBoundingClientRect();
      const experienceRect =
        experienceSectionRef.current.getBoundingClientRect();
      const contactRect = contactSectionRef.current.getBoundingClientRect();

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
      } else if (contactRect.top >= -100 && contactRect.top <= 100) {
        setCurrentSection(3);
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
          onScrollToNext={() => scrollToExperienceSection("start")}
          showGuy={hasReachedSecondSection}
          isActive={currentSection === 1}
        />
      </div>
      <div ref={experienceSectionRef}>
        <ExperienceSection
          onScrollToPrev={scrollToAboutSection}
          onScrollToNext={scrollToContactSection}
          entry={experienceEntry}
          isActive={currentSection === 2}
        />
      </div>
      <div ref={contactSectionRef}>
        <ContactSection
          onScrollToPrev={() => scrollToExperienceSection("end")}
          isActive={currentSection === 3}
        />
      </div>
    </div>
  );
};

export default New;
