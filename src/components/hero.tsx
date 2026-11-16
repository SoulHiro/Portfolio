"use client";

import { Download, MoveRight } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { P } from "@/components/ui/typography";
import { Link } from "@/i18n/navigation";

export function Hero() {
  const t = useTranslations("Hero");

  const wrapperRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const fullstackRef = useRef<HTMLDivElement>(null);
  const engineerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const imageScaleRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const bioRef = useRef<HTMLDivElement>(null);
  const chalkRef = useRef<HTMLDivElement>(null);
  const coordLeftRef = useRef<HTMLSpanElement>(null);
  const coordRightRef = useRef<HTMLSpanElement>(null);
  const hatRef = useRef<HTMLImageElement>(null);
  const moniculosRef = useRef<HTMLImageElement>(null);
  const moustacheRef = useRef<HTMLImageElement>(null);
  const tieRef = useRef<HTMLImageElement>(null);
  const profileImageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Async import + React StrictMode: the first effect run is cleaned up before
    // init() resolves, so we need a flag to avoid building the scene twice.
    let cancelled = false;
    let mm: { revert: () => void } | undefined;
    let resizeObserver: ResizeObserver | undefined;

    const positionCoords = () => {
      if (fullstackRef.current && coordLeftRef.current) {
        const rect = fullstackRef.current.getBoundingClientRect();
        coordLeftRef.current.style.left = `${rect.left}px`;
        coordLeftRef.current.style.right = "auto";
        coordLeftRef.current.style.opacity = "1";
      }
      if (engineerRef.current && coordRightRef.current) {
        const rect = engineerRef.current.getBoundingClientRect();
        coordRightRef.current.style.right = `${window.innerWidth - rect.right}px`;
        coordRightRef.current.style.left = "auto";
        coordRightRef.current.style.opacity = "1";
      }
    };

    const init = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      // Mobile address bar show/hide fires resize events; refreshing on every one
      // makes the pinned hero jump mid-scroll.
      ScrollTrigger.config({ ignoreMobileResize: true });

      positionCoords();
      resizeObserver = new ResizeObserver(positionCoords);
      if (sectionRef.current) resizeObserver.observe(sectionRef.current);

      // Prevent browser from restoring scroll position (avoids flash of mid-animation state)
      if ("scrollRestoration" in history) history.scrollRestoration = "manual";

      const props = [
        hatRef.current,
        moniculosRef.current,
        moustacheRef.current,
        tieRef.current,
      ];

      // matchMedia builds one choreography per layout and reverts it cleanly
      // (inline styles included) when the viewport crosses the breakpoint.
      const media = gsap.matchMedia();
      mm = media;

      media.add(
        {
          isDesktop: "(min-width: 1024px)",
          isMobile: "(max-width: 1023.98px)",
          canHover: "(hover: hover) and (pointer: fine)",
        },
        (context) => {
          const { isDesktop, canHover } = context.conditions as {
            isDesktop: boolean;
            canHover: boolean;
          };
          const cleanups: (() => void)[] = [];
          const on = (
            el: EventTarget | null | undefined,
            type: string,
            fn: EventListener,
          ) => {
            if (!el) return;
            el.addEventListener(type, fn);
            cleanups.push(() => el.removeEventListener(type, fn));
          };

          // ── Mouse parallax (pointer devices only) ──────────────────────
          if (canHover) {
            on(sectionRef.current, "mousemove", ((e: MouseEvent) => {
              if (window.scrollY > 20) return;
              const section = sectionRef.current;
              if (!section) return;
              const r = section.getBoundingClientRect();
              const dx = (e.clientX - r.left - r.width / 2) / (r.width / 2);
              const dy = (e.clientY - r.top - r.height / 2) / (r.height / 2);
              gsap.to(parallaxRef.current, {
                x: -dx * 14,
                y: -dy * 10,
                duration: 1.2,
                ease: "power2.out",
                overwrite: "auto",
              });
            }) as EventListener);
            on(sectionRef.current, "mouseleave", () => {
              gsap.to(parallaxRef.current, {
                x: 0,
                y: 0,
                duration: 1.5,
                ease: "power2.out",
              });
            });
          }

          const tl = gsap.timeline();

          // Phase 1: texts + coords exit
          tl.to(
            [fullstackRef.current, coordLeftRef.current],
            { x: "-90vw", opacity: 0, ease: "none", duration: 0.5 },
            0,
          );
          tl.to(
            [engineerRef.current, coordRightRef.current],
            { x: "90vw", opacity: 0, ease: "none", duration: 0.5 },
            0,
          );

          // Phase 2: image steps aside + scale/crop + spotlight
          if (isDesktop) {
            // Function value + invalidateOnRefresh keeps it right after a resize
            tl.to(
              imageRef.current,
              {
                x: () => window.innerWidth * 0.1 + 100,
                ease: "none",
                duration: 0.5,
              },
              0.55,
            );
          } else {
            // No room for a side-by-side layout: the portrait slides right and
            // dims into a backdrop so the bio reads on top of it.
            tl.to(
              imageRef.current,
              {
                x: () => window.innerWidth * 0.3,
                opacity: 0.22,
                ease: "none",
                duration: 0.5,
              },
              0.55,
            );
            tl.to(props, { opacity: 0, ease: "none", duration: 0.3 }, 0.55);
          }

          tl.fromTo(
            spotlightRef.current,
            { opacity: 0, scale: 0.6 },
            { opacity: 1, scale: 1, ease: "none", duration: 0.5 },
            0.55,
          );

          tl.fromTo(
            imageScaleRef.current,
            { scale: 1, clipPath: "inset(0% 0% 0% 0%)" },
            {
              scale: 1.05,
              clipPath: "inset(0% 0% 5% 0%)",
              ease: "none",
              duration: 0.5,
            },
            0.55,
          );

          // Phase 2 parallel: bio + chalk fade in
          tl.fromTo(
            bioRef.current,
            // autoAlpha also toggles visibility: a hidden bio must not catch
            // taps or keyboard focus
            { autoAlpha: 0, x: -32 },
            { autoAlpha: 1, x: 0, ease: "none", duration: 0.35 },
            0.75,
          );
          tl.fromTo(
            chalkRef.current,
            { opacity: 0 },
            { opacity: 1, ease: "none", duration: 0.35 },
            0.75,
          );

          // Hold at "Quem sou" state — extends scroll time so the bio is readable
          tl.to({}, { duration: 0.8 }, 1.17);

          // Phase 3: Quem Sou exits — bio rises and fades, profile shrinks and fades
          tl.to(
            bioRef.current,
            { autoAlpha: 0, y: -40, x: -16, ease: "power2.in", duration: 0.35 },
            1.97,
          );
          tl.to(
            [chalkRef.current, spotlightRef.current],
            { opacity: 0, ease: "none", duration: 0.35 },
            1.97,
          );
          tl.to(
            [profileImageRef.current, imageScaleRef.current],
            { opacity: 0, scale: 0.95, ease: "power2.in", duration: 0.35 },
            1.97,
          );
          tl.to(props, { opacity: 0, ease: "none", duration: 0.25 }, 2.0);

          // Props are clickable on desktop while the bio is up (phase 2) and,
          // on touch screens, in the intro where the portrait is the focus.
          const setPropsInteractive = (progress: number) => {
            const active = isDesktop
              ? progress > 0.29 && progress < 0.76
              : progress < 0.04;
            for (const el of props) {
              if (el) el.style.pointerEvents = active ? "auto" : "none";
            }
          };

          const st = ScrollTrigger.create({
            trigger: wrapperRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: isDesktop ? 1.2 : 0.8,
            animation: tl,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              setPropsInteractive(self.progress);
              if (canHover && self.progress > 0.01) {
                gsap.to(parallaxRef.current, {
                  x: 0,
                  y: 0,
                  duration: 0.4,
                  overwrite: "auto",
                });
              }
            },
          });
          setPropsInteractive(st.progress);

          // ── Prop micro-interactions ────────────────────────────────────
          // Hover on pointer devices; on touch, a tap plays "enter" then settles.
          const bindProp = (
            el: HTMLElement | null,
            origin: string,
            enter: () => gsap.core.Tween,
            leave?: () => gsap.core.Tween,
          ) => {
            if (!el) return;
            gsap.set(el, { transformOrigin: origin });
            if (canHover) {
              on(el, "mouseenter", () => enter());
              if (leave) on(el, "mouseleave", () => leave());
            } else {
              on(el, "click", () => {
                const t = enter();
                if (leave) t.eventCallback("onComplete", () => leave());
              });
            }
          };

          const hat = hatRef.current;
          bindProp(
            hat,
            "50% 100%",
            () =>
              gsap.to(hat, {
                rotate: -10,
                y: -10,
                duration: 0.4,
                ease: "power2.out",
              }),
            () =>
              gsap.to(hat, {
                rotate: 0,
                y: 0,
                duration: 0.5,
                ease: "elastic.out(1, 0.5)",
              }),
          );

          const monoculos = moniculosRef.current;
          bindProp(
            monoculos,
            "50% 50%",
            () =>
              gsap.to(monoculos, {
                rotate: 10,
                y: -6,
                duration: 0.4,
                ease: "power2.out",
              }),
            () =>
              gsap.to(monoculos, {
                rotate: 0,
                y: 0,
                duration: 0.5,
                ease: "elastic.out(1, 0.5)",
              }),
          );

          const moustache = moustacheRef.current;
          bindProp(moustache, "50% 50%", () =>
            gsap.to(moustache, {
              keyframes: [
                { rotate: -6, duration: 0.08 },
                { rotate: 6, duration: 0.08 },
                { rotate: -5, duration: 0.08 },
                { rotate: 5, duration: 0.08 },
                { rotate: -3, duration: 0.08 },
                { rotate: 3, duration: 0.08 },
                { rotate: 0, duration: 0.12 },
              ],
            }),
          );

          const tie = tieRef.current;
          bindProp(tie, "50% 0%", () =>
            gsap.to(tie, {
              keyframes: [
                { rotate: -7, duration: 0.09 },
                { rotate: 7, duration: 0.09 },
                { rotate: -5, duration: 0.09 },
                { rotate: 5, duration: 0.09 },
                { rotate: -3, duration: 0.09 },
                { rotate: 3, duration: 0.09 },
                { rotate: 0, duration: 0.14 },
              ],
            }),
          );

          return () => {
            for (const fn of cleanups) fn();
          };
        },
      );
    };

    init();

    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
      mm?.revert();
    };
  }, []);

  const coordStyle: React.CSSProperties = {
    WebkitTextStroke: "0.6px rgba(255,255,255,0.13)",
    color: "transparent",
    opacity: 0,
  };

  return (
    <div
      ref={wrapperRef}
      className="relative -mx-4 md:-mx-6 lg:mx-0 h-[calc(2600px+100lvh)] lg:h-[calc(3400px+100vh)]"
    >
      <section
        ref={sectionRef}
        id="hero-section"
        className="sticky top-0 h-lvh lg:h-screen w-full max-lg:overflow-clip"
        aria-labelledby="hero-title"
      >
        {/* Background lines */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          aria-hidden="true"
        >
          <div className="absolute left-[20%] inset-y-0 w-px bg-linear-to-b from-background via-muted-foreground to-background" />
          <div className="absolute left-1/2  inset-y-0 w-px bg-linear-to-b from-background via-muted-foreground to-background" />
          <div className="absolute left-[80%] inset-y-0 w-px bg-linear-to-b from-background via-muted-foreground to-background" />
        </div>

        {/* Fullstack */}
        <div
          ref={fullstackRef}
          className="absolute top-[13svh] left-4 md:left-6 z-0 pointer-events-none select-none lg:left-auto lg:right-[calc(50%+32vh)] lg:top-1/2 lg:-translate-y-1/2 lg:text-right"
        >
          <div className="flex flex-col items-start lg:items-end">
            <span
              id="hero-title"
              className="font-display text-[min(19vw,7rem)] lg:text-display-xl leading-none tracking-tight block"
            >
              Fullstack
            </span>
            <span
              className="font-sans text-label-sm tracking-[3px] uppercase opacity-0"
              aria-hidden="true"
            >
              {t("level")}
            </span>
          </div>
        </div>

        {/* Coordinate left */}
        <span
          ref={coordLeftRef}
          className="absolute bottom-8 hidden lg:block font-mono text-[clamp(1.5rem,2.8vw,2.4rem)] leading-none tracking-tight pointer-events-none select-none"
          style={coordStyle}
          aria-hidden="true"
        >
          -23.55°
        </span>

        {/* Engineer */}
        <div
          ref={engineerRef}
          className="absolute top-[calc(13svh+min(19vw,7rem))] right-4 md:right-6 z-0 pointer-events-none select-none lg:right-auto lg:left-[calc(50%+28vh)] lg:top-1/2 lg:-translate-y-1/2"
        >
          <div className="flex flex-col">
            <span className="font-display text-[min(19vw,7rem)] lg:text-display-xl leading-none tracking-tight italic text-muted-foreground block">
              Engineer
            </span>
            <span className="not-italic font-sans text-label-sm font-normal text-muted-foreground/40 tracking-[3px] uppercase self-end">
              {t("level")}
            </span>
          </div>
        </div>

        {/* Coordinate right */}
        <span
          ref={coordRightRef}
          className="absolute bottom-8 hidden lg:block font-mono text-[clamp(1.5rem,2.8vw,2.4rem)] leading-none tracking-tight pointer-events-none select-none"
          style={coordStyle}
          aria-hidden="true"
        >
          -46.63°
        </span>

        {/* Image stack */}
        <div
          ref={imageRef}
          className="absolute left-1/2 -translate-x-1/2 w-fit z-10 pointer-events-none select-none lg:left-0 lg:right-0 lg:mx-auto lg:translate-x-0"
          style={{ bottom: "-5vh" }}
        >
          <div
            ref={spotlightRef}
            className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
            style={{
              bottom: "-15%",
              width: "220%",
              height: "130%",
              background:
                "radial-gradient(ellipse 55% 50% at 50% 52%, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.03) 45%, transparent 70%)",
              zIndex: -1,
              opacity: 0,
            }}
            aria-hidden="true"
          />
          <div ref={parallaxRef}>
            <div ref={imageScaleRef} className="origin-top">
              {/* Portrait box: height drives everything; props below are placed
                  in % of this box so they stay glued to the face at any size. */}
              <div
                ref={profileImageRef}
                className="relative h-[70svh] sm:h-[78svh] lg:h-[105vh] aspect-[500/720]"
              >
                <Image
                  src="/profile.png"
                  alt="Victor M. Santos"
                  width={500}
                  height={720}
                  sizes="(min-width: 1024px) 73vh, 55svh"
                  className="h-full w-auto max-w-none block"
                  priority
                />
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={hatRef}
                src="/hat.svg"
                alt=""
                aria-hidden="true"
                data-hero-hat=""
                className="absolute select-none cursor-pointer"
                style={{
                  top: "11.43%",
                  left: "35.66%",
                  width: "52.11%",
                  height: "auto",
                }}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={moniculosRef}
                src="/monoculos.svg"
                alt=""
                aria-hidden="true"
                className="absolute select-none cursor-pointer"
                style={{
                  top: "40%",
                  left: "72.69%",
                  width: "auto",
                  height: "28.57%",
                }}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={moustacheRef}
                src="/moustache.svg"
                alt=""
                aria-hidden="true"
                className="absolute select-none cursor-pointer"
                style={{
                  top: "50.48%",
                  left: "45.94%",
                  width: "32.91%",
                  height: "auto",
                }}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={tieRef}
                src="/tie.svg"
                alt=""
                aria-hidden="true"
                className="absolute select-none cursor-pointer"
                style={{
                  top: "60.95%",
                  left: "46.63%",
                  width: "30.17%",
                  height: "auto",
                }}
              />
            </div>
          </div>
        </div>

        {/* Chalk line */}
        <div
          ref={chalkRef}
          className="absolute left-3 lg:left-2 top-[12%] h-[76%] w-5 pointer-events-none select-none z-20"
          style={{ opacity: 0 }}
          aria-hidden="true"
        >
          <svg
            className="h-full w-full"
            viewBox="0 0 20 800"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <filter
                id="chalk-filter"
                x="-50%"
                y="-5%"
                width="200%"
                height="110%"
              >
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.018 0.45"
                  numOctaves="4"
                  seed="9"
                  result="noise"
                />
                <feDisplacementMap
                  in="SourceGraphic"
                  in2="noise"
                  scale="3.5"
                  xChannelSelector="R"
                  yChannelSelector="G"
                />
              </filter>
            </defs>
            <line
              x1="10"
              y1="0"
              x2="10"
              y2="800"
              stroke="rgba(255,255,255,0.22)"
              strokeWidth="1.5"
              strokeLinecap="round"
              filter="url(#chalk-filter)"
            />
          </svg>
        </div>

        {/* Bio panel */}
        <div
          ref={bioRef}
          className="absolute left-11 right-5 top-[50svh] -translate-y-1/2 z-20 max-w-md flex flex-col gap-5 lg:left-10 lg:right-auto lg:top-1/2 lg:max-w-sm lg:gap-6"
          style={{ opacity: 0, visibility: "hidden" }}
        >
          <h2 className="font-display text-[min(17vw,5.5rem)] lg:text-display-xl leading-none tracking-tight italic">
            {t("bioTitle")}
          </h2>
          <P size="lg" className="text-foreground leading-relaxed">
            {t("bio")}
          </P>
          <div className="flex items-center gap-3 font-mono text-label-xs text-muted-foreground/60 tracking-wide">
            <span>{t("remote")}</span>
            <span className="w-px h-3 bg-muted-foreground/30" />
            <span>{t("languages")}</span>
          </div>
          <div className="flex flex-wrap gap-1.5 [@media(max-height:560px)]:hidden">
            {[
              "Next.js",
              "React",
              "TypeScript",
              "Node.js",
              "PostgreSQL",
              "Docker",
            ].map((tech) => (
              <span
                key={tech}
                className="font-mono text-label-xs text-muted-foreground/50 border border-border/50 px-2 py-1"
              >
                {tech}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/#contact"
              className="flex items-center gap-2.5 bg-foreground rounded-sm px-5 py-2.5 text-label-md font-medium text-background transition-all duration-300 hover:bg-foreground/85"
            >
              {t("cta")}
              <MoveRight className="size-4" />
            </Link>
            <a
              href="/cv.pdf"
              download
              className="flex items-center gap-2.5 border border-border rounded-sm px-5 py-2.5 text-label-md font-medium text-muted-foreground transition-all duration-300 hover:border-foreground hover:text-foreground"
            >
              {t("cvCta")}
              <Download className="size-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
