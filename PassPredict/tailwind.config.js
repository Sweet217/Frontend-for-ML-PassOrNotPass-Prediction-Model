/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      scrollSnapType: {
        x: 'x mandatory',
        y: 'y mandatory',
        both: 'both mandatory',
        none: 'none',
      },
      scrollSnapAlign: {
        start: 'start',
        center: 'center',
        end: 'end',
      },
      scrollSnapStop: {
        always: 'always',
        normal: 'normal',
      },
      colors: {
        'custom-bg': '#101121', 
      },
      fontFamily: {
        'super-funky': ['Super Funky', 'sans-serif'],
      },
    },
    plugins: [
      require('@tailwindcss/forms'),
      require('@tailwindcss/typography'),
      require('@tailwindcss/aspect-ratio'),
      require('@tailwindcss/line-clamp'),
    ],
  }
}