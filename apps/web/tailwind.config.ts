import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef3f8',
          100: '#d5e1ed',
          200: '#aec4db',
          300: '#7da0c4',
          400: '#4d7dae',
          500: '#1e3a5f',
          600: '#1a3354',
          700: '#162c49',
          800: '#11223a',
          900: '#0d1a2d',
        },
      },
    },
  },
  plugins: [],
};
export default config;
