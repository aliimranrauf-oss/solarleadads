/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Hides the `x-powered-by: Next.js` response header. No SEO effect, but it
  // stops advertising the stack to anyone scanning the site.
  poweredByHeader: false,

  // Removes the trailing-slash ambiguity so /services and /services/ can never
  // both be indexed as separate URLs.
  trailingSlash: false,

  compress: true,

  images: {
    // AVIF first, WebP as fallback. Both are far smaller than JPEG, and image
    // weight is the usual cause of a failing Largest Contentful Paint score —
    // which Google uses directly as a ranking signal.
    formats: ["image/avif", "image/webp"],
    // Cache optimised images for 30 days instead of the 60-second default,
    // so repeat visitors and the crawler aren't re-generating them.
    minimumCacheTTL: 2592000,
    remotePatterns: [
      // Previously `hostname: "**"`, which allowed this site's image optimiser
      // to be used as an open proxy for ANY remote image — a real abuse vector
      // that also inflates your Vercel image-transformation bill.
      //
      // Supabase Storage is the only remote source this project actually uses
      // (review avatars + blog cover images).
      //
      // TODO (owner action): if you host images anywhere other than Supabase,
      // add that hostname here too, or those images will stop rendering.
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Sends the origin (not the full path) to third parties — keeps
          // Google Analytics referral data intact without leaking URLs.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
      {
        // Static hero assets never change without a new filename, so they can
        // be cached permanently. Faster repeat loads = better Core Web Vitals.
        source: "/hero/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },

  async redirects() {
    return [
      // /au is a natural thing for people (and other sites) to link to.
      // A 301 here consolidates that link equity onto /australia instead of
      // returning a 404.
      { source: "/au", destination: "/australia", permanent: true },
      { source: "/us", destination: "/usa", permanent: true },
      { source: "/pricing", destination: "/services", permanent: true },
      { source: "/chatbot", destination: "/ai-chatbot", permanent: true },
    ];
  },
};

export default nextConfig;
