'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  leaving?: boolean;
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

    // Start exit animation after 3.5s, remove after 4s
    setTimeout(() => {
      setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
    }, 3500);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 300);
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
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

interface ToastItemProps {
  toast: Toast;
  onDismiss: () => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const [visible, setVisible] = useState(false);
  const styles = getToastStyles(toast.type);

  useEffect(() => {
    // Trigger enter animation
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      style={{
        ...styles,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        minWidth: '300px',
        maxWidth: '500px',
        pointerEvents: 'auto',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        opacity: visible && !toast.leaving ? 1 : 0,
        transform: visible && !toast.leaving ? 'translateX(0)' : 'translateX(100%)',
      }}
      onClick={onDismiss}
    >
      <div style={{ fontSize: '20px' }}>{getToastIcon(toast.type)}</div>
      <div style={{ flex: 1, fontSize: '14px', fontWeight: 500 }}>{toast.message}</div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDismiss();
        }}
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          opacity: 0.7,
          fontSize: '18px',
          padding: '0 4px',
          color: 'inherit',
        }}
        aria-label="Close"
      >
        ×
      </button>
    </div>
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
