/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,ts,jsx,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        'custom-black': '#0E1113',
      },
    },
  },
  plugins: [
    "@tailwindcss/postcss"
  ],
}

