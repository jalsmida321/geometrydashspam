import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  ArrowLeft, 
  Share2, 
  Heart, 
  Star, 
  User, 
  Gamepad2, 
  Info, 
  Clock,
  Tag,
  ExternalLink
} from 'lucide-react';
import { GameGrid } from '../components/game';
import { SEOHead } from '../components/SEO';
import { useRelatedGames } from '../hooks';
import { gameService } from '../services';
import { Game } from '../types/game';
import { extractGameKeywords, generateMetaDescription } from '../utils/seoUtils';

interface LocationState {
  gameUrl: string;
  gameImage: string;
  allGames?: Game[];
}

const GamePage: React.FC = () => {
  const { gameName } = useParams<{ gameName: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  
  // State management
  const [isGameVisible, setIsGameVisible] = useState(false);
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);

  // Get game data from location state or find by name
  const { gameUrl, gameImage, allGames } = (location.state as LocationState) || {};
  
  // Get related games using the hook
  const { games: relatedGames } = useRelatedGames(currentGame?.id || '', 6);

  // Initialize game data
  useEffect(() => {
    if (gameName) {
      const decodedName = decodeURIComponent(gameName);
      
      // Try to find game in the new data structure
      const foundGame = gameService.getAllGames().find(
        game => game.name.toLowerCase() === decodedName.toLowerCase()
      );
      
      if (foundGame) {
        setCurrentGame(foundGame);
        setIsFavorite(gameService.isFavorite(foundGame.id));
        
        // Add to recently played
        gameService.addToRecentlyPlayed(foundGame.id);
      } else if (gameUrl && gameImage) {
        // Fallback to legacy data structure
        const legacyGame: Game = {
          id: decodedName.toLowerCase().replace(/\s+/g, '-'),
          name: decodedName,
          description: `Play ${decodedName} online for free`,
          image: gameImage,
          url: gameUrl,
          category: { id: 'other', name: 'Other', slug: 'other', description: '', color: 'blue' },
          tags: [],
          featured: false,
          popularity: 50,
          dateAdded: new Date(),
          metadata: {}
        };
        setCurrentGame(legacyGame);
      }
    }
  }, [gameName, gameUrl, gameImage]);

  // Handle game play
  const playGame = () => {
    setIsGameVisible(true);
    if (currentGame) {
      gameService.addToRecentlyPlayed(currentGame.id);
    }
  };

  // Handle favorite toggle
  const toggleFavorite = () => {
    if (currentGame) {
      gameService.toggleFavorite(currentGame.id);
      setIsFavorite(!isFavorite);
    }
  };

  // Handle rating
  const handleRating = (rating: number) => {
    setUserRating(rating);
    // In a real app, this would save to backend
    localStorage.setItem(`rating-${currentGame?.id}`, rating.toString());
  };

  // Handle sharing
  const handleShare = async () => {
    if (navigator.share && currentGame) {
      try {
        await navigator.share({
          title: currentGame.name,
          text: currentGame.description,
          url: window.location.href,
        });
      } catch (err) {
        setShowShareModal(true);
      }
    } else {
      setShowShareModal(true);
    }
  };

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setShowShareModal(false);
  };

  if (!currentGame) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <div className="bg-red-50 rounded-lg p-8">
            <h1 className="text-2xl font-bold text-red-900 mb-4">Game Not Found</h1>
            <p className="text-red-700 mb-6">
              The game "{gameName}" could not be found.
            </p>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title={`${currentGame.name} - Play Online for Free`}
        description={generateMetaDescription('game', { game: currentGame })}
        keywords={extractGameKeywords(currentGame)}
        image={currentGame.image}
        game={currentGame}
        type="game"
        url={window.location.href}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
        <button
          onClick={() => navigate('/')}
          className="hover:text-gray-700 transition-colors duration-200"
        >
          Home
        </button>
        <span>/</span>
        <button
          onClick={() => navigate(`/games/category/${currentGame.category.slug}`)}
          className="hover:text-gray-700 transition-colors duration-200"
        >
          {currentGame.category.name}
        </button>
        <span>/</span>
        <span className="text-gray-900 font-medium">{currentGame.name}</span>
      </nav>

      {/* Game Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {currentGame.name}
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              {currentGame.description}
            </p>
            
            {/* Game Actions */}
            <div className="flex items-center space-x-4 mb-6">
              <button
                onClick={toggleFavorite}
                className={`flex items-center px-4 py-2 rounded-md border transition-colors duration-200 ${
                  isFavorite
                    ? 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Heart className={`w-4 h-4 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
                {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              </button>
              
              <button
                onClick={handleShare}
                className="flex items-center px-4 py-2 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Game
              </button>
            </div>

            {/* Game Rating */}
            <div className="flex items-center space-x-4 mb-6">
              <span className="text-sm font-medium text-gray-700">Rate this game:</span>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRating(star)}
                    className={`w-6 h-6 ${
                      star <= userRating ? 'text-yellow-400' : 'text-gray-300'
                    } hover:text-yellow-400 transition-colors duration-200`}
                  >
                    <Star className="w-full h-full fill-current" />
                  </button>
                ))}
              </div>
              <span className="text-sm text-gray-500">
                ({Math.round(currentGame.popularity)}% popularity)
              </span>
            </div>
          </div>

          {/* Game Metadata */}
          <div className="lg:w-80">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Game Information</h3>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <Tag className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-600">Category:</span>
                  <Link
                    to={`/games/category/${currentGame.category.slug}`}
                    className="ml-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    {currentGame.category.name}
                  </Link>
                </div>
                
                {currentGame.metadata?.developer && (
                  <div className="flex items-center">
                    <User className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-600">Developer:</span>
                    <span className="ml-2 text-sm text-gray-900">{currentGame.metadata.developer}</span>
                  </div>
                )}
                
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-600">Added:</span>
                  <span className="ml-2 text-sm text-gray-900">
                    {currentGame.dateAdded.toLocaleDateString()}
                  </span>
                </div>
                
                {currentGame.metadata?.controls && (
                  <div className="flex items-start">
                    <Gamepad2 className="w-4 h-4 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <span className="text-sm text-gray-600">Controls:</span>
                      <p className="text-sm text-gray-900 mt-1">{currentGame.metadata.controls}</p>
                    </div>
                  </div>
                )}
                
                {currentGame.metadata?.instructions && (
                  <div className="flex items-start">
                    <Info className="w-4 h-4 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <span className="text-sm text-gray-600">Instructions:</span>
                      <p className="text-sm text-gray-900 mt-1">{currentGame.metadata.instructions}</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Game Tags */}
              {currentGame.tags.length > 0 && (
                <div className="mt-4">
                  <span className="text-sm font-medium text-gray-700 mb-2 block">Tags:</span>
                  <div className="flex flex-wrap gap-2">
                    {currentGame.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Game Container */}
      <div className="game-container mb-12">
        <div 
          id="game"
          className={`flex justify-center mb-4 ${isGameVisible ? '' : 'hidden'}`}
        >
          <iframe 
            className="w-full h-[590px] max-w-[850px] rounded-lg shadow-lg"
            src={isGameVisible ? (currentGame.url || gameUrl) : 'about:blank'}
            scrolling="no" 
            frameBorder="0" 
            allowFullScreen
            style={{ boxSizing: 'border-box' }}
          ></iframe>
        </div>

        {!isGameVisible && (
          <div className="flex justify-center mb-4">
            <div className="relative">
              <img 
                src={currentGame.image || gameImage} 
                alt={currentGame.name} 
                className="w-full h-[590px] max-w-[850px] object-cover rounded-lg shadow-lg"
              />
              <div className="play absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 rounded-lg">
                <button 
                  className="playBT bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full text-2xl transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                  onClick={playGame}
                >
                  <Gamepad2 className="w-8 h-8 mr-3 inline" />
                  Play Now
                </button>
                <p className="text-white text-sm mt-4 opacity-90">
                  Click to start playing {currentGame.name}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Related Games */}
      {relatedGames.length > 0 && (
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Related Games</h2>
          <GameGrid
            games={relatedGames}
            columns={3}
            loading={false}
          />
        </div>
      )}

      {/* Legacy More Games (fallback) */}
      {allGames && allGames.length > 0 && (
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">More Games</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allGames.filter(game => game.name !== gameName).map((game, index) => (
              <div key={index} className="bg-white shadow-md rounded-lg overflow-hidden">
                <img src={game.image} alt={game.name} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{game.name}</h3>
                  <p className="text-gray-600 mb-4">{game.description}</p>
                  <Link
                    to={`/game/${encodeURIComponent(game.name)}`}
                    state={{ gameUrl: game.url, gameImage: game.image, allGames }}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Play {game.name}
                    <ArrowRight className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Share Game</h3>
            <div className="space-y-3">
              <button
                onClick={() => copyToClipboard(window.location.href)}
                className="w-full flex items-center px-4 py-2 text-left border border-gray-200 rounded-md hover:bg-gray-50"
              >
                <ExternalLink className="w-4 h-4 mr-3" />
                Copy Link
              </button>
              <button
                onClick={() => copyToClipboard(`Check out ${currentGame.name}! ${window.location.href}`)}
                className="w-full flex items-center px-4 py-2 text-left border border-gray-200 rounded-md hover:bg-gray-50"
              >
                <Share2 className="w-4 h-4 mr-3" />
                Copy Share Text
              </button>
            </div>
            <button
              onClick={() => setShowShareModal(false)}
              className="mt-4 w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GamePage;