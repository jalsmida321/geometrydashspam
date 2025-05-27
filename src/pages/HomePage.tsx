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
      
      <section class="hero-gradient text-white py-20 md:py-32">
        <div class="container mx-auto px-4 flex flex-col md:flex-row items-center">
            <div class="md:w-1/2 mb-10 md:mb-0">
                <h1 class="text-4xl md:text-5xl font-bold mb-6">Geometry Dash Spam Test</h1>
                <p class="text-xl md:text-2xl mb-8">Master your clicking skills and conquer the most challenging levels in Geometry Dash</p>
                <a href="#try-now" class="bg-white text-indigo-600 font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-gray-100 transition pulse-btn inline-block">Try Spam Test Now</a>
            </div>
            <div class="md:w-1/2 flex justify-center">
                <div class="relative w-64 h-64 md:w-80 md:h-80 bg-indigo-800 rounded-xl shadow-2xl overflow-hidden">
                    <div class="absolute inset-0 flex items-center justify-center">
                        <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center z-10">
                            <div class="w-12 h-12 bg-indigo-500 rounded-full"></div>
                        </div>
                    </div>
                    <div class="wave-animation absolute bottom-0 w-full">
                        <svg class="wave-path" viewBox="0 0 1200 120" preserveAspectRatio="none">
                            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" fill="#4338ca" opacity=".8"></path>
                            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" fill="#6366f1" opacity=".5"></path>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    </section>
    
      <div className="mb-12">
      <iframe 
        className="w-full h-[600px] max-w-[1200px] mx-auto rounded-lg shadow-xl"
        src="https://pub-9cd8442eae39491496da90d370d65538.r2.dev/Geometry-Dash-spam-test.html"
        scrolling="no"
        frameBorder="0"
        allowFullScreen
        loading="eager"
      />
    </div>
    
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