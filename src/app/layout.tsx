import type { Metadata } from "next";
import { Archivo_Black, DM_Sans, Libre_Baskerville } from "next/font/google";
import { SiteNav } from "@/components/shell/SiteNav";
import { MobileBanner } from "@/components/shell/MobileBanner";
import { Providers } from "@/components/shell/Providers";
import { CursorDot } from "@/components/graphics/CursorDot";
import "./globals.css";

const libreBaskerville = Libre_Baskerville({
  weight: ["400", "700"],
  variable: "--font-brand-face",
  subsets: ["latin"],
});

const archivoBlack = Archivo_Black({
  weight: "400",
  variable: "--font-display-face",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Neural Network Museum",
    template: "%s · Wonder",
  },
  description:
    "10 playful mini-games that teach how AI works — no math, no jargon, just play.",
  openGraph: {
    title: "Wonder — Neural Network Museum",
    description:
      "Touch, train, and discover neural networks — from a single neuron to transformers.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${libreBaskerville.variable} ${archivoBlack.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Providers>
          <CursorDot />
          <SiteNav />
          <MobileBanner />
          <main className="relative z-10 flex-1">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
