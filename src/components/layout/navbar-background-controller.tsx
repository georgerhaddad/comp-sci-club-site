"use client";
import { useEffect } from "react";

interface NavbarBackgroundControllerProps {
  initialColor?: string;
  scrolledColor?: string;
  scrollThreshold?: number;
}

export function NavbarBackgroundController({
  initialColor = "bg-secondary",
  scrolledColor = "bg-background border-border shadow-xl",
  scrollThreshold = 10,
}: NavbarBackgroundControllerProps) {
  useEffect(() => {
    const navbar = document.getElementById("main-navbar");
    if (!navbar) return;

    navbar.className = `w-full transition-colors duration-300 ${initialColor}`;

    const handleScroll = () => {
      const scrolled = window.scrollY > scrollThreshold;

      if (scrolled) {
        navbar.className = `w-full transition-colors duration-300 ${scrolledColor}`;
      } else {
        navbar.className = `w-full transition-colors duration-300 ${initialColor}`;
      }
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [initialColor, scrolledColor, scrollThreshold]);

  return (
    <div className={`${initialColor} absolute top-0 h-12 w-full lg:h-16`}></div>
  );
}
