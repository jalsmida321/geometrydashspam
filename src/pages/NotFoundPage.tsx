import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Search, Grid3X3, ArrowLeft, AlertTriangle } from 'lucide-react';
import { GameGrid } from '../components/game';
import { useGames } from '../hooks';

/**
 * NotFoundPage component for handling 404 errors with helpful navigation
 */
const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get some popular games to show as suggestions
  const { games: popularGames } = useGames({ 
    sortBy: 'popularity', 
    sortOrder: 'desc' 
  });
  
  const suggestedGames = popularGames.slice(0, 6);
  
  // Extract potential search terms from the URL
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const potentialSearchTerm = pathSegments[pathSegments.length - 1]?.replace(/-/g, ' ');

  const handleSearchSuggestion = () => {
    if (potentialSearchTerm) {
      navigate(`/search?q=${encodeURIComponent(potentialSearchTerm)}`);
    } else {
      navigate('/search');
    }
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate('/');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      {/* Error Header */}
      <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-lg p-8 mb-8 text-white">
        <AlertTriangle className="w-16 h-16 mx-auto mb-4 opacity-80" />
        <h1 className="text-6xl font-bold mb-2">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-lg opacity-90">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>

      {/* Current Path Info */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Requested Path
        </h3>
        <code className="bg-gray-200 px-3 py-1 rounded text-sm font-mono text-gray-700">
          {location.pathname}
        </code>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        <button
          onClick={() => navigate('/')}
          className="flex flex-col items-center p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 group"
        >
          <Home className="w-8 h-8 text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
          <span className="font-medium text-gray-900">Go Home</span>
          <span className="text-sm text-gray-500 mt-1">Return to homepage</span>
        </button>

        <button
          onClick={() => navigate('/games')}
          className="flex flex-col items-center p-6 bg-white rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-md transition-all duration-200 group"
        >
          <Grid3X3 className="w-8 h-8 text-green-600 mb-3 group-hover:scale-110 transition-transform" />
          <span className="font-medium text-gray-900">Browse Games</span>
          <span className="text-sm text-gray-500 mt-1">View all games</span>
        </button>

        <button
          onClick={handleSearchSuggestion}
          className="flex flex-col items-center p-6 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all duration-200 group"
        >
          <Search className="w-8 h-8 text-purple-600 mb-3 group-hover:scale-110 transition-transform" />
          <span className="font-medium text-gray-900">Search</span>
          <span className="text-sm text-gray-500 mt-1">
            {potentialSearchTerm ? `Search "${potentialSearchTerm}"` : 'Find games'}
          </span>
        </button>

        <button
          onClick={handleGoBack}
          className="flex flex-col items-center p-6 bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 group"
        >
          <ArrowLeft className="w-8 h-8 text-gray-600 mb-3 group-hover:scale-110 transition-transform" />
          <span className="font-medium text-gray-900">Go Back</span>
          <span className="text-sm text-gray-500 mt-1">Previous page</span>
        </button>
      </div>

      {/* Suggested Games */}
      {suggestedGames.length > 0 && (
        <div className="text-left">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Popular Games You Might Like
          </h3>
          <GameGrid
            games={suggestedGames}
            columns={3}
            loading={false}
          />
        </div>
      )}

      {/* Help Section */}
      <div className="bg-blue-50 rounded-lg p-6 mt-12">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Need Help?
        </h3>
        <div className="text-left max-w-2xl mx-auto">
          <p className="text-gray-700 mb-4">
            If you think this is an error, here are some things you can try:
          </p>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Check the URL for typos or formatting errors
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Use the search function to find specific games
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Browse games by category from the homepage
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Try refreshing the page or clearing your browser cache
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;