/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      // Bubble-themed color palette with soft gradients
      colors: {
        bubble: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
        focus: {
          50: "#faf5ff",
          100: "#f3e8ff",
          200: "#e9d5ff",
          300: "#d8b4fe",
          400: "#c084fc",
          500: "#a855f7",
          600: "#9333ea",
          700: "#7e22ce",
          800: "#6b21a8",
          900: "#581c87",
        },
      },
      // Soft rounded corners for bubble aesthetic
      borderRadius: {
        bubble: "2rem",
        "bubble-lg": "3rem",
      },
      // Floating animation for bubble effect
      animation: {
        float: "float 3s ease-in-out infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "float-1": {
          "0%": {
            transform: "translate(0, 0)",
          },
          "25%": {
            transform: "translate(50px, -50px)",
          },
          "50%": {
            transform: "translate(-30px, 30px)",
          },
          "75%": {
            transform: "translate(30px, 20px)",
          },
          "100%": {
            transform: "translate(0, 0)",
          },
        },
        "float-2": {
          "0%": {
            transform: "translate(0, 0)",
          },
          "25%": {
            transform: "translate(-40px, 40px)",
          },
          "50%": {
            transform: "translate(40px, -40px)",
          },
          "75%": {
            transform: "translate(-20px, -30px)",
          },
          "100%": {
            transform: "translate(0, 0)",
          },
        },
      },
      // Soft shadows for depth
      boxShadow: {
        bubble: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
        "bubble-lg": "0 12px 48px 0 rgba(31, 38, 135, 0.2)",
      },
    },
  },
  plugins: [],
};
