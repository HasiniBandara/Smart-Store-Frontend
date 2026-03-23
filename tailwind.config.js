/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#a4133c",
        light: "#fff0f3",
      },
      fontFamily: {
        logo: ["'Lily Script One'", "cursive"],
        main: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};
