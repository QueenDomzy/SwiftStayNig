module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}" // Add if you’re using Next.js 13+ App Router
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0C2340",    // Deep navy blue
        accent: "#D4AF37",     // Gold
        success: "#047857",    // Green
        dark: "#000000",
        light: "#FFFFFF",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        serif: ["Merriweather", "serif"], // Optional for elegant headings
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
  ],
};
