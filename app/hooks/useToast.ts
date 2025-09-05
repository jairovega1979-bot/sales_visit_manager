

'use client';

import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

interface ToastOptions {
  duration?: number;
  position?: 'top-center' | 'top-right' | 'top-left' | 'bottom-center' | 'bottom-right' | 'bottom-left';
}

export function useToast() {
  const [toasts, setToasts] = useState<any[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'loading' | 'info' = 'info', options?: ToastOptions) => {
    const toastOptions = {
      duration: options?.duration || 4000,
      position: options?.position || 'top-right',
      style: {
        borderRadius: '8px',
        background: '#333',
        color: '#fff',
        fontSize: '14px',
        padding: '12px 16px',
      }
    };

    switch (type) {
      case 'success':
        return toast.success(message, {
          ...toastOptions,
          style: {
            ...toastOptions.style,
            background: '#22c55e',
          }
        });
      case 'error':
        return toast.error(message, {
          ...toastOptions,
          duration: 6000,
          style: {
            ...toastOptions.style,
            background: '#ef4444',
          }
        });
      case 'loading':
        return toast.loading(message, toastOptions);
      default:
        return toast(message, toastOptions);
    }
  }, []);

  const dismissToast = useCallback((toastId: string) => {
    toast.dismiss(toastId);
  }, []);

  const dismissAllToasts = useCallback(() => {
    toast.dismiss();
  }, []);

  return {
    toast: showToast,
    dismiss: dismissToast,
    dismissAll: dismissAllToasts,
    success: (message: string, options?: ToastOptions) => showToast(message, 'success', options),
    error: (message: string, options?: ToastOptions) => showToast(message, 'error', options),
    loading: (message: string, options?: ToastOptions) => showToast(message, 'loading', options),
    info: (message: string, options?: ToastOptions) => showToast(message, 'info', options),
  };
}

