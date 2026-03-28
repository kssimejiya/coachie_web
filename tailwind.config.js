/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,ts,tsx}',
  ],
  safelist: ['animate-spin', 'animate-pulse'],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      colors: {
        primary: '#FFFFFF',
        secondary: '#ADB5BD',
        dark: '#343A40',
        light: '#F8F9FA',
        title: '#495057',
        desc: '#ADB5BD',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    function({ addUtilities }) {
      addUtilities({
        '.gpu-accelerated': {
          'transform': 'translateZ(0)',
          'will-change': 'transform',
        },
        '.smooth-scroll': {
          'scroll-behavior': 'smooth',
        },
        '.no-scroll': {
          'overflow': 'hidden',
        },
        '.transition-fast': {
          'transition-duration': '150ms',
        },
        '.transition-slow': {
          'transition-duration': '500ms',
        },
      });
    },
  ],
  corePlugins: {
    preflight: true,
  },
};
