import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        dz: {
          950: "#050505",
          900: "#0b0b0c",
          800: "#151517",
          700: "#242428",
          300: "#b8b8bd",
          100: "#f2f2f4"
        }
      },
      boxShadow: {
        metal: "0 20px 70px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.08)"
      }
    }
  },
  plugins: []
};

export default config;
