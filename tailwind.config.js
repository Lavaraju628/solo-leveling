/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hunter: {
          dark: '#030712',
          navy: '#070d1e',
          card: 'rgba(10, 20, 42, 0.75)',
          border: 'rgba(56, 189, 248, 0.25)',
          blue: '#00d2ff',
          neon: '#00f0ff',
          deepBlue: '#0047ab',
          purple: '#8b5cf6',
          shadow: '#4c1d95',
          gold: '#fbbf24',
          goldLight: '#fde047',
          blood: '#ef4444',
          darkRed: '#7f1d1d'
        }
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        rajdhani: ['Rajdhani', 'sans-serif'],
        cinzel: ['Cinzel', 'serif'],
      },
      boxShadow: {
        'glow-blue': '0 0 20px rgba(0, 210, 255, 0.4), 0 0 40px rgba(0, 210, 255, 0.2)',
        'glow-blue-lg': '0 0 35px rgba(0, 240, 255, 0.6), 0 0 70px rgba(0, 140, 255, 0.3)',
        'glow-purple': '0 0 25px rgba(139, 92, 246, 0.5), 0 0 50px rgba(76, 29, 149, 0.3)',
        'glow-gold': '0 0 25px rgba(251, 191, 36, 0.6), 0 0 50px rgba(245, 158, 11, 0.3)',
        'glow-red': '0 0 25px rgba(239, 68, 68, 0.6), 0 0 50px rgba(127, 29, 29, 0.3)',
        'holo': 'inset 0 0 15px rgba(0, 240, 255, 0.2), 0 0 20px rgba(0, 150, 255, 0.3)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2.5s infinite ease-in-out',
        'float': 'float 4s infinite ease-in-out',
        'scanline': 'scanline 6s linear infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
        'monarch-aura': 'monarchAura 3s infinite alternate',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', filter: 'drop-shadow(0 0 15px rgba(0, 240, 255, 0.4))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 35px rgba(0, 240, 255, 0.8))' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        monarchAura: {
          '0%': { filter: 'drop-shadow(0 0 20px rgba(0, 240, 255, 0.5)) hue-rotate(0deg)' },
          '100%': { filter: 'drop-shadow(0 0 45px rgba(139, 92, 246, 0.8)) hue-rotate(45deg)' },
        }
      }
    },
  },
  plugins: [],
}
