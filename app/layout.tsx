import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://solarleadads.com"),
  title: {
    default: "SolarLeadAds — Meta Ads Lead Generation for Solar Businesses",
    template: "%s | SolarLeadAds",
  },
  description:
    "SolarLeadAds runs Meta ad campaigns that bring qualified leads to solar installers, sellers, technicians, and panel & battery providers in the USA, UK, and Australia.",
  openGraph: {
    title: "SolarLeadAds — Meta Ads Lead Generation for Solar Businesses",
    description:
      "We run high-performing Meta ad campaigns for solar installers, sellers, and technicians in the USA, UK, and Australia — exclusive leads, no long-term contracts.",
    url: "https://solarleadads.com",
    siteName: "SolarLeadAds",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SolarLeadAds — Meta Ads Lead Generation for Solar Businesses",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SolarLeadAds — Meta Ads Lead Generation for Solar Businesses",
    description:
      "Qualified Meta ad leads for solar installers, sellers, and technicians in the USA, UK, and Australia.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        {/* Fallback for the rare no-JS visitor: the scroll-reveal in
            components/Reveal.tsx needs JS to flip elements visible, so
            force them visible here if JS never runs. */}
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
        {/* Only loads if NEXT_PUBLIC_GA_MEASUREMENT_ID is set in Vercel env
            vars — safe to deploy even before you have a GA4 property. */}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
      </body>
    </html>
  );
}
