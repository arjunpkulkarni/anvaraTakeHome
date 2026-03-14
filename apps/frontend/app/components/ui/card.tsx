'use client';

import { HTMLAttributes, forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface CardProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag'
> {
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  animate?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ hover = false, padding = 'md', animate = false, className = '', children, ...props }, ref) => {
    const baseStyles =
      'bg-white border border-[var(--color-border)] rounded-lg shadow-[var(--shadow-sm)] transition-shadow duration-200';

    const paddingStyles = {
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
    };

    if (animate || hover) {
      return (
        <motion.div
          ref={ref}
          className={`${baseStyles} ${paddingStyles[padding]} ${className}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
          whileHover={
            hover
              ? {
                  y: -4,
                  boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                  transition: { duration: 0.2 },
                }
              : undefined
          }
          whileTap={hover ? { scale: 0.98 } : undefined}
          {...(props as HTMLMotionProps<'div'>)}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <div ref={ref} className={`${baseStyles} ${paddingStyles[padding]} ${className}`} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = ({
  className = '',
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={`mb-4 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle = ({
  className = '',
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={`text-xl font-semibold text-[var(--color-text-primary)] ${className}`} {...props}>
    {children}
  </h3>
);

export const CardDescription = ({
  className = '',
  children,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) => (
  <p className={`text-sm text-[var(--color-text-secondary)] ${className}`} {...props}>
    {children}
  </p>
);

export const CardContent = ({
  className = '',
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={`${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter = ({
  className = '',
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={`mt-4 flex items-center gap-2 ${className}`} {...props}>
    {children}
  </div>
);
