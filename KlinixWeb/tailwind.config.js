/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"

  ],
  theme: {
    extend: {
      colors: {
        brandFrom: 'rgb(var(--klinix-from) / <alpha-value>)',
        brandTo: 'rgb(var(--klinix-to) / <alpha-value>)',
      },
    },
  },
  plugins: [],
}

