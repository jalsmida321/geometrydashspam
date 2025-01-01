import React from 'react';
import { useNavigate } from 'react-router-dom';

const PopularGames = () => {
  const navigate = useNavigate();

const PopularGames = () => {
  const popularGames = [
    { id: 1, title: 'Geometry Dash', image: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', description: 'The original rhythm-based platformer game.' },
    { id: 2, title: 'Geometry Dash Meltdown', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', description: 'A spin-off with new levels and challenges.' },
    { id: 3, title: 'Geometry Dash SubZero', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', description: 'Another spin-off with icy-themed levels.' },
    { id: 4, title: 'Geometry Dash World', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', description: 'A mobile-focused version with shorter levels.' },
    { id: 5, title: 'Geometry Dash Lite', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', description: 'A free version with limited levels.' },
    { id: 6, title: 'Geometry Dash Vault', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', description: 'A secret area with hidden content and rewards.' },
  ];

  const handlePlayNow = (gameId) => {
    navigate(`/game/${gameId}`);  
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Popular Games</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {popularGames.map((game) => (
          <div key={game.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105">
            <img src={game.image} alt={game.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{game.title}</h3>
              <p className="text-gray-300">{game.description}</p>
              <button 
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition"
                onClick={() => handlePlayNow(game.id)}
              >
                Play Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularGames;