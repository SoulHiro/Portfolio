import type { Metadata } from "next";
import {
  Outfit,
  Instrument_Serif,
  JetBrains_Mono,
  Noto_Sans_KR,
} from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400"],
});

const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Victor M. Santos",
  description: "Software developer and product designer.",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://www.victormts.dev/#person",
      name: "Victor M. Santos",
      url: "https://www.victormts.dev",
      jobTitle: "Software Developer & Product Designer",
      description:
        "Full-stack developer and product designer based in Brazil. Building in public and documenting the process.",
      knowsAbout: [
        "Next.js",
        "TypeScript",
        "React",
        "Go",
        "Python",
        "PostgreSQL",
        "Product Design",
        "SaaS",
      ],
      sameAs: [
        "https://github.com/SoulHiro",
        "https://www.linkedin.com/in/victormts",
        "https://twitter.com/victormts_dev",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://www.victormts.dev/#website",
      url: "https://www.victormts.dev",
      name: "Victor M. Santos",
      description: "Portfolio, devlog, and lab of Victor M. Santos — software developer and product designer.",
      author: { "@id": "https://www.victormts.dev/#person" },
      inLanguage: ["pt-BR", "en"],
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      suppressHydrationWarning
      className={`${outfit.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} ${notoSansKR.variable} antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
