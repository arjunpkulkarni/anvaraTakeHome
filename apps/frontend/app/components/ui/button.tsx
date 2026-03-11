'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', fullWidth = false, className = '', children, disabled, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

    const variants = {
      primary: 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]',
      secondary:
        'border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-background-secondary)]',
      ghost: 'text-[var(--color-text-secondary)] hover:bg-[var(--color-background-secondary)]',
      danger: 'bg-[var(--color-error)] text-white hover:bg-red-600',
      dark: 'bg-zinc-950 text-white hover:bg-zinc-800',
    };

    const sizes = {
      sm: 'text-sm px-3 py-1.5 rounded-md',
      md: 'text-base px-4 py-2 rounded-lg',
      lg: 'text-lg px-6 py-3 rounded-lg',
    };

    const widthClass = fullWidth ? 'w-full' : '';

    return (
      <motion.button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
        disabled={disabled}
        whileTap={disabled ? undefined : { scale: 0.95 }}
        transition={{ duration: 0.1 }}
        {...(props as HTMLMotionProps<'button'>)}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
