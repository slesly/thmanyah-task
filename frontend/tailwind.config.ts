import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'ibm-plex-sans-arabic': ['IBM Plex Sans Arabic', 'Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
        'gt-america': ['"GT America Expanded Bold"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        'sf-mono': ['"SFMono-Regular"', 'Consolas', '"Liberation Mono"', 'Menlo', 'Courier', 'monospace'],
      },
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        // Light theme colors
        light: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
        accent: {
          cyan: '#0891b2',
          blue: '#2563eb',
          orange: '#ea580c',
          yellow: '#ca8a04',
          green: '#16a34a',
          pink: '#db2777',
          purple: '#7c3aed',
          violet: '#9333ea',
        },
        border: '#e5e7eb',
        background: '#ffffff',
        foreground: '#111827',
        muted: '#6b7280',
        card: '#ffffff',
        'card-foreground': '#111827',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(to bottom right, #3b82f6, #1d4ed8)',
        'gradient-secondary': 'linear-gradient(to bottom right, #6366f1, #4f46e5)',
        'gradient-accent': 'linear-gradient(to bottom right, #0891b2, #0e7490)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'gradient': 'gradientBG 5s infinite',
        'spin-slow': 'spin 750ms infinite linear',
      },
      keyframes: {
        gradientBG: {
          '0%': { background: '#db2777' },
          '10%': { background: '#be185d' },
          '20%': { background: '#ea580c' },
          '30%': { background: '#ca8a04' },
          '40%': { background: '#16a34a' },
          '50%': { background: '#0891b2' },
          '60%': { background: '#2563eb' },
          '70%': { background: '#6366f1' },
          '80%': { background: '#7c3aed' },
          '90%': { background: '#9333ea' },
          '100%': { background: '#db2777' },
        },
      },
    },
  },
  plugins: [
    function({ addUtilities }: any) {
      const newUtilities = {
        '.rtl': {
          direction: 'rtl',
        },
        '.ltr': {
          direction: 'ltr',
        },
        '.space-x-reverse': {
          '--tw-space-x-reverse': '1',
        },
        '.space-y-reverse': {
          '--tw-space-y-reverse': '1',
        },
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        '.line-clamp-1': {
          overflow: 'hidden',
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '1',
        },
        '.line-clamp-2': {
          overflow: 'hidden',
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '2',
        },
        '.line-clamp-3': {
          overflow: 'hidden',
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '3',
        },
      }
      addUtilities(newUtilities)
    }
  ],
}
export default config 