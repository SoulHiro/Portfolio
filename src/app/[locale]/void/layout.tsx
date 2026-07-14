import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "void",
  robots: { index: false, follow: false },
};

export default function VoidLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
