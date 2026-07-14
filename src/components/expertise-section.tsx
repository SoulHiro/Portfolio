"use client";

import { type ReactNode, useEffect, useRef } from "react";

export function ExpertiseSection({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let ctx: { revert: () => void } | undefined;

    const init = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const cards = Array.from(
        el.querySelectorAll<HTMLElement>("[data-expertise-card]"),
      );
      gsap.set(cards, { y: 60, opacity: 0 });

      // Each card occupies its own slice of the timeline so scrub gives stagger
      const tl = gsap.timeline();
      cards.forEach((card, i) => {
        tl.fromTo(
          card,
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, ease: "none", duration: 0.4 },
          i * 0.28,
        );
      });

      ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          end: "top 20%",
          scrub: 1,
          animation: tl,
        });
      });
    };

    init();
    return () => ctx?.revert();
  }, []);

  return <div ref={ref}>{children}</div>;
}
