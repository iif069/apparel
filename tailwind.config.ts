import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#7b29ba',
          soft: '#f4ebfb',
          hover: '#6921a2',
          glow: 'rgba(123, 41, 186, 0.35)',
        },
        page: '#f5f4f8',
        surface: '#ffffff',
        line: '#e2e0ea',
        ink: {
          DEFAULT: '#1c1b1a',
          muted: '#726f7c',
        },
        tag: {
          bg: '#f9f2ff',
          text: '#6b22a6',
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
      },
      borderRadius: {
        card: '28px',
        pill: '9999px',
      },
    },
  },
  plugins: [],
};

export default config;
