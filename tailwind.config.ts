import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Surfaces — warm, calm, expensive
        canvas: '#F8F6F2',   // beige/off-white page background
        surface: '#FFFFFF',  // pure white cards
        line: '#ECE7DF',     // very subtle warm border
        // Text
        ink: {
          DEFAULT: '#2D2D2D', // primary dark grey
          soft: '#6B7280',    // secondary soft grey
          muted: '#9CA3AF',   // labels / faint
        },
        // Brand — warm gold accent
        gold: {
          DEFAULT: '#C8A97E',
          dark: '#B5946A',
          soft: '#F4EFE6',    // tinted gold background
        },
        // Restrained, desaturated tones for charts / secondary data (no brightness)
        tone: {
          slate: '#8A8F98',
          sage: '#7E9A7E',
          clay: '#BC8A78',
          taupe: '#9A8F86',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl2: '1rem', // 16px — consistent premium radius
      },
      boxShadow: {
        // Whisper-soft, expensive depth
        card: '0 1px 3px rgba(45,45,45,0.04), 0 1px 2px rgba(45,45,45,0.03)',
        soft: '0 1px 2px rgba(45,45,45,0.05)',
        lift: '0 6px 24px rgba(45,45,45,0.06)',
      },
    },
  },
  plugins: [],
};

export default config;
