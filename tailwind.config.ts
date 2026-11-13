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
          hover: '#6a21a3',
          deep: '#551c7d',
          soft: '#f4ebfa',
          glow: 'rgba(123, 41, 186, 0.35)',
        },
        page: '#f5f4f8',
        surface: '#ffffff',
        line: '#e2e0ea',
        ink: {
          DEFAULT: '#1c1b1a',
          muted: '#6b675e',
        },
        muted: '#6b675e',
        success: {
          bg: '#dcfce7',
          fg: '#15803d',
        },
        warning: {
          bg: '#fdf0d5',
          fg: '#8a5a00',
        },
        danger: {
          bg: '#fee2e2',
          fg: '#b91c1c',
        },
        live: '#4ade80',
        tag: {
          bg: '#f4ebfa',
          text: '#7b29ba',
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
