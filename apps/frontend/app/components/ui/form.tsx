'use client';

import { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, forwardRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, label, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const [isFocused, setIsFocused] = useState(false);

    return (
      <div className="space-y-1">
        {label && (
          <motion.label 
            htmlFor={inputId} 
            className="block text-sm font-medium text-[var(--color-text-primary)]"
            animate={{ 
              color: isFocused ? 'var(--color-primary)' : 'var(--color-text-primary)',
              scale: isFocused ? 1.02 : 1,
            }}
            transition={{ duration: 0.2 }}
          >
            {label}
            {props.required && <span className="text-[var(--color-error)] ml-1">*</span>}
          </motion.label>
        )}
        <motion.input
          ref={ref}
          id={inputId}
          className={`w-full px-3 py-2 text-base border rounded-lg bg-white transition-all duration-200 
            ${
              error
                ? 'border-[var(--color-error)] focus:border-[var(--color-error)] focus:ring-[var(--color-error)]'
                : 'border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]'
            }
            focus:outline-none focus:ring-2 focus:ring-opacity-50
            disabled:bg-[var(--color-background-secondary)] disabled:cursor-not-allowed
            ${className}`}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          whileFocus={{ scale: 1.01 }}
          transition={{ duration: 0.15 }}
          {...props}
        />
        <AnimatePresence>
          {error && (
            <motion.p 
              className="text-sm text-[var(--color-error)]"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Input.displayName = 'Input';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error, label, className = '', id, rows = 3, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const [isFocused, setIsFocused] = useState(false);

    return (
      <div className="space-y-1">
        {label && (
          <motion.label 
            htmlFor={textareaId} 
            className="block text-sm font-medium text-[var(--color-text-primary)]"
            animate={{ 
              color: isFocused ? 'var(--color-primary)' : 'var(--color-text-primary)',
              scale: isFocused ? 1.02 : 1,
            }}
            transition={{ duration: 0.2 }}
          >
            {label}
            {props.required && <span className="text-[var(--color-error)] ml-1">*</span>}
          </motion.label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={`w-full px-3 py-2 text-base border rounded-lg bg-white transition-all duration-200 resize-vertical
            ${
              error
                ? 'border-[var(--color-error)] focus:border-[var(--color-error)] focus:ring-[var(--color-error)]'
                : 'border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]'
            }
            focus:outline-none focus:ring-2 focus:ring-opacity-50
            disabled:bg-[var(--color-background-secondary)] disabled:cursor-not-allowed
            ${className}`}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        />
        <AnimatePresence>
          {error && (
            <motion.p 
              className="text-sm text-[var(--color-error)]"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  label?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ error, label, className = '', id, children, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const [isFocused, setIsFocused] = useState(false);

    return (
      <div className="space-y-1">
        {label && (
          <motion.label 
            htmlFor={selectId} 
            className="block text-sm font-medium text-[var(--color-text-primary)]"
            animate={{ 
              color: isFocused ? 'var(--color-primary)' : 'var(--color-text-primary)',
              scale: isFocused ? 1.02 : 1,
            }}
            transition={{ duration: 0.2 }}
          >
            {label}
            {props.required && <span className="text-[var(--color-error)] ml-1">*</span>}
          </motion.label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={`w-full px-3 py-2 text-base border rounded-lg bg-white transition-all duration-200
            ${
              error
                ? 'border-[var(--color-error)] focus:border-[var(--color-error)] focus:ring-[var(--color-error)]'
                : 'border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]'
            }
            focus:outline-none focus:ring-2 focus:ring-opacity-50
            disabled:bg-[var(--color-background-secondary)] disabled:cursor-not-allowed
            ${className}`}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        >
          {children}
        </select>
        <AnimatePresence>
          {error && (
            <motion.p 
              className="text-sm text-[var(--color-error)]"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Select.displayName = 'Select';

export const FormError = ({ error }: { error?: string }) => {
  return (
    <AnimatePresence>
      {error && (
        <motion.div 
          className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-[var(--color-error)]"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {error}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
