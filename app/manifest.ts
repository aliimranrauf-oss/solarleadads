import type { MetadataRoute } from "next";

/**
 * A manifest isn't a direct ranking factor, but Lighthouse checks for one and
 * it's what lets a visitor add the site to a phone home screen. Next.js picks
 * this file up automatically and links it from every page — no wiring needed.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SolarLeadAds — Solar Lead Generation",
    short_name: "SolarLeadAds",
    description:
      "Exclusive solar leads from Meta ad campaigns for installers, sellers, technicians and cleaning teams in the USA, UK and Australia.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0b1f3a",
    icons: [
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
