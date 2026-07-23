/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lanka: {
          bg: '#070b13',
          'bg-light': '#0b1424',
          card: 'rgba(13, 22, 38, 0.65)',
          'card-hover': 'rgba(20, 32, 54, 0.85)',
          border: 'rgba(59, 130, 246, 0.12)',
          'border-hover': 'rgba(59, 130, 246, 0.3)',
          blue: '#2563eb',
          'blue-hover': '#1d4ed8',
          'blue-light': '#3b82f6',
          'blue-glow': 'rgba(37, 99, 235, 0.2)',
          cyan: '#00d2ff',
          'cyan-glow': 'rgba(0, 210, 255, 0.25)',
          teal: '#10b981',
          'teal-glow': 'rgba(16, 185, 129, 0.25)',
          rose: '#f43f5e',
          'rose-glow': 'rgba(244, 63, 94, 0.25)',
          text: '#f8fafc',
          muted: '#94a3b8',
          darkText: '#64748b'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'cyan-glow': '0 0 15px rgba(0, 210, 255, 0.35)',
        'blue-glow': '0 0 15px rgba(37, 99, 235, 0.35)',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}
