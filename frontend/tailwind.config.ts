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
          base: '#060A12',
          surface: '#0B1120',
          elevated: '#111827',
        },
        border: {
          subtle: '#1E2A3B',
          default: '#243347',
        },
        text: {
          primary: '#E8EDF5',
          secondary: '#8BA0BB',
          muted: '#4A6080',
        },
        accent: {
          blue: '#2D7CF6',
          productive: '#10B981',
          improductive: '#F59E0B',
        },
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fill-bar': {
          '0%': { width: '0%' },
          '100%': { width: 'var(--target-width)' },
        },
        'step-reveal': {
          '0%': { opacity: '0', transform: 'translateX(-8px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out forwards',
        'fill-bar': 'fill-bar 1s ease-out forwards',
        'step-reveal': 'step-reveal 0.4s ease-out forwards',
        'pulse-dot': 'pulse-dot 1.2s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
      },
    },
  },
  plugins: [],
} satisfies Config
