import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    spacing: {
      "0": "0px",
      "1": "1px",
      "2": "2px",
      "2.5": "2.5px",
      "3": "3px",
      "4": "4px",
      "5": "5px",
      "6": "6px",
      "7": "7px",
      "8": "8px",
      "10": "10px",
      "12": "12px",
      "15": "15px",
      "20": "20px",
      "25": "25px",
      "30": "30px",
      "35": "35px",
      "40": "40px",
      "45": "45px",
    },
    fontSize: {
      "10": "10px",
      "15": "15px",
      "30": "30px",
    },
    lineHeight: {
      "10": "10px",
      "15": "15px",
      "20": "20px",
    },
    extend: {
      screens: {
        xs: "450px",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
export default config
