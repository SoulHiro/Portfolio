"use client";

import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { Small } from "@/components/ui/typography";
import { Link } from "@/i18n/navigation";

function LiveClock() {
  const locale = useLocale();
  const countryCode = locale === "pt-br" ? "BR" : "US";
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentTime(new Date());
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Small
      size="xs"
      className="text-muted-foreground tracking-wide"
      suppressHydrationWarning
    >
      {currentTime
        ? `${countryCode} — ${currentTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`
        : `${countryCode} — --:--:--`}
    </Small>
  );
}

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero-section");
    if (!hero) {
      setIsScrolled(false);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setIsScrolled(!entry?.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  const headerBg = isScrolled
    ? "bg-background/50 backdrop-blur-md border-b border-border/50"
    : "";

  return (
    <header
      className={`fixed z-50 top-0 left-0 w-full transition-all duration-300 ${headerBg}`}
    >
      <div className="flex items-center justify-between px-4 py-4 lg:px-8 lg:py-6 max-w-7xl mx-auto">
        <Link href="/">
          <span className="font-mono text-label-xs tracking-[4px] text-muted-foreground/70 uppercase">
            Victor M. Santos
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <LiveClock />
          <LocaleSwitcher />
        </div>
      </div>
    </header>
  );
}
