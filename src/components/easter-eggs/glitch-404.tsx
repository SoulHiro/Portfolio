"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

const GLITCH_CHARS = "0123456789!@#$%".split("");
const pick = () =>
  GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];

export function Glitch404() {
  const [digits, setDigits] = useState(["4", "0", "4"]);
  const [message, setMessage] = useState(false);
  const [busy, setBusy] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const runGlitch = useCallback((onDone?: () => void) => {
    let tick = 0;
    timerRef.current = setInterval(() => {
      setDigits([pick(), pick(), pick()]);
      tick++;
      if (tick >= 14) {
        clearInterval(timerRef.current!);
        onDone?.();
      }
    }, 40);
  }, []);

  const triggerEgg = useCallback(() => {
    if (busy) return;
    setBusy(true);
    setMessage(false);

    runGlitch(() => {
      setDigits(["", "∞", ""]);
      setMessage(true);

      setTimeout(() => {
        setMessage(false);
        runGlitch(() => {
          setDigits(["4", "0", "4"]);
          setBusy(false);
        });
      }, 3200);
    });
  }, [busy, runGlitch]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const cx = e.clientX / window.innerWidth;
      const cy = e.clientY / window.innerHeight;
      if (cx > 0.45 && cx < 0.55 && cy > 0.45 && cy < 0.55) {
        triggerEgg();
      }
    };
    window.addEventListener("click", handler);
    return () => {
      window.removeEventListener("click", handler);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [triggerEgg]);

  return (
    <div className="flex flex-col gap-2">
      <h1 className="font-display italic text-display-year tracking-tight leading-none">
        {digits.map((d, i) => (
          <span
            key={i}
            style={{
              display: "inline-block",
              minWidth: d === "" ? "0" : "0.6em",
              transition: "min-width 0.15s",
            }}
          >
            {d}
          </span>
        ))}
      </h1>

      <AnimatePresence>
        {message && (
          <motion.p
            key="void-msg"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="font-mono text-label-xs text-muted-foreground/50 tracking-[3px]"
          >
            o infinito também erra.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
