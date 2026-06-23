import { getTranslations } from "next-intl/server";
import { H2, P } from "@/components/ui/typography";
import { MessageCircle } from "lucide-react";
import { ContactForm } from "@/components/contact-form";

const WHATSAPP_NUMBER = "5511914720379";

const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/victormts/" },
  { label: "Github", href: "https://github.com/SoulHiro" },
  { label: "Instagram", href: "https://www.instagram.com/soulhirostudio" },
  { label: "Youtube", href: "https://www.youtube.com/@soulhirostudio" },
];

export async function Contact() {
  const t = await getTranslations("Contact");
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(t("whatsappMessage"))}`;

  return (
    <section
      id="contact"
      className="flex items-center justify-center min-h-screen py-24 md:py-32 px-6 md:px-12 lg:px-24"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 w-full">
        {/* Left — info */}
        <div className="flex flex-col gap-8 justify-center">
          <H2>
            {t("title1")}{" "}
            <span className="text-muted-foreground italic">{t("titleHighlight")}</span>
            <br />
            {t("title2")}
          </H2>
          <P size="lg" className="text-muted-foreground font-light">
            {t("description")}
          </P>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group/wa flex items-center gap-3 w-fit border border-border px-5 py-3 transition-colors duration-300 hover:border-foreground"
          >
            <MessageCircle className="size-5 text-muted-foreground transition-colors duration-300 group-hover/wa:text-foreground" />
            <P size="md" className="text-muted-foreground font-medium transition-colors duration-300 group-hover/wa:text-foreground">
              {t("whatsappCta")}
            </P>
          </a>
          <div className="flex flex-wrap gap-4 md:gap-8">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 group/social"
              >
                <span className="size-1.5 rounded-full bg-muted-foreground" />
                <P size="lg" className="text-muted-foreground transition-colors duration-300 group-hover/social:text-foreground">
                  {social.label}
                </P>
              </a>
            ))}
          </div>
        </div>

        {/* Right — form */}
        <div className="flex flex-col justify-center">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
