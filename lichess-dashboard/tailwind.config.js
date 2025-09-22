/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'lichess-blue': '#759656',
        'lichess-green': '#779556',
        'lichess-dark': '#312e2b',
      },
    },
  },
  plugins: [],
}
