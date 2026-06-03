import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        midnight: '#0B071E',
        plum: {
          DEFAULT: '#160E33',
          light: '#1E1540',
          border: '#2A2150',
        },
        muted: '#8B86B8',
        neon: {
          cyan: '#00F2FE',
          magenta: '#FF007F',
          green: '#00FF87',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
};

export default config;
