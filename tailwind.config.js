/** @type {import('tailwindcss').Config} */
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
      },
    },
  },
  daisyui: {
    themes: ['black'],
  },
  plugins: [require('daisyui')],
};
