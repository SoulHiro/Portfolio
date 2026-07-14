"use client";

import { useEffect, useRef } from "react";

// Hero GSAP animation ends when wrapper's bottom meets viewport bottom:
// wrapper height = calc(2500px + 100vh), "bottom bottom" → scrollY = 2500px exactly
const HERO_END = 2500;

export function SectionsWrapper({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      if (window.scrollY >= HERO_END) {
        // Hero is gone — normal document flow, positioned right after hero scroll space
        el.style.position = "relative";
        el.style.top = "";
        el.style.left = "";
        el.style.width = "";
        el.style.marginTop = "calc(-100vh)";
      } else {
        // Hero is active — sections are fixed behind the hero, completely stationary
        el.style.position = "fixed";
        el.style.top = "0";
        el.style.left = "0";
        el.style.width = "100%";
        el.style.marginTop = "0";
      }
    };

    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div
      ref={ref}
      className="z-10 bg-background"
      style={{ position: "fixed", top: 0, left: 0, width: "100%" }}
    >
      {children}
    </div>
  );
}
