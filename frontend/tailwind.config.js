/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#6D28D9",
          secondary: "#DB2777",
          accent: "#B45309",
          background: "#F8FAFC",
          surface: "#FFFFFF",
          text: "#0F172A"
        }
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Inter", "sans-serif"],
        display: ["Playfair Display", "serif"]
      }
    },
  },
  plugins: [],
}
