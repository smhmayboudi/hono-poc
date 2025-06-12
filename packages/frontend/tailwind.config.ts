import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  darkMode: "media",
  plugins: [],
  theme: {
    extend: {
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "slide-from-right": {
          from: { transform: "translateX(500px)" },
          to: { transform: "translateX(0)" },
        },
      },
      animation: {
        "custom-fade-in": "fade-in 0.5s ease-out forwards",
        "custom-float": "float 3s ease-in-out infinite",
        "custom-slide-from-right": "slide-from-right 0.5s ease-out forwards",
      },
    },
  },
} satisfies Config;
