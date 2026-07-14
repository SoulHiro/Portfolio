"use client";

import { useEffect, useState } from "react";

export function MouseCoords() {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCoords({ x: e.clientX, y: e.clientY });
      if (!visible) setVisible(true);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [visible]);

  return (
    <div
      className="fixed bottom-6 right-8 flex items-center gap-3 font-mono text-label-xs text-muted-foreground/25 select-none pointer-events-none transition-opacity duration-500"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <span>X: {String(coords.x).padStart(4, "0")}</span>
      <span className="text-muted-foreground/15">·</span>
      <span>Y: {String(coords.y).padStart(4, "0")}</span>
    </div>
  );
}
