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
      <!-- What is Geometry Dash Spam Test -->
    <section id="what-is" class="py-16 bg-white">
        <div class="container mx-auto px-4">
            <h2 class="text-3xl font-bold text-center mb-12">What is Geometry Dash Spam Test?</h2>
            <div class="flex flex-col md:flex-row items-center">
                <div class="md:w-1/2 mb-8 md:mb-0 md:pr-8">
                    <p class="mb-4">The Geometry Dash Spam Test is a specialized practice mode that measures your ability to tap or click rapidly and consistently. In the world of Geometry Dash, certain levels require players to achieve clicking speeds of up to 50 CPS (clicks per second), with some extreme challenges demanding nearly 100 CPS.</p>
                    <p class="mb-4">Unlike standard Geometry Dash levels that test various skills, the Geometry Dash Spam Test specifically focuses on your ability to maintain high-speed clicking while preserving accuracy. The test typically features wave segments where players control a small triangle that moves up and down as you tap or click.</p>
                    <p>The objective is straightforward yet challenging: navigate through increasingly narrow passages without touching any obstacles or boundaries. If you miss a tap/click or mistime it, your icon will crash and you have to start over. Just stay focused and keep the rhythm.</p>
                </div>
                <div class="md:w-1/2">
                    <div class="bg-indigo-50 p-6 rounded-lg shadow-md">
                        <h3 class="text-xl font-semibold mb-4">Why Geometry Dash Spam Test Matters</h3>
                        <p class="mb-4">For serious Geometry Dash players, mastering spam clicking is not optional—it's essential. Many of the game's hardest levels, particularly those created by the community, incorporate sections that demand exceptional clicking speed and consistency.</p>
                        <p>The Geometry Dash Spam Test provides a controlled environment where you can practice this specific skill without the frustration of failing an entire level due to one difficult section. Regular practice has been shown to significantly improve player performance across all aspects of the game.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Benefits -->
    <section id="benefits" class="py-16 bg-white">
        <div class="container mx-auto px-4">
            <h2 class="text-3xl font-bold text-center mb-12">Benefits of Practicing Geometry Dash Spam Test</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="flex items-start">
                    <div class="flex-shrink-0 mr-4">
                        <div class="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                    </div>
                    <div>
                        <h3 class="text-xl font-semibold mb-2">Improved Reaction Time</h3>
                        <p>The Geometry Dash Spam Test forces players to react instantly to visual cues, significantly enhancing overall reaction time. This improvement can transfer to other games and even real-life situations requiring quick reflexes.</p>
                    </div>
                </div>
                <div class="flex items-start">
                    <div class="flex-shrink-0 mr-4">
                        <div class="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                            </svg>
                        </div>
                    </div>
                    <div>
                        <h3 class="text-xl font-semibold mb-2">Enhanced Hand-Eye Coordination</h3>
                        <p>Maintaining precise control while clicking at high speeds develops exceptional hand-eye coordination. Players often report improved dexterity in other fine motor tasks after consistent Geometry Dash Spam Test practice.</p>
                    </div>
                </div>
                <div class="flex items-start">
                    <div class="flex-shrink-0 mr-4">
                        <div class="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </div>
                    </div>
                    <div>
                        <h3 class="text-xl font-semibold mb-2">Mental Focus and Concentration</h3>
                        <p>Successfully completing a Geometry Dash Spam Test requires intense concentration for extended periods. This mental training helps develop focus that can be applied to studying, work, and other activities requiring sustained attention.</p>
                    </div>
                </div>
                <div class="flex items-start">
                    <div class="flex-shrink-0 mr-4">
                        <div class="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                    </div>
                    <div>
                        <h3 class="text-xl font-semibold mb-2">Stress Management</h3>
                        <p>The high-pressure nature of the Geometry Dash Spam Test teaches players to perform under stress. Learning to maintain composure and execution despite increasing difficulty is a valuable skill in many aspects of life.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- How to Improve -->
    <section id="improve" class="py-16 bg-gray-50">
        <div class="container mx-auto px-4">
            <h2 class="text-3xl font-bold text-center mb-12">How to Improve Your Geometry Dash Spam Test Performance</h2>
            <div class="flex flex-col md:flex-row">
                <div class="md:w-1/2 md:pr-8 mb-8 md:mb-0">
                    <div class="bg-white p-6 rounded-lg shadow-md mb-6">
                        <h3 class="text-xl font-semibold mb-3">Start Slow and Build Consistency</h3>
                        <p>Begin with slower, more manageable sections and focus on consistency rather than raw speed. It's better to complete easier tests with perfect accuracy than to fail repeatedly at more difficult challenges. As your consistency improves, gradually increase the difficulty and speed requirements.</p>
                    </div>
                    <div class="bg-white p-6 rounded-lg shadow-md">
                        <h3 class="text-xl font-semibold mb-3">Practice Daily in Short Sessions</h3>
                        <p>Brief, daily practice sessions are more effective than occasional marathon sessions. Aim for 15-30 minutes of focused practice each day, concentrating on specific techniques or problem areas. This approach prevents fatigue and promotes steady improvement.</p>
                    </div>
                </div>
                <div class="md:w-1/2 md:pl-8">
                    <div class="bg-white p-6 rounded-lg shadow-md mb-6">
                        <h3 class="text-xl font-semibold mb-3">Analyze Your Failures</h3>
                        <p>When you fail a Geometry Dash Spam Test, take a moment to understand why. Was your clicking too slow, too fast, or inconsistent? Identifying specific weaknesses allows you to target your practice more effectively.</p>
                    </div>
                    <div class="bg-white p-6 rounded-lg shadow-md">
                        <h3 class="text-xl font-semibold mb-3">Experiment with Different Clicking Techniques</h3>
                        <p>Players use various clicking methods, including traditional clicking, butterfly clicking, and jitter clicking. Experiment with different techniques to find what works best for your hand size, dexterity, and the specific challenges you're facing.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    </div>
  );
};

export default HomePage;