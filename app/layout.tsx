import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
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
    "SolarLeadAds runs Meta ad campaigns that bring qualified leads to solar installers, sellers, technicians, and panel & battery providers across the USA.",
  openGraph: {
    title: "SolarLeadAds — Meta Ads Lead Generation for Solar Businesses",
    description:
      "We run high-performing Meta ad campaigns for solar installers, sellers, and technicians across the USA — exclusive leads, no long-term contracts.",
    url: "https://solarleadads.com",
    siteName: "SolarLeadAds",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SolarLeadAds — Meta Ads Lead Generation for Solar Businesses",
    description:
      "Qualified Meta ad leads for solar installers, sellers, and technicians across the USA.",
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
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
