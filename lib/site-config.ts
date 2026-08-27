export const siteConfig = {
  name: "SolarLeadAds",
  domain: "solarleadads.com",
  email: "hello@solarleadads.com",
  // WhatsApp number in international format, no +, no spaces, no leading zeros.
  whatsappNumber: "447462230676",
  whatsappDefaultMessage:
    "Hi SolarLeadAds, I'd like to talk about lead generation for my solar business.",
  nav: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Results", href: "/results" },
    { label: "Process", href: "/process" },
    { label: "About", href: "/about" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
  ],
  primaryCta: { label: "Get a Free Lead Audit", href: "/contact" },
  secondaryCta: { label: "Message us on WhatsApp", href: "#whatsapp" },
};

export function whatsappLink(message?: string) {
  const text = encodeURIComponent(message ?? siteConfig.whatsappDefaultMessage);
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${text}`;
}
