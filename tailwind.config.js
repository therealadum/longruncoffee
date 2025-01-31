const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");
const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

module.exports = {
  important: true,
  content: [
    "./config/*.json",
    "./layout/*.liquid",
    "./blocks/*.liquid",
    "./assets/*.liquid",
    "./sections/*.liquid",
    "./snippets/*.liquid",
    "./templates/*.liquid",
    "./templates/*.json",
    "./templates/customers/*.liquid",
    "./locales/*.json",
    "./src/**/*.tsx",
  ],
  safelist: ["border-cyan-600", "bg-cyan-800", "text-cyan-50"],
  theme: {
    extend: {
      colors: {
        black: "#000000",
        white: "#ffffff",
        cyan: {
          50: "#D8F2F5",
          100: "#C8EDF1",
          200: "#A7E2E9",
          300: "#86D7E1",
          400: "#66CDD9",
          500: "#45C2D1",
          600: "#2CA4B2",
          700: "#217A85",
          800: "#165158",
          900: "#044E54",
        },
        tan: {
          50: "#FFFDFA",
          100: "#FFF6EB",
          200: "#FFE8CC",
          300: "#FFDAAE",
          400: "#FFCD8F",
          500: "#FFC37A",
          600: "#FDB153",
          700: "#EB962D",
          800: "#DF8416",
          900: "#CC7914",
        },
        neutral: {
          50: "#F0F4F8",
          100: "#D9E2EC",
          200: "#BCCCDC",
          300: "#9FB3C8",
          400: "#829AB1",
          500: "#627D98",
          600: "#486581",
          700: "#334E68",
          800: "#243B53",
          900: "#102A43",
        },
      },
      height: {
        "10v": "10vh",
        "20v": "20vh",
        "30v": "30vh",
        "40v": "40vh",
        "50v": "50vh",
        "60v": "60vh",
        "70v": "70vh",
        "80v": "80vh",
        "90v": "90vh",
        "100v": "100vh",
      },
      screens: {
        xs: "24em",
        sm: "32em",
        md: "48em",
        lg: "64em",
        xl: "80em",
        "2xl": "96em",
        "sm-max": { max: "48em" },
        "sm-only": { min: "32em", max: "48em" },
        "md-only": { min: "48em", max: "64em" },
        "lg-only": { min: "64em", max: "80em" },
        "xl-only": { min: "80em", max: "96em" },
        "2xl-only": { min: "96em" },
      },
      fontFamily: {
        accent: ['"IntroRust"', "Palatino", "ui-serif"],
        base: ['"Montserrat"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/forms"),
    require("tailwindcss-inner-border"),
    require("@tailwindcss/aspect-ratio"),
    addVariablesForColors,
  ],
};

function addVariablesForColors({ addBase, theme }) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val]),
  );

  addBase({
    ":root": newVars,
  });
}
