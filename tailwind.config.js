// tailwind预处理
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      black: "#000000",
      white: "#ffffff",
      primary: "#d33a31",
      ct: "#2d2d2d",
      ctd: "#787878",
    },
    extend: {
      backdropBlur: {
        xxs: '1px',
      }
    },
  },
  plugins: [],
}

