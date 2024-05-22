/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    screens: {
      tablet: '1024px',
      phone: '744px',
    },
    extend: {
      colors: {
        black2: '#667176',
      },
    },
  },
  plugins: [],
};
