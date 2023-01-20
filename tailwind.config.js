/** @type {import('tailwindcss').Config} */

const svgToDataUri = require('mini-svg-data-uri');
const {
  default: flattenColorPalette,
} = require('tailwindcss/lib/util/flattenColorPalette');

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      animation: {
        'gradient-1': 'animate-gradient-1 8s infinite',
        'gradient-2': 'animate-gradient-2 8s infinite',
        'gradient-3': 'animate-gradient-3 8s infinite',
        'gradient-4': 'animate-gradient-4 8s infinite',
        blob: 'blob 7s infinite',
      },
      keyframes: {
        'animate-gradient-1': {
          '0%, 16.667%, 100%': { opacity: '1' },
          '33.333%, 83.333%': { opacity: '0' },
        },
        'animate-gradient-2': {
          '0%, 16.667%, 66.667%, 100%': { opacity: '0' },
          '33.333%, 50%': { opacity: '1' },
        },
        'animate-gradient-3': {
          '0%, 50%,  100%': { opacity: '0' },
          '66.667%, 83.333%': { opacity: '1' },
        },
        blob: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
          '100%': {
            transform: 'tranlate(0px, 0px) scale(1)',
          },
        },
      },
    },
  },
  daisyui: {
    themes: ['black'],
  },
  plugins: [
    function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          'bg-grid': (value) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="64" height="64" fill="none" stroke="${value}" stroke-width="0.5"><path d="M0 .5H31.5V32" /></svg>`
            )}")`,
          }),
        },
        {
          values: flattenColorPalette(theme('backgroundColor')),
          type: 'color',
        }
      );
    },
    require('daisyui'),
  ],
};
