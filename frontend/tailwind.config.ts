import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      colors: {
        bg: {
          base: '#0C0C0C',
          surface: '#141414',
          elevated: '#1C1C1C',
        },
        border: {
          subtle: '#252525',
          default: '#333333',
        },
        text: {
          primary: '#F0F0F0',
          secondary: '#8A8A8A',
          muted: '#505050',
        },
        accent: {
          lime: '#C8FF00',
          productive: '#4ADE80',
          improductive: '#FF5555',
        },
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'step-reveal': {
          '0%': { opacity: '0', transform: 'translateX(-6px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.2' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        grain: {
          '0%':   { transform: 'translate(0, 0)' },
          '10%':  { transform: 'translate(-5%, -5%)' },
          '20%':  { transform: 'translate(-10%, 5%)' },
          '30%':  { transform: 'translate(5%, -10%)' },
          '40%':  { transform: 'translate(-5%, 15%)' },
          '50%':  { transform: 'translate(-10%, 5%)' },
          '60%':  { transform: 'translate(15%, 0%)' },
          '70%':  { transform: 'translate(0%, 10%)' },
          '80%':  { transform: 'translate(-15%, -5%)' },
          '90%':  { transform: 'translate(10%, 5%)' },
          '100%': { transform: 'translate(5%, 0%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.4s ease-out forwards',
        'step-reveal': 'step-reveal 0.3s ease-out forwards',
        'pulse-dot': 'pulse-dot 1.4s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
        grain: 'grain 8s steps(10) infinite',
      },
    },
  },
  plugins: [],
} satisfies Config
