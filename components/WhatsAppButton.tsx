import { whatsappLink } from "@/lib/site-config";

export default function WhatsAppButton() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Message SolarLeadAds on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-leaf-500 text-white shadow-soft transition-transform hover:scale-105"
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.48 1.34 5L2 22l5.2-1.36a9.94 9.94 0 0 0 4.84 1.23h.01c5.5 0 9.96-4.46 9.96-9.96C22 6.46 17.55 2 12.04 2zm5.83 14.24c-.25.7-1.45 1.33-2 1.42-.53.08-1.13.12-3.14-.66-2.64-1.03-4.36-3.7-4.5-3.87-.13-.18-1.08-1.44-1.08-2.75 0-1.3.68-1.94.93-2.2.24-.26.53-.32.7-.32h.51c.16 0 .38-.03.58.44.25.6.83 2.06.9 2.2.07.14.12.31.02.5-.1.19-.15.31-.3.48-.15.16-.31.36-.44.49-.15.15-.3.31-.13.6.16.3.72 1.19 1.55 1.93 1.06.94 1.96 1.24 2.26 1.38.3.14.47.12.65-.07.18-.19.75-.87.95-1.17.2-.3.4-.25.66-.15.27.1 1.71.81 2 .96.3.14.49.22.56.34.08.13.08.72-.17 1.42z" />
      </svg>
    </a>
  );
}
