import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import "../styles/ZPetNavigation.css";

/**
 * 4-Pointed Luxury Sparkle Star
 */
const SparkleStar = ({ className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`z-sparkle-star ${className}`}
    aria-hidden="true"
  >
    <path
      d="M12 0C12 6.627 17.373 12 24 12C17.373 12 12 17.373 12 24C12 17.373 6.627 12 0 12C6.627 12 12 6.627 12 0Z"
      fill="#FFF1A8"
    />
  </svg>
);

/**
 * Dog Profile Silhouette Icon matching the exact uploaded image
 */
const DogProfileSilhouetteIcon = () => (
  <svg
    viewBox="0 0 100 100"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className="pet-icon-svg"
    aria-hidden="true"
  >
    <path
      d="M 39.6 10.3 L 30.4 13.9 L 24.3 19.4 L 7.2 41.4 L 6.0 44.5 L 6.0 50.0 L 9.1 56.1 L 16.4 62.8 L 24.3 66.5 L 29.8 66.5 L 32.9 65.3 L 37.2 60.4 L 38.4 56.1 L 38.4 48.2 L 37.8 47.6 L 37.8 43.9 L 37.2 43.3 L 37.2 39.6 L 35.9 35.9 L 35.3 29.2 L 34.1 26.2 L 34.7 24.9 L 35.9 26.2 L 42.1 46.9 L 42.7 54.9 L 43.3 55.5 L 42.7 56.1 L 42.1 61.6 L 40.2 65.3 L 35.9 69.6 L 31.7 71.4 L 24.3 71.4 L 18.8 68.9 L 17.0 75.1 L 24.3 81.8 L 34.7 87.3 L 47.6 90.3 L 57.9 90.3 L 58.6 89.7 L 61.0 89.7 L 62.8 89.1 L 61.6 86.1 L 61.0 80.6 L 60.4 79.9 L 60.4 72.6 L 62.8 65.3 L 67.1 61.0 L 75.7 59.2 L 82.4 55.5 L 86.1 51.8 L 88.5 46.9 L 90.9 43.9 L 92.2 40.2 L 93.4 29.8 L 92.2 27.4 L 88.5 26.2 L 75.7 26.2 L 73.2 24.3 L 68.9 16.4 L 66.5 13.9 L 61.0 10.9 L 56.1 9.7 L 51.8 9.7 L 51.2 9.1 Z M 63.4 47.6 L 64.7 46.9 L 67.1 48.8 L 69.6 50.0 L 70.8 50.0 L 71.4 50.6 L 77.5 50.6 L 78.1 51.2 L 76.9 52.4 L 69.6 52.4 L 67.1 51.2 Z M 59.2 21.9 L 62.2 21.9 L 64.7 24.9 L 64.1 27.4 L 61.0 29.8 L 59.2 29.2 L 57.3 27.4 L 57.3 26.2 L 56.7 25.6 L 57.3 23.7 Z"
      fillRule="evenodd"
    />
  </svg>
);

/**
 * Cat Profile Silhouette Icon matching the exact uploaded image
 */
const CatProfileSilhouetteIcon = () => (
  <svg
    viewBox="0 0 100 100"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className="pet-icon-svg"
    aria-hidden="true"
  >
    <path
      d="M 66.4 15.3 L 64.8 15.8 L 61.0 18.5 L 55.6 23.9 L 61.6 25.5 L 66.4 27.7 Z M 45.4 11.0 L 44.4 12.1 L 43.8 12.1 L 36.8 19.6 L 33.6 24.4 L 30.4 30.9 L 29.3 35.2 L 25.5 39.5 L 22.8 43.8 L 19.1 51.3 L 17.5 55.6 L 16.4 60.0 L 15.8 65.3 L 16.9 69.6 L 18.5 72.9 L 21.2 76.6 L 26.6 82.0 L 31.4 85.2 L 39.5 89.0 L 60.0 89.0 L 58.9 86.3 L 58.3 82.5 L 58.9 77.7 L 60.0 75.0 L 63.2 71.8 L 65.9 70.7 L 69.1 70.7 L 71.2 70.2 L 75.0 68.6 L 77.2 66.4 L 77.2 65.9 L 81.5 62.1 L 82.5 59.4 L 82.5 57.8 L 84.2 55.1 L 84.2 53.0 L 77.7 46.5 L 76.6 41.7 L 74.5 36.8 L 69.6 32.0 L 66.4 29.8 L 62.6 28.2 L 57.3 26.6 L 54.0 26.6 L 51.9 25.0 L 49.7 18.5 L 46.5 12.1 Z M 69.1 60.5 L 67.5 62.1 L 62.1 65.3 L 55.6 71.2 L 54.0 70.7 L 54.0 69.6 L 61.6 62.6 L 66.9 59.4 L 68.0 59.4 Z M 68.0 57.3 L 67.5 59.4 L 62.6 60.0 L 55.1 62.1 L 50.8 63.7 L 43.3 67.5 L 41.7 66.9 L 41.7 65.9 L 42.7 64.8 L 53.5 60.0 L 62.6 57.3 L 66.4 56.7 Z M 68.0 55.1 L 67.5 56.7 L 57.3 56.7 L 48.1 58.9 L 45.4 57.8 L 46.5 56.7 L 55.1 54.6 L 65.3 54.0 Z M 65.3 41.7 L 67.5 41.7 L 69.6 44.4 L 69.6 46.0 L 69.1 47.0 L 68.0 48.1 L 66.4 48.7 L 65.3 48.1 L 63.2 45.4 L 63.7 43.3 Z M 44.9 18.5 L 46.0 19.6 L 49.7 29.8 L 48.7 30.9 L 46.5 31.4 L 40.6 34.7 L 40.6 30.9 L 41.7 25.5 L 43.3 20.7 Z"
      fillRule="evenodd"
    />
  </svg>
);

/**
 * Clean 3-slider filter/others icon matching the design reference
 */
const SlidersFilterIcon = () => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="pet-icon-svg"
    aria-hidden="true"
  >
    {/* Top Slider Track & Knob */}
    <path d="M8 14H40" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
    <circle cx="30" cy="14" r="4.2" fill="currentColor" />

    {/* Middle Slider Track & Knob */}
    <path d="M8 24H40" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
    <circle cx="35" cy="24" r="4.2" fill="currentColor" />

    {/* Bottom Slider Track & Knob */}
    <path d="M8 34H40" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
    <circle cx="18" cy="34" r="4.2" fill="currentColor" />
  </svg>
);

/**
 * ZPetNavigation Component - Premium Gold Edition with Shimmer & Sparkles
 *
 * Primary Color: #D4AF37
 * Radial Layout: Dog (Top), Cat (Top-Left), Others/Settings (Top-Right)
 * Supports Dog, Cat, and Other Pets shopping experiences with visual active states.
 */
export default function ZPetNavigation({
  onSelectPet,
  customRoutes,
  className = "",
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const leaveTimerRef = useRef(null);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Detect currently active pet shopping experience from URL
  const rawPet = (
    searchParams.get("pet_type") ||
    searchParams.get("pet") ||
    ""
  ).toLowerCase().trim();

  const isDogActive = rawPet === "dog";
  const isCatActive = rawPet === "cat";
  const isOtherActive = [
    "other",
    "others",
    "otherpets",
    "other_pets",
    "settings",
    "bird",
    "fish",
    "rabbit",
    "cattle",
  ].includes(rawPet);

  const hasActiveExperience = isDogActive || isCatActive || isOtherActive;

  // Clear timer on unmount
  useEffect(() => {
    return () => {
      if (leaveTimerRef.current) {
        clearTimeout(leaveTimerRef.current);
      }
    };
  }, []);

  // Handle outside click on touch devices to collapse menu
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target)
      ) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener("pointerdown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
    };
  }, [isExpanded]);

  // Handle Mouse Enter with debounce cancel
  const handleMouseEnter = () => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
    setIsExpanded(true);
  };

  // Handle Mouse Leave with gentle debounce to prevent flickering
  const handleMouseLeave = () => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
    }
    leaveTimerRef.current = setTimeout(() => {
      setIsExpanded(false);
    }, 180);
  };

  // Toggle for touch devices and keyboard interaction
  const handleMainClick = (e) => {
    e.stopPropagation();
    setIsExpanded((prev) => !prev);
  };

  // Handle pet shopping experience icon selection
  const handleItemClick = (key) => {
    setIsExpanded(false);

    if (onSelectPet) {
      onSelectPet(key);
      return;
    }

    // Toggle back to general home if clicking the already active experience
    if (key === "Dog") {
      if (isDogActive) {
        navigate("/home");
      } else {
        navigate("/home?pet_type=Dog");
      }
    } else if (key === "Cat") {
      if (isCatActive) {
        navigate("/home");
      } else {
        navigate("/home?pet_type=Cat");
      }
    } else if (key === "Filter" || key === "Other" || key === "Settings") {
      if (isOtherActive) {
        navigate("/home");
      } else {
        navigate("/home?pet_type=Other");
      }
    } else if (customRoutes && customRoutes[key]) {
      navigate(customRoutes[key]);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Keyboard accessibility
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setIsExpanded(false);
    }
  };

  return (
    <div
      ref={wrapperRef}
      className={`z-pet-nav-wrapper ${isExpanded ? "expanded" : ""} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
      role="region"
      aria-label="Pet Category Navigation"
    >
      <div className="z-pet-nav-envelope">
        {/* Golden glow pulse indicator ring */}
        <div className="z-main-glow" aria-hidden="true" />

        {/* =====================================================
            CONNECTOR STEMS (Radiating from Gold Z to the 3 icons)
        ===================================================== */}
        <div className="z-connector z-connector-dog" aria-hidden="true" />
        <div className="z-connector z-connector-cat" aria-hidden="true" />
        <div className="z-connector z-connector-filter" aria-hidden="true" />

        {/* =====================================================
            1. DOG ICON (Centered Above Z)
        ===================================================== */}
        <button
          type="button"
          className={`pet-btn pet-btn-dog ${isDogActive ? "active" : ""}`}
          onClick={() => handleItemClick("Dog")}
          aria-label="Dog Shopping Experience"
          title="Dog Shopping Experience"
          aria-pressed={isDogActive}
          tabIndex={isExpanded ? 0 : -1}
        >
          <DogProfileSilhouetteIcon />
          <span className="pet-btn-tooltip">Dogs</span>
        </button>

        {/* =====================================================
            2. CAT ICON (Diagonally Upper-Left of Z)
        ===================================================== */}
        <button
          type="button"
          className={`pet-btn pet-btn-cat ${isCatActive ? "active" : ""}`}
          onClick={() => handleItemClick("Cat")}
          aria-label="Cat Shopping Experience"
          title="Cat Shopping Experience"
          aria-pressed={isCatActive}
          tabIndex={isExpanded ? 0 : -1}
        >
          <CatProfileSilhouetteIcon />
          <span className="pet-btn-tooltip">Cats</span>
        </button>

        {/* =====================================================
            3. OTHERS / SETTINGS ICON (Diagonally Upper-Right of Z)
        ===================================================== */}
        <button
          type="button"
          className={`pet-btn pet-btn-filter ${isOtherActive ? "active" : ""}`}
          onClick={() => handleItemClick("Filter")}
          aria-label="Other Pets Shopping Experience (Birds, Small Pets & More)"
          title="Other Pets Shopping Experience"
          aria-pressed={isOtherActive}
          tabIndex={isExpanded ? 0 : -1}
        >
          <SlidersFilterIcon />
          <span className="pet-btn-tooltip">Other Pets</span>
        </button>

        {/* =====================================================
            MAIN GOLD Z BUTTON WITH SHIMMER
        ===================================================== */}
        <button
          type="button"
          className={`z-main-btn ${hasActiveExperience ? "has-active-experience" : ""}`}
          onClick={handleMainClick}
          aria-label={
            hasActiveExperience
              ? isDogActive
                ? "Dog Shopping Experience active — Click to switch or close"
                : isCatActive
                ? "Cat Shopping Experience active — Click to switch or close"
                : "Other Pets Shopping Experience active — Click to switch or close"
              : isExpanded
              ? "Close pet navigation"
              : "Open pet navigation"
          }
          aria-expanded={isExpanded}
          aria-haspopup="true"
        >
          {/* Moving diagonal metallic gold shimmer reflection */}
          <span className="z-shimmer" aria-hidden="true" />

          {/* Bold White Letter Z */}
          <span className="z-letter" aria-hidden="true">Z</span>

          {/* Active experience indicator dot */}
          {hasActiveExperience && (
            <span className="z-active-badge" aria-hidden="true" />
          )}
        </button>

        {/* =====================================================
            TINY SPARKLING PARTICLES (Outer Rim)
        ===================================================== */}
        <div className="z-sparkles" aria-hidden="true">
          <SparkleStar className="z-sparkle-1" />
          <SparkleStar className="z-sparkle-2" />
          <SparkleStar className="z-sparkle-3" />
        </div>
      </div>
    </div>
  );
}
