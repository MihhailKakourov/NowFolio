/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gruvbox: {
          bg: '#282828',
          bg1: '#3c3836',
          bg2: '#504945',
          bg3: '#665c54',
          bg4: '#7c6f64',
          fg0: '#fbf1c7',
          fg: '#ebdbb2',
          fg4: '#a89984',
          red: '#cc241d',
          redLight: '#fb4934',
          green: '#98971a',
          greenLight: '#b8bb26',
          yellow: '#d79921',
          yellowLight: '#fabd2f',
          blue: '#458588',
          blueLight: '#83a598',
          purple: '#b16286',
          purpleLight: '#d3869b',
          aqua: '#689d6a',
          aquaLight: '#8ec07c',
          orange: '#d65d0e',
          orangeLight: '#fe8019',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}