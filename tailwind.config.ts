import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Surfaces
        canvas: '#F4F6F8',   // page background — soft light gray
        surface: '#FFFFFF',  // cards
        line: '#E8ECF1',     // 1px razor borders
        // Sidebar — deep navy
        navy: {
          DEFAULT: '#141B2D',
          light: '#1E2740',
          border: '#2A344F',
        },
        // Text
        ink: {
          DEFAULT: '#1E293B', // primary slate
          soft: '#475569',    // secondary
          muted: '#94A3B8',   // labels / subtext
        },
        // Brand
        coral: {
          DEFAULT: '#FF6B4A',
          dark: '#F1563B',
          soft: '#FFF1ED',    // tinted icon wrapper / hover
        },
        // Corporate data tints
        tint: {
          blue: '#5B8DEF',
          amber: '#F5A623',
          purple: '#8B7FD6',
          sage: '#4FB286',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl2: '1rem', // 16px — consistent card radius
      },
      boxShadow: {
        // Diffused, near-invisible — depth without heavy dropshadow
        card: '0 4px 20px rgba(15, 23, 42, 0.03)',
        soft: '0 1px 3px rgba(15, 23, 42, 0.04)',
      },
    },
  },
  plugins: [],
};

export default config;
