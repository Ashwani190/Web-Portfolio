/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        silk:   '#130F40',
        canvas: '#2C3E50',
        burlap: '#BDC3C7',
        timber: '#A5B1C2',
        ember:  '#95A5A6',
        cocoa:  '#F8FAFC',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'fade-in':  'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'float':    'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:  { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp: { '0%': { transform: 'translateY(30px)', opacity: 0 }, '100%': { transform: 'translateY(0)', opacity: 1 } },
        float:   { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
      },
      boxShadow: {
        'warm-sm': '0 2px 8px rgba(0,0,0,0.20)',
        'warm-md': '0 8px 24px rgba(0,0,0,0.28)',
        'warm-lg': '0 20px 48px rgba(0,0,0,0.35)',
        'warm-xl': '0 32px 64px rgba(0,0,0,0.40)',
      },
    },
  },
  plugins: [],
};
