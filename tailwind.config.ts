import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0B2545",
          700: "#0F2E56",
          800: "#0B2545",
          900: "#081B36",
        },
        trust: {
          DEFAULT: "#1B6CA8",
          50: "#EAF3FA",
          100: "#D3E7F4",
          400: "#3585C2",
          500: "#1B6CA8",
          600: "#155889",
        },
        leaf: {
          DEFAULT: "#2E9E5B",
          50: "#E9F7EF",
          100: "#CFEFDD",
          500: "#2E9E5B",
          600: "#25824A",
        },
        amber: {
          DEFAULT: "#F2A93B",
          100: "#FDF0DA",
          500: "#F2A93B",
        },
        ink: {
          DEFAULT: "#1C2530",
          400: "#5B6572",
          300: "#8A93A0",
        },
        surface: {
          DEFAULT: "#F8FAFB",
          alt: "#EFF4F6",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        soft: "0 4px 24px -8px rgba(11, 37, 69, 0.12)",
        card: "0 2px 12px -2px rgba(11, 37, 69, 0.08)",
      },
      keyframes: {
        panelPulse: {
          "0%, 100%": { opacity: "0.35" },
          "50%": { opacity: "1" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        panelPulse: "panelPulse 3.2s ease-in-out infinite",
        floatSlow: "floatSlow 6s ease-in-out infinite",
        fadeInUp: "fadeInUp 0.6s ease-out both",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
