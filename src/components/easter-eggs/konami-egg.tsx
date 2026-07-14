"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";
import { useKonami } from "@/hooks/use-konami";

const PARTICLES = Array.from({ length: 28 }, (_, i) => {
  const angle = (i * 360) / 28;
  const distance = 140 + Math.random() * 280;
  const rad = (angle * Math.PI) / 180;
  return {
    id: i,
    x: Math.cos(rad) * distance,
    y: Math.sin(rad) * distance,
    color: `hsl(${Math.round(i * 13) % 360}, 78%, 62%)`,
    size: 5 + Math.floor(Math.random() * 7),
    duration: 0.9 + Math.random() * 0.5,
  };
});

export function KonamiEgg() {
  const [flash, setFlash] = useState(false);
  const [active, setActive] = useState(false);

  const handleUnlock = useCallback(() => {
    if (active) return;
    setFlash(true);
    setTimeout(() => {
      setFlash(false);
      setActive(true);
      setTimeout(() => setActive(false), 5500);
    }, 280);
  }, [active]);

  useKonami(handleUnlock);

  return (
    <>
      {/* Screen flash */}
      <AnimatePresence>
        {flash && (
          <motion.div
            key="flash"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.9, 0] }}
            transition={{ duration: 0.28, times: [0, 0.35, 1] }}
            className="fixed inset-0 z-[10000] bg-white pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Konami overlay */}
      <AnimatePresence>
        {active && (
          <motion.div
            key="konami-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={() => setActive(false)}
            className="fixed inset-0 z-[9999] bg-background/92 backdrop-blur-md flex items-center justify-center cursor-pointer overflow-hidden select-none"
          >
            {/* Particle burst */}
            {PARTICLES.map((p) => (
              <motion.div
                key={p.id}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.2 }}
                transition={{ duration: p.duration, ease: [0.2, 1, 0.4, 1] }}
                className="absolute rounded-sm pointer-events-none"
                style={{
                  width: p.size,
                  height: p.size,
                  background: p.color,
                }}
              />
            ))}

            {/* Content */}
            <div className="flex flex-col items-center gap-5 relative z-10">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.4 }}
                className="font-mono text-xs text-muted-foreground/60 tracking-[4px] uppercase"
              >
                ↑↑↓↓←→←→BA
              </motion.p>

              <motion.h2
                initial={{ opacity: 0, scale: 0.75, filter: "blur(8px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{
                  delay: 0.5,
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="font-display font-bold tracking-tight text-foreground"
                style={{ fontSize: "clamp(2.5rem, 10vw, 6rem)" }}
              >
                KONAMI CODE
              </motion.h2>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.9, duration: 0.5, ease: "easeOut" }}
                className="w-12 h-px bg-border"
                style={{ transformOrigin: "center" }}
              />

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.4 }}
                className="text-muted-foreground text-body-sm"
              >
                30 vidas desbloqueadas.
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
