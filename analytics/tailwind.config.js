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
        sans: ['"IBM Plex Sans"', "ui-sans-serif", "system-ui", "sans-serif"],
        display: ['"Fraunces"', "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
