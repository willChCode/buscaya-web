/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/components/**/*.{js,vue,ts}',
    './app/layouts/**/*.vue',
    './app/pages/**/*.vue',
    './app/plugins/**/*.{js,ts}',
    './app/app.vue',
    './app/error.vue',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', '"Noto Sans"', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#ebfef9',
          100: '#cffdf1',
          200: '#a5fbe4',
          300: '#6bf6d0',
          400: '#2de8b3',
          500: '#00cc8d', // Logo color
          600: '#00a572',
          700: '#00845d',
          800: '#06684b',
          900: '#08563f',
          950: '#033024',
        },
        secondary: {
          50: '#f4f6f7',
          100: '#e3e8eb',
          200: '#c5ced4',
          300: '#9baab5',
          400: '#728594',
          500: '#556979',
          600: '#425261',
          700: '#35434f',
          800: '#2d3740',
          900: '#283037',
          950: '#0e1a23', // Logo Dark Navy
        },
      },
    },
  },
  plugins: [],
};
