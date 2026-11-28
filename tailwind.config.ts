import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        emerald: {
          850: "#0c3b32",
          900: "#134e43",
          950: "#0b2f28",
        },
      },
      fontFamily: {
        arabic: ["'Scheherazade New'", "'Amiri'", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;

