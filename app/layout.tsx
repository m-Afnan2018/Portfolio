import type { Metadata } from "next";
import { Syne, Manrope } from "next/font/google";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Harsh Sharma | Graphic Designer & Visual Brand Specialist",
  description: "Creative Graphic Designer with expertise in brand identity, logo design, and visual communication. Based in Ghaziabad, India.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
          {/* Skip-to-main for keyboard users */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-5 focus:py-3 focus:rounded-xl focus:text-sm focus:font-semibold focus:text-white"
            style={{ background: "var(--accent)" } as React.CSSProperties}
          >
            Skip to main content
          </a>
          {children}
        </body>
    </html>
  );
}
