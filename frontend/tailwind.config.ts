import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0D0D0F",
        accent: "#E50914"
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Raleway", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
