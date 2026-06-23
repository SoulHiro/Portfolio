"use client";

import { useEffect, useRef } from "react";

const CLICKABLE =
  'a, button, input, select, textarea, label, [role="button"], [tabindex]:not([tabindex="-1"]), [data-cursor-expand]';

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Direct DOM mutation — no React state, no rAF — positional lag = 0ms
    const onMouseMove = (e: MouseEvent) => {
      const t = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      dot.style.transform = t;
      ring.style.transform = t;
      if (!dot.style.opacity || dot.style.opacity === "0") {
        dot.style.opacity = "1";
        ring.style.opacity = "1";
      }
    };

    const onMouseOver = (e: MouseEvent) => {
      if ((e.target as Element).closest(CLICKABLE)) {
        ring.dataset.expanded = "";
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      // Only collapse ring when actually leaving a clickable zone
      const leaving = (e.target as Element).closest(CLICKABLE);
      const entering = (e.relatedTarget as Element | null)?.closest(CLICKABLE);
      if (leaving && !entering) {
        delete ring.dataset.expanded;
      }
      // Hide both when leaving the viewport
      if (!e.relatedTarget) {
        dot.style.opacity = "0";
        ring.style.opacity = "0";
      }
    };

    document.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseover", onMouseOver, { passive: true });
    document.addEventListener("mouseout", onMouseOut, { passive: true });

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} aria-hidden="true" className="cursor-dot" />
      <div ref={ringRef} aria-hidden="true" className="cursor-ring" />
    </>
  );
}
