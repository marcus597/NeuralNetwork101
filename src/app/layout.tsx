import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteNav } from "@/components/shell/SiteNav";
import { MobileBanner } from "@/components/shell/MobileBanner";
import { Providers } from "@/components/shell/Providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Wonder — Learn ML by Touching It",
    template: "%s · Wonder",
  },
  description:
    "An interactive machine learning lab for Reel. Drag boundaries, tune neurons, chase error — and understand why.",
  openGraph: {
    title: "Wonder — Learn ML by Touching It",
    description:
      "Interactive ML intuition. No lectures upfront — experiment first.",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Providers>
          <SiteNav />
          <MobileBanner />
          <main className="flex-1">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
