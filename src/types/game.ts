/**
 * Core game data interfaces for the classic game site
 */

/**
 * Represents a game category
 */
export interface GameCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
}

/**
 * Represents a game
 */
export interface Game {
  id: string;
  name: string;
  description: string;
  image: string;
  url: string;
  category: GameCategory;
  tags: string[];
  featured: boolean;
  popularity: number;
  dateAdded: Date;
  metadata?: {
    developer?: string;
    controls?: string;
    instructions?: string;
  };
}

/**
 * Filter options for games
 */
export interface GameFilter {
  category?: string;
  tags?: string[];
  search?: string;
  sortBy?: 'popularity' | 'name' | 'dateAdded';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Game context type for React Context
 */
export interface GameContextType {
  games: Game[];
  categories: GameCategory[];
  filteredGames: Game[];
  currentFilter: GameFilter;
  setFilter: (filter: GameFilter) => void;
  searchGames: (query: string) => void;
  getGamesByCategory: (categoryId: string) => Game[];
  getFeaturedGames: () => Game[];
  getRelatedGames: (gameId: string) => Game[];
  getRecentlyPlayed: () => Game[];
  addToRecentlyPlayed: (gameId: string) => void;
  toggleFavorite: (gameId: string) => void;
  getFavorites: () => Game[];
  isFavorite: (gameId: string) => boolean;
  clearRecentlyPlayed: () => void;
  clearFavorites: () => void;
}

/**
 * Props for the GameCard component
 */
export interface GameCardProps {
  game: Game;
  size?: 'small' | 'medium' | 'large';
  showCategory?: boolean;
  showDescription?: boolean;
}

/**
 * Props for the GameGrid component
 */
export interface GameGridProps {
  games: Game[];
  columns?: number;
  spacing?: 'tight' | 'normal' | 'loose';
  loading?: boolean;
  onGameClick?: (game: Game) => void;
  className?: string;
  emptyStateMessage?: string;
  showResultsCount?: boolean;
}

/**
 * Props for the CategoryFilter component
 */
export interface CategoryFilterProps {
  categories: GameCategory[];
  selectedCategory?: string;
  onCategoryChange: (categoryId: string) => void;
}

/**
 * Props for the SearchBar component
 */
export interface SearchBarProps {
  onSearch: (query: string, filter?: GameFilter) => void;
  placeholder?: string;
  suggestions?: string[];
  showFilters?: boolean;
  showSorting?: boolean;
  initialFilter?: GameFilter;
}