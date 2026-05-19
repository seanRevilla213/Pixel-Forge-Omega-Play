/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '320px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        'ultrawide': '1920px',
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        accent: ['Plus Jakarta Sans', 'sans-serif'],
      },
      colors: {
        'matte-black': '#08080A',
        'midnight': '#0F172A',
        'luxury-violet': '#7C3AED',
        'luxury-cyan': '#06B6D4',
        'glass-silver': 'rgba(255, 255, 255, 0.05)',
        'glass-border': 'rgba(255, 255, 255, 0.1)',
        'text-primary': '#FFFFFF',
        'text-secondary': '#94A3B8',
        'text-muted': '#475569',
      },
      fontSize: {
        'fluid-h1': 'clamp(3.5rem, 10vw, 8.5rem)',
        'fluid-h2': 'clamp(2.5rem, 7vw, 4rem)',
        'fluid-body': 'clamp(0.9rem, 2vw, 1.15rem)',
      }
    },
  },
  plugins: [],
}
