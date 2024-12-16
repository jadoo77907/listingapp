/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B82F6',
          dark: '#60A5FA',
        },
        background: {
          light: '#FFFFFF',
          dark: '#121212',
        },
        surface: {
          light: '#F3F4F6',
          dark: '#1E1E1E',
        },
        text: {
          light: '#1F2937',
          dark: '#E5E7EB',
        },
        border: {
          light: '#E5E7EB',
          dark: '#374151',
        },
      },
    },
  },
  plugins: [],
}

