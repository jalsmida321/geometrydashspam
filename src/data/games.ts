import { Game } from '../types/game';
import { gameCategories, getCategoryById } from './categories';

/**
 * Games data configuration
 * Converting existing games to new data structure while preserving all content
 */
export const games: Game[] = [
  {
    id: 'geometry-dash-spam-test',
    name: 'Geometry Dash Spam Test',
    description: 'Test your spamming skills in this exciting Geometry Dash challenge!',
    image: 'https://pub-9cd8442eae39491496da90d370d65538.r2.dev/geometry-dash-spam-test.png',
    url: 'https://pub-9cd8442eae39491496da90d370d65538.r2.dev/Geometry-Dash-spam-test.html',
    category: getCategoryById('geometry-dash')!,
    tags: ['spam', 'challenge', 'rhythm', 'clicking'],
    featured: true,
    popularity: 95,
    dateAdded: new Date('2024-01-01'),
    metadata: {
      developer: 'Geometry Dash Community',
      controls: 'Click or tap to jump/fly',
      instructions: 'Navigate through narrow passages by clicking rapidly and consistently. Maintain high-speed clicking while preserving accuracy.'
    }
  },
  {
    id: 'geometry-dash-spam-challenge',
    name: 'Geometry Dash Spam Challenge',
    description: 'Push your limits in this intense Geometry Dash spam challenge!',
    image: 'https://pub-9cd8442eae39491496da90d370d65538.r2.dev/geometry-dash-spam-challenge.png',
    url: 'https://pub-9cd8442eae39491496da90d370d65538.r2.dev/Geometry-Dash-Spam-Challenge.html',
    category: getCategoryById('geometry-dash')!,
    tags: ['spam', 'challenge', 'intense', 'difficult'],
    featured: true,
    popularity: 88,
    dateAdded: new Date('2024-01-02'),
    metadata: {
      developer: 'Geometry Dash Community',
      controls: 'Click or tap rapidly',
      instructions: 'Take on the ultimate spam challenge with increasingly difficult sections that demand exceptional clicking speed.'
    }
  },
  {
    id: 'geometry-dash-spam-master',
    name: 'Geometry Dash Spam Master',
    description: 'Become the ultimate spam master in this Geometry Dash game!',
    image: 'https://pub-9cd8442eae39491496da90d370d65538.r2.dev/geometry-dash-spam-master.png',
    url: 'https://pub-9cd8442eae39491496da90d370d65538.r2.dev/Geometry-Dash-Spam-Master.html',
    category: getCategoryById('geometry-dash')!,
    tags: ['spam', 'master', 'advanced', 'skill'],
    featured: false,
    popularity: 82,
    dateAdded: new Date('2024-01-03'),
    metadata: {
      developer: 'Geometry Dash Community',
      controls: 'Click or tap to control',
      instructions: 'Master the art of spam clicking with precision timing and consistent rhythm.'
    }
  },
  {
    id: 'geometry-dash-spam-wave',
    name: 'Geometry Dash Spam Wave',
    description: 'Master the wave in this challenging Geometry Dash spam game!',
    image: 'https://pub-9cd8442eae39491496da90d370d65538.r2.dev/geometry-dash-spam-wave.png',
    url: 'https://pub-9cd8442eae39491496da90d370d65538.r2.dev/Geometry-Dash-Spam-Wave.html',
    category: getCategoryById('geometry-dash')!,
    tags: ['spam', 'wave', 'flying', 'control'],
    featured: true,
    popularity: 90,
    dateAdded: new Date('2024-01-04'),
    metadata: {
      developer: 'Geometry Dash Community',
      controls: 'Hold to fly up, release to fly down',
      instructions: 'Control the wave through tight spaces with precise spam clicking techniques.'
    }
  },
  {
    id: 'geometry-dash-spam-challenge-chall',
    name: 'Geometry Dash Spam Challenge Chall',
    description: 'Take on the ultimate spam challenge in this Geometry Dash game!',
    image: 'https://pub-9cd8442eae39491496da90d370d65538.r2.dev/geometry-dash-spam-chall.png',
    url: 'https://pub-9cd8442eae39491496da90d370d65538.r2.dev/Geometry-Dash-spam-chall.html',
    category: getCategoryById('geometry-dash')!,
    tags: ['spam', 'challenge', 'ultimate', 'extreme'],
    featured: false,
    popularity: 85,
    dateAdded: new Date('2024-01-05'),
    metadata: {
      developer: 'Geometry Dash Community',
      controls: 'Click rapidly to navigate',
      instructions: 'Face the ultimate test of spam clicking endurance and precision.'
    }
  },
  {
    id: 'aka-geometry-dash-spam',
    name: 'AKA Geometry Dash Spam',
    description: 'Experience a unique twist on Geometry Dash spam gameplay!',
    image: 'https://pub-9cd8442eae39491496da90d370d65538.r2.dev/AKA-geometry-dash-spam.png',
    url: 'https://pub-9cd8442eae39491496da90d370d65538.r2.dev/The-Great-Escape-AKA-Geometry-Spam.html',
    category: getCategoryById('geometry-dash')!,
    tags: ['spam', 'unique', 'escape', 'adventure'],
    featured: false,
    popularity: 78,
    dateAdded: new Date('2024-01-06'),
    metadata: {
      developer: 'Geometry Dash Community',
      controls: 'Click to jump and navigate',
      instructions: 'Experience The Great Escape with a unique twist on traditional spam gameplay.'
    }
  },
  {
    id: 'geometry-dash-wave-spam',
    name: 'Geometry Dash Wave Spam',
    description: 'This is geometry dash wave spam as much as you can and try to get through the impossible level',
    image: 'https://pub-9cd8442eae39491496da90d370d65538.r2.dev/geometry-dash-wave-spam.png',
    url: 'https://pub-9cd8442eae39491496da90d370d65538.r2.dev/geometry-dash-wave-spam.html',
    category: getCategoryById('geometry-dash')!,
    tags: ['spam', 'wave', 'impossible', 'endurance'],
    featured: true,
    popularity: 92,
    dateAdded: new Date('2024-01-07'),
    metadata: {
      developer: 'Geometry Dash Community',
      controls: 'Spam click to control wave movement',
      instructions: 'Spam click as much as you can to control the wave and try to get through this impossible level.'
    }
  }
];

/**
 * Get game by ID
 */
export const getGameById = (id: string): Game | undefined => {
  return games.find(game => game.id === id);
};

/**
 * Get game by name (for backward compatibility)
 */
export const getGameByName = (name: string): Game | undefined => {
  return games.find(game => game.name === name);
};

/**
 * Get games by category
 */
export const getGamesByCategory = (categoryId: string): Game[] => {
  return games.filter(game => game.category.id === categoryId);
};

/**
 * Get featured games
 */
export const getFeaturedGames = (): Game[] => {
  return games.filter(game => game.featured).sort((a, b) => b.popularity - a.popularity);
};

/**
 * Search games by name or description
 */
export const searchGames = (query: string): Game[] => {
  const lowercaseQuery = query.toLowerCase();
  return games.filter(game => 
    game.name.toLowerCase().includes(lowercaseQuery) ||
    game.description.toLowerCase().includes(lowercaseQuery) ||
    game.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

/**
 * Get related games based on category and tags
 */
export const getRelatedGames = (gameId: string, limit: number = 4): Game[] => {
  const currentGame = getGameById(gameId);
  if (!currentGame) return [];

  const relatedGames = games
    .filter(game => game.id !== gameId)
    .map(game => {
      let score = 0;
      
      // Same category gets higher score
      if (game.category.id === currentGame.category.id) {
        score += 10;
      }
      
      // Shared tags increase score
      const sharedTags = game.tags.filter(tag => currentGame.tags.includes(tag));
      score += sharedTags.length * 2;
      
      // Featured games get slight boost
      if (game.featured) {
        score += 1;
      }
      
      return { game, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.game);

  return relatedGames;
};