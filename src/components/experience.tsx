"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

export function Experience() {
  const t = useTranslations("Experience");

  const items = [
    {
      period: t("item1Period"),
      role: t("item1Role"),
      field: t("item1Field"),
      description: t("item1Desc"),
    },
    {
      period: t("item2Period"),
      role: t("item2Role"),
      field: t("item2Field"),
      description: t("item2Desc"),
    },
    {
      period: t("item3Period"),
      role: t("item3Role"),
      field: t("item3Field"),
      description: t("item3Desc"),
    },
  ];

  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let cancelled = false;
    let mm: { revert: () => void } | undefined;

    const init = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const rows = rowRefs.current.filter(Boolean) as HTMLDivElement[];
      const media = gsap.matchMedia();
      mm = media;

      // Desktop: cells slide in from their own side and out again at the top
      media.add("(min-width: 1024px)", () => {
        rows.forEach((row) => {
          const left = row.querySelector<HTMLElement>("[data-cell='left']");
          const right = row.querySelector<HTMLElement>("[data-cell='right']");

          for (const [el, dir, endIn] of [
            [left, -1, "top 55%"],
            [right, 1, "top 50%"],
          ] as const) {
            if (!el) continue;
            gsap.fromTo(
              el,
              { opacity: 0, x: 28 * dir },
              {
                opacity: 1,
                x: 0,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: row,
                  start: "top 88%",
                  end: endIn,
                  scrub: 0.6,
                },
              },
            );
            gsap.fromTo(
              el,
              { opacity: 1, x: 0 },
              {
                opacity: 0,
                x: 28 * dir,
                ease: "power2.in",
                immediateRender: false,
                scrollTrigger: {
                  trigger: row,
                  start: "top 8%",
                  end: "top -20%",
                  scrub: 0.6,
                },
              },
            );
          }
        });
      });

      // Mobile: single-column timeline — period then content rise in.
      // No exit fade: tall rows would fade while still being read.
      media.add("(max-width: 1023.98px)", () => {
        rows.forEach((row) => {
          const cells = row.querySelectorAll<HTMLElement>("[data-cell]");
          gsap.fromTo(
            cells,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              ease: "power2.out",
              stagger: 0.15,
              scrollTrigger: {
                trigger: row,
                start: "top 90%",
                end: "top 62%",
                scrub: 0.6,
              },
            },
          );
        });
      });
    };

    init();

    return () => {
      cancelled = true;
      mm?.revert();
    };
  }, []);

  return (
    <section
      id="experience"
      className="py-16 md:py-24 relative overflow-visible"
    >
      <h2 className="font-display text-display-md tracking-tight leading-tight text-center mb-12 lg:mb-20">
        {t("title") && `${t("title")} `}
        <span className="italic text-muted-foreground">
          {t("titleHighlight")}
        </span>
      </h2>

      {/* Pawn — anchored beside item 1 (2022 start), left of timeline */}
      <div
        className="absolute left-[calc(50%-22rem)] top-[14rem] pointer-events-none select-none float-anim hidden lg:block"
        aria-hidden="true"
      >
        <Image
          src="/pawn.svg"
          alt=""
          width={175}
          height={307}
          className="w-16 h-auto opacity-60 drop-shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
        />
      </div>

      {/* Palette — anchored beside item 3 (Freelance), right of timeline */}
      <div
        className="absolute right-[calc(45%-22rem)] bottom-64 pointer-events-none select-none float-anim-slow hidden lg:block"
        aria-hidden="true"
      >
        <Image
          src="/palette.svg"
          alt=""
          width={303}
          height={278}
          className="w-24 h-auto opacity-55 drop-shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
        />
      </div>

      <div className="max-w-3xl mx-auto">
        {items.map((item, index) => {
          const yearLeft = index % 2 === 0;
          const isLast = index === items.length - 1;

          // Mobile: [dot | period / content]. Desktop: alternating
          // [left | dot | right] — same nodes, placed by grid lines.
          return (
            <div
              key={item.period + item.role}
              ref={(el) => {
                rowRefs.current[index] = el;
              }}
              className="grid grid-cols-[12px_1fr] gap-x-5 lg:grid-cols-[1fr_36px_1fr] lg:gap-x-0"
            >
              {/* Period */}
              <div
                data-cell={yearLeft ? "left" : "right"}
                className={`col-start-2 row-start-1 flex items-start pb-2 lg:row-start-1 lg:pb-0 lg:pt-1.5 ${
                  yearLeft
                    ? "lg:col-start-1 lg:pr-8 lg:justify-end"
                    : "lg:col-start-3 lg:pl-8 lg:justify-start"
                }`}
              >
                <span className="font-mono text-label-xs text-muted-foreground/40 tracking-widest">
                  {item.period}
                </span>
              </div>

              {/* Center: dot + line */}
              <div className="col-start-1 row-start-1 row-span-2 flex flex-col items-center lg:col-start-2 lg:row-span-1">
                <div className="size-2 rounded-full bg-foreground/35 mt-1 lg:mt-1.5 shrink-0" />
                {!isLast && <div className="w-px flex-1 bg-border/50 mt-3" />}
              </div>

              {/* Content */}
              <div
                data-cell={yearLeft ? "right" : "left"}
                className={`col-start-2 row-start-2 flex justify-start lg:row-start-1 ${
                  yearLeft ? "lg:col-start-3 lg:pl-8" : "lg:col-start-1 lg:pr-8"
                }`}
              >
                <div
                  className={`flex flex-col gap-2 ${yearLeft ? "" : "lg:text-right"} ${isLast ? "" : "pb-14 lg:pb-20"}`}
                >
                  <h3 className="font-display text-h3 italic leading-tight tracking-tight">
                    {item.role}
                  </h3>
                  <span className="font-mono text-label-xs text-muted-foreground/50 tracking-wide">
                    {item.field}
                  </span>
                  <p className="text-body-sm text-muted-foreground font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
