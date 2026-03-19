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
          base:     'rgb(var(--bg-base) / <alpha-value>)',
          surface:  'rgb(var(--bg-surface) / <alpha-value>)',
          elevated: 'rgb(var(--bg-elevated) / <alpha-value>)',
        },
        border: {
          subtle:  'rgb(var(--border-subtle) / <alpha-value>)',
          default: 'rgb(var(--border-default) / <alpha-value>)',
        },
        text: {
          primary:   'rgb(var(--text-primary) / <alpha-value>)',
          secondary: 'rgb(var(--text-secondary) / <alpha-value>)',
          muted:     'rgb(var(--text-muted) / <alpha-value>)',
        },
        accent: {
          lime:         'rgb(var(--accent-lime) / <alpha-value>)',
          blue:         '#2D7CF6',
          productive:   'rgb(var(--accent-productive) / <alpha-value>)',
          improductive: 'rgb(var(--accent-improductive) / <alpha-value>)',
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
