/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta da Samgat Store - Pretos, brancos e tons neutros
        'samgat-black': '#000000',
        'samgat-dark': '#1A1A1A',
        'samgat-gray': '#333333',
        'samgat-gray-light': '#666666',
        'samgat-gray-lighter': '#E0E0E0',
        'samgat-white': '#FFFFFF',
        'samgat-off-white': '#F5F5F5',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};