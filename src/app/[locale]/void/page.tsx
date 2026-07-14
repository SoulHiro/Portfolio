"use client";

import { AnimatePresence, motion } from "motion/react";
import { useLocale } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import {
  buildLines,
  type HistoryEntry,
  handleCommand,
} from "@/lib/void-commands";

export default function VoidPage() {
  const locale = useLocale();
  const router = useRouter();
  const isPt = locale === "pt-br";
  const lines = buildLines(isPt);

  const totalDelay = lines[lines.length - 1].delay + 0.4;

  const [inputReady, setInputReady] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(
      () => {
        setInputReady(true);
      },
      totalDelay * 1000 + 400,
    );
    return () => clearTimeout(t);
  }, [totalDelay]);

  useEffect(() => {
    if (inputReady) inputRef.current?.focus();
  }, [inputReady]);

  const submit = useCallback(() => {
    const raw = inputValue;
    setInputValue("");

    const output = handleCommand(
      raw,
      isPt,
      () => router.push("/"),
      () => setHistory([]),
    );

    if (raw.trim() !== "" || output.length > 0) {
      setHistory((prev) => [...prev, { input: raw, output }]);
    }
  }, [inputValue, isPt, router]);

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: intentional terminal click-to-focus UX
    // biome-ignore lint/a11y/useKeyWithClickEvents: terminal captures keyboard via input element
    <div
      className="fixed inset-0 z-[100] bg-[#050505] flex items-center justify-center overflow-hidden"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Pulsing ambient background */}
      <motion.div
        animate={{ scale: [1, 1.12, 1], opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, oklch(0.18 0 0) 0%, oklch(0.04 0 0) 100%)",
        }}
      />

      <div className="relative z-10 font-mono text-sm leading-loose max-w-lg w-full px-8">
        {/* Static animated lines */}
        {lines.map((line, i) => {
          if (line.type === "gap") return <div key={i} className="h-3" />;
          return (
            <motion.p
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: line.delay, duration: 0.3 }}
              className={
                line.type === "cmd" ? "text-[#e5e5e5]" : "text-[#52525b] pl-4"
              }
            >
              {line.text}
            </motion.p>
          );
        })}

        {/* Command history */}
        <AnimatePresence>
          {history.map((entry, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-[#e5e5e5]">&gt; {entry.input}</p>
              {entry.output.map((line, j) => (
                <p key={j} className="text-[#52525b] pl-4">
                  {line}
                </p>
              ))}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Interactive prompt */}
        <AnimatePresence>
          {inputReady && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex items-center text-[#e5e5e5]"
            >
              <span className="select-none">&gt;&nbsp;</span>
              <input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") submit();
                }}
                className="flex-1 bg-transparent border-none outline-none text-[#e5e5e5] font-mono text-sm caret-[#e5e5e5]"
                spellCheck={false}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
              />
              {inputValue === "" && (
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.85, repeat: Infinity }}
                  className="text-[#e5e5e5] select-none pointer-events-none"
                >
                  _
                </motion.span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
