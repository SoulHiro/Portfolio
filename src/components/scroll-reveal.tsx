"use client";

import { type ReactNode, useEffect, useRef } from "react";

export function ScrollReveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const items = Array.from(el.querySelectorAll<HTMLElement>("[data-reveal]"));

    items.forEach((item) => {
      item.style.opacity = "0";
      item.style.transform = "translateY(32px)";
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const item = entry.target as HTMLElement;
          const index = items.indexOf(item);

          setTimeout(() => {
            item.style.transition = "opacity 0.7s ease, transform 0.7s ease";
            item.style.opacity = "1";
            item.style.transform = "translateY(0)";
          }, index * 90);

          observer.unobserve(item);
        });
      },
      { threshold: 0.08 },
    );

    items.forEach((item) => {
      observer.observe(item);
    });
    return () => observer.disconnect();
  }, []);

  return <div ref={ref}>{children}</div>;
}
