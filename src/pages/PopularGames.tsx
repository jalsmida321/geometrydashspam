import React from 'react';
import { useNavigate } from 'react-router-dom';

const PopularGames = () => {
  const navigate = useNavigate();

const PopularGames = () => {
  const popularGames = [
    { 
      id: 1, 
      title: 'Space Waves', 
      image: 'https://pub-9cd8442eae39491496da90d370d65538.r2.dev/space-waves.png', 
      description: 'Navigate through cosmic waves in this mesmerizing space adventure.',
      url: 'https://pub-9cd8442eae39491496da90d370d65538.r2.dev/space-waves.html' // 添加游戏URL
    },
    { 
      id: 2, 
      title: 'Stickman Run', 
      image: 'https://pub-9cd8442eae39491496da90d370d65538.r2.dev/stickman-run.png', 
      description: 'A thrilling endless runner where your agility is put to the test.',
      url: 'https://pub-9cd8442eae39491496da90d370d65538.r2.dev/Stickman-Run.html' // 添加游戏URL
    },
    { 
      id: 3, 
      title: 'Paper Airplane', 
      image: 'https://pub-9cd8442eae39491496da90d370d65538.r2.dev/paper-airplane.png', 
      description: 'Soar through the skies in this relaxing paper plane flight simulator.',
      url: 'https://pub-9cd8442eae39491496da90d370d65538.r2.dev/Paper-AirPlane.html' // 添加游戏URL
    },
    { 
      id: 4, 
      title: 'Geometry Dash', 
      image: 'https://pub-9cd8442eae39491496da90d370d65538.r2.dev/Geometry-dash.png', 
      description: 'A rhythm-based action platformer with challenging geometric obstacles.',
      url: 'https://pub-9cd8442eae39491496da90d370d65538.r2.dev/Geometry-Dash.html' // 添加游戏URL
    },
    { 
      id: 5, 
      title: 'Brawl Stars', 
      image: 'https://pub-9cd8442eae39491496da90d370d65538.r2.dev/brawl-stars.png', 
      description: 'Fast-paced multiplayer battles with a diverse cast of brawlers.',
      url: 'https://pub-9cd8442eae39491496da90d370d65538.r2.dev/Brawl-Stars.html' // 添加游戏URL
    },
    { 
      id: 6, 
      title: 'Bouncing My Way Up', 
      image: 'https://pub-9cd8442eae39491496da90d370d65538.r2.dev/bouncing-my-way-up.png', 
      description: 'A vertically challenging platformer where bouncing skills are your key to ascension.',
      url: 'https://pub-9cd8442eae39491496da90d370d65538.r2.dev/Bouncing-My-Way-Up.html' // 添加游戏URL
    },
  ];

  const handlePlayNow = (gameUrl) => {
    window.open(gameUrl, '_blank'); // 在新标签页打开游戏URL
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center">Popular Games</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {popularGames.map((game) => (
          <div key={game.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105">
            <img src={game.image} alt={game.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2 text-white">{game.title}</h3>
              <p className="text-gray-300 mb-4">{game.description}</p>
              <button 
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition"
                onClick={() => handlePlayNow(game.url)}
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