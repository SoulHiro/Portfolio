import { getTranslations } from "next-intl/server";
import { P } from "@/components/ui/typography";
import { Container } from "@/components/ui/container";
import {
  IconBrandLinkedin,
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandYoutube,
  IconBrandWhatsapp,
} from "@tabler/icons-react";
import { ScrollToTop } from "@/components/scroll-to-top";

const WHATSAPP_NUMBER = "5511914720379";

const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/victormts/", icon: IconBrandLinkedin },
  { label: "Github", href: "https://github.com/SoulHiro", icon: IconBrandGithub },
  { label: "Instagram", href: "https://www.instagram.com/soulhirostudio", icon: IconBrandInstagram },
  { label: "Youtube", href: "https://www.youtube.com/@soulhirostudio", icon: IconBrandYoutube },
];

export async function Footer() {
  const t = await getTranslations("Footer");
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(t("whatsappMessage"))}`;
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border">
      <Container className="flex items-center justify-between py-6 gap-4">
        <P size="xs" className="text-muted-foreground flex-1">
          {t("copyright", { year })}
        </P>

        <div className="flex items-center gap-4">
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="text-muted-foreground transition-colors duration-300 hover:text-foreground"
            >
              <social.icon className="size-5" stroke={1.5} />
            </a>
          ))}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("whatsappLabel")}
            className="text-muted-foreground transition-colors duration-300 hover:text-foreground"
          >
            <IconBrandWhatsapp className="size-5" stroke={1.5} />
          </a>
        </div>

        <div className="flex-1 flex justify-end">
          <ScrollToTop />
        </div>
      </Container>
    </footer>
  );
}
