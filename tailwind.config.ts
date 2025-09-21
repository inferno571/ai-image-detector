import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#0D0E2B', // Deep blue
        'brand-secondary': 'rgba(26, 27, 58, 0.5)', // Semi-transparent for glass effect
        'brand-accent': '#00F5D4', // Bright cyan/teal
        'brand-accent-dark': '#00BFA5',
        'brand-text': '#E0E0FF',
        'brand-subtle': '#A0A0C0',
        'glass-border': 'rgba(255, 255, 255, 0.1)',
      },
      backgroundImage: {
        'gradient-main': 'linear-gradient(135deg, #0D0E2B 0%, #1A0A3A 100%)',
        'gradient-radial-glow': 'radial-gradient(circle at center, rgba(0, 245, 212, 0.1) 0%, rgba(0, 245, 212, 0) 70%)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glow': '0 0 20px 5px rgba(0, 245, 212, 0.2)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px 5px rgba(0, 245, 212, 0.2)' },
          '50%': { boxShadow: '0 0 30px 10px rgba(0, 245, 212, 0.4)' },
        },
        fadeInUp: {
            '0%': { opacity: '0', transform: 'translateY(20px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        pulseGlow: 'pulseGlow 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        fadeInUp: 'fadeInUp 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
} satisfies Config
