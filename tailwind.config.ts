import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
        heading: ["var(--font-heading)", "sans-serif"],
      },
      colors: {
        background: "var(--bg-primary)",
        secondary: "var(--bg-secondary)",
        card: "var(--bg-card)",
        primary: {
          DEFAULT: "var(--accent-pink)",
          hover: "var(--accent-pink-hover)",
        },
        accent: {
          blue: "var(--accent-blue)",
          "blue-hover": "var(--accent-blue-hover)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
        },
        success: "var(--success)",
        warning: "var(--warning)",
        error: "var(--error)",
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #ff006e 0%, #0096ff 100%)',
        'gradient-card': 'linear-gradient(145deg, #2a2a2a 0%, #1a1a1a 100%)',
      }
    },
  },
  plugins: [],
};
export default config;
