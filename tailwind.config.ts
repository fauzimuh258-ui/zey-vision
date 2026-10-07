import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--zv-color-background)",
        surface: "var(--zv-color-surface)",
        foreground: "var(--zv-color-foreground)",
        "foreground-muted": "var(--zv-color-foreground-muted)",
        border: "var(--zv-color-border)",
        accent: "var(--zv-color-accent)",
        neutral: {
          0: "var(--zv-neutral-0)",
          50: "var(--zv-neutral-50)",
          100: "var(--zv-neutral-100)",
          200: "var(--zv-neutral-200)",
          300: "var(--zv-neutral-300)",
          400: "var(--zv-neutral-400)",
          500: "var(--zv-neutral-500)",
          600: "var(--zv-neutral-600)",
          700: "var(--zv-neutral-700)",
          800: "var(--zv-neutral-800)",
          900: "var(--zv-neutral-900)",
        },
      },
    },
  },
  plugins: [],
};

export default config;
