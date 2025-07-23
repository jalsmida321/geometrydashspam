import React, { useState } from 'react';
import { Search, Grid3X3, Star, TrendingUp, Gamepad2 } from 'lucide-react';
import { GameGrid, SearchBar, CategoryFilter } from '../components/game';
import FeaturedGamesSection from '../components/game/FeaturedGamesSection';
import RecentlyPlayedSection, { EmptyRecentlyPlayedSection } from '../components/game/RecentlyPlayedSection';
import { SEOHead } from '../components/SEO';
import { useGames, useFeaturedGames } from '../hooks';
import { useGameContext } from '../context/GameContext';
import { useUserInteractions } from '../hooks/useUserInteractions';
import { generateMetaDescription, extractGameKeywords } from '../utils/seoUtils';
import { GameFilter } from '../types/game';

const HomePage: React.FC = () => {
  // Use new context and hooks for data management
  const gameContext = useGameContext();
  const { games, updateFilter, filter, loading, error } = useGames();
  const { featuredGames } = useFeaturedGames({ maxFeatured: 6 });
  const { getRecentlyPlayed, hasRecentlyPlayed, clearRecentlyPlayed } = useUserInteractions();
  
  // Local state for UI
  const [showFilters, setShowFilters] = useState(false);

  // Get recently played games using the hook
  const recentlyPlayed = getRecentlyPlayed(4);

  // Handle errors gracefully
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️ Error loading games</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Handle search using the new architecture
  const handleSearch = (query: string, searchFilter?: GameFilter) => {
    updateFilter({ 
      ...filter,
      search: query,
      ...searchFilter 
    });
  };

  // Handle category change using the new architecture
  const handleCategoryChange = (categoryId: string) => {
    updateFilter({ 
      ...filter,
      category: categoryId || undefined 
    });
  };

  return (
    <>
      <SEOHead
        title="Geometry Dash Spam Games - Test Your Skills Online"
        description="Discover the thrilling world of Geometry Dash Spam Challenges! Test your skills with fast-paced levels that challenge your reflexes and precision."
        keywords={['geometry dash', 'spam test', 'online games', 'browser games', 'skill games', 'reaction games', 'free games']}
        games={games}
        type="website"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Geometry Dash Spam Games</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Discover the thrilling world of Geometry Dash Spam Challenges! Test your skills with fast-paced levels that challenge your reflexes and precision.
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search for games..."
        />
      </div>

      {/* Category Navigation Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {gameContext.categories.map((category) => {
            const isSelected = filter.category === category.id;
            const gameCount = gameContext.getGamesByCategory(category.id).length;
            
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(isSelected ? '' : category.id)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 text-center ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="text-2xl mb-2">
                  {category.icon === 'Triangle' && '▲'}
                  {category.icon === 'Zap' && '⚡'}
                  {category.icon === 'Puzzle' && '🧩'}
                  {category.icon === 'Gamepad2' && '🎮'}
                  {category.icon === 'Trophy' && '🏆'}
                  {category.icon === 'Target' && '🎯'}
                </div>
                <div className="font-medium text-sm">{category.name}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {gameCount} game{gameCount !== 1 ? 's' : ''}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Filter and Toggle */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-900">Browse Games</h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Grid3X3 className="w-4 h-4 mr-2" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {showFilters && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <CategoryFilter
              categories={gameContext.categories}
              selectedCategory={filter.category || ''}
              onCategoryChange={handleCategoryChange}
            />
          </div>
        )}
      </div>

      {/* Recently Played Section */}
      {hasRecentlyPlayed ? (
        <div className="mb-12">
          <RecentlyPlayedSection
            games={recentlyPlayed}
            title="Recently Played"
            maxVisible={4}
            onClearHistory={clearRecentlyPlayed}
            showClearButton={true}
          />
        </div>
      ) : (
        <div className="mb-12">
          <EmptyRecentlyPlayedSection
            onBrowseGames={() => updateFilter({ search: undefined, category: undefined })}
          />
        </div>
      )}

      {/* Featured Games Section */}
      {featuredGames.length > 0 && (
        <div className="mb-12">
          <FeaturedGamesSection
            games={featuredGames}
            title="Featured Games"
            displayMode="carousel"
            autoRotate={true}
            rotationInterval={5000}
            maxVisible={4}
            className=""
          />
        </div>
      )}

      {/* Main Games Grid */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            {filter.category 
              ? `${gameContext.categories.find(c => c.id === filter.category)?.name || 'Category'} Games`
              : filter.search 
                ? `Search Results for "${filter.search}"`
                : 'All Games'
            }
          </h2>
          <div className="text-sm text-gray-500">
            {games.length} game{games.length !== 1 ? 's' : ''} found
          </div>
        </div>
        
        {games.length === 0 && !loading ? (
          <div className="text-center py-12">
            <Gamepad2 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter.search ? 'No games found' : filter.category ? 'No games in this category' : 'No games available'}
            </h3>
            <p className="text-gray-500 mb-4">
              {filter.search 
                ? `Try searching for something else or browse our categories above.`
                : filter.category 
                  ? 'Try selecting a different category or view all games.'
                  : 'Games will appear here once they are loaded.'
              }
            </p>
            {(filter.search || filter.category) && (
              <button
                onClick={() => updateFilter({ search: undefined, category: undefined })}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                View All Games
              </button>
            )}
          </div>
        ) : (
          <GameGrid
            games={games}
            columns={3}
            loading={loading}
          />
        )}
      </div>


      {/* What is Geometry Dash Spam Test Section */}
      <section id="what-is" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What is Geometry Dash Spam Test?</h2>
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
              <p className="mb-4">The Geometry Dash Spam Test is a specialized practice mode that measures your ability to tap or click rapidly and consistently. In the world of Geometry Dash, certain levels require players to achieve clicking speeds of up to 50 CPS (clicks per second), with some extreme challenges demanding nearly 100 CPS.</p>
              <p className="mb-4">Unlike standard Geometry Dash levels that test various skills, the Geometry Dash Spam Test specifically focuses on your ability to maintain high-speed clicking while preserving accuracy. The test typically features wave segments where players control a small triangle that moves up and down as you tap or click.</p>
              <p>The objective is straightforward yet challenging: navigate through increasingly narrow passages without touching any obstacles or boundaries. If you miss a tap/click or mistime it, your icon will crash and you have to start over. Just stay focused and keep the rhythm.</p>
            </div>
            <div className="md:w-1/2">
              <div className="bg-indigo-50 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">Why Geometry Dash Spam Test Matters</h3>
                <p className="mb-4">For serious Geometry Dash players, mastering spam clicking is not optional—it's essential. Many of the game's hardest levels, particularly those created by the community, incorporate sections that demand exceptional clicking speed and consistency.</p>
                <p>The Geometry Dash Spam Test provides a controlled environment where you can practice this specific skill without the frustration of failing an entire level due to one difficult section. Regular practice has been shown to significantly improve player performance across all aspects of the game.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="benefits" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Benefits of Practicing Geometry Dash Spam Test</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Improved Reaction Time</h3>
                <p>The Geometry Dash Spam Test forces players to react instantly to visual cues, significantly enhancing overall reaction time. This improvement can transfer to other games and even real-life situations requiring quick reflexes.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Enhanced Hand-Eye Coordination</h3>
                <p>Maintaining precise control while clicking at high speeds develops exceptional hand-eye coordination. Players often report improved dexterity in other fine motor tasks after consistent Geometry Dash Spam Test practice.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Mental Focus and Concentration</h3>
                <p>Successfully completing a Geometry Dash Spam Test requires intense concentration for extended periods. This mental training helps develop focus that can be applied to studying, work, and other activities requiring sustained attention.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Stress Management</h3>
                <p>The high-pressure nature of the Geometry Dash Spam Test teaches players to perform under stress. Learning to maintain composure and execution despite increasing difficulty is a valuable skill in many aspects of life.</p>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section id="improve" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How to Improve Your Geometry Dash Spam Test Performance</h2>
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 md:pr-8 mb-8 md:mb-0">
              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h3 className="text-xl font-semibold mb-3">Start Slow and Build Consistency</h3>
                <p>Begin with slower, more manageable sections and focus on consistency rather than raw speed. It's better to complete easier tests with perfect accuracy than to fail repeatedly at more difficult challenges. As your consistency improves, gradually increase the difficulty and speed requirements.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Practice Daily in Short Sessions</h3>
                <p>Brief, daily practice sessions are more effective than occasional marathon sessions. Aim for 15-30 minutes of focused practice each day, concentrating on specific techniques or problem areas. This approach prevents fatigue and promotes steady improvement.</p>
              </div>
            </div>
            <div className="md:w-1/2 md:pl-8">
              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h3 className="text-xl font-semibold mb-3">Analyze Your Failures</h3>
                <p>When you fail a Geometry Dash Spam Test, take a moment to understand why. Was your clicking too slow, too fast, or inconsistent? Identifying specific weaknesses allows you to target your practice more effectively.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Experiment with Different Clicking Techniques</h3>
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