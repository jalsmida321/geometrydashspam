import React from 'react';
import { 
  AlertCircle, 
  Search, 
  Filter, 
  RefreshCw, 
  Home, 
  Gamepad2,
  WifiOff,
  ServerCrash
} from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  onGoHome?: () => void;
  showRetry?: boolean;
  showGoHome?: boolean;
  className?: string;
}

/**
 * Generic error state component
 */
export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  onRetry,
  onGoHome,
  showRetry = true,
  showGoHome = true,
  className = ''
}) => (
  <div className={`text-center py-12 ${className}`}>
    <div className="bg-red-50 rounded-lg p-8 max-w-md mx-auto">
      <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-red-900 mb-2">{title}</h3>
      <p className="text-red-700 mb-6">{message}</p>
      
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {showRetry && onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
        )}
        
        {showGoHome && onGoHome && (
          <button
            onClick={onGoHome}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </button>
        )}
      </div>
    </div>
  </div>
);

/**
 * Search error state component
 */
export const SearchErrorState: React.FC<{
  searchQuery?: string;
  onRetry?: () => void;
  onClearSearch?: () => void;
  onBrowseGames?: () => void;
}> = ({ searchQuery, onRetry, onClearSearch, onBrowseGames }) => (
  <div className="text-center py-12">
    <div className="bg-yellow-50 rounded-lg p-8 max-w-md mx-auto">
      <Search className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-yellow-900 mb-2">Search Error</h3>
      <p className="text-yellow-700 mb-6">
        {searchQuery 
          ? `We couldn't search for "${searchQuery}". Please try again.`
          : 'There was a problem with your search. Please try again.'
        }
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry Search
          </button>
        )}
        
        {onClearSearch && (
          <button
            onClick={onClearSearch}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Search className="w-4 h-4 mr-2" />
            Clear Search
          </button>
        )}
        
        {onBrowseGames && (
          <button
            onClick={onBrowseGames}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Gamepad2 className="w-4 h-4 mr-2" />
            Browse Games
          </button>
        )}
      </div>
    </div>
  </div>
);

/**
 * Filter error state component
 */
export const FilterErrorState: React.FC<{
  onRetry?: () => void;
  onClearFilters?: () => void;
  onBrowseAll?: () => void;
}> = ({ onRetry, onClearFilters, onBrowseAll }) => (
  <div className="text-center py-12">
    <div className="bg-blue-50 rounded-lg p-8 max-w-md mx-auto">
      <Filter className="w-16 h-16 text-blue-500 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-blue-900 mb-2">Filter Error</h3>
      <p className="text-blue-700 mb-6">
        There was a problem applying your filters. Please try again or clear your filters.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </button>
        )}
        
        {onClearFilters && (
          <button
            onClick={onClearFilters}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Filter className="w-4 h-4 mr-2" />
            Clear Filters
          </button>
        )}
        
        {onBrowseAll && (
          <button
            onClick={onBrowseAll}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Gamepad2 className="w-4 h-4 mr-2" />
            Browse All
          </button>
        )}
      </div>
    </div>
  </div>
);

/**
 * Network error state component
 */
export const NetworkErrorState: React.FC<{
  onRetry?: () => void;
  onGoOffline?: () => void;
}> = ({ onRetry, onGoOffline }) => (
  <div className="text-center py-12">
    <div className="bg-gray-50 rounded-lg p-8 max-w-md mx-auto">
      <WifiOff className="w-16 h-16 text-gray-500 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Connection Error</h3>
      <p className="text-gray-700 mb-6">
        Unable to connect to the server. Please check your internet connection and try again.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
        )}
        
        {onGoOffline && (
          <button
            onClick={onGoOffline}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Gamepad2 className="w-4 h-4 mr-2" />
            Browse Offline
          </button>
        )}
      </div>
    </div>
  </div>
);

/**
 * Server error state component
 */
export const ServerErrorState: React.FC<{
  onRetry?: () => void;
  onReportIssue?: () => void;
}> = ({ onRetry, onReportIssue }) => (
  <div className="text-center py-12">
    <div className="bg-red-50 rounded-lg p-8 max-w-md mx-auto">
      <ServerCrash className="w-16 h-16 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-red-900 mb-2">Server Error</h3>
      <p className="text-red-700 mb-6">
        Our servers are experiencing issues. We're working to fix this as quickly as possible.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
        )}
        
        {onReportIssue && (
          <button
            onClick={onReportIssue}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <AlertCircle className="w-4 h-4 mr-2" />
            Report Issue
          </button>
        )}
      </div>
    </div>
  </div>
);

/**
 * Game load error state component
 */
export const GameLoadErrorState: React.FC<{
  gameName?: string;
  onRetry?: () => void;
  onBrowseOther?: () => void;
}> = ({ gameName, onRetry, onBrowseOther }) => (
  <div className="text-center py-12">
    <div className="bg-orange-50 rounded-lg p-8 max-w-md mx-auto">
      <Gamepad2 className="w-16 h-16 text-orange-500 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-orange-900 mb-2">Game Load Error</h3>
      <p className="text-orange-700 mb-6">
        {gameName 
          ? `Unable to load "${gameName}". This might be a temporary issue.`
          : 'Unable to load the game. This might be a temporary issue.'
        }
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reload Game
          </button>
        )}
        
        {onBrowseOther && (
          <button
            onClick={onBrowseOther}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Gamepad2 className="w-4 h-4 mr-2" />
            Browse Other Games
          </button>
        )}
      </div>
    </div>
  </div>
);

export default ErrorState;