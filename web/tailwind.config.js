/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB',
          light: '#60A5FA',
          dark: '#1E40AF',
        },
        secondary: '#8B5CF6',
        background: '#F1F5F9',
        backgroundCard: '#FFFFFF',
        backgroundLight: '#F8FAFC',
        text: {
          DEFAULT: '#1E293B',
          secondary: '#64748B',
          light: '#94A3B8',
        },
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
        border: '#E2E8F0',
        borderLight: '#F1F5F9',
        disabled: '#CBD5E1',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.1)',
        md: '0 2px 4px rgba(0, 0, 0, 0.15)',
        lg: '0 4px 8px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
}

