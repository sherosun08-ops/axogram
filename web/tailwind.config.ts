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
        navy: {
          DEFAULT: "#0B1F3A",
          50: "#E8EEF6",
          100: "#C5D3E6",
          200: "#8BA6C7",
          700: "#132A4A",
          800: "#0E2340",
          900: "#0B1F3A",
        },
        accent: {
          DEFAULT: "#229ED9",
          dark: "#1B8BC4",
          soft: "#E6F5FC",
        },
        success: {
          DEFAULT: "#16A34A",
          soft: "#E8F8EE",
        },
        warning: {
          DEFAULT: "#EA580C",
          soft: "#FFF1E8",
        },
        danger: {
          DEFAULT: "#DC2626",
          soft: "#FDECEC",
        },
        gold: {
          DEFAULT: "#D4A017",
          soft: "#FFF6DC",
        },
        ink: {
          DEFAULT: "#1A2332",
          muted: "#6B7280",
        },
        canvas: "#F3F5F8",
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 23, 42, 0.04), 0 8px 24px rgba(15, 23, 42, 0.04)",
        soft: "0 1px 3px rgba(15, 23, 42, 0.06)",
      },
      borderRadius: {
        xl2: "1.1rem",
      },
    },
  },
  plugins: [],
};
export default config;
