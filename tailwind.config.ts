import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      /* ---- Color Palette ---- */
      colors: {
        background: "var(--background)",
        "background-secondary": "var(--background-secondary)",
        "background-tertiary": "var(--background-tertiary)",
        foreground: "var(--foreground)",
        "foreground-secondary": "var(--foreground-secondary)",
        "foreground-muted": "var(--foreground-muted)",

        primary: {
          DEFAULT: "var(--primary)",
          hover: "var(--primary-hover)",
          light: "var(--primary-light)",
          foreground: "var(--primary-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          hover: "var(--accent-hover)",
          light: "var(--accent-light)",
          foreground: "var(--accent-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
          border: "var(--card-border)",
        },
        border: "var(--border)",
        "border-light": "var(--border-light)",
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        ring: "var(--ring)",

        /* Green sub-palettes */
        sage: {
          50: "var(--color-sage-50)",
          100: "var(--color-sage-100)",
          200: "var(--color-sage-200)",
          300: "var(--color-sage-300)",
          400: "var(--color-sage-400)",
          500: "var(--color-sage-500)",
          600: "var(--color-sage-600)",
          700: "var(--color-sage-700)",
          800: "var(--color-sage-800)",
          900: "var(--color-sage-900)",
        },
        emerald: {
          50: "var(--color-emerald-50)",
          100: "var(--color-emerald-100)",
          200: "var(--color-emerald-200)",
          300: "var(--color-emerald-300)",
          400: "var(--color-emerald-400)",
          500: "var(--color-emerald-500)",
          600: "var(--color-emerald-600)",
          700: "var(--color-emerald-700)",
          800: "var(--color-emerald-800)",
          900: "var(--color-emerald-900)",
        },
        mint: {
          50: "var(--color-mint-50)",
          100: "var(--color-mint-100)",
          200: "var(--color-mint-200)",
          300: "var(--color-mint-300)",
          400: "var(--color-mint-400)",
          500: "var(--color-mint-500)",
          600: "var(--color-mint-600)",
          700: "var(--color-mint-700)",
          800: "var(--color-mint-800)",
          900: "var(--color-mint-900)",
        },

        /* Dark mode specific semantic colors */
        "dark-bg": "#0D1F0D",
        "dark-bg-secondary": "#1A2E1A",
        "dark-accent": "#8FBF8F",
        "dark-text": "#F0F5F0",
      },

      /* ---- Font Families ---- */
      fontFamily: {
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        heading: ["var(--font-plus-jakarta)", "system-ui", "sans-serif"],
        accent: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
      },

      /* ---- Fluid Font Sizes (Major Third scale ~1.25) ---- */
      fontSize: {
        "fluid-h1": [
          "clamp(1.5rem, 3vw, 3.5rem)",
          { lineHeight: "1.1", letterSpacing: "-0.04em", fontWeight: "700" },
        ],
        "fluid-h2": [
          "clamp(1.25rem, 2.5vw, 2.8rem)",
          { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "700" },
        ],
        "fluid-h3": [
          "clamp(1.1rem, 2vw, 2.25rem)",
          { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "600" },
        ],
        "fluid-h4": [
          "clamp(1rem, 1.6vw, 1.8rem)",
          { lineHeight: "1.4", fontWeight: "600" },
        ],
        "fluid-h5": [
          "clamp(0.95rem, 1.3vw, 1.44rem)",
          { lineHeight: "1.5", fontWeight: "500" },
        ],
        "fluid-h6": [
          "clamp(0.9rem, 1.1vw, 1.15rem)",
          { lineHeight: "1.5", fontWeight: "500" },
        ],
        "fluid-body": [
          "clamp(1rem, 1.1rem, 1.25rem)",
          { lineHeight: "1.7" },
        ],
        "fluid-body-sm": [
          "clamp(0.875rem, 0.95rem, 1rem)",
          { lineHeight: "1.6" },
        ],
        "fluid-caption": [
          "clamp(0.75rem, 0.85rem, 0.875rem)",
          { lineHeight: "1.5" },
        ],
      },

      /* ---- Letter Spacing ---- */
      letterSpacing: {
        "heading-tight": "-0.04em",
        "heading-snug": "-0.02em",
      },

      /* ---- Fluid Spacing ---- */
      spacing: {
        section: "clamp(2rem, 5vw, 6rem)",
        "section-sm": "clamp(1.5rem, 3vw, 4rem)",
        container: "clamp(1rem, 3vw, 2rem)",
      },

      /* ---- Backdrop Blur for Glassmorphism ---- */
      backdropBlur: {
        xs: "4px",
        glass: "8px",
        "glass-md": "12px",
        "glass-lg": "16px",
        "glass-xl": "20px",
      },

      /* ---- Box Shadows (layered depth) ---- */
      boxShadow: {
        glass: "0 8px 32px rgba(82, 140, 82, 0.08)",
        "glass-dark": "0 8px 32px rgba(0, 0, 0, 0.3)",
        "elevation-1": "0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)",
        "elevation-2":
          "0 4px 6px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.03)",
        "elevation-3":
          "0 10px 15px rgba(0, 0, 0, 0.05), 0 4px 6px rgba(0, 0, 0, 0.04), 0 2px 4px rgba(0, 0, 0, 0.03), 0 1px 2px rgba(0, 0, 0, 0.02)",
        "elevation-4":
          "0 20px 25px rgba(0, 0, 0, 0.06), 0 10px 10px rgba(0, 0, 0, 0.04), 0 4px 6px rgba(0, 0, 0, 0.03), 0 1px 3px rgba(0, 0, 0, 0.02)",
        "glow-green": "0 0 20px rgba(82, 140, 82, 0.3)",
        "glow-green-lg": "0 0 40px rgba(82, 140, 82, 0.4)",
      },

      /* ---- Border Radius ---- */
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },

      /* ---- Keyframe Animations ---- */
      keyframes: {
        "blob-float": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(30px, -30px) scale(1.05)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.95)" },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "icon-bounce": {
          "0%": { transform: "scale(1)" },
          "25%": { transform: "scale(1.25)" },
          "50%": { transform: "scale(0.9)" },
          "75%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        "blob-float": "blob-float 20s ease-in-out infinite",
        "gradient-shift": "gradient-shift 15s ease infinite",
        shimmer: "shimmer 2s linear infinite",
        "fade-in-up": "fade-in-up 0.6s ease-out forwards",
        "icon-bounce": "icon-bounce 0.6s ease-out",
      },

      /* ---- Transition Duration ---- */
      transitionDuration: {
        "300": "300ms",
        "400": "400ms",
      },

      /* ---- Background Image for nature patterns ---- */
      backgroundImage: {
        "nature-pattern":
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cpath d='M40 10c0 16.569-13.431 30-30 30' fill='none' stroke='%23528c52' stroke-width='0.5' opacity='0.15'/%3E%3Cpath d='M70 40c-16.569 0-30 13.431-30 30' fill='none' stroke='%23528c52' stroke-width='0.5' opacity='0.15'/%3E%3C/svg%3E\")",
        "leaf-pattern":
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cpath d='M30 5c12 0 20 10 20 25s-10 20-20 20S10 42 10 30s8-25 20-25z' fill='none' stroke='%23528c52' stroke-width='0.4' opacity='0.12'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [
    /* ---- Glassmorphism Utility Plugin ---- */
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".glass": {
          background: "var(--glass-bg)",
          "backdrop-filter": "blur(12px)",
          "-webkit-backdrop-filter": "blur(12px)",
          border: "1px solid var(--glass-border)",
          "box-shadow": "var(--glass-shadow)",
        },
        ".glass-sm": {
          background: "var(--glass-bg)",
          "backdrop-filter": "blur(8px)",
          "-webkit-backdrop-filter": "blur(8px)",
          border: "1px solid var(--glass-border)",
          "box-shadow": "var(--glass-shadow)",
        },
        ".glass-lg": {
          background: "var(--glass-bg-heavy)",
          "backdrop-filter": "blur(20px)",
          "-webkit-backdrop-filter": "blur(20px)",
          border: "1px solid var(--glass-border)",
          "box-shadow": "var(--glass-shadow)",
        },
        ".glass-card": {
          background: "var(--glass-bg)",
          "backdrop-filter": "blur(12px)",
          "-webkit-backdrop-filter": "blur(12px)",
          border: "1px solid var(--glass-border)",
          "box-shadow": "var(--glass-shadow)",
          "border-radius": "1rem",
        },
        ".glass-nav": {
          background: "var(--glass-bg-heavy)",
          "backdrop-filter": "blur(16px)",
          "-webkit-backdrop-filter": "blur(16px)",
          border: "1px solid var(--glass-border)",
          "box-shadow": "var(--glass-shadow)",
        },
        /* Fallback for browsers without backdrop-filter */
        "@supports not (backdrop-filter: blur(1px))": {
          ".glass, .glass-sm, .glass-lg, .glass-card, .glass-nav": {
            background: "var(--glass-bg-heavy)",
          },
        },
      });
    }),
  ],
};

export default config;
