import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Earthy / geological palette
        rock: {
          50: "#f6f5f3",
          100: "#e8e5df",
          200: "#d1cabd",
          300: "#b3a892",
          400: "#968870",
          500: "#7c6f59",
          600: "#635847",
          700: "#4f463a",
          800: "#3a3329",
          900: "#26211a",
          950: "#15120e",
        },
        ore: {
          // gold / mineral accent
          400: "#e8b94a",
          500: "#d99e2b",
          600: "#b67f1c",
        },
        terrain: {
          // teal-green for maps / GIS accent
          400: "#3fb6a0",
          500: "#2a9685",
          600: "#1f7568",
        },
        cyber: {
          // cyan / electric secondary accent for the futuristic look
          100: "#cffafe",
          200: "#a5f3fc",
          300: "#67e8f9",
          400: "#22d3ee",
          500: "#06b6d4",
          600: "#0891b2",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      maxWidth: {
        content: "72rem",
      },
      boxShadow: {
        // soft neon glows
        "glow-ore": "0 0 24px -4px rgba(217,158,43,0.45)",
        "glow-cyber": "0 0 24px -4px rgba(34,211,238,0.45)",
        "glow-soft": "0 0 40px -8px rgba(34,211,238,0.25)",
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(to right, rgba(120,140,160,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(120,140,160,0.06) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "44px 44px",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.35" },
          "50%": { opacity: "0.6" },
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
        // Aurora: slowly shift a wide gradient back and forth
        aurora: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        // Aurora bands gently drift, scale and fade like the northern lights
        auroraDrift: {
          "0%, 100%": {
            transform: "translateX(-8%) translateY(0) scale(1)",
            opacity: "0.55",
          },
          "33%": {
            transform: "translateX(6%) translateY(-6%) scale(1.15)",
            opacity: "0.8",
          },
          "66%": {
            transform: "translateX(-4%) translateY(4%) scale(1.05)",
            opacity: "0.65",
          },
        },
        // Stars softly pulse in brightness and size
        twinkle: {
          "0%, 100%": { opacity: "0.25", transform: "scale(0.85)" },
          "50%": { opacity: "1", transform: "scale(1.1)" },
        },
      },
      animation: {
        float: "float 8s ease-in-out infinite",
        "pulse-glow": "pulseGlow 6s ease-in-out infinite",
        shimmer: "shimmer 6s linear infinite",
        aurora: "aurora 12s ease-in-out infinite",
        "aurora-drift": "auroraDrift 16s ease-in-out infinite",
        "aurora-drift-slow": "auroraDrift 22s ease-in-out infinite reverse",
        twinkle: "twinkle 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
