"use client";

import { useEffect, useRef } from "react";

const SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export function useKonami(onSuccess: () => void) {
  const indexRef = useRef(0);
  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === SEQUENCE[indexRef.current]) {
        indexRef.current++;
        if (indexRef.current === SEQUENCE.length) {
          indexRef.current = 0;
          onSuccessRef.current();
        }
      } else {
        indexRef.current = e.key === SEQUENCE[0] ? 1 : 0;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
}
