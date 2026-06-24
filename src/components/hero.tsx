"use client";

import { MoveRight } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { useTranslations } from "next-intl";
import { H1, Label, P, Small } from "@/components/ui/typography";
import { Link } from "@/i18n/navigation";

export function Hero() {
  const t = useTranslations("Hero");
  const { scrollY } = useScroll();
  const sectionOpacity = useTransform(scrollY, [0, 300, 700], [1, 1, 0]);
  const scrollLineScale = useTransform(scrollY, [0, 200], [0, 1]);

  return (
    <motion.section
      id="hero-section"
      className="relative flex flex-col w-full h-screen overflow-hidden px-6 md:px-12 lg:px-24"
      style={{ opacity: sectionOpacity }}
    >
      {/* Background lines */}
      <div
        className="absolute inset-0 opacity-20 -z-10 pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute left-[20%] inset-y-0 w-px bg-linear-to-b from-background via-muted-foreground to-background" />
        <div className="absolute left-1/2 inset-y-0 w-px bg-linear-to-b from-background via-muted-foreground to-background" />
        <div className="absolute left-[80%] inset-y-0 w-px bg-linear-to-b from-background via-muted-foreground to-background" />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 justify-center gap-10 md:gap-16">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="hidden md:block w-16 h-px bg-muted-foreground" />
            <Label size="sm" className="text-muted-foreground md:text-label-md">
              Software Developer & Product Designer
            </Label>
          </div>
          <H1 className="text-display-xl leading-[0.9]">
            <span className="block">Victor</span>
            <span className="block">
              <span className="italic text-muted-foreground">M.</span>
              {" Santos"}
            </span>
          </H1>
        </div>
        <div className="flex flex-col gap-8">
          <P className="text-foreground max-w-md">{t("description")}</P>
          <Link
            href="/#contact"
            className="flex items-center gap-2.5 w-fit border border-foreground rounded-sm px-5 py-2.5 md:px-6 md:py-3 text-label-md md:text-label-lg font-medium text-foreground transition-all duration-300 hover:bg-foreground hover:text-background"
          >
            {t("cta")}
            <MoveRight className="size-4" />
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="flex flex-col items-center gap-3 pb-8">
        <Small size="xs" className="tracking-[1.12px] text-muted-foreground">
          SCROLL
        </Small>
        <motion.div
          className="w-px h-8 bg-muted-foreground opacity-20 origin-top"
          style={{ scaleY: scrollLineScale }}
        />
      </div>

      {/* Year */}
      <span className="absolute top-[58%] md:top-auto md:bottom-48 left-[60%] md:left-[55%] font-display tracking-tight text-display-year leading-none text-transparent [-webkit-text-stroke:1px_var(--border)] select-none">
        2026
      </span>
    </motion.section>
  );
}
