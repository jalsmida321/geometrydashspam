import React, { useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';

interface LocationState {
  gameUrl: string;
  gameImage: string;
}

const GamePage: React.FC = () => {
  const { gameName } = useParams<{ gameName: string }>();
  const location = useLocation();
  const { gameUrl, gameImage } = location.state as LocationState;
  const [isGameVisible, setIsGameVisible] = useState(false);

  const playGame = () => {
    setIsGameVisible(true);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">{decodeURIComponent(gameName || '')}</h1>
      <div className="game-container">
        <div 
          id="game" 
          className={`ratio ratio-16x9 overflow-hidden rounded-3 mb-4 game-ratio ${isGameVisible ? '' : 'hidden'}`}
        >
          <iframe 
            id="ubgs" 
            className="game-iframe w-full h-full"
            src={isGameVisible ? gameUrl : 'about:blank'}
            width="850" 
            height="590" 
            scrolling="no" 
            frameBorder="0" 
            allowFullScreen
          ></iframe>
        </div>
        {!isGameVisible && (
          <div id="loader" className="preview ratio ratio-16x9">
            <div id="playGame" className="relative">
              <img 
                src={gameImage} 
                alt={gameName} 
                width="850" 
                height="590" 
                className="w-full h-auto rounded-3 glow"
              />
              <div className="play absolute inset-0 flex flex-col items-center justify-center">
                <div className="playimg mb-4">
                  <img 
                    src={gameImage} 
                    alt={gameName} 
                    width="190" 
                    height="190" 
                    className="rounded-full"
                  />
                </div>
                <button 
                  className="playBT bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={playGame}
                >
                  <span className="text-2xl">Play Now</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GamePage;