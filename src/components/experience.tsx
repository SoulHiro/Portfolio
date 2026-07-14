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
    const triggers: { kill: () => void }[] = [];

    const init = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const rows = rowRefs.current.filter(Boolean) as HTMLDivElement[];

      rows.forEach((row) => {
        const left = row.querySelector<HTMLElement>("[data-cell='left']");
        const right = row.querySelector<HTMLElement>("[data-cell='right']");

        if (left) {
          const stIn = gsap.fromTo(
            left,
            { opacity: 0, x: -28 },
            {
              opacity: 1,
              x: 0,
              ease: "power2.out",
              scrollTrigger: {
                trigger: row,
                start: "top 88%",
                end: "top 55%",
                scrub: 0.6,
              },
            },
          );
          if (stIn.scrollTrigger) triggers.push(stIn.scrollTrigger);

          const stOut = gsap.fromTo(
            left,
            { opacity: 1, x: 0 },
            {
              opacity: 0,
              x: -28,
              ease: "power2.in",
              scrollTrigger: {
                trigger: row,
                start: "top 8%",
                end: "top -20%",
                scrub: 0.6,
              },
            },
          );
          if (stOut.scrollTrigger) triggers.push(stOut.scrollTrigger);
        }

        if (right) {
          const stIn = gsap.fromTo(
            right,
            { opacity: 0, x: 28 },
            {
              opacity: 1,
              x: 0,
              ease: "power2.out",
              scrollTrigger: {
                trigger: row,
                start: "top 88%",
                end: "top 50%",
                scrub: 0.6,
              },
            },
          );
          if (stIn.scrollTrigger) triggers.push(stIn.scrollTrigger);

          const stOut = gsap.fromTo(
            right,
            { opacity: 1, x: 0 },
            {
              opacity: 0,
              x: 28,
              ease: "power2.in",
              scrollTrigger: {
                trigger: row,
                start: "top 8%",
                end: "top -20%",
                scrub: 0.6,
              },
            },
          );
          if (stOut.scrollTrigger) triggers.push(stOut.scrollTrigger);
        }
      });
    };

    init();

    return () => {
      triggers.forEach((t) => {
        t.kill();
      });
    };
  }, []);

  return (
    <section id="experience" className="py-24 relative overflow-visible">
      <h2 className="font-display text-display-md tracking-tight leading-tight text-center mb-20">
        {t("title") && `${t("title")} `}
        <span className="italic text-muted-foreground">
          {t("titleHighlight")}
        </span>
      </h2>

      {/* Pawn — anchored beside item 1 (2022 start), left of timeline */}
      <div
        className="absolute left-[calc(50%-22rem)] top-[14rem] pointer-events-none select-none float-anim"
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
        className="absolute right-[calc(45%-22rem)] bottom-64 pointer-events-none select-none float-anim-slow"
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

          return (
            <div
              key={item.period + item.role}
              ref={(el) => {
                rowRefs.current[index] = el;
              }}
              className="grid grid-cols-[1fr_36px_1fr]"
            >
              {/* Left cell */}
              <div
                data-cell="left"
                className={`pr-8 flex ${yearLeft ? "justify-end items-start pt-1.5" : "justify-start"}`}
              >
                {yearLeft ? (
                  <span className="font-mono text-label-xs text-muted-foreground/40 tracking-widest">
                    {item.period}
                  </span>
                ) : (
                  <div
                    className={`flex flex-col gap-2 text-right ${isLast ? "" : "pb-20"}`}
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
                )}
              </div>

              {/* Center: dot + line */}
              <div className="flex flex-col items-center">
                <div className="size-2 rounded-full bg-foreground/35 mt-1.5 shrink-0" />
                {!isLast && <div className="w-px flex-1 bg-border/50 mt-3" />}
              </div>

              {/* Right cell */}
              <div
                data-cell="right"
                className={`pl-8 flex ${yearLeft ? "justify-start" : "justify-start items-start pt-1.5"}`}
              >
                {yearLeft ? (
                  <div
                    className={`flex flex-col gap-2 ${isLast ? "" : "pb-20"}`}
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
                ) : (
                  <span className="font-mono text-label-xs text-muted-foreground/40 tracking-widest">
                    {item.period}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
