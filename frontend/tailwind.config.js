/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'royal-blue': '#1f6feb',
        bunker: {
          100: '#0D1117',
          200: '#161B22',
        },
        haiti: '#08081F',
        'blue-violet': '#9747ff',
        surface: '#24292f',
      },
    },
  },
  plugins: [],
};
