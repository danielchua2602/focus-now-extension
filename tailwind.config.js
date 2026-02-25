/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './src/**/*.html'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          light: 'hsl(193, 65%, 78%)',
          DEFAULT: 'hsl(193, 65%, 68%)',
          dark: 'hsl(193, 65%, 58%)',
        },
        secondary: {
          light: 'hsl(163, 65%, 78%)',
          DEFAULT: 'hsl(163, 65%, 68%)',
          dark: 'hsl(163, 65%, 58%)',
        },
        accent: {
          light: 'hsl(230, 65%, 78%)',
          DEFAULT: 'hsl(230, 65%, 68%)',
          dark: 'hsl(230, 65%, 58%)',
        },

        // Semantic colors
        success: {
          light: 'hsl(142, 71%, 65%)',
          DEFAULT: 'hsl(142, 71%, 45%)', // Green
          dark: 'hsl(142, 71%, 35%)',
        },
        error: {
          light: 'hsl(0, 84%, 70%)',
          DEFAULT: 'hsl(0, 84%, 60%)', // Red
          dark: 'hsl(0, 84%, 50%)',
        },
        warning: {
          light: 'hsl(38, 92%, 65%)',
          DEFAULT: 'hsl(38, 92%, 50%)', // Amber/Orange
          dark: 'hsl(38, 92%, 40%)',
        },
        info: {
          light: 'hsl(199, 89%, 58%)',
          DEFAULT: 'hsl(199, 89%, 48%)', // Blue
          dark: 'hsl(199, 89%, 38%)',
        },

        background: 'hsl(var(--color-background) / <alpha-value>)',
        surface: 'hsl(var(--color-surface) / <alpha-value>)',
        border: 'hsl(var(--color-border) / <alpha-value>)',

        text: {
          primary: 'hsl(var(--color-text-primary) / <alpha-value>)',
          secondary: 'hsl(var(--color-text-secondary) / <alpha-value>)',
          muted: 'hsl(var(--color-text-muted) / <alpha-value>)',
        },
      },
    },
  },
  plugins: [],
};
