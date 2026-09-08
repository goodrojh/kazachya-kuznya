/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0B0B0C',
        coal: '#111113',
        steel: '#1A1A1E',
        smoke: '#25252B',
        bone: '#F2F0EC',
        ash: '#94908A',
        brass: {
          DEFAULT: '#C8A25C',
          light: '#E0C182',
          dark: '#8E6F35',
        },
      },
      fontFamily: {
        display: ['Oswald', 'Impact', 'sans-serif'],
        sans: ['Manrope', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.16, 1, 0.3, 1)',
        drawer: 'cubic-bezier(0.76, 0, 0.24, 1)',
      },
    },
  },
  plugins: [],
}
