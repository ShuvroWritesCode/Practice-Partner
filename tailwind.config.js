/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#006590', 
      },
      placeholderFontWeight: ['responsive', 'hover', 'focus'],
    },
    backgroundColor: theme => ({
      ...theme('colors'),
      'primary': '#006590',
      'secondary' : '#4f606e',
      'surface' : '#f9f9fc',
      'primary-container' : '#c8e6ff',
      'secondary-container' : '#d2e5f5',
      'on-surface' :'#191c1e',
      'on-primary-container': '#001e2e',
      'on-secondary-container': '#0b1d29',
      'on-surface-variant': '#41484d', 
      
      }),
  },
  plugins: [
  ],
}