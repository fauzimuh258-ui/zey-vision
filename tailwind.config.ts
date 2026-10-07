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
        success: {
          bg: "var(--zv-color-success-bg)",
          fg: "var(--zv-color-success-fg)",
          border: "var(--zv-color-success-border)",
        },
        warning: {
          bg: "var(--zv-color-warning-bg)",
          fg: "var(--zv-color-warning-fg)",
          border: "var(--zv-color-warning-border)",
        },
        error: {
          bg: "var(--zv-color-error-bg)",
          fg: "var(--zv-color-error-fg)",
          border: "var(--zv-color-error-border)",
        },
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
      fontFamily: {
        serif: "var(--zv-font-serif)",
        sans: "var(--zv-font-sans)",
        mono: "var(--zv-font-mono)",
      },
      fontSize: {
        xs: "var(--zv-text-xs)",
        sm: "var(--zv-text-sm)",
        base: "var(--zv-text-base)",
        lg: "var(--zv-text-lg)",
        xl: "var(--zv-text-xl)",
        "2xl": "var(--zv-text-2xl)",
        "3xl": "var(--zv-text-3xl)",
        "4xl": "var(--zv-text-4xl)",
        "5xl": "var(--zv-text-5xl)",
      },
      borderRadius: {
        sm: "var(--zv-radius-sm)",
      },
      boxShadow: {
        sm: "var(--zv-shadow-sm)",
        md: "var(--zv-shadow-md)",
      },
    },
  },
  plugins: [],
};

export default config;
