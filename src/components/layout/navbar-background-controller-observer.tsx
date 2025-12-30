"use client";
import { useEffect, useRef } from "react";

interface NavbarBackgroundControllerObserverProps {
  initialColor?: string;
  scrolledColor?: string;
  scrollThreshold?: number;
}

export function NavbarBackgroundControllerObserver({
  initialColor = "bg-transparent",
  scrolledColor = "bg-background border-border shadow-xl",
  scrollThreshold = 10,
}: NavbarBackgroundControllerObserverProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const navbar = document.getElementById("main-navbar");
    const sentinel = sentinelRef.current;

    if (!navbar || !sentinel) return;

    navbar.className = `w-full px-4 transition-colors duration-300 ${initialColor}`;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            navbar.className = `w-full px-4 transition-colors duration-300 ${scrolledColor}`;
          } else {
            navbar.className = `w-full px-4 transition-colors duration-300 ${initialColor}`;
          }
        });
      },
      {
        threshold: 0,
        rootMargin: "0px",
      },
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
      if (navbar) {
        navbar.className =
          "w-full px-4 transition-colors duration-300 bg-background";
      }
    };
  }, [initialColor, scrolledColor, scrollThreshold]);

  return (
    <div
      ref={sentinelRef}
      style={{
        position: "absolute",
        top: `${scrollThreshold}px`,
        left: 0,
        width: "1px",
        height: "1px",
        pointerEvents: "none",
        visibility: "hidden",
      }}
      aria-hidden="true"
    />
  );
}
