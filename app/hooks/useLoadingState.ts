

'use client';

import { useState, useCallback } from 'react';
import { useToast } from './useToast';

interface LoadingOptions {
  successMessage?: string;
  errorMessage?: string;
  loadingMessage?: string;
}

export function useLoadingState() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const executeAsync = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    options?: LoadingOptions
  ): Promise<T | null> => {
    try {
      setIsLoading(true);
      setError(null);

      let toastId: string | undefined;
      if (options?.loadingMessage) {
        toastId = toast(options.loadingMessage, 'loading');
      }

      const result = await asyncFn();
      
      // Note: toast.dismiss will be handled by react-hot-toast automatically
      
      if (options?.successMessage) {
        toast(options.successMessage, 'success');
      }

      return result;
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
      
      if (options?.errorMessage) {
        toast(options.errorMessage, 'error');
      } else {
        toast(err.message || 'Une erreur est survenue', 'error');
      }
      
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    executeAsync,
    clearError
  };
}

