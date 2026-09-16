import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SolarChatBot from "@/components/SolarChatBot";

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
    // Keyword-first title. "Solar Lead Generation" is the phrase buyers
    // actually search; the brand name sits after it so it still reads as
    // a real company and not as keyword stuffing.
    default: "Solar Lead Generation Agency | Exclusive Solar Leads — SolarLeadAds",
    template: "%s | SolarLeadAds",
  },
  description:
    "Exclusive solar leads from Meta ad campaigns built for installers, panel & battery sellers, technicians, and solar cleaning teams in the USA, UK, and Australia. No shared leads, no long-term contracts.",
  applicationName: "SolarLeadAds",
  authors: [{ name: "SolarLeadAds", url: "https://solarleadads.com" }],
  creator: "SolarLeadAds",
  publisher: "SolarLeadAds",
  category: "Marketing",
  // Default canonical. Every page overrides this with its own path, but a
  // default stops any stray route from being indexed under a query-string
  // or tracking-parameter URL.
  alternates: {
    canonical: "/",
  },
  // Explicitly tell Google to index and follow, and allow full-size image
  // and video previews — the defaults are more restrictive than most people
  // realise and can suppress image thumbnails in results.
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // Stops iOS Safari auto-linking numbers in body copy as phone links,
  // which mangles things like "25–40 leads/month".
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
  // TODO (owner action): paste your Google Search Console verification token
  // here, then remove the comment. Leave the object out entirely if unused.
  // verification: { google: "your-search-console-token" },
  openGraph: {
    title: "Solar Lead Generation Agency — Exclusive Leads for Solar Businesses",
    description:
      "We run high-performing Meta ad campaigns for solar installers, sellers, and technicians in the USA, UK, and Australia — exclusive leads, no long-term contracts.",
    url: "https://solarleadads.com",
    siteName: "SolarLeadAds",
    locale: "en_US",
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
    title: "Solar Lead Generation Agency — Exclusive Leads for Solar Businesses",
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
      <head>
        {/* next/font self-hosts the font files, but the stylesheet fetch still
            benefits from an early connection on slow mobile networks — this is
            a direct Core Web Vitals (LCP) win. */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
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
        <SolarChatBot />
        {/* Only loads if NEXT_PUBLIC_GA_MEASUREMENT_ID is set in Vercel env
            vars — safe to deploy even before you have a GA4 property. */}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
      </body>
    </html>
  );
}
