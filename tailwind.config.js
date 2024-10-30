/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'prussian_blue': {
          DEFAULT: '#13293d',
          100: '#04080c',
          200: '#081119',
          300: '#0c1925',
          400: '#0f2132',
          500: '#13293d',
          600: '#275580',
          700: '#3b81c2',
          800: '#7cabd7',
          900: '#bdd5eb'
        },
        'celadon': {
          DEFAULT: '#b3e9c7',
          100: '#134023',
          200: '#258047',
          300: '#38c06a',
          400: '#74d798',
          500: '#b3e9c7',
          600: '#c3eed3',
          700: '#d2f2de',
          800: '#e1f6e9',
          900: '#f0fbf4'
        },
        'sunglow': {
          DEFAULT: '#ffcb47',
          100: '#412f00',
          200: '#835e00',
          300: '#c48c00',
          400: '#ffb806',
          500: '#ffcb47',
          600: '#ffd56c',
          700: '#ffe091',
          800: '#ffeab6',
          900: '#fff5da'
        },
        'celestial_blue': {
          DEFAULT: '#1b98e0',
          100: '#051e2c',
          200: '#0b3c59',
          300: '#105b85',
          400: '#1679b2',
          500: '#1b98e0',
          600: '#46ade8',
          700: '#74c1ee',
          800: '#a2d6f4',
          900: '#d1eaf9'
        },
        'alice_blue': {
          DEFAULT: '#f4faff',
          100: '#003764',
          200: '#006ec8',
          300: '#2da0ff',
          400: '#91cdff',
          500: '#f4faff',
          600: '#f7fbff',
          700: '#f9fcff',
          800: '#fbfdff',
          900: '#fdfeff'
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ],
}
