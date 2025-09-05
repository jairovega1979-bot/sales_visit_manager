
// Centralized error handling utilities

import { AppError, ApiResponse } from '@/lib/types';

// Error codes
export const ERROR_CODES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  DATA_NOT_FOUND: 'DATA_NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
} as const;

// Error messages in French
export const ERROR_MESSAGES = {
  [ERROR_CODES.NETWORK_ERROR]: 'Erreur de connexion. Veuillez vérifier votre connexion internet.',
  [ERROR_CODES.DATA_NOT_FOUND]: 'Les données demandées sont introuvables.',
  [ERROR_CODES.VALIDATION_ERROR]: 'Les données saisies sont invalides.',
  [ERROR_CODES.AUTH_ERROR]: 'Erreur d\'authentification. Veuillez vous reconnecter.',
  [ERROR_CODES.SERVER_ERROR]: 'Erreur serveur. Veuillez réessayer plus tard.',
  [ERROR_CODES.UNKNOWN_ERROR]: 'Une erreur inattendue s\'est produite.'
} as const;

// Create standardized error
export function createAppError(
  message: string, 
  code?: keyof typeof ERROR_CODES, 
  details?: any
): AppError {
  return {
    message: code ? ERROR_MESSAGES[code] || message : message,
    code,
    details
  };
}

// Handle API response errors
export function handleApiError(error: any): AppError {
  console.error('API Error:', error);

  if (error?.response?.status) {
    const status = error.response.status;
    
    switch (status) {
      case 400:
        return createAppError('Requête invalide', ERROR_CODES.VALIDATION_ERROR, error.response.data);
      case 401:
        return createAppError('Non autorisé', ERROR_CODES.AUTH_ERROR);
      case 404:
        return createAppError('Ressource introuvable', ERROR_CODES.DATA_NOT_FOUND);
      case 500:
        return createAppError('Erreur serveur', ERROR_CODES.SERVER_ERROR);
      default:
        return createAppError(`Erreur HTTP ${status}`, ERROR_CODES.SERVER_ERROR);
    }
  }

  if (error?.code === 'NETWORK_ERROR' || error?.message?.includes('fetch')) {
    return createAppError('Erreur réseau', ERROR_CODES.NETWORK_ERROR, error);
  }

  if (error?.message) {
    return createAppError(error.message, ERROR_CODES.UNKNOWN_ERROR, error);
  }

  return createAppError('Erreur inconnue', ERROR_CODES.UNKNOWN_ERROR, error);
}

// Create success response
export function createSuccessResponse<T>(data: T): ApiResponse<T> {
  return {
    data,
    success: true
  };
}

// Create error response
export function createErrorResponse(error: AppError): ApiResponse {
  return {
    error,
    success: false
  };
}

// Error boundary utility
export function withErrorHandling<T extends any[], R>(
  fn: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<ApiResponse<R>> => {
    try {
      const data = await fn(...args);
      return createSuccessResponse(data);
    } catch (error) {
      const appError = handleApiError(error);
      return createErrorResponse(appError);
    }
  };
}

// Demo mode error simulation (for testing)
export function simulateRandomError(): AppError | null {
  if (Math.random() < 0.1) { // 10% chance of error in demo mode
    const errors = [
      createAppError('Erreur de démonstration', ERROR_CODES.NETWORK_ERROR),
      createAppError('Timeout de démonstration', ERROR_CODES.SERVER_ERROR)
    ];
    return errors[Math.floor(Math.random() * errors.length)];
  }
  return null;
}
