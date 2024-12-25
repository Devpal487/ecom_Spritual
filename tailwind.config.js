/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'custom-light': '0 4px 10px rgba(0, 0, 0, 0.1)',
        'custom-heavy': '0 8px 20px rgba(0, 0, 0, 0.2)',
      },
      height: {
        'header-scrolled': '60px',
        'hero': '80vh',
      },
      spacing: {
        'header-top': '60px',
        'extra-large': '4rem',
      },
      colors: {
        'header-bg': '#433487',
        'header-text': '#F6D2C8',
        'primary': '#007bff',
      },
      fontSize: {
        'xxs': '0.65rem',
      },
      keyframes: {
        gradientBG: {
          '0%': { backgroundPosition: '0% 0%' },
          '50%': { backgroundPosition: '100% 100%' },
          '100%': { backgroundPosition: '0% 0%' },
        },
        scaleUp: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        'gradient-animated': 'gradientBG 5s ease infinite',
        'scale-up': 'scaleUp 2s ease-in-out infinite',
      },
    },
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
  },
  variants: {
    extend: {
      transitionProperty: ['hover', 'focus'],
    },
  },
  plugins: [],
};