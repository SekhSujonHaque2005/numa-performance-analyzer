export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Times New Roman"', 'Times', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
      },
      colors: {
        scholar: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        dark: {
          bg: '#000000',
          surface: '#0a0a0a',
          border: '#1a1a1a',
          accent: '#00f0ff',
          secondary: '#bf00ff',
        }
      },
    },
  },
  plugins: [],
}
