import React, { useState, useCallback } from 'react';
import { RefreshCw, AlertCircle, Wifi, WifiOff } from 'lucide-react';

interface RetryHandlerProps {
  onRetry: () => void | Promise<void>;
  error?: Error | string;
  maxRetries?: number;
  children?: React.ReactNode;
  className?: string;
}

/**
 * RetryHandler component for handling failed operations with retry functionality
 */
export const RetryHandler: React.FC<RetryHandlerProps> = ({
  onRetry,
  error,
  maxRetries = 3,
  children,
  className = ''
}) => {
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = useCallback(async () => {
    if (retryCount >= maxRetries) return;
    
    setIsRetrying(true);
    try {
      await onRetry();
      setRetryCount(0); // Reset on success
    } catch (err) {
      setRetryCount(prev => prev + 1);
    } finally {
      setIsRetrying(false);
    }
  }, [onRetry, retryCount, maxRetries]);

  const getErrorMessage = () => {
    if (typeof error === 'string') return error;
    if (error instanceof Error) return error.message;
    return 'An unexpected error occurred';
  };

  const isNetworkError = () => {
    const errorMessage = getErrorMessage().toLowerCase();
    return errorMessage.includes('network') || 
           errorMessage.includes('fetch') || 
           errorMessage.includes('connection');
  };

  return (
    <div className={`text-center py-8 ${className}`}>
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
        <div className="flex items-center justify-center mb-4">
          {isNetworkError() ? (
            <WifiOff className="h-12 w-12 text-red-500" />
          ) : (
            <AlertCircle className="h-12 w-12 text-red-500" />
          )}
        </div>
        
        <h3 className="text-lg font-semibold text-red-900 mb-2">
          {isNetworkError() ? 'Connection Error' : 'Something went wrong'}
        </h3>
        
        <p className="text-red-700 mb-4 text-sm">
          {getErrorMessage()}
        </p>

        {retryCount > 0 && (
          <p className="text-red-600 text-xs mb-4">
            Retry attempt {retryCount} of {maxRetries}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleRetry}
            disabled={isRetrying || retryCount >= maxRetries}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
            {isRetrying ? 'Retrying...' : retryCount >= maxRetries ? 'Max retries reached' : 'Try Again'}
          </button>
          
          {children}
        </div>

        {isNetworkError() && (
          <div className="mt-4 text-xs text-red-600">
            <p>Please check your internet connection and try again.</p>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Hook for handling retry logic
 */
export const useRetry = (
  operation: () => Promise<void>,
  maxRetries: number = 3
) => {
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const retry = useCallback(async () => {
    if (retryCount >= maxRetries) return;
    
    setIsRetrying(true);
    setError(null);
    
    try {
      await operation();
      setRetryCount(0);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setRetryCount(prev => prev + 1);
    } finally {
      setIsRetrying(false);
    }
  }, [operation, retryCount, maxRetries]);

  const reset = useCallback(() => {
    setRetryCount(0);
    setError(null);
    setIsRetrying(false);
  }, []);

  return {
    retry,
    reset,
    retryCount,
    isRetrying,
    error,
    canRetry: retryCount < maxRetries,
    hasMaxRetries: retryCount >= maxRetries
  };
};

export default RetryHandler;