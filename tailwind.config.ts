import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        zyp: {
          primary: "#2563EB", // Vibrant Blue from Figma
          primaryHover: "#1D4ED8",
          sidebar: "#0F172A", // Dark Navy
          bg: "#F8FAFC", // Light Gray background
          surface: "#FFFFFF", // White cards
          textPrimary: "#1E293B",
          textMuted: "#64748B",
          border: "#E2E8F0",
          success: "#10B981", // Green
          warning: "#F59E0B", // Orange
          danger: "#EF4444", // Red
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        display: ['var(--font-inter)'], // Figma uses a clean sans-serif (Inter) everywhere
      }
    },
  },
  plugins: [],
};
export default config;
