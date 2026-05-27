/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#0a0a0f',
          card: '#111118',
          elevated: '#16161f',
          border: '#1e1e2a',
        },
        accent: {
          DEFAULT: '#f59e0b',
          dim: '#d97706',
          muted: 'rgba(245,158,11,0.15)',
        },
        text: {
          primary: '#f4f4f5',
          secondary: '#a1a1aa',
          muted: '#52525b',
        },
        success: '#10b981',
        danger: '#ef4444',
        warn: '#f97316',
        info: '#3b82f6',
      },
      fontFamily: {
        sans: ['"DM Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Syne"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.5), 0 0 0 1px rgba(30,30,42,0.8)',
        glow: '0 0 20px rgba(245,158,11,0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'check-bounce': 'checkBounce 0.3s cubic-bezier(0.34,1.56,0.64,1)',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(12px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        checkBounce: { '0%': { transform: 'scale(0.8)' }, '60%': { transform: 'scale(1.15)' }, '100%': { transform: 'scale(1)' } },
      },
    },
  },
  plugins: [],
};


