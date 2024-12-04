const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        tall: {
          raw: '(min-height: 933px)'
        }
      },
      borderRadius: {
        xl: 'calc(var(--radius) * 4.5)',
        lg: 'calc(var(--radius) * 2)',
        md: 'var(--radius)',
        sm: 'calc(var(--radius) / 2)'
      },
      fontSize: {
        xs: '12px',
        sm: '13px',
        base: '14px',
        lg: '16px',
        xl: '18px',
        '2xl': '20px',
        '3xl': '24px',
        '4xl': '30px',
        '5xl': '36px',
        '6xl': '40px',
        '7xl': '48px'
      },
      lineHeight: {
        xs: '16px',
        sm: '18px',
        base: '20px',
        lg: '24px',
        xl: '28px',
        '2xl': '32px',
        '3xl': '36px',
        '4xl': '40px',
        '5xl': '48px',
        '6xl': '56px',
        '7xl': '56px'
      },
      fontWeight: {
        semibold: '600',
        normal: '400',
        medium: '500'
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        muted: 'hsl(var(--muted))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
        card: 'hsl(var(--card))',
        'card-foreground': 'hsl(var(--card-foreground))',
        popover: 'hsl(var(--popover))',
        'popover-foreground': 'hsl(var(--popover-foreground))',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        primary: 'rgb(var(--primary))',
        'primary-foreground': 'hsl(var(--primary-foreground))',
        secondary: 'hsl(var(--secondary))',
        'secondary-foreground': 'hsl(var(--secondary-foreground))',
        accent: 'hsl(var(--accent))',
        'accent-foreground': 'hsl(var(--accent-foreground))',
        destructive: 'rgb(var(--destructive))',
        'destructive-foreground': 'hsl(var(--destructive-foreground))',
        ring: 'hsl(var(--ring))',
        'basic-black': 'rgb(var(--basic-black))',
        'basic-blue': 'rgb(var(--basic-blue))',
        'basic-white': 'rgb(var(--basic-white))',
        'basic-grey': 'rgb(var(--basic-grey))',
        'brand-900': 'rgb(var(--brand-900))',
        'brand-800': 'rgb(var(--brand-800))',
        'brand-700': 'rgb(var(--brand-700))',
        'brand-600': 'rgb(var(--brand-600))',
        'brand-500': 'rgb(var(--brand-500))',
        'brand-400': 'rgb(var(--brand-400))',
        'brand-300': 'rgb(var(--brand-300))',
        'brand-200': 'rgb(var(--brand-200))',
        'brand-100': 'rgb(var(--brand-100))',
        'brand-00': 'rgb(var(--brand-00))',
        'neutral-divider': 'rgb(var(--neutral-divider))',
        'neutral-900': 'rgb(var(--neutral-900))',
        'neutral-800': 'rgb(var(--neutral-800))',
        'neutral-700': 'rgb(var(--neutral-700))',
        'neutral-600': 'rgb(var(--neutral-600))',
        'neutral-500': 'rgb(var(--neutral-500))',
        'neutral-400': 'rgb(var(--neutral-400))',
        'neutral-300': 'rgb(var(--neutral-300))',
        'neutral-200': 'rgb(var(--neutral-200))',
        'neutral-100': 'rgb(var(--neutral-100))',
        'neutral-50': 'rgb(var(--neutral-50))',
        'status-danger-300': 'rgb(var(--status-danger-300))',
        'status-danger-200': 'rgb(var(--status-danger-200))',
        'status-danger-100': 'rgb(var(--status-danger-100))',
        'status-warning-300': 'rgb(var(--status-warning-300))',
        'status-warning-200': 'rgb(var(--status-warning-200))',
        'status-warning-100': 'rgb(var(--status-warning-100))',
        'status-success-300': 'rgb(var(--status-success-300))',
        'status-success-200': 'rgb(var(--status-success-200))',
        'status-success-100': 'rgb(var(--status-success-100))',
        'other-purple': 'rgb(var(--other-purple))',
        'other-purple-10': 'rgba(var(--other-purple-10))',
        'other-red': 'rgb(var(--other-red))',
        'other-red-10': 'rgba(var(--other-red-10))',
        'other-orange': 'rgb(var(--other-orange))',
        'other-orange-10': 'rgba(var(--other-orange-10))',
        'other-blue': 'rgb(var(--other-blue))',
        'other-blue-10': 'rgba(var(--other-blue-10))',
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))'
        }
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
}

