import { getTranslations } from "next-intl/server";
import { H2, P } from "@/components/ui/typography";
import { ContactForm } from "@/components/contact-form";

const EMAIL = "victormts.s1@gmail.com";

const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/victormts/" },
  { label: "Github", href: "https://github.com/SoulHiro" },
  { label: "Instagram", href: "https://www.instagram.com/soulhirostudio" },
  { label: "Youtube", href: "https://www.youtube.com/@soulhirostudio" },
];

export async function Contact() {
  const t = await getTranslations("Contact");

  return (
    <section
      id="contact"
      className="flex items-center justify-center min-h-screen py-24 md:py-32"
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
            href={`mailto:${EMAIL}`}
            className="text-body-md text-muted-foreground hover:text-foreground transition-colors duration-300 w-fit"
          >
            {EMAIL}
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
