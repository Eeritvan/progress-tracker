/** @type {import('tailwindcss').Config} */
import tailwindcssMotion from 'tailwindcss-motion'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        '26': 'repeat(26, minmax(0, 1fr))',
      }
    }
  },
  plugins: [tailwindcssMotion],
}
