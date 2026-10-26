/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        quest: {
          dark: '#0f172a',
          card: '#1e293b',
          border: '#334155',
          primary: '#6366f1',
          gold: '#f59e0b',
          emerald: '#10b981',
          ruby: '#ef4444',
          cyan: '#06b6d4',
          purple: '#a855f7',
        }
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        pop: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(245, 158, 11, 0.4)' },
          '50%': { boxShadow: '0 0 30px rgba(245, 158, 11, 0.8)' },
        }
      },
      animation: {
        wiggle: 'wiggle 0.3s ease-in-out infinite',
        pop: 'pop 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        glow: 'pulseGlow 2s infinite',
      }
    },
  },
  plugins: [],
}
