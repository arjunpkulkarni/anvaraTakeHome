'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { toastAnimation } from '@/lib/animations';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = { id, message, type };
    
    setToasts((prev) => [...prev, newToast]);
    
    // Auto dismiss after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        style={{
          position: 'fixed',
          top: '16px',
          right: '16px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          pointerEvents: 'none',
        }}
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

interface ToastItemProps {
  toast: Toast;
  onDismiss: () => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const styles = getToastStyles(toast.type);
  
  return (
    <motion.div
      variants={toastAnimation}
      initial="initial"
      animate="animate"
      exit="exit"
      layout
      style={{
        ...styles,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        minWidth: '300px',
        maxWidth: '500px',
        pointerEvents: 'auto',
        cursor: 'pointer',
      }}
      onClick={onDismiss}
    >
      <div style={{ fontSize: '20px' }}>
        {getToastIcon(toast.type)}
      </div>
      <div style={{ flex: 1, fontSize: '14px', fontWeight: 500 }}>
        {toast.message}
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDismiss();
        }}
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          opacity: 0.6,
          fontSize: '18px',
          padding: '0 4px',
        }}
        aria-label="Close"
      >
        ×
      </button>
    </motion.div>
  );
}

function getToastStyles(type: ToastType) {
  const styles = {
    success: {
      backgroundColor: '#10B981',
      color: 'white',
      border: '1px solid #059669',
    },
    error: {
      backgroundColor: '#EF4444',
      color: 'white',
      border: '1px solid #DC2626',
    },
    warning: {
      backgroundColor: '#F59E0B',
      color: 'white',
      border: '1px solid #D97706',
    },
    info: {
      backgroundColor: '#3B82F6',
      color: 'white',
      border: '1px solid #2563EB',
    },
  };
  return styles[type];
}

function getToastIcon(type: ToastType) {
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ⓘ',
  };
  return icons[type];
}
