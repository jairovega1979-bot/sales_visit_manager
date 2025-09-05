
'use client';

import { useState, useCallback } from 'react';
import { AppError, LoadingState } from '@/lib/types';
import { handleApiError, createAppError, ERROR_CODES } from '@/lib/error-handler';

export function useErrorHandler() {
  const [state, setState] = useState<LoadingState>({
    isLoading: false,
    error: null
  });

  const setLoading = useCallback((isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading }));
  }, []);

  const setError = useCallback((error: AppError | string | null) => {
    const appError = error 
      ? typeof error === 'string' 
        ? createAppError(error, ERROR_CODES.UNKNOWN_ERROR) 
        : error
      : null;
    
    setState(prev => ({ 
      ...prev, 
      error: appError,
      isLoading: false 
    }));
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const executeWithErrorHandling = useCallback(async <T>(
    operation: () => Promise<T>,
    onSuccess?: (data: T) => void,
    onError?: (error: AppError) => void
  ): Promise<T | null> => {
    setLoading(true);
    clearError();

    try {
      const result = await operation();
      setLoading(false);
      onSuccess?.(result);
      return result;
    } catch (error: any) {
      const appError = handleApiError(error);
      setError(appError);
      onError?.(appError);
      return null;
    }
  }, [setLoading, setError, clearError]);

  return {
    ...state,
    setLoading,
    setError,
    clearError,
    executeWithErrorHandling
  };
}
