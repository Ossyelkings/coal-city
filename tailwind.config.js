/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#050d1a',
          900: '#0a1628',
          800: '#0f2035',
          700: '#1e3a5f',
          600: '#2a4f7a',
          500: '#3a6b9f',
        },
        gold: {
          400: '#e8c06a',
          500: '#d4a853',
          600: '#b8903f',
          700: '#9a7832',
        },
        cream: {
          50: '#fdfbf7',
          100: '#f7f3eb',
          200: '#ede5d5',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
