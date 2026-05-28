/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#F4F8FF',
          surface: '#E9F0FF',
          card: '#FFFFFF',
          text: '#0F1B33',
          accent: '#4F7CFF',
          'accent-dark': '#2F5CE0',
          line: '#CFDCF7',
          glow: '#8CB4FF',
          mint: '#63C2B5',
        },
      },
      boxShadow: {
        card: '0 14px 36px rgba(23, 56, 140, 0.12)',
        float: '0 28px 66px rgba(25, 65, 166, 0.18)',
      },
      backgroundImage: {
        'hero-wash':
          'radial-gradient(circle at 10% 18%, rgba(79, 124, 255, 0.28), transparent 42%), radial-gradient(circle at 88% 12%, rgba(99, 194, 181, 0.2), transparent 36%), linear-gradient(180deg, #f4f8ff 0%, #e9f0ff 100%)',
      },
    },
  },
  plugins: [],
}

