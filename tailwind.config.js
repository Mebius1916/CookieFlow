/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,html}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1677FF',
          light: '#E6F7FF',
          dark: '#0958D9',
        }
      },
    },
  },
  plugins: [],
} 