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
    image: "https://pub-9cd8442eae39491496da90d370d65538.r2.dev/geometry-dash-spam-test.png",
    url: "https://pub-9cd8442eae39491496da90d370d65538.r2.dev/Geometry-Dash-spam-test.html",
  },
  {
    name: "Geometry Dash Spam Challenge",
    description: "Push your limits in this intense Geometry Dash spam challenge!",
    image: "https://pub-9cd8442eae39491496da90d370d65538.r2.dev/geometry-dash-spam-challenge.png",
    url: "https://pub-9cd8442eae39491496da90d370d65538.r2.dev/Geometry-Dash-Spam-Challenge.html",
  },
  {
    name: "Geometry Dash Spam Master",
    description: "Become the ultimate spam master in this Geometry Dash game!",
    image: "https://pub-9cd8442eae39491496da90d370d65538.r2.dev/geometry-dash-spam-master.png",
    url: "https://pub-9cd8442eae39491496da90d370d65538.r2.dev/Geometry-Dash-Spam-Master.html",
  },
  {
    name: "Geometry Dash Spam Wave",
    description: "Master the wave in this challenging Geometry Dash spam game!",
    image: "https://pub-9cd8442eae39491496da90d370d65538.r2.dev/geometry-dash-spam-wave.png",
    url: "https://pub-9cd8442eae39491496da90d370d65538.r2.dev/Geometry-Dash-Spam-Wave.html",
  },
  {
    name: "Geometry Dash Spam Challenge Chall",
    description: "Take on the ultimate spam challenge in this Geometry Dash game!",
    image: "https://pub-9cd8442eae39491496da90d370d65538.r2.dev/geometry-dash-spam-chall.png",
    url: "https://pub-9cd8442eae39491496da90d370d65538.r2.dev/Geometry-Dash-spam-chall.html",
  },
  {
    name: "AKA Geometry Dash Spam",
    description: "Experience a unique twist on Geometry Dash spam gameplay!",
    image: "https://pub-9cd8442eae39491496da90d370d65538.r2.dev/AKA-geometry-dash-spam.png",
    url: "https://pub-9cd8442eae39491496da90d370d65538.r2.dev/The-Great-Escape-AKA-Geometry-Spam.html",
  },
  {
    name: "Geometry Dash Wave Spam",
    description: "This is geometry dash wave spam as much as you can and try to get through the impossible level",
    image: "https://pub-9cd8442eae39491496da90d370d65538.r2.dev/geometry-dash-wave-spam.png",
    url: "https://pub-9cd8442eae39491496da90d370d65538.r2.dev/geometry-dash-wave-spam.html",
  },
];

const HomePage: React.FC = () => {
  // 新增结构化数据
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "GameSeries",
    "name": "Geometry Dash Spam Challenges",
    "description": "Discover the thrilling world of Geometry Dash Spam Challenges! Test your skills with fast-paced levels that challenge your reflexes and precision. Join a community of gamers who love creating and playing custom spam levels designed to push your limits. Share your best runs and strategies while climbing the leaderboard. Are you ready to tackle the ultimate test in Geometry Dash?",
    "game": games.map(game => ({
      "@type": "VideoGame",
      "name": game.name,
      "description": game.description,
      "url": window.location.origin + `/game/${encodeURIComponent(game.name)}`,
      "image": game.image
    }))
  };

  return (
// 为了解决 JSX 元素隐式具有类型 "any" 的问题，确保项目中正确配置了 React 类型定义
// 这里假设已经正确配置，直接使用标准的 JSX 写法
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>
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