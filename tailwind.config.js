/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        silk:   '#FBF9E4',
        canvas: '#B8C8D8',
        burlap: '#5B88B2',
        timber: '#1E4A7A',
        ember:  '#5B88B2',
        cocoa:  '#122C4F',
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
        'warm-sm': '0 2px 8px rgba(18,44,79,0.08)',
        'warm-md': '0 8px 24px rgba(18,44,79,0.12)',
        'warm-lg': '0 20px 48px rgba(18,44,79,0.18)',
        'warm-xl': '0 32px 64px rgba(18,44,79,0.24)',
      },
    },
  },
  plugins: [],
};
