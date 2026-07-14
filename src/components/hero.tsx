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
    let ctx: { revert: () => void } | undefined;
    let onMouseMove: ((e: MouseEvent) => void) | undefined;
    let onMouseLeave: (() => void) | undefined;
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
      gsap.registerPlugin(ScrollTrigger);

      positionCoords();
      resizeObserver = new ResizeObserver(positionCoords);
      if (sectionRef.current) resizeObserver.observe(sectionRef.current);

      onMouseMove = (e: MouseEvent) => {
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
      };

      onMouseLeave = () => {
        gsap.to(parallaxRef.current, {
          x: 0,
          y: 0,
          duration: 1.5,
          ease: "power2.out",
        });
      };

      sectionRef.current?.addEventListener("mousemove", onMouseMove);
      sectionRef.current?.addEventListener("mouseleave", onMouseLeave);

      // Prevent browser from restoring scroll position (avoids flash of mid-animation state)
      if ("scrollRestoration" in history) history.scrollRestoration = "manual";

      ctx = gsap.context(() => {
        // Compute x target in pixels — GSAP doesn't reliably parse vw inside calc() for shorthand x
        const imageTargetX = window.innerWidth * 0.1 + 100;

        const tl = gsap.timeline();

        // Phase 1: texts + coords exit
        tl.to(
          [fullstackRef.current, coordLeftRef.current],
          {
            x: "-90vw",
            opacity: 0,
            ease: "none",
            duration: 0.5,
          },
          0,
        );
        tl.to(
          [engineerRef.current, coordRightRef.current],
          {
            x: "90vw",
            opacity: 0,
            ease: "none",
            duration: 0.5,
          },
          0,
        );

        // Phase 2: image translate + scale/crop + spotlight
        tl.to(
          imageRef.current,
          {
            x: imageTargetX,
            ease: "none",
            duration: 0.5,
          },
          0.55,
        );

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
          { opacity: 0, x: -32 },
          { opacity: 1, x: 0, ease: "none", duration: 0.35 },
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
          { opacity: 0, y: -40, x: -16, ease: "power2.in", duration: 0.35 },
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
        tl.to(
          [
            moniculosRef.current,
            moustacheRef.current,
            tieRef.current,
            hatRef.current,
          ],
          { opacity: 0, ease: "none", duration: 0.25 },
          2.0,
        );

        ScrollTrigger.create({
          trigger: wrapperRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.2,
          animation: tl,
          onUpdate: (self) => {
            // Phase 2 ≈ progress 0.29–0.76 (bio visible, Quem Sou state)
            const inPhase2 = self.progress > 0.29 && self.progress < 0.76;
            [
              hatRef.current,
              moniculosRef.current,
              moustacheRef.current,
              tieRef.current,
            ].forEach((el) => {
              if (el) el.style.pointerEvents = inPhase2 ? "auto" : "none";
            });
            if (self.progress > 0.01) {
              gsap.to(parallaxRef.current, {
                x: 0,
                y: 0,
                duration: 0.4,
                overwrite: "auto",
              });
            }
          },
        });

        // Prop hover animations — inside gsap.context for proper cleanup
        const hat = hatRef.current;
        const monoculos = moniculosRef.current;
        const moustache = moustacheRef.current;
        const tie = tieRef.current;

        if (hat) {
          gsap.set(hat, { transformOrigin: "50% 100%" });
          const onEnter = () =>
            gsap.to(hat, {
              rotate: -10,
              y: -10,
              duration: 0.4,
              ease: "power2.out",
            });
          const onLeave = () =>
            gsap.to(hat, {
              rotate: 0,
              y: 0,
              duration: 0.5,
              ease: "elastic.out(1, 0.5)",
            });
          hat.addEventListener("mouseenter", onEnter);
          hat.addEventListener("mouseleave", onLeave);
        }

        if (monoculos) {
          gsap.set(monoculos, { transformOrigin: "50% 50%" });
          const onEnter = () =>
            gsap.to(monoculos, {
              rotate: 10,
              y: -6,
              duration: 0.4,
              ease: "power2.out",
            });
          const onLeave = () =>
            gsap.to(monoculos, {
              rotate: 0,
              y: 0,
              duration: 0.5,
              ease: "elastic.out(1, 0.5)",
            });
          monoculos.addEventListener("mouseenter", onEnter);
          monoculos.addEventListener("mouseleave", onLeave);
        }

        if (moustache) {
          gsap.set(moustache, { transformOrigin: "50% 50%" });
          const onEnter = () =>
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
            });
          moustache.addEventListener("mouseenter", onEnter);
        }

        if (tie) {
          gsap.set(tie, { transformOrigin: "50% 0%" });
          const onEnter = () =>
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
            });
          tie.addEventListener("mouseenter", onEnter);
        }
      });
    };

    init();

    return () => {
      if (onMouseMove)
        sectionRef.current?.removeEventListener("mousemove", onMouseMove);
      if (onMouseLeave)
        sectionRef.current?.removeEventListener("mouseleave", onMouseLeave);
      resizeObserver?.disconnect();
      ctx?.revert();
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
      className="relative"
      style={{ height: "calc(3400px + 100vh)" }}
    >
      <section
        ref={sectionRef}
        id="hero-section"
        className="sticky top-0 h-screen w-full"
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
          className="absolute top-1/2 -translate-y-1/2 z-0 pointer-events-none select-none text-right"
          style={{ right: "calc(50% + 32vh)" }}
        >
          <div className="flex flex-col items-end">
            <span
              id="hero-title"
              className="font-display text-display-xl leading-none tracking-tight block"
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
          className="absolute bottom-8 font-mono text-[clamp(1.5rem,2.8vw,2.4rem)] leading-none tracking-tight pointer-events-none select-none"
          style={coordStyle}
          aria-hidden="true"
        >
          -23.55°
        </span>

        {/* Engineer */}
        <div
          ref={engineerRef}
          className="absolute top-1/2 -translate-y-1/2 z-0 pointer-events-none select-none"
          style={{ left: "calc(50% + 28vh)" }}
        >
          <div className="flex flex-col">
            <span className="font-display text-display-xl leading-none tracking-tight italic text-muted-foreground block">
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
          className="absolute bottom-8 font-mono text-[clamp(1.5rem,2.8vw,2.4rem)] leading-none tracking-tight pointer-events-none select-none"
          style={coordStyle}
          aria-hidden="true"
        >
          -46.63°
        </span>

        {/* Image stack */}
        <div
          ref={imageRef}
          className="absolute left-0 right-0 mx-auto w-fit z-10 pointer-events-none select-none"
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
              <div ref={profileImageRef}>
                <Image
                  src="/profile.png"
                  alt="Victor M. Santos"
                  width={500}
                  height={720}
                  className="h-[105vh] w-auto max-w-none block"
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
                  top: "12vh",
                  left: "26vh",
                  width: "38vh",
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
                  top: "42vh",
                  left: "53vh",
                  width: "auto",
                  height: "30vh",
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
                  top: "53vh",
                  left: "33.5vh",
                  width: "24vh",
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
                  top: "64vh",
                  left: "34vh",
                  width: "22vh",
                  height: "auto",
                }}
              />
            </div>
          </div>
        </div>

        {/* Chalk line */}
        <div
          ref={chalkRef}
          className="absolute left-2 top-[12%] h-[76%] w-5 pointer-events-none select-none z-20"
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
          className="absolute left-10 top-1/2 -translate-y-1/2 z-20 max-w-sm flex flex-col gap-6"
          style={{ opacity: 0 }}
        >
          <h2 className="font-display text-display-xl leading-none tracking-tight italic">
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
          <div className="flex flex-wrap gap-1.5">
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
          <div className="flex gap-3">
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
