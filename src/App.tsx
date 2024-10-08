import React from 'react';
import { ArrowRight, Gamepad2, TrendingUp, BookOpen, Info, BookOpen as ReadMore, Mail } from 'lucide-react';

interface Game {
  name: string;
  description: string;
  image: string;
}

const games: Game[] = [
  {
    name: "Geometry Dash Spam Test",
    description: "Test your spamming skills in this exciting Geometry Dash challenge!",
    image: "https://geometrydash-spam.com/src/img/geometry-dash-spam-test.png",
  },
  {
    name: "Geometry Dash Spam Master",
    description: "Become the ultimate spam master in this intense Geometry Dash game!",
    image: "https://geometrydash-spam.com/src/img/geometry-dash-spam-master.png",
  },
  {
    name: "Geometry Dash Spam Chall",
    description: "Click frenzy unleashed! Can you conquer this ultimate speed challenge?",
    image: "https://geometrydash-spam.com/src/img/geometry-dash-spam-chall.png",
  },
  {
    name: "Geometry Dash Spam Wave",
    description: "Push your limits! Show off your godlike speed in this insane wave challenge!",
    image: "https://geometrydash-spam.com/src/img/geometry-dash-spam-wave.png",
  },
  {
    name: "Geometry Dash Spam Challenge",
    description: "Push your limits with this ultimate Geometry Dash spam challenge!",
    image: "https://geometrydash-spam.com/src/img/geometry-dash-spam-challenge.png",
  },
  {
    name: "AKA Geometry Dash Spam",
    description: "Fingertip lightning war! Experience an unprecedented rhythm rush!",
    image: "https://geometrydash-spam.com/src/img/AKA-geometry-dash-spam.png",
  },
];

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="font-bold text-xl">Geometry Dash Spam</span>
            </div>
            <div className="flex">
              <a href="#" className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                <Gamepad2 className="mr-1.5 h-5 w-5" />
                Popular Games
              </a>
              <a href="#" className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                <TrendingUp className="mr-1.5 h-5 w-5" />
                Trending
              </a>
              <a href="#" className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                <BookOpen className="mr-1.5 h-5 w-5" />
                Blog
              </a>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">Geometry Dash Spam Games</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game, index) => (
              <div key={index} className="bg-white shadow-md rounded-lg overflow-hidden">
                <img src={game.image} alt={game.name} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">{game.name}</h2>
                  <p className="text-gray-600 mb-4">{game.description}</p>
                  <a
                    href={`/${game.name.toLowerCase().replace(/\s+/g, '-')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Play {game.name}
                    <ArrowRight className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-between items-center">
            <div className="w-full md:w-1/3 mb-6 md:mb-0">
              <h3 className="text-xl font-bold mb-2 flex items-center">
                <Info className="mr-2 h-5 w-5" />
                ABOUT US
              </h3>
              <p className="text-gray-400">
                We are passionate about bringing you the best Geometry Dash spam challenges and games.
              </p>
            </div>
            <div className="w-full md:w-1/3 mb-6 md:mb-0">
              <h3 className="text-xl font-bold mb-2 flex items-center">
                <ReadMore className="mr-2 h-5 w-5" />
                READ MORE
              </h3>
              <ul className="text-gray-400">
                <li><a href="#" className="hover:text-white">Game Tutorials</a></li>
                <li><a href="#" className="hover:text-white">Spam Techniques</a></li>
                <li><a href="#" className="hover:text-white">Community Highlights</a></li>
              </ul>
            </div>
            <div className="w-full md:w-1/3">
              <h3 className="text-xl font-bold mb-2 flex items-center">
                <Mail className="mr-2 h-5 w-5" />
                CONTACT US
              </h3>
              <p className="text-gray-400">
                Have questions or feedback? Reach out to us at:
                <a href="mailto:contact@geometrydashspam.com" className="hover:text-white">
                  contact@geometrydash-spam.com
                </a>
              </p>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Geometry Dash Spam. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;