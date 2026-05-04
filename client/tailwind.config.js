/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sage: {
          50: "#f3f7f4",
          100: "#e3ece4",
          200: "#c6d8c9",
          300: "#9fbca5",
          400: "#74997d",
          500: "#547d5f",
          600: "#3f624a",
          700: "#324f3c",
          800: "#2a4032",
          900: "#23362a",
          950: "#111d16",
        },
        ink: {
          50: "#f7f7f6",
          100: "#eeeeec",
          200: "#d8d8d4",
          300: "#b3b3ad",
          400: "#878781",
          500: "#5e5e58",
          600: "#464642",
          700: "#363633",
          800: "#22221f",
          900: "#141413",
        },
        cream: "#f8f7f2",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        display: [
          "Fraunces",
          "Inter",
          "ui-serif",
          "Georgia",
          "Cambria",
          "serif",
        ],
        mono: [
          "JetBrains Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
      },
      letterSpacing: {
        tightish: "-0.015em",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(17, 29, 22, 0.04), 0 8px 24px rgba(17, 29, 22, 0.06)",
        ring: "0 0 0 1px rgba(63, 98, 74, 0.15)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
      },
    },
  },
  plugins: [],
};
