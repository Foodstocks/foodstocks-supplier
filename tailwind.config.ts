import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#FFF1F2',
          100: '#FFE0E1',
          200: '#FFBFC2',
          300: '#FF8D91',
          400: '#FF4F55',
          500: '#E8161A',
          600: '#C91318',
          700: '#A50F12',
          800: '#880C0F',
          900: '#710A0D',
        },
        sidebar: '#0F1117',
      },
      fontFamily: {
        heading: ['Plus Jakarta Sans', 'sans-serif'],
        body:    ['Inter', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '8px',
        sm: '6px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '20px',
      },
      boxShadow: {
        xs:  '0 1px 2px rgba(0,0,0,0.04)',
        sm:  '0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.05)',
        md:  '0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.05)',
        lg:  '0 8px 24px rgba(0,0,0,0.10), 0 4px 8px rgba(0,0,0,0.06)',
        xl:  '0 20px 40px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.08)',
        brand: '0 4px 14px rgba(232,22,26,0.30)',
      },
    },
  },
  plugins: [],
}

export default config
