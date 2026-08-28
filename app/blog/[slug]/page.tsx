// app/blog/[slug]/page.tsx
import type { Metadata } from "next";
import { supabase } from "@/lib/supabaseClient";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export const revalidate = 0;

// Pre-render every live post at build time, and let Next fall back to
// on-demand rendering (via revalidate = 0 above) for anything published
// after the last deploy — so a brand-new post is live immediately.
export async function generateStaticParams() {
  const { data: posts } = await supabase.from("blogs").select("slug").eq("is_live", true);
  return posts?.map((post) => ({ slug: post.slug })) ?? [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { data: post } = await supabase
    .from("blogs")
    .select("title, excerpt, image_url, published_at, updated_at")
    .eq("slug", slug)
    .eq("is_live", true)
    .single();

  if (!post) return { title: "Post Not Found" };

  return {
    title: post.title,
    description: post.excerpt || "",
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt || "",
      url: `https://solarleadads.com/blog/${slug}`,
      type: "article",
      siteName: "SolarLeadAds",
      publishedTime: post.published_at,
      modifiedTime: post.updated_at,
      images: post.image_url ? [{ url: post.image_url, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || "",
      images: post.image_url ? [post.image_url] : undefined,
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
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: post } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .eq("is_live", true)
    .single();

  if (!post) notFound();

  // Editors drop {{IMAGE_2}} / {{IMAGE_3}} anywhere inside `content` in
  // Supabase and fill image_url_2 / image_url_3 — no code changes needed
  // to add extra in-post images.
  let renderedContent = post.content || "<p>No content available.</p>";

  const buildFigure = (url: string, alt: string) => `
    <figure>
      <img class="post-img" src="${url}" alt="${alt}" />
    </figure>
  `;

  renderedContent = post.image_url_2
    ? renderedContent.replaceAll("{{IMAGE_2}}", buildFigure(post.image_url_2, post.title))
    : renderedContent.replaceAll("{{IMAGE_2}}", "");

  renderedContent = post.image_url_3
    ? renderedContent.replaceAll("{{IMAGE_3}}", buildFigure(post.image_url_3, post.title))
    : renderedContent.replaceAll("{{IMAGE_3}}", "");

  // BlogPosting structured data — this is what lets Google show rich
  // article results (author, dates, image) and target this page for
  // ranking on the post's specific keywords.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://solarleadads.com/blog/${post.slug}`,
    },
    headline: post.title,
    description: post.excerpt || "",
    image: post.image_url ? [post.image_url] : undefined,
    datePublished: post.published_at,
    dateModified: post.updated_at || post.published_at,
    author: {
      "@type": "Organization",
      name: post.author_name || "SolarLeadAds Team",
    },
    publisher: {
      "@type": "Organization",
      name: "SolarLeadAds",
      logo: {
        "@type": "ImageObject",
        url: "https://solarleadads.com/logo.png",
      },
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://solarleadads.com" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://solarleadads.com/blog" },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `https://solarleadads.com/blog/${post.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <main className="section-pad pt-10">
        <div className="container-max mx-auto max-w-3xl">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm text-ink-300">
            <Link href="/blog" className="hover:text-trust-500">
              Blog
            </Link>
            <span className="mx-2">/</span>
            <span className="text-ink-400">{post.title}</span>
          </nav>

          {/* Title & meta */}
          <div className="mb-8">
            <span className="rounded bg-trust-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-trust-600">
              {post.category || "Lead Generation"}
            </span>
            <h1 className="mt-4 text-3xl font-semibold leading-[1.15] text-navy sm:text-4xl">
              {post.title}
            </h1>
            <p className="mt-4 text-sm text-ink-300">
              By {post.author_name || "SolarLeadAds Team"} ·{" "}
              {new Date(post.published_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Featured image */}
          {post.image_url && (
            <div className="relative mb-10 h-64 w-full overflow-hidden rounded-xl2 bg-surface-alt shadow-card md:h-96">
              <Image
                src={post.image_url}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Content */}
          <div className="rounded-xl2 border border-navy/5 bg-white p-8 shadow-card md:p-12">
            <div
              className="prose prose-lg max-w-none text-ink
              prose-headings:font-display prose-headings:text-navy
              prose-a:text-trust-500 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-navy
              [&_.cta-btn]:mr-3 [&_.cta-btn]:my-2 [&_.cta-btn]:inline-block [&_.cta-btn]:rounded-full [&_.cta-btn]:bg-trust-500 [&_.cta-btn]:px-6 [&_.cta-btn]:py-3 [&_.cta-btn]:font-bold [&_.cta-btn]:text-white [&_.cta-btn]:no-underline [&_.cta-btn]:shadow-soft [&_.cta-btn]:transition-colors hover:[&_.cta-btn]:bg-trust-600
              [&_.tldr-box]:my-8 [&_.tldr-box]:rounded-xl2 [&_.tldr-box]:border [&_.tldr-box]:border-trust-100 [&_.tldr-box]:bg-trust-50 [&_.tldr-box]:p-6 [&_.tldr-box_p]:m-0 [&_.tldr-box_ul]:m-0
              [&_.callout-box]:my-8 [&_.callout-box]:rounded-r-xl [&_.callout-box]:border-l-4 [&_.callout-box]:border-leaf-500 [&_.callout-box]:bg-surface-alt [&_.callout-box]:p-6 [&_.callout-box]:text-lg [&_.callout-box]:italic [&_.callout-box]:text-ink [&_.callout-box_p]:m-0
              [&_.post-img]:my-8 [&_.post-img]:h-auto [&_.post-img]:w-full [&_.post-img]:rounded-xl2 [&_.post-img]:shadow-card
              [&_figcaption]:mb-8 [&_figcaption]:mt-[-1.5rem] [&_figcaption]:text-center [&_figcaption]:text-sm [&_figcaption]:not-italic [&_figcaption]:text-ink-300
              [&_table]:my-8 [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-navy/10 [&_th]:bg-surface-alt [&_th]:p-3 [&_th]:text-left [&_th]:font-bold [&_th]:text-navy [&_td]:border [&_td]:border-navy/10 [&_td]:p-3"
              dangerouslySetInnerHTML={{ __html: renderedContent }}
            />
          </div>

          {/* CTA footer — every post nudges toward the core conversion */}
          <div className="mt-10 rounded-xl2 bg-navy p-8 text-center text-white">
            <h2 className="font-display text-2xl font-semibold">
              Want leads like this for your solar business?
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-white/70">
              We run exclusive Meta ad campaigns for solar installers, sellers, and
              technicians — no long-term contracts.
            </p>
            <Link href="/contact" className="btn-primary mt-6 inline-flex">
              Get a Free Lead Audit
            </Link>
          </div>

          <div className="mt-10">
            <Link href="/blog" className="text-sm font-medium text-trust-500 hover:text-trust-600">
              ← Back to Blog
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
