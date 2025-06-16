// 删除开头的隐藏字符
import React from 'react';
// 方案一：保持原引入方式
import { Helmet } from 'react-helmet';

// 方案二：使用异步版本
import { Helmet } from 'react-helmet-async';
import { Gamepad2, School, Shield, TrendingUp } from 'lucide-react';

export default function UnblockedGames() {
  const gameCategories = [
    {
      title: 'Popular Games',
      icon: <TrendingUp className="w-5 h-5" />,
      games: [
        {
          title: 'Geometry Dash Unblocked',
          description: 'Rhythm-based platformer challenges your reflexes',
          rating: '4.9/5',
          url: '/games/geometry-dash-unblocked'
        },
        // More game data...
      ]
    },
    // Other categories...
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Helmet>
        <title>Unblocked Games - School Approved Gaming Hub</title>
        <meta name="description" content="VPN-free access to education institution certified games" />
      </Helmet>

      {/* Category sections */}
      <div className="space-y-16">
        {gameCategories.map((category) => (
          <section key={category.title} className="bg-gray-800 p-6 rounded-xl">
            <div className="flex items-center mb-6 space-x-2">
              {category.icon}
              <h2 className="text-2xl font-bold">{category.title}</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.games.map((game) => (
                <a 
                  key={game.title}
                  href={game.url}
                  className="bg-gray-700 hover:bg-indigo-600 p-6 rounded-lg transition-colors group"
                >
                  <h3 className="text-xl font-semibold mb-2">{game.title}</h3>
                  <p className="text-gray-400 group-hover:text-gray-200 mb-4">
                    {game.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="bg-green-800 text-green-300 px-3 py-1 rounded-full text-sm">
                      {game.rating}
                    </span>
                    <span className="text-indigo-400 group-hover:text-white">
                      Play Now →
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}