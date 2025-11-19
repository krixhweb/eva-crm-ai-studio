export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        'xs': ['0.8rem', { lineHeight: '1.2rem' }],
        'sm': ['0.925rem', { lineHeight: '1.35rem' }],
        'base': ['1.05rem', { lineHeight: '1.6rem' }],
        'lg': ['1.175rem', { lineHeight: '1.8rem' }],
        'xl': ['1.3rem', { lineHeight: '1.9rem' }],
        '2xl': ['1.6rem', { lineHeight: '2.1rem' }],
        '3xl': ['1.975rem', { lineHeight: '2.4rem' }],
      },
      colors: {
        dark: {
          bg: '#000000',
          surface: '#18181b',
          surfaceHover: '#27272a',
          border: '#27272a',
          text: '#e4e4e7',
          muted: '#a1a1aa',
        },
        green: {
          DEFAULT: '#22C55E',
          '50': '#F0FDF4',
          '100': '#DCFCE7',
          '200': '#BBF7D0',
          '300': '#86EFAC',
          '400': '#4ADE80',
          '500': '#22C55E',
          '600': '#16A34A',
          '700': '#15803D',
          '800': '#166534',
          '900': '#14532D',
        },
        blue: {
          DEFAULT: '#3B82F6',
          '500': '#3B82F6',
        },
        status: {
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          info: '#3B82F6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    }
  },
  plugins: [],
};
