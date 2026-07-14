"use client";

import { useEffect, useRef } from "react";

const SHOW_THRESHOLD = 1000;

export function ScrollProgress() {
  const fillRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const progress = total > 0 ? Math.min(scrolled / total, 1) : 0;
      if (fillRef.current)
        fillRef.current.style.transform = `scaleY(${progress})`;
      if (containerRef.current) {
        containerRef.current.style.opacity =
          scrolled > SHOW_THRESHOLD ? "1" : "0";
      }
    };

    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed right-5 top-1/2 -translate-y-1/2 z-50 pointer-events-none hidden lg:block"
      style={{ opacity: 0, transition: "opacity 0.6s ease" }}
    >
      <div
        className="relative w-[2px] bg-foreground/10"
        style={{ height: "calc(56vh + 134px)" }}
      >
        <div
          ref={fillRef}
          className="absolute top-0 left-0 w-full h-full bg-foreground origin-top"
          style={{ transform: "scaleY(0)" }}
        />
      </div>
    </div>
  );
}
