import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#080a10",
        surface: "#0f111a",
        "surface-hover": "#181b26",
        primary: {
          DEFAULT: "#38bdf8",
          foreground: "#080a10",
        },
        accent: {
          DEFAULT: "#fb923c",
          foreground: "#080a10",
        },
        success: "#34d399",
        danger: "#f87171",
        muted: {
          DEFAULT: "#1a1d2a",
          foreground: "#94a3b8",
        },
        border: "#1e2130",
        ring: "#38bdf8",
        input: "#1e2130",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
