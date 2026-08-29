// app/blog/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Solar Marketing Blog — Lead Generation Tips for Solar Businesses",
  description:
    "Guides on Meta ads, lead generation, and growth for solar installers, sellers, and technicians in the USA, UK, and Australia.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Solar Marketing Blog — Lead Generation Tips for Solar Businesses",
    description:
      "Guides on Meta ads, lead generation, and growth for solar installers, sellers, and technicians in the USA, UK, and Australia.",
    url: "https://solarleadads.com/blog",
    type: "website",
    siteName: "SolarLeadAds",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SolarLeadAds Blog — Solar Marketing Tips",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Solar Marketing Blog — Lead Generation Tips for Solar Businesses",
    description:
      "Guides on Meta ads, lead generation, and growth for solar installers, sellers, and technicians.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

// Always fetch fresh so a new post (is_live = true in Supabase) shows up
// immediately without a redeploy.
export const revalidate = 0;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "SolarLeadAds Blog",
  description:
    "Meta ads, lead generation, and growth guides for solar installers, sellers, and technicians.",
  url: "https://solarleadads.com/blog",
  publisher: {
    "@type": "Organization",
    name: "SolarLeadAds",
    url: "https://solarleadads.com",
    logo: {
      "@type": "ImageObject",
      url: "https://solarleadads.com/logo.png",
    },
  },
};

export default async function BlogPage() {
  const { data: posts, error } = await supabase
    .from("blogs")
    .select("id, slug, title, excerpt, category, published_at, image_url, author_name")
    .eq("is_live", true)
    .eq("lang", "en")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Supabase blog fetch error:", error.message);
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="section-pad pb-8 pt-10 text-center sm:pt-14">
        <div className="container-max mx-auto max-w-2xl">
          <Reveal>
            <p className="eyebrow">Resources</p>
            <h1 className="mt-3 text-3xl font-semibold leading-[1.15] sm:text-4xl">
              The Solar Lead Gen Blog
            </h1>
            <p className="mt-4 text-base text-ink-400">
              Straight-talk guides on Meta ads, lead quality, and growing a solar
              business — for installers, sellers, and technicians in the USA, UK,
              and Australia.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section-pad pt-0">
        <div className="container-max mx-auto">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts?.map((post, index) => (
              <Reveal key={post.id} delay={(index % 3) * 80}>
                <article className="card-lift flex h-full flex-col overflow-hidden rounded-xl2 border border-navy/5 bg-white shadow-card">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="relative block h-48 flex-shrink-0 overflow-hidden bg-surface-alt"
                  >
                    {post.image_url ? (
                      <Image
                        src={post.image_url}
                        alt={post.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 hover:scale-105"
                        priority={index < 3}
                        loading={index < 3 ? "eager" : "lazy"}
                      />
                    ) : (
                      <div className="h-full w-full bg-surface-alt" />
                    )}
                  </Link>

                  <div className="flex flex-grow flex-col p-5">
                    <div className="mb-3 flex flex-wrap items-center gap-3">
                      <span className="rounded bg-trust-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-trust-600">
                        {post.category || "Lead Generation"}
                      </span>
                      <span className="text-[11px] text-ink-300">
                        {new Date(post.published_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    <h2 className="mb-2 line-clamp-2 font-display text-lg font-semibold leading-snug text-navy">
                      <Link href={`/blog/${post.slug}`} className="hover:text-trust-500">
                        {post.title}
                      </Link>
                    </h2>

                    <p className="mb-5 line-clamp-2 flex-grow text-sm leading-relaxed text-ink-400">
                      {post.excerpt}
                    </p>

                    <Link
                      href={`/blog/${post.slug}`}
                      className="mt-auto inline-flex items-center gap-1 text-sm font-bold text-trust-500 transition-all hover:gap-2"
                    >
                      Read article →
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          {(!posts || posts.length === 0) && (
            <p className="mt-16 text-center text-ink-300">
              No posts yet. Check back soon.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
