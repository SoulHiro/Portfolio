"use client";

import { useEffect } from "react";

let fired = false;

export function ConsoleEgg() {
  useEffect(() => {
    if (fired) return;
    fired = true;
    const banner = [
      "╔══════════════════════════════════════════╗",
      "║  안녕하세요.  I'm Victor — 민준.           ║",
      "╚══════════════════════════════════════════╝",
    ].join("\n");

    console.log(
      `%c${banner}`,
      [
        "font-family: monospace",
        "font-size: 12px",
        "line-height: 1.7",
        "background: #0a0a0a",
        "color: #e5e5e5",
        "padding: 10px 16px",
        "display: block",
        "border-radius: 4px",
      ].join("; "),
    );

    console.log(
      "%c→ bisbilhotando o código?  entendo.",
      "font-family: monospace; font-size: 11px; color: #a1a1aa; padding: 2px 0;",
    );

    console.log(
      "%chint: o vazio te espera.",
      "font-family: monospace; font-size: 11px; color: #3f3f46; padding: 2px 0;",
    );
  }, []);

  return null;
}
