"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { Label, Small } from "@/components/ui/typography";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { Menu, X } from "lucide-react";

/* ─── Live Clock ─── */
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
    <Small size="xs" className="text-muted-foreground tracking-wide" suppressHydrationWarning>
      {currentTime
        ? `${countryCode} — ${currentTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`
        : `${countryCode} — --:--:--`}
    </Small>
  );
}

/* ─── Nav Items (desktop) ─── */
function NavItems() {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const items = [
    { label: t("about"), href: "/#about", sectionId: "about" },
    { label: t("devlog"), href: "/works" },
    { label: t("lab"), href: "/lab" },
    { label: t("contact"), href: "/#contact", sectionId: "contact" },
  ];

  useEffect(() => {
    if (pathname !== "/") return;
    const sectionIds = items.filter((i) => i.sectionId).map((i) => i.sectionId!);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }
      },
      { rootMargin: "-40% 0px -40% 0px" },
    );
    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [pathname]);

  const handleClick = (e: React.MouseEvent, item: (typeof items)[number]) => {
    if (item.sectionId) {
      e.preventDefault();
      if (pathname === "/") {
        document.getElementById(item.sectionId)?.scrollIntoView({ behavior: "smooth" });
      } else {
        router.push(item.href);
      }
    }
  };

  return (
    <nav className="hidden lg:flex gap-4 text-muted-foreground">
      {items.map((item) => {
        const isActive = item.sectionId
          ? pathname === "/" && activeSection === item.sectionId
          : pathname.startsWith(item.href);
        return (
          <div key={item.href} className="relative pb-1">
            <a
              href={item.href}
              onClick={(e) => handleClick(e, item)}
              className={cn(
                "text-label-md transition-colors duration-300 hover:text-primary",
                isActive && "text-primary",
              )}
            >
              {item.label}
            </a>
            {isActive && (
              <motion.div
                layoutId="nav-underline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                style={{ originX: 0.5 }}
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}

/* ─── Mobile Menu ─── */
function MobileMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const router = useRouter();

  const items = [
    { label: t("about"), href: "/#about", sectionId: "about" },
    { label: t("devlog"), href: "/works" },
    { label: t("lab"), href: "/lab" },
    { label: t("contact"), href: "/#contact", sectionId: "contact" },
  ];

  const handleClick = (e: React.MouseEvent, item: (typeof items)[number]) => {
    if (item.sectionId) {
      e.preventDefault();
      onClose();
      if (pathname === "/") {
        setTimeout(() => {
          document.getElementById(item.sectionId!)?.scrollIntoView({ behavior: "smooth" });
        }, 300);
      } else {
        router.push(item.href);
      }
    } else {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-40 bg-background flex flex-col items-center justify-center"
        >
          <nav className="flex flex-col items-center gap-8">
            {items.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleClick(e, item)}
                className="text-3xl md:text-4xl font-medium text-foreground transition-colors duration-300 hover:text-muted-foreground"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Navbar (exported) ─── */
export function Navbar() {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => { setIsMenuOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMenuOpen]);

  useEffect(() => {
    const hero = document.getElementById("hero-section");
    if (!hero) { setIsScrolled(false); return; }
    const observer = new IntersectionObserver(
      ([entry]) => setIsScrolled(!entry?.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, [pathname]);

  const headerBg = isMenuOpen
    ? "bg-background"
    : isScrolled
      ? "bg-background/50 backdrop-blur-md border-b border-border/50"
      : "";

  return (
    <>
      <header
        className={`fixed z-50 top-0 left-0 w-full transition-all duration-300 ${headerBg}`}
      >
        <div className="grid grid-cols-[1fr_auto_1fr] items-center px-4 py-4 lg:px-8 lg:py-8 max-w-7xl mx-auto">
        <Link href="/" className="justify-self-start">
          <Label className="font-korean text-body-md font-medium">민준</Label>
        </Link>

        <div>
          <NavItems />
          <div className="lg:hidden"><LiveClock /></div>
        </div>

        <div className="justify-self-end flex items-center gap-6">
          <div className="hidden lg:block"><LiveClock /></div>
          <LocaleSwitcher />
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden flex items-center justify-center size-10 text-foreground cursor-pointer"
            aria-label={isMenuOpen ? t("closeMenu") : t("openMenu")}
          >
            {isMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
        </div>
      </header>

      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
