/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#79653f',
        colorprimary: '#6e685c',
        headerbg: '#ead1c4',
        bg: '#fdf8f3',
        itemborder: '#e2d9cc',
        bordercolor: '#e7dfd9',
        disabled: '#c9beae',
      },
    },
  },
  plugins: [],
};
