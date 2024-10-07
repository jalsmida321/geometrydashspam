import React from 'react';
import { useParams, useLocation } from 'react-router-dom';

interface LocationState {
  gameUrl: string;
}

const GamePage: React.FC = () => {
  const { gameName } = useParams<{ gameName: string }>();
  const location = useLocation();
  const { gameUrl } = location.state as LocationState;

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">{decodeURIComponent(gameName || '')}</h1>
      <div id="game" class="ratio ratio-16x9 overflow-hidden rounded-3 mb-4 game-ratio" style="display:none;">
   <iframe id="ubgs" class="game-iframe lazyload" src="about:blank"  src={gameUrl}
          title={gameName} width="850" height="590" scrolling="none" frameborder="0" allowfullscreen></iframe>
      </div>
    </div>
  );
};

export default GamePage;