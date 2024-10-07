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
      <div className="aspect-w-16 aspect-h-9">
        <iframe
          src={gameUrl}
          title={gameName}
          className="w-full h-[calc(100vh-300px)] border-0"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default GamePage;