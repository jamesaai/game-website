/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        zentry: ["zentry", "sans-serif"],
        general: ["general", "sans-serif"],
        "circular-web": ["circular-web", "sans-serif"],
        "robert-medium": ["robert-medium", "sans-serif"],
        "robert-regular": ["robert-regular", "sans-serif"],
      },
      colors: {
        blue: {
          50: "#dfdff0",
          75: "#dfdff2",
          100: "#f0f2fa",
          200: "#101010",
          300: "#4fb7dd",
        },
        red: {
          300: "#dc2626", // Fire alarm red
          400: "#b91c1c",
          500: "#991b1b",
          600: "#7f1d1d",
        },
        yellow: {
          100: "#8e983f",
          300: "#fbbf24", // Warning yellow
        },
        // Keep violet for compatibility, but red is primary theme
        violet: {
          50: "#f5f3ff",
          300: "#dc2626", // Changed to red for fire alarm theme
        },
      },
    },
  },
  plugins: [],
};