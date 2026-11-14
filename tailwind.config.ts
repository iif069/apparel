import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: 'rgb(var(--color-brand-rgb) / <alpha-value>)',
          hover: 'rgb(var(--color-brand-hover-rgb) / <alpha-value>)',
          deep: 'rgb(var(--color-brand-deep-rgb) / <alpha-value>)',
          soft: 'rgb(var(--color-brand-soft-rgb) / <alpha-value>)',
          glow: 'rgba(123, 41, 186, 0.35)',
        },
        page: 'rgb(var(--color-page-rgb) / <alpha-value>)',
        surface: 'rgb(var(--color-surface-rgb) / <alpha-value>)',
        line: 'rgb(var(--color-line-rgb) / <alpha-value>)',
        ink: {
          DEFAULT: 'rgb(var(--color-ink-rgb) / <alpha-value>)',
          muted: 'rgb(var(--color-muted-rgb) / <alpha-value>)',
        },
        muted: 'rgb(var(--color-muted-rgb) / <alpha-value>)',
        success: {
          bg: 'var(--color-success-bg)',
          fg: 'var(--color-success-fg)',
        },
        warning: {
          bg: 'var(--color-warning-bg)',
          fg: 'var(--color-warning-fg)',
        },
        danger: {
          bg: 'var(--color-danger-bg)',
          fg: 'var(--color-danger-fg)',
        },
        live: '#4ade80',
        tag: {
          bg: 'rgb(var(--color-brand-soft-rgb) / <alpha-value>)',
          text: 'rgb(var(--color-brand-rgb) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-anton)', 'Impact', 'sans-serif'],
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
      },
      boxShadow: {
        soft: '0 4px 18px rgba(28, 27, 26, 0.06)',
        card: '0 8px 30px rgba(28, 27, 26, 0.08)',
        float: '0 12px 36px rgba(28, 27, 26, 0.12)',
        glow: '0 6px 20px rgba(123, 41, 186, 0.35)',
        glass: '0 8px 28px rgba(40, 14, 62, 0.14)',
      },
      borderRadius: {
        card: '32px',
        pill: '9999px',
      },
    },
  },
  plugins: [],
};

export default config;
