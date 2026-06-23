import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { NuqsAdapter } from "nuqs/adapters/next/app";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

const BASE_URL = "https://www.victormts.dev";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const ogLocale = locale === "pt-br" ? "pt_BR" : "en_US";

  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: t("title"),
      template: "%s | Victor M. Santos",
    },
    description: t("description"),
    authors: [{ name: "Victor M. Santos", url: BASE_URL }],
    creator: "Victor M. Santos",
    openGraph: {
      type: "website",
      url: `${BASE_URL}/${locale}`,
      locale: ogLocale,
      siteName: "Victor M. Santos",
      title: t("title"),
      description: t("description"),
      images: [{ url: `${BASE_URL}/og.webp`, width: 1200, height: 630, alt: t("title") }],
    },
    twitter: {
      card: "summary_large_image",
      creator: "@victormts_dev",
      title: t("title"),
      description: t("description"),
      images: [`${BASE_URL}/og.webp`],
    },
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages: {
        en: `${BASE_URL}/en`,
        "pt-BR": `${BASE_URL}/pt-br`,
      },
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <NextIntlClientProvider>
      <NuqsAdapter>
        <Navbar />
        <main className="flex-1 w-full max-w-7xl mx-auto">{children}</main>
        <Footer />
      </NuqsAdapter>
    </NextIntlClientProvider>
  );
}
