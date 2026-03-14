'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  children?: ReactNode;
}

export function EmptyState({ title, description, action, children }: EmptyStateProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-2xl font-semibold text-gray-900 mb-3">{title}</h3>
      {description && (
        <p className="text-gray-600 max-w-md mb-6 text-lg" style={{ marginTop: '10px' }}>
          {description}
        </p>
      )}
      {action && (
        <motion.button
          onClick={action.onClick}
          className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {action.label}
        </motion.button>
      )}
      {children}
    </motion.div>
  );
}

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  onGoBack?: () => void;
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
  onGoBack,
}: ErrorStateProps) {
  return (
    <motion.div
      className="rounded-lg border border-red-200 bg-red-50 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex gap-4">
        <motion.div
          className="flex-shrink-0 text-3xl"
          initial={{ rotate: -180, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        >
          ⚠️
        </motion.div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-red-900 mb-2">{title}</h3>
          <p className="text-red-700 mb-4">{message}</p>
          <div className="flex gap-3 flex-wrap">
            {onRetry && (
              <motion.button
                onClick={onRetry}
                className="inline-flex items-center px-4 py-2 rounded-md bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Try Again
              </motion.button>
            )}
            {onGoBack && (
              <motion.button
                onClick={onGoBack}
                className="inline-flex items-center px-4 py-2 rounded-md bg-white border border-red-300 text-red-700 text-sm font-medium hover:bg-red-50 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Go Back
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
