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
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      maxWidth: {
        content: "72rem",
      },
    },
  },
  plugins: [],
};

export default config;
