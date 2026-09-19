import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Industrial steel palette
        steel: {
          50: "#f4f6f8",
          100: "#e3e8ee",
          200: "#c8d3df",
          300: "#a0b2c6",
          400: "#7189a7",
          500: "#516b8c",
          600: "#3f5573",
          700: "#34465e",
          800: "#2d3c50",
          900: "#1b2533",
          950: "#11161f",
        },
        accent: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "1.5rem",
          lg: "2rem",
        },
        screens: {
          "2xl": "1280px",
        },
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        kenburns: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.12)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        kenburns: "kenburns 7s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
