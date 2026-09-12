import React, { useRef, useEffect, useState } from "react";
import Hero from "../components/new/sections/Hero";
import About from "../components/new/sections/About/About";
import ExperienceSection from "../components/new/sections/Experience/ExperienceSection";
import ContactSection from "../components/new/sections/Contact/ContactSection";
import SceneLoader from "../components/new/SceneLoader";
import { useSceneAssets } from "../components/new/useSceneAssets";

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
  const { ready } = useSceneAssets();
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const previous = window.history.scrollRestoration;
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    setCurrentSection(0);
    setHasReachedSecondSection(false);
    return () => {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = previous || "auto";
      }
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.scrollTo(0, 0);
    setCurrentSection(0);
  }, [ready]);

  useEffect(() => {
    if (!showLoader) return;

    const html = document.documentElement;
    const body = document.body;
    const previous = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
      htmlOverscroll: html.style.overscrollBehavior,
    };

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    html.style.overscrollBehavior = "none";

    const prevent = (event) => {
      event.preventDefault();
    };

    const preventKeys = (event) => {
      if (
        ["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(
          event.key
        )
      ) {
        event.preventDefault();
      }
    };

    const lockTop = () => {
      if (window.scrollY || html.scrollTop || body.scrollTop) {
        window.scrollTo(0, 0);
        html.scrollTop = 0;
        body.scrollTop = 0;
      }
    };

    let frame = 0;
    const pin = () => {
      lockTop();
      frame = requestAnimationFrame(pin);
    };

    window.addEventListener("wheel", prevent, { passive: false, capture: true });
    window.addEventListener("touchmove", prevent, { passive: false, capture: true });
    window.addEventListener("keydown", preventKeys, { capture: true });
    window.addEventListener("scroll", lockTop, { passive: false, capture: true });
    frame = requestAnimationFrame(pin);
    lockTop();

    return () => {
      cancelAnimationFrame(frame);
      html.style.overflow = previous.htmlOverflow;
      body.style.overflow = previous.bodyOverflow;
      html.style.overscrollBehavior = previous.htmlOverscroll;
      window.removeEventListener("wheel", prevent, { capture: true });
      window.removeEventListener("touchmove", prevent, { capture: true });
      window.removeEventListener("keydown", preventKeys, { capture: true });
      window.removeEventListener("scroll", lockTop, { capture: true });
    };
  }, [showLoader]);

  const dismissLoader = () => {
    window.scrollTo(0, 0);
    setCurrentSection(0);
    window.setTimeout(() => setShowLoader(false), 650);
  };

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
    if (showLoader) return;

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
  }, [hasReachedSecondSection, showLoader]);

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
          isActive={currentSection === 0 && ready && !showLoader}
          assetsReady={ready}
        />
      </div>
      <div ref={secondSectionRef}>
        <About
          onScrollToPrev={scrollToHeroSection}
          onScrollToNext={() => scrollToExperienceSection("start")}
          showGuy={hasReachedSecondSection}
          isActive={currentSection === 1 && ready && !showLoader}
        />
      </div>
      <div ref={experienceSectionRef}>
        <ExperienceSection
          onScrollToPrev={scrollToAboutSection}
          onScrollToNext={scrollToContactSection}
          entry={experienceEntry}
          isActive={currentSection === 2 && ready && !showLoader}
        />
      </div>
      <div ref={contactSectionRef}>
        <ContactSection
          onScrollToPrev={() => scrollToExperienceSection("end")}
          isActive={currentSection === 3 && ready && !showLoader}
        />
      </div>
      {showLoader && (
        <SceneLoader fading={ready} onComplete={dismissLoader} />
      )}
    </div>
  );
};

export default New;
