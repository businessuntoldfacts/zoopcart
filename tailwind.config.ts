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
        zyp: {
          bg: "#0B0E14",
          surface: "#161B24",
          accent: "#7C3AED", // Match the logo's purple
          accentSecondary: "#4338CA", // Match the logo's indigo
          success: "#2ECC71",
          warning: "#F39C4E",
          danger: "#EF5A5A",
          textPrimary: "#F5F6F8",
          textMuted: "#9AA3B2",
          lightSurface: "#FBFAF7",
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        display: ['var(--font-fraunces)', 'serif'],
        mono: ['var(--font-geist-mono)', 'monospace'], // Default mono if needed
      }
    },
  },
  plugins: [],
};
export default config;
