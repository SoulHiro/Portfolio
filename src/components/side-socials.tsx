"use client";

import { useEffect, useRef } from "react";
import { socialLinks } from "@/lib/social-links";

// Threshold matches roughly when the "Quem sou" bio panel fades in (~75% through the hero scroll pin of 2200px)
const SHOW_THRESHOLD = 1000;

export function SideSocials() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      if (!containerRef.current) return;
      containerRef.current.style.opacity =
        window.scrollY > SHOW_THRESHOLD ? "1" : "0";
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed left-5 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col items-center gap-5"
      style={{ opacity: 0, transition: "opacity 0.6s ease" }}
    >
      <div className="w-[1.5px] h-[28vh] bg-foreground/10" />
      {socialLinks.map(({ href, icon: Icon, label }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="text-muted-foreground/40 hover:text-foreground transition-colors duration-300"
        >
          <Icon className="size-[18px]" stroke={1.5} />
        </a>
      ))}
      <div className="w-[1.5px] h-[28vh] bg-foreground/10" />
    </div>
  );
}
