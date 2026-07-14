"use client";

import { type ReactNode, useEffect, useRef } from "react";

export function ScrollScrub({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const init = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      // Generic reveal — used by Contact and any other [data-reveal] elements
      const revealItems = Array.from(
        ref.current?.querySelectorAll<HTMLElement>("[data-reveal]") ?? [],
      );
      revealItems.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 92%",
              end: "top 58%",
              scrub: 0.6,
            },
          },
        );
      });

      // ── HomeProjects scroll-driven sequence ──────────────────────────────
      //
      // Sequence (all scrub-based, advance/recede with scroll):
      //   1. Cat    — fade in from bottom
      //   2. Hat    — zoom in directly above cat
      //   3. Title  — slide in from below
      //   4. Cards  — bounce in from bottom, staggered left → right
      //
      const hpHeader =
        ref.current?.querySelector<HTMLElement>("[data-hp-header]");
      const hpCat = ref.current?.querySelector<HTMLElement>("[data-hp-cat]");
      const hpHat = ref.current?.querySelector<HTMLElement>("[data-hp-hat]");
      const hpTitle =
        ref.current?.querySelector<HTMLElement>("[data-hp-title]");
      const hpGrid = ref.current?.querySelector<HTMLElement>("[data-hp-grid]");
      const hpCards = Array.from(
        ref.current?.querySelectorAll<HTMLElement>("[data-hp-card]") ?? [],
      );

      if (hpHeader && hpCat && hpHat && hpTitle) {
        // Initial hidden states — prevents flash before trigger fires
        gsap.set(hpCat, { opacity: 0, y: 40 });
        gsap.set(hpHat, { opacity: 0, scale: 0, transformOrigin: "50% 50%" });
        gsap.set(hpTitle, { opacity: 0, y: 24 });

        const headerTl = gsap.timeline();

        // 1 — Cat fades in from bottom
        headerTl.to(
          hpCat,
          {
            opacity: 0.7,
            y: 0,
            ease: "power2.out",
            duration: 1,
          },
          0,
        );

        // 2 — Hat zooms in while cat is still settling (overlap at t=0.6)
        headerTl.to(
          hpHat,
          {
            opacity: 1,
            scale: 1,
            ease: "back.out(1.7)",
            duration: 0.9,
          },
          0.6,
        );

        // 3 — Title slides in from below
        headerTl.to(
          hpTitle,
          {
            opacity: 1,
            y: 0,
            ease: "power2.out",
            duration: 0.8,
          },
          1.1,
        );

        ScrollTrigger.create({
          trigger: hpHeader,
          start: "top 85%",
          end: "center 50%",
          scrub: 1,
          animation: headerTl,
        });
      }

      if (hpGrid && hpCards.length > 0) {
        gsap.set(hpCards, { opacity: 0, y: 70 });

        const cardsTl = gsap.timeline();
        hpCards.forEach((card, i) => {
          cardsTl.to(
            card,
            {
              opacity: 1,
              y: 0,
              ease: "power3.out",
              duration: 1,
            },
            i * 0.3,
          );
        });

        ScrollTrigger.create({
          trigger: hpGrid,
          start: "top 90%",
          end: "center 55%",
          scrub: 0.8,
          animation: cardsTl,
        });
      }
    };

    init();
  }, []);

  return <div ref={ref}>{children}</div>;
}
