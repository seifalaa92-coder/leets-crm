import type { Config } from "tailwindcss";

/**
 * Leets Design System Configuration
 * Brand: PRACTICE > ACHIEVE > INSPIRE
 * Primary: #E8461A (Leets Orange-Red)
 * Fonts: Bebas Neue (display) + Inter (body)
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
        // Nike-inspired Brand Colors
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
        // Nike Neutral Colors
        neutral: {
          white: '#FFFFFF',
          'off-white': '#F5F5F5',
          cream: '#E5E5E5',
          black: '#000000',
          dark: '#111111',
          charcoal: '#2D2D2D',
        },
        // Zone Colors
        zone: {
          padel: '#C85A2A',
          'padel-bg': '#F0EBE3',
          gym: '#1A1A1A',
          pool: '#3ABFBF',
          wellness: '#D4C4A8',
          kids: '#F28C38',
          fb: '#F5F0E8',
        },
        // Semantic Colors
        success: {
          DEFAULT: '#2ECC71',
          light: 'rgba(46, 204, 113, 0.15)',
        },
        warning: {
          DEFAULT: '#F39C12',
          light: 'rgba(243, 156, 18, 0.15)',
        },
        error: {
          DEFAULT: '#E74C3C',
          light: 'rgba(231, 76, 60, 0.12)',
        },
        info: {
          DEFAULT: '#3498DB',
        },
        // Utility
        border: {
          DEFAULT: '#E0D9CF',
          dark: '#3A3A3A',
        },
      },
      fontFamily: {
        sans: ['Bebas Neue', 'sans-serif'],
        display: ['Bebas Neue', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        arabic: ['Noto Sans Arabic', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Display - Extra large headlines matching M3 Academy style
        'display-2xl': ['clamp(48px, 8vw, 80px)', { lineHeight: '0.95', letterSpacing: '0.02em' }],
        'display-xl': ['clamp(40px, 6vw, 64px)', { lineHeight: '0.95', letterSpacing: '0.02em' }],
        'display-lg': ['clamp(32px, 4vw, 48px)', { lineHeight: '1', letterSpacing: '0.01em' }],
        // Headings - Bold condensed uppercase style
        'h1': ['clamp(40px, 5vw, 72px)', { lineHeight: '0.95', letterSpacing: '0.02em' }],
        'h2': ['clamp(32px, 4vw, 48px)', { lineHeight: '1', letterSpacing: '0.02em' }],
        'h3': ['clamp(24px, 3vw, 36px)', { lineHeight: '1.1', letterSpacing: '0.02em' }],
        'h4': ['24px', { lineHeight: '1.2', letterSpacing: '0.01em' }],
        'h5': ['20px', { lineHeight: '1.2', letterSpacing: '0.01em' }],
        'h6': ['18px', { lineHeight: '1.3' }],
        // Body text - Clean and readable
        'body-lg': ['18px', { lineHeight: '1.6' }],
        'body-md': ['16px', { lineHeight: '1.6' }],
        'body-sm': ['14px', { lineHeight: '1.5' }],
        'body-xs': ['12px', { lineHeight: '1.5' }],
        // Small text/captions
        'caption': ['14px', { lineHeight: '1.5', letterSpacing: '0.02em' }],
        'label': ['11px', { lineHeight: '1.4', letterSpacing: '0.1em' }],
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
        'sm': '0 1px 3px rgba(0,0,0,0.10), 0 1px 2px rgba(0,0,0,0.06)',
        'md': '0 4px 12px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.08)',
        'lg': '0 10px 30px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.10)',
        'xl': '0 20px 60px rgba(0,0,0,0.20), 0 8px 24px rgba(0,0,0,0.12)',
        'brand': '0 4px 20px rgba(232, 70, 26, 0.35)',
        'brand-lg': '0 8px 40px rgba(232, 70, 26, 0.45)',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'bounce-subtle': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      transitionDuration: {
        'fast': '150ms',
        'base': '200ms',
        'slow': '300ms',
        'slower': '500ms',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in': 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
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
