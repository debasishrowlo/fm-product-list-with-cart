import type { Config } from 'tailwindcss'

const pxToRem = (px:number, base = 16) => {
  return px / base
}

const generateFontSize = () => {
  const min = 12
  const max = 100
  const fontSize:{
    [key:string]: string,
  } = {}

  for (let i = min; i <= max; i += 2) {
    fontSize[i] = pxToRem(i) + "rem"
  }

  return fontSize
}

const generateBorderRadius = () => {
  const max = 24
  const borderRadius:{
    [key:string]: string,
  } = {}

  for (let i = 0; i <= max; i += 2) {
    borderRadius[i] = pxToRem(i) + "rem"
  }
  borderRadius["full"] = "9999px"

  return borderRadius
}

const generateSpacing = () => {
  const max = 5000
  const spacing:{
    [key:string]: string,
  } = {}

  for (let i = 0; i <= max; i++) {
    spacing[i] = pxToRem(i) + "rem"
  }

  return spacing
}

export default {
  future: {
    hoverOnlyWhenSupported: true,
  },
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    borderRadius: generateBorderRadius(),
    fontSize: generateFontSize(),
    spacing: generateSpacing(),
    extend: {
      fontFamily: {
        "sans": ['"Red Hat Text", sans-serif'],
      },
      colors: {
        red: {
          100: "#C73B0F",
          200: "#952c0b",
        },
        rose: {
          50: "#FCF8F6",
          100: "#F5EEEC",
          300: "#CAAFA7",
          400: "#AD8A85",
          500: "#87635A",
          900: "#260F08",
        },
        green: "#1EA575",
      },
      transitionDuration: {
        DEFAULT: "300ms",
      },
    },
  },
  plugins: [],
} satisfies Config