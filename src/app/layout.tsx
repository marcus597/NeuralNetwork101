import type { Metadata } from "next";
import { Bangers, Comic_Neue, Geist_Mono } from "next/font/google";
import { SiteNav } from "@/components/shell/SiteNav";
import { MobileBanner } from "@/components/shell/MobileBanner";
import { Providers } from "@/components/shell/Providers";
import { ComicBackdrop } from "@/components/graphics/ComicBackdrop";
import "./globals.css";

const bangers = Bangers({
  weight: "400",
  variable: "--font-bangers",
  subsets: ["latin"],
});

const comicNeue = Comic_Neue({
  weight: ["400", "700"],
  variable: "--font-comic",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
      className={`${bangers.variable} ${comicNeue.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Providers>
          <ComicBackdrop />
          <SiteNav />
          <MobileBanner />
          <main className="relative z-10 flex-1">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
