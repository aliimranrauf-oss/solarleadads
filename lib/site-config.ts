export type NavChild = { label: string; href: string; description?: string };
export type NavItem = { label: string; href: string; children?: NavChild[] };

export const siteConfig = {
  name: "SolarLeadAds",
  domain: "solarleadads.com",
  email: "hello@solarleadads.com",
  // WhatsApp number in international format, no +, no spaces, no leading zeros.
  whatsappNumber: "447462230676",
  // Human-readable version of the same number, for showing in chat text/UI.
  whatsappDisplayNumber: "+44 7462 230676",
  whatsappDefaultMessage:
    "Hi SolarLeadAds, I'd like to talk about lead generation for my solar business.",
  // "Services" groups our two service lines under one dropdown instead of
  // competing for separate top-level nav slots. `href` still points to the
  // overview page, so clicking the label itself (not just a child) works too.
  nav: [
    { label: "Home", href: "/" },
    {
      label: "Services",
      href: "/services",
      children: [
        {
          label: "Meta Ads Lead Gen",
          href: "/services",
          description: "Exclusive solar leads via Facebook & Instagram ads",
        },
        {
          label: "AI Chatbots",
          href: "/ai-chatbot",
          description: "Custom AI chat assistants trained on your business",
        },
      ],
    },
    { label: "Results", href: "/results" },
    { label: "Process", href: "/process" },
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
  ] satisfies NavItem[],
  primaryCta: { label: "Get a Free Lead Audit", href: "/contact" },
  secondaryCta: { label: "Message us on WhatsApp", href: "#whatsapp" },
};

export function whatsappLink(message?: string) {
  const text = encodeURIComponent(message ?? siteConfig.whatsappDefaultMessage);
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${text}`;
}
