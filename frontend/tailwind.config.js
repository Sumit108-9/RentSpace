/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1D9E75',
        dark: '#085041',
        light: '#E1F5EE',
        background: '#FAFAF8',
        white: '#FFFFFF',
        border: '#E8E6DF',
        text: '#2C2C2A',
        muted: '#888780',
        section: '#F5F4F0',
        success: '#1D9E75',
        error: '#C4575A',
        warning: '#C49A57',
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      borderRadius: {
        'small': '6px',
        'card': '10px',
        'hero': '16px',
      },
      borderWidth: {
        '0.5': '0.5px',
      },
      animation: {
        'fade-in': 'fadeIn 0.15s ease-in-out',
        'slide-up': 'slideUp 0.15s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
