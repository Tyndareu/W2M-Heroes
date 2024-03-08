/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        chill: {
          50: '#fffbeb',
          50: '#f6f5fd',
          100: '#efecfb',
          200: '#dfdbf9',
          300: '#c7bef4',
          400: '#ac99ec',
          500: '#9070e2',
          600: '#7e51d6',
          700: '#673ab7',
          800: '#5c34a3',
          900: '#4c2d85',
          950: '#2f1b5a',
        },
      },
    },
  },
  plugins: [],
};
