import { GameCategory } from '../types/game';

/**
 * Game categories configuration
 */
export const gameCategories: GameCategory[] = [
  {
    id: 'geometry-dash',
    name: 'Geometry Dash',
    slug: 'geometry-dash',
    description: 'Rhythm-based platformer challenges that test your reflexes and timing',
    icon: 'Triangle',
    color: 'blue'
  },
  {
    id: 'action',
    name: 'Action Games',
    slug: 'action',
    description: 'Fast-paced action adventures and arcade games',
    icon: 'Zap',
    color: 'red'
  },
  {
    id: 'puzzle',
    name: 'Puzzle Games',
    slug: 'puzzle',
    description: 'Mind-bending puzzle challenges and brain teasers',
    icon: 'Puzzle',
    color: 'green'
  },
  {
    id: 'arcade',
    name: 'Arcade Games',
    slug: 'arcade',
    description: 'Classic arcade-style games with simple controls',
    icon: 'Gamepad2',
    color: 'purple'
  },
  {
    id: 'sports',
    name: 'Sports Games',
    slug: 'sports',
    description: 'Sports simulations and athletic challenges',
    icon: 'Trophy',
    color: 'orange'
  },
  {
    id: 'strategy',
    name: 'Strategy Games',
    slug: 'strategy',
    description: 'Strategic thinking and planning games',
    icon: 'Target',
    color: 'indigo'
  }
];

/**
 * Get category by ID
 */
export const getCategoryById = (id: string): GameCategory | undefined => {
  return gameCategories.find(category => category.id === id);
};

/**
 * Get category by slug
 */
export const getCategoryBySlug = (slug: string): GameCategory | undefined => {
  return gameCategories.find(category => category.slug === slug);
};