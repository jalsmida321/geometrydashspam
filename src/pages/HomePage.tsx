import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface Game {
  name: string;
  description: string;
  image: string;
  url: string;
}

const games: Game[] = [
  {
    name: "Geometry Dash Spam Test",
    description: "Test your spamming skills in this exciting Geometry Dash challenge!",
    image: "https://geometrydashspam.com/media/uploads/games/thumb/geometry-dash-spam.webp",
    url: "https://turbowarp.org/558930579/embed",
  },
  {
    name: "Geometry Dash Spam Challenge",
    description: "Push your limits in this intense Geometry Dash spam challenge!",
    image: "https://geometrydashspam.com/media/uploads/games/thumb/geometry-dash-spam-challenge.webp",
    url: "https://turbowarp.org/558930580/embed",
  },
  {
    name: "Geometry Dash Spam Master",
    description: "Become the ultimate spam master in this Geometry Dash game!",
    image: "https://geometrydashspam.com/media/uploads/games/thumb/geometry-dash-spam-master.webp",
    url: "https://turbowarp.org/558930581/embed",
  },
  {
    name: "Geometry Dash Spam Wave",
    description: "Master the wave in this challenging Geometry Dash spam game!",
    image: "https://geometrydashspam.com/media/uploads/games/thumb/geometry-dash-spam-wave.webp",
    url: "https://turbowarp.org/558930582/embed",
  },
  {
    name: "Geometry Dash Spam Challenge Chall",
    description: "Take on the ultimate spam challenge in this Geometry Dash game!",
    image: "https://geometrydashspam.com/media/uploads/games/thumb/geometry-dash-spam-challenge-chall.webp",
    url: "https://turbowarp.org/558930583/embed",
  },
  {
    name: "AKA Geometry Dash Spam",
    description: "Experience a unique twist on Geometry Dash spam gameplay!",
    image: "https://geometrydashspam.com/media/uploads/games/thumb/aka-geometry-dash-spam.webp",
    url: "https://turbowarp.org/558930584/embed",
  },
];

const HomePage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">Geometry Dash Spam Games</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game, index) => (
          <div key={index} className="bg-white shadow-md rounded-lg overflow-hidden">
            <img src={game.image} alt={game.name} className="w-full h-48 object-cover" />
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">{game.name}</h2>
              <p className="text-gray-600 mb-4">{game.description}</p>
              <Link
                to={`/game/${encodeURIComponent(game.name)}`}
                state={{ gameUrl: game.url, gameImage: game.image, allGames: games }}
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

export default HomePage;