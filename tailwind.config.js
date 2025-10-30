import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './lib/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: '#0F766E',
        brandAccent: '#D97706',
        brandSurface: '#F4DEC2',
        brandDeep: '#854D0E',
        brandSecondary: '#B45309',
      },
      fontFamily: {
        display: ['Poppins', ...defaultTheme.fontFamily.sans],
      },
      boxShadow: {
        soft: '0 18px 40px -20px rgba(120,53,15,0.35)',
        glow: '0 20px 46px -22px rgba(15,118,110,0.45)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(12px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
};

export default config;
