/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');

module.exports = {
  darkMode: ["class"],
  content: [
    './src/pages/**/*.{js,jsx}',
    './src/components/**/*.{js,jsx}',
    './src/app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
    './index.html',
  ],
  prefix: "",
  safelist: [
    // Add specific classes that use opacity modifiers
    'bg-surface',
    'bg-opacity-90',
    'bg-opacity-80',
    'bg-opacity-40',
    'bg-opacity-30',
    'bg-opacity-20',
    'bg-opacity-10',
    'text-opacity-95',
    'text-opacity-80',
    'border-opacity-50',
    'border-opacity-30',
    'border-opacity-20',
    'shadow-black',
    {
      pattern: /bg-(primary|success|warning|error|muted|surface)\/\d+/,
      variants: ['hover', 'dark', 'dark:hover'],
    },
    {
      pattern: /border-(primary|success|warning|error|muted|surface)\/\d+/,
      variants: ['hover', 'dark', 'dark:hover'],
    },
    {
      pattern: /text-(primary|success|warning|error|muted|surface)\/\d+/,
      variants: ['hover', 'dark', 'dark:hover'],
    }
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "var(--color-border)", // gray-200
        input: "var(--color-input)", // white
        ring: "var(--color-ring)", // blue-800
        background: "var(--color-background)", // gray-50
        foreground: "var(--color-foreground)", // gray-800
        primary: {
          DEFAULT: "var(--color-primary)", // blue-800
          foreground: "var(--color-primary-foreground)", // white
        },
        secondary: {
          DEFAULT: "var(--color-secondary)", // orange-500
          foreground: "var(--color-secondary-foreground)", // white
        },
        destructive: {
          DEFAULT: "var(--color-destructive)", // red-600
          foreground: "var(--color-destructive-foreground)", // white
        },
        muted: {
          DEFAULT: "var(--color-muted)", // gray-100
          foreground: "var(--color-muted-foreground)", // gray-500
        },
        accent: {
          DEFAULT: "var(--color-accent)", // amber-600
          foreground: "var(--color-accent-foreground)", // white
        },
        popover: {
          DEFAULT: "var(--color-popover)", // white
          foreground: "var(--color-popover-foreground)", // gray-800
        },
        card: {
          DEFAULT: "var(--color-card)", // white
          foreground: "var(--color-card-foreground)", // gray-800
        },
        success: {
          DEFAULT: "var(--color-success)", // emerald-600
          foreground: "var(--color-success-foreground)", // white
        },
        warning: {
          DEFAULT: "var(--color-warning)", // amber-600
          foreground: "var(--color-warning-foreground)", // white
        },
        error: {
          DEFAULT: "var(--color-error)", // red-600
          foreground: "var(--color-error-foreground)", // white
        },
        // Cultural Brand Colors
        prosperity: {
          DEFAULT: "var(--color-prosperity)", // amber-500
          foreground: "var(--color-prosperity-foreground)", // gray-800
        },
        trust: {
          DEFAULT: "var(--color-trust)", // blue-800
          foreground: "var(--color-trust-foreground)", // white
        },
        growth: {
          DEFAULT: "var(--color-growth)", // orange-600
          foreground: "var(--color-growth-foreground)", // white
        },
        // Text Colors
        'text-primary': "var(--color-text-primary)", // gray-800
        'text-secondary': "var(--color-text-secondary)", // gray-500
        'text-muted': "var(--color-text-muted)", // gray-400
        // Surface Colors
        surface: {
          DEFAULT: "var(--color-surface)", // white
          secondary: "var(--color-surface-secondary)", // slate-50
          muted: "var(--color-surface-muted)", // slate-100
        },
      },
      borderRadius: {
        lg: "var(--radius-lg)", // 12px
        md: "var(--radius-md)", // 8px
        sm: "var(--radius-sm)", // 4px
        xl: "var(--radius-xl)", // 16px
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        accent: ['Playfair Display', 'Georgia', 'serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      spacing: {
        'xs': 'var(--spacing-xs)', // 4px
        'sm': 'var(--spacing-sm)', // 8px
        'md': 'var(--spacing-md)', // 16px
        'lg': 'var(--spacing-lg)', // 24px
        'xl': 'var(--spacing-xl)', // 32px
        '2xl': 'var(--spacing-2xl)', // 48px
      },
      boxShadow: {
        'sm': 'var(--shadow-sm)',
        'DEFAULT': 'var(--shadow-md)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
        'xl': 'var(--shadow-xl)',
        '2xl': 'var(--shadow-2xl)',
        'cultural': '0 10px 25px -5px rgba(30, 64, 175, 0.1), 0 4px 6px -2px rgba(245, 158, 11, 0.05)',
        'prosperity': '0 10px 25px -5px rgba(245, 158, 11, 0.15), 0 4px 6px -2px rgba(234, 88, 12, 0.1)',
        'trust': '0 10px 25px -5px rgba(30, 64, 175, 0.15), 0 4px 6px -2px rgba(30, 64, 175, 0.1)',
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-up": "slide-up 0.5s ease-out",
        "pulse-soft": "pulse-soft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "gradient": "gradient 8s ease infinite",
        "spin-slow": "spin 3s linear infinite",
        "bounce-soft": "bounce-soft 2s infinite",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.95", transform: "scale(1.02)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "gradient": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "bounce-soft": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
      },
      backgroundImage: {
        'gradient-cultural': 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-prosperity) 50%, var(--color-growth) 100%)',
        'gradient-prosperity': 'linear-gradient(135deg, var(--color-prosperity) 0%, var(--color-growth) 100%)',
        'gradient-trust': 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-trust) 100%)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      transitionDuration: {
        'fast': 'var(--animation-duration-fast)', // 150ms
        'normal': 'var(--animation-duration-normal)', // 300ms
        'slow': 'var(--animation-duration-slow)', // 500ms
      },
      transitionTimingFunction: {
        'ease': 'var(--animation-ease)', // cubic-bezier(0.25, 0.46, 0.45, 0.94)
        'spring': 'var(--animation-ease-spring)', // cubic-bezier(0.68, -0.55, 0.265, 1.55)
      },
      backdropBlur: {
        'xs': '2px',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    // Custom plugin to handle arbitrary opacity values with custom colors
    plugin(function({ addUtilities, matchUtilities, theme }) {
      // This will enable classes like `bg-surface/90` and similar opacity modifiers
      const opacityValues = {
        '5': '0.05',
        '10': '0.1',
        '20': '0.2',
        '30': '0.3',
        '40': '0.4',
        '50': '0.5',
        '60': '0.6',
        '70': '0.7',
        '80': '0.8',
        '90': '0.9',
        '95': '0.95',
      }
      
      const colors = theme('colors');
      
      Object.entries(colors).forEach(([colorName, colorValue]) => {
        if (typeof colorValue === 'string') {
          Object.entries(opacityValues).forEach(([opacityName, opacityValue]) => {
            addUtilities({
              [`.bg-${colorName}\\/${opacityName}`]: {
                backgroundColor: `color-mix(in srgb, ${colorValue} ${parseFloat(opacityValue) * 100}%, transparent)`
              },
              [`.text-${colorName}\\/${opacityName}`]: {
                color: `color-mix(in srgb, ${colorValue} ${parseFloat(opacityValue) * 100}%, transparent)`
              },
              [`.border-${colorName}\\/${opacityName}`]: {
                borderColor: `color-mix(in srgb, ${colorValue} ${parseFloat(opacityValue) * 100}%, transparent)`
              },
              [`.shadow-${colorName}\\/${opacityName}`]: {
                '--tw-shadow-color': `color-mix(in srgb, ${colorValue} ${parseFloat(opacityValue) * 100}%, transparent)`,
                '--tw-shadow': 'var(--tw-shadow-colored)'
              },
            })
          })
        }
      })
    }),
  ],
}