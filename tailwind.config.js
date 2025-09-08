/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        islamic: {
          gold: {
            50: '#fefce8',
            100: '#fef3c7',
            200: '#fde68a',
            300: '#fcd34d',
            400: '#fbbf24',
            500: '#f59e0b',
            600: '#d97706',
            700: '#b45309',
            800: '#92400e',
            900: '#78350f',
          },
          blue: {
            900: '#0d1b44', // Darker blue from cover
            800: '#1e3a8a',
            700: '#1d4ed8',
            600: '#2563eb',
            500: '#3b82f6',
            400: '#60a5fa',
            300: '#93c5fd',
            200: '#bfdbfe',
            100: '#dbeafe',
            50: '#eff6ff',
          },
          red: '#a42a28', // From the cover
        }
      },
      backgroundImage: {
        'book-cover': "url('https://i.ibb.co/pL9Rz9p/islamic-book-cover.png')",
        'gold-gradient': 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #fcd34d 100%)',
        'gold-text': 'linear-gradient(135deg, #d97706 0%, #f59e0b 50%, #fbbf24 100%)',
      },
      fontFamily: {
        arabic: ['Amiri', 'serif'],
        urdu: ['Noto Nastaliq Urdu', 'serif'],
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: 0.5 },
          '50%': { opacity: 1 },
        },
      },
      animation: {
        pulse: 'pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
};
