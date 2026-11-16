import { getTranslations } from "next-intl/server";
import { ContactForm } from "@/components/contact-form";
import { H2, P } from "@/components/ui/typography";
import { socialLinks } from "@/lib/social-links";

const EMAIL = "victormts.s1@gmail.com";

export async function Contact() {
  const t = await getTranslations("Contact");

  return (
    <section
      id="contact"
      className="flex items-center justify-center md:min-h-screen py-16 md:py-32"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 w-full">
        {/* Left — info */}
        <div data-reveal className="flex flex-col gap-8 justify-center">
          <H2>
            {t("title1")}{" "}
            <span className="text-muted-foreground italic">
              {t("titleHighlight")}
            </span>
          </H2>

          <P size="lg" className="text-muted-foreground font-light max-w-xs">
            {t("description")}
          </P>

          <address className="not-italic flex flex-col gap-1.5">
            <span className="font-display text-h3 italic leading-tight tracking-tight">
              R. País Leme, 215 — Conj. 1713
            </span>
            <span className="text-body-md text-muted-foreground">
              Pinheiros · São Paulo, SP
            </span>
            <span className="font-mono text-label-sm text-muted-foreground/50 mt-1">
              CEP 05424-150
            </span>
          </address>

          <a
            href={`mailto:${EMAIL}`}
            className="text-body-md text-muted-foreground hover:text-foreground transition-colors duration-300 w-fit break-all"
          >
            {EMAIL}
          </a>

          {/* Desktop shows these in the fixed side rail; below lg it's hidden */}
          <ul className="flex items-center gap-2 -ml-2.5 lg:hidden">
            {socialLinks.map(({ href, icon: Icon, label }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex size-11 items-center justify-center text-muted-foreground/60 hover:text-foreground transition-colors duration-300"
                >
                  <Icon className="size-5" stroke={1.5} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Right — form */}
        <div data-reveal className="flex flex-col justify-center">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
