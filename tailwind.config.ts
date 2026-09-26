import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0F172A',
        muted: '#64748B',
        paper: '#F8FAFC',
        line: '#E2E8F0',
        brand: { DEFAULT: '#2563EB', dark: '#1D4ED8', soft: '#EFF6FF' },
        amber: { DEFAULT: '#F59E0B', dark: '#D97706', soft: '#FFFBEB' },
        success: { DEFAULT: '#10B981', dark: '#059669', soft: '#ECFDF5' },
        danger: { DEFAULT: '#EF4444', dark: '#DC2626', soft: '#FEF2F2' },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        label: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.03)',
        card: '0 1px 3px rgba(15, 23, 42, 0.04), 0 4px 16px -2px rgba(15, 23, 42, 0.05)',
        safe: '0 0 0 1px #A7F3D0, 0 8px 24px -4px rgba(16, 185, 129, 0.08)',
        caution: '0 0 0 1px #FDE68A, 0 8px 24px -4px rgba(245, 158, 11, 0.12)',
        critical: '0 0 0 1px #FECACA, 0 8px 24px -4px rgba(239, 68, 68, 0.12)',
      },
      borderRadius: { '3xl': '1.5rem' },
    },
  },
  plugins: [],
} satisfies Config
