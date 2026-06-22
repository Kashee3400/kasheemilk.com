import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  "#EEF9F8",
          100: "#D6F0EE",
          200: "#A8E3E0",
          300: "#6ECDC8",
          400: "#36AFA9",
          500: "#228C87",
          600: "#1B6B67",
          700: "#155552",
          800: "#0F3D39",
          900: "#0B2C2A",
        },
        gold: {
          50:  "#FFFBF0",
          100: "#FEF3D5",
          200: "#FDE3A7",
          300: "#FBCA6E",
          400: "#F5A623",
          500: "#E08A00",
          600: "#C27200",
          700: "#9E5A00",
          800: "#7A4500",
          900: "#5C3300",
        },
        ink: {
          50:  "#F2F7F7",
          100: "#E4EEEE",
          200: "#C8D9D8",
          300: "#A3BCBB",
          400: "#7D9C9B",
          500: "#5C7877",
          600: "#415C5B",
          700: "#2E4140",
          800: "#1E2C2B",
          900: "#111918",
          950: "#0A0F0E",
        },
        surface: {
          page:   "#F7FAFA",
          card:   "#FFFFFF",
          raised: "#EEF6F5",
          sunken: "#E4EEEE",
          dark:   "#0F3D39",
          darker: "#0B2C2A",
        },
      },

      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body:    ["var(--font-body)",    "system-ui", "sans-serif"],
        accent:  ["var(--font-accent)",  "cursive"],
      },

      boxShadow: {
        xs:       "0 1px 3px rgba(11,44,42,0.06), 0 1px 2px rgba(11,44,42,0.04)",
        sm:       "0 2px 8px rgba(11,44,42,0.08), 0 1px 4px rgba(11,44,42,0.05)",
        md:       "0 4px 20px rgba(11,44,42,0.10), 0 2px 8px rgba(11,44,42,0.06)",
        lg:       "0 8px 40px rgba(11,44,42,0.12), 0 4px 16px rgba(11,44,42,0.08)",
        xl:       "0 16px 64px rgba(11,44,42,0.14), 0 8px 24px rgba(11,44,42,0.10)",
        "2xl":    "0 32px 96px rgba(11,44,42,0.18), 0 16px 40px rgba(11,44,42,0.12)",
        "gold-sm":"0 4px 20px rgba(224,138,0,0.25)",
        "gold-md":"0 8px 40px rgba(224,138,0,0.30)",
        "teal-sm":"0 4px 20px rgba(34,140,135,0.25)",
        "teal-md":"0 8px 40px rgba(34,140,135,0.30)",
      },

      backgroundImage: {
        "gradient-primary":      "linear-gradient(135deg, #155552 0%, #228C87 100%)",
        "gradient-primary-dark": "linear-gradient(135deg, #0B2C2A 0%, #155552 100%)",
        "gradient-gold":         "linear-gradient(135deg, #9E5A00 0%, #F5A623 100%)",
        "gradient-gold-light":   "linear-gradient(135deg, #E08A00 0%, #FBCA6E 100%)",
        "gradient-hero":         "linear-gradient(135deg, #0B2C2A 0%, #155552 50%, #228C87 100%)",
        "gradient-warm":         "linear-gradient(135deg, #1B6B67 0%, #228C87 40%, #C27200 100%)",
        "gradient-overlay-dark": "linear-gradient(to top, rgba(11,44,42,0.85) 0%, rgba(11,44,42,0.40) 60%, transparent 100%)",
        "gradient-overlay-side": "linear-gradient(to right, rgba(11,44,42,0.80) 0%, rgba(11,44,42,0.30) 60%, transparent 100%)",
      },

      borderRadius: {
        xs:   "4px",
        sm:   "8px",
        md:   "12px",
        lg:   "16px",
        xl:   "24px",
        "2xl":"32px",
      },

      animation: {
        "fade-up":    "fadeInUp 0.8s ease forwards",
        "fade-in":    "fadeIn 0.7s ease forwards",
        "slide-down": "slideInDown 0.4s ease forwards",
        "float":      "float 5s ease-in-out infinite",
        "shimmer":    "shimmer 1.5s infinite",
        "pulse-dot":  "pulse-dot 2s cubic-bezier(0.4,0,0.6,1) infinite",
        "marquee-up": "marqueeUp 28s linear infinite",
      },

      keyframes: {
        fadeInUp:    { from: { opacity: "0", transform: "translateY(32px)"  }, to: { opacity: "1", transform: "translateY(0)"  } },
        fadeIn:      { from: { opacity: "0" },                                  to: { opacity: "1" } },
        slideInDown: { from: { opacity: "0", transform: "translateY(-16px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        float:       { "0%, 100%": { transform: "translateY(0px)"  }, "50%": { transform: "translateY(-12px)" } },
        shimmer:     { "0%": { backgroundPosition: "-200% center" }, "100%": { backgroundPosition: "200% center" } },
        "pulse-dot": { "0%, 100%": { opacity: "1", transform: "scale(1)" },    "50%": { opacity: "0.6", transform: "scale(0.85)" } },
        marqueeUp:   { "0%": { transform: "translateY(0)" },                   "100%": { transform: "translateY(-50%)" } },
      },

      transitionTimingFunction: {
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },

      transitionDuration: {
        fast: "150ms",
        base: "250ms",
        slow: "400ms",
      },
    },
  },
  plugins: [],
};

export default config;