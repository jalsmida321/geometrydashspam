import React, { useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface Game {
  name: string;
  description: string;
  image: string;
  url: string;
}

interface LocationState {
  gameUrl: string;
  gameImage: string;
  allGames: Game[];
}

const GamePage: React.FC = () => {
  const { gameName } = useParams<{ gameName: string }>();
  const location = useLocation();
  const { gameUrl, gameImage, allGames } = location.state as LocationState;
  const [isGameVisible, setIsGameVisible] = useState(false);

  const playGame = () => {
    setIsGameVisible(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
        {decodeURIComponent(gameName || '')}
      </h1>
  
      <div className="game-container mb-12">
        <div 
          id="game"
          className={`flex justify-center mb-4 ${isGameVisible ? '' : 'hidden'}`}
        >
          <iframe 
            className="w-full h-[590px] max-w-[850px] rounded-lg"
            src={isGameVisible ? gameUrl : 'about:blank'}
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
                src={gameImage} 
                alt={gameName} 
                className="w-full h-[590px] max-w-[850px] object-cover rounded-lg"
              />
              <div className="play absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 rounded-lg">
                <button 
                  className="playBT bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full text-2xl transition duration-300 ease-in-out transform hover:scale-105"
                  onClick={playGame}
                >
                  Play Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
  
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
  );
};

export default GamePage;