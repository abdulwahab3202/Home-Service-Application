/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        // This correctly sets Outfit as the default sans-serif font
        sans: ['Outfit', 'sans-serif'], 
      },
    },
  },
  plugins: [],
}