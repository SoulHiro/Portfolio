"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

const HANGUL_POOL = "가나다라마바사아자차카타파하강산물빛하늘마음사랑꿈별";

const RAIN = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  char: HANGUL_POOL[Math.floor(Math.random() * HANGUL_POOL.length)],
  x: Math.random() * 100,
  delay: i * 0.07 + Math.random() * 0.1,
  duration: 1.6 + Math.random() * 0.8,
  size: 18 + Math.floor(Math.random() * 18),
}));

export function LogoEgg() {
  const [active, setActive] = useState(false);
  const countRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = useCallback(() => {
    setActive(false);
    countRef.current = 0;
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  useEffect(() => {
    const handler = () => {
      countRef.current++;
      if (countRef.current >= 7) {
        countRef.current = 0;
        setActive(true);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(dismiss, 7000);
      }
    };

    window.addEventListener("logo-click", handler);
    return () => {
      window.removeEventListener("logo-click", handler);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [dismiss]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="logo-egg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          onClick={dismiss}
          className="fixed inset-0 z-[9999] bg-background flex items-center justify-center overflow-hidden cursor-pointer select-none"
        >
          {/* Hangul rain */}
          {RAIN.map((rc) => (
            <motion.span
              key={rc.id}
              initial={{ y: "-8vh", opacity: 0.6 }}
              animate={{ y: "108vh", opacity: 0 }}
              transition={{
                duration: rc.duration,
                delay: rc.delay,
                ease: "linear",
              }}
              className="absolute font-korean text-foreground/10 pointer-events-none"
              style={{ left: `${rc.x}%`, fontSize: rc.size }}
            >
              {rc.char}
            </motion.span>
          ))}

          {/* Center content */}
          <div className="flex flex-col items-center gap-8 relative z-10 pointer-events-none">
            <motion.span
              initial={{ scale: 0.4, opacity: 0, filter: "blur(12px)" }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="font-korean font-bold leading-none text-foreground"
              style={{ fontSize: "clamp(5rem, 22vw, 15rem)" }}
            >
              민준
            </motion.span>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 1, ease: "easeOut" }}
              className="w-16 h-px bg-border"
              style={{ transformOrigin: "center" }}
            />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.3, ease: "easeOut" }}
              className="font-display italic text-foreground"
              style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)" }}
            >
              발견했군요
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.9, ease: "easeOut" }}
              className="text-muted-foreground text-body-sm tracking-wide"
            >
              você me encontrou.
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
