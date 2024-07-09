/** @type {import('tailwindcss').Config} */

export default {
  content: ['./src/**/*.{mjs,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'pale-green': '#dde7dd',
        'earth-green': '#6a8f6b',
        'midnight-blue': '#221c42',
        pale: '#ffe0c9'
      }
    }
  },
  plugins: []
}
