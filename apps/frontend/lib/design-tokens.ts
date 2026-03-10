/**
 * Design System Tokens
 * 
 * A minimal, cohesive design system for a modern SaaS product.
 * Based on clean, professional aesthetics inspired by Stripe, Linear, and Vercel.
 */

export const colors = {
  // Primary - Used for CTAs and interactive elements
  primary: {
    DEFAULT: '#2563EB', // Blue
    hover: '#1D4ED8',
    light: '#3B82F6',
  },

  // Neutrals - Backgrounds and text
  neutral: {
    white: '#FFFFFF',
    background: '#FFFFFF',
    backgroundSecondary: '#F9FAFB',
    border: '#E5E7EB',
    borderLight: '#F3F4F6',
    textPrimary: '#111827',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',
  },

  // Accent - Success states
  accent: '#10B981',

  // Status colors (minimal set)
  status: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
  },
} as const;

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '32px',
  '3xl': '48px',
  '4xl': '64px',
} as const;

export const typography = {
  fontFamily: {
    sans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },

  fontSize: {
    // Body text
    body: '16px',
    bodySmall: '14px',
    bodyTiny: '12px',

    // Headings
    h1: '48px',
    h2: '32px',
    h3: '24px',
    h4: '20px',
  },

  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

export const borderRadius = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  full: '9999px',
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
} as const;

export const layout = {
  containerMaxWidth: '1200px',
  sectionSpacing: '80px',
  navHeight: '64px',
} as const;
