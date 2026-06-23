import type { Metadata } from "next";
import { DM_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

const instrumentSerif = Instrument_Serif({
  display: "swap",
  variable: "--font-instrument-serif",
  weight: "400",
  subsets: ["latin"],
});

const dmSanss = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Victor M. Santos Portfolio",
    default: "Victor M. Santos Portfolio",
  },
  description:
    "Morning! My name is Victor, and I am a software engineer. Check out my portfolio!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        dmSanss.className,
        "font-sans",
        instrumentSerif.variable,
      )}
      suppressHydrationWarning
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <body className="min-h-full flex flex-col">{children}</body>
      </ThemeProvider>
    </html>
  );
}
