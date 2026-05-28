import type { Config } from "tailwindcss";

/**
 * Leets Design System
 * Brand: Practice > Achieve > Inspire
 * Primary: #EA553B (Leets Orange-Red)
 * Fonts: Barlow Condensed (display) + Sora (body)
 */

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#EA553B',
          light: '#FF6B4F',
          dark: '#D14028',
          50: '#FFF5F3',
          100: '#FFE8E4',
          500: '#EA553B',
          600: '#D14028',
          700: '#B53520',
        },
        secondary: {
          DEFAULT: '#F97316',
          50: '#FFF7ED',
          100: '#FFEDD5',
          500: '#F97316',
        },
        neutral: {
          white: '#FFFFFF',
          'off-white': '#F5F5F5',
          cream: '#E8E4DF',
          black: '#0A0A0A',
          dark: '#0F172A',
          'dark-alt': '#0A0F1E',
          charcoal: '#1E293B',
          gray: '#64748B',
          'gray-light': '#94A3B8',
        },
        zone: {
          padel: '#C85A2A',
          'padel-bg': '#F0EBE3',
          gym: '#1A1A1A',
          pool: '#3ABFBF',
          wellness: '#D4C4A8',
          kids: '#F28C38',
          fb: '#F5F0E8',
        },
        success: {
          DEFAULT: '#22C55E',
          light: 'rgba(34, 197, 94, 0.15)',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light: 'rgba(245, 158, 11, 0.15)',
        },
        error: {
          DEFAULT: '#EF4444',
          light: 'rgba(239, 68, 68, 0.12)',
        },
        info: {
          DEFAULT: '#3B82F6',
        },
        border: {
          DEFAULT: '#E2E8F0',
          dark: '#1E293B',
        },
      },
      fontFamily: {
        display: ['var(--font-barlow)', 'Barlow Condensed', 'system-ui', 'sans-serif'],
        body: ['var(--font-sora)', 'Sora', 'system-ui', 'sans-serif'],
        arabic: ['Noto Sans Arabic', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-2xl': ['clamp(48px, 8vw, 80px)', { lineHeight: '0.95', letterSpacing: '-0.02em' }],
        'display-xl': ['clamp(40px, 6vw, 64px)', { lineHeight: '0.95', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(32px, 4vw, 48px)', { lineHeight: '1', letterSpacing: '-0.01em' }],
        'h1': ['clamp(40px, 5vw, 72px)', { lineHeight: '0.95', letterSpacing: '-0.02em' }],
        'h2': ['clamp(32px, 4vw, 48px)', { lineHeight: '1', letterSpacing: '-0.01em' }],
        'h3': ['clamp(24px, 3vw, 36px)', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
        'h4': ['24px', { lineHeight: '1.2' }],
        'h5': ['20px', { lineHeight: '1.2' }],
        'h6': ['18px', { lineHeight: '1.3' }],
        'body-lg': ['18px', { lineHeight: '1.6' }],
        'body-md': ['16px', { lineHeight: '1.6' }],
        'body-sm': ['14px', { lineHeight: '1.5' }],
        'body-xs': ['12px', { lineHeight: '1.5' }],
        'caption': ['14px', { lineHeight: '1.5', letterSpacing: '0.02em' }],
        'label': ['11px', { lineHeight: '1.4', letterSpacing: '0.12em' }],
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
        '20': '80px',
        '24': '96px',
        '32': '128px',
      },
      borderRadius: {
        'none': '0px',
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(15, 23, 42, 0.06)',
        'md': '0 4px 12px rgba(15, 23, 42, 0.08)',
        'lg': '0 10px 30px rgba(15, 23, 42, 0.12)',
        'xl': '0 20px 60px rgba(15, 23, 42, 0.16)',
        'brand': '0 4px 24px rgba(234, 85, 59, 0.35)',
        'brand-lg': '0 8px 40px rgba(234, 85, 59, 0.45)',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'out': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      transitionDuration: {
        'fast': '150ms',
        'base': '200ms',
        'slow': '300ms',
        'slower': '500ms',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
