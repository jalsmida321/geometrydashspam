import React from 'react';
import { TrendingUp, ThumbsUp, MessageSquare } from 'lucide-react';

const Trending = () => {
  const trendingGames = [
    { id: 1, title: 'Neon Dash', likes: 15000, comments: 2500, trend: '+25%' },
    { id: 2, title: 'Cube Runner', likes: 12000, comments: 1800, trend: '+18%' },
    { id: 3, title: 'Gravity Flip', likes: 10000, comments: 1500, trend: '+15%' },
    { id: 4, title: 'Pixel Jumper', likes: 9000, comments: 1200, trend: '+12%' },
    { id: 5, title: 'Rhythm Blast', likes: 8000, comments: 1000, trend: '+10%' },
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Trending Games</h2>
      <div className="space-y-6">
        {trendingGames.map((game) => (
          <div key={game.id} className="bg-gray-800 rounded-lg p-6 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold mb-2">{game.title}</h3>
              <div className="flex space-x-4 text-gray-300">
                <span className="flex items-center">
                  <ThumbsUp size={16} className="mr-1" />
                  {game.likes.toLocaleString()}
                </span>
                <span className="flex items-center">
                  <MessageSquare size={16} className="mr-1" />
                  {game.comments.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="flex items-center text-green-400">
              <TrendingUp size={24} className="mr-2" />
              <span className="text-lg font-bold">{game.trend}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Trending;