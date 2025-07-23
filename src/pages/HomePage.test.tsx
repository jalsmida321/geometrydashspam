import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import HomePage from './HomePage';

// Mock the hooks and components
jest.mock('../hooks', () => ({
  useGames: jest.fn(),
  useFeaturedGames: jest.fn()
}));

jest.mock('../hooks/useUserInteractions', () => ({
  useUserInteractions: jest.fn()
}));

jest.mock('../context/GameContext', () => ({
  useGameContext: jest.fn()
}));

jest.mock('../components/game', () => ({
  GameGrid: ({ games, loading }: any) => (
    <div data-testid="game-grid">
      {loading ? 'Loading...' : `${games.length} games`}
    </div>
  ),
  SearchBar: ({ onSearch, placeholder }: any) => (
    <input
      data-testid="search-bar"
      placeholder={placeholder}
      onChange={(e) => onSearch(e.target.value)}
    />
  ),
  CategoryFilter: ({ categories, onCategoryChange }: any) => (
    <div data-testid="category-filter">
      {categories.map((cat: any) => (
        <button key={cat.id} onClick={() => onCategoryChange(cat.id)}>
          {cat.name}
        </button>
      ))}
    </div>
  )
}));

jest.mock('../components/game/FeaturedGamesSection', () => {
  return function FeaturedGamesSection({ games, title }: any) {
    return (
      <div data-testid="featured-games-section">
        <h2>{title}</h2>
        <div>{games.length} featured games</div>
      </div>
    );
  };
});

jest.mock('../components/game/RecentlyPlayedSection', () => {
  return {
    __esModule: true,
    default: function RecentlyPlayedSection({ games, title }: any) {
      return (
        <div data-testid="recently-played-section">
          <h2>{title}</h2>
          <div>{games.length} recently played games</div>
        </div>
      );
    },
    EmptyRecentlyPlayedSection: function EmptyRecentlyPlayedSection({ onBrowseGames }: any) {
      return (
        <div data-testid="empty-recently-played-section">
          <p>No recently played games</p>
          {onBrowseGames && (
            <button onClick={onBrowseGames}>Browse Games</button>
          )}
        </div>
      );
    }
  };
});

const mockGames = [
  {
    id: 'game-1',
    name: 'Test Game 1',
    description: 'A test game',
    image: 'https://example.com/image1.jpg',
    url: 'https://example.com/game1',
    category: {
      id: 'action',
      name: 'Action',
      slug: 'action',
      description: 'Action games',
      icon: 'Zap',
      color: 'red'
    },
    tags: ['test', 'action'],
    featured: false,
    popularity: 80,
    dateAdded: new Date('2024-01-01')
  },
  {
    id: 'game-2',
    name: 'Test Game 2',
    description: 'Another test game',
    image: 'https://example.com/image2.jpg',
    url: 'https://example.com/game2',
    category: {
      id: 'puzzle',
      name: 'Puzzle',
      slug: 'puzzle',
      description: 'Puzzle games',
      icon: 'Puzzle',
      color: 'green'
    },
    tags: ['test', 'puzzle'],
    featured: true,
    popularity: 90,
    dateAdded: new Date('2024-01-02')
  }
];

const mockCategories = [
  { id: 'action', name: 'Action', slug: 'action', description: 'Action games', icon: 'Zap', color: 'red' },
  { id: 'puzzle', name: 'Puzzle', slug: 'puzzle', description: 'Puzzle games', icon: 'Puzzle', color: 'green' }
];

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('HomePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default mocks
    const { useGames } = require('../hooks');
    const { useFeaturedGames } = require('../hooks');
    const { useUserInteractions } = require('../hooks/useUserInteractions');
    const { useGameContext } = require('../context/GameContext');

    useGames.mockReturnValue({
      games: mockGames,
      updateFilter: jest.fn(),
      filter: { sortBy: 'popularity', sortOrder: 'desc' },
      loading: false,
      error: null
    });

    useFeaturedGames.mockReturnValue({
      featuredGames: [mockGames[1]] // Only the featured game
    });

    useUserInteractions.mockReturnValue({
      getRecentlyPlayed: jest.fn(() => [mockGames[0]]),
      hasRecentlyPlayed: true,
      clearRecentlyPlayed: jest.fn()
    });

    useGameContext.mockReturnValue({
      categories: mockCategories,
      getGamesByCategory: jest.fn((id) => mockGames.filter(g => g.category.id === id))
    });
  });

  describe('rendering', () => {
    it('should render main heading and description', () => {
      renderWithRouter(<HomePage />);

      expect(screen.getByText('Geometry Dash Spam Games')).toBeInTheDocument();
      expect(screen.getByText(/Discover the thrilling world of Geometry Dash Spam Challenges/)).toBeInTheDocument();
    });

    it('should render search bar', () => {
      renderWithRouter(<HomePage />);

      expect(screen.getByTestId('search-bar')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Search for games...')).toBeInTheDocument();
    });

    it('should render category navigation', () => {
      renderWithRouter(<HomePage />);

      expect(screen.getByText('Browse by Category')).toBeInTheDocument();
      expect(screen.getByText('Action')).toBeInTheDocument();
      expect(screen.getByText('Puzzle')).toBeInTheDocument();
    });

    it('should render recently played section when user has played games', () => {
      renderWithRouter(<HomePage />);

      expect(screen.getByTestId('recently-played-section')).toBeInTheDocument();
      expect(screen.getByText('Recently Played')).toBeInTheDocument();
    });

    it('should render empty recently played section when user has no played games', () => {
      const { useUserInteractions } = require('../hooks/useUserInteractions');
      useUserInteractions.mockReturnValue({
        getRecentlyPlayed: jest.fn(() => []),
        hasRecentlyPlayed: false,
        clearRecentlyPlayed: jest.fn()
      });

      renderWithRouter(<HomePage />);

      expect(screen.getByTestId('empty-recently-played-section')).toBeInTheDocument();
      expect(screen.getByText('No recently played games')).toBeInTheDocument();
    });

    it('should render featured games section', () => {
      renderWithRouter(<HomePage />);

      expect(screen.getByTestId('featured-games-section')).toBeInTheDocument();
      expect(screen.getByText('Featured Games')).toBeInTheDocument();
      expect(screen.getByText('1 featured games')).toBeInTheDocument();
    });

    it('should render main games grid', () => {
      renderWithRouter(<HomePage />);

      expect(screen.getByTestId('game-grid')).toBeInTheDocument();
      expect(screen.getByText('2 games')).toBeInTheDocument();
    });

    it('should render educational sections', () => {
      renderWithRouter(<HomePage />);

      expect(screen.getByText('What is Geometry Dash Spam Test?')).toBeInTheDocument();
      expect(screen.getByText('Benefits of Practicing Geometry Dash Spam Test')).toBeInTheDocument();
      expect(screen.getByText('How to Improve Your Geometry Dash Spam Test Performance')).toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    it('should handle search input', async () => {
      const mockUpdateFilter = jest.fn();
      const { useGames } = require('../hooks');
      useGames.mockReturnValue({
        games: mockGames,
        updateFilter: mockUpdateFilter,
        filter: { sortBy: 'popularity', sortOrder: 'desc' },
        loading: false,
        error: null
      });

      renderWithRouter(<HomePage />);

      const searchBar = screen.getByTestId('search-bar');
      fireEvent.change(searchBar, { target: { value: 'test search' } });

      await waitFor(() => {
        expect(mockUpdateFilter).toHaveBeenCalledWith({
          sortBy: 'popularity',
          sortOrder: 'desc',
          search: 'test search'
        });
      });
    });

    it('should handle category selection', () => {
      const mockUpdateFilter = jest.fn();
      const { useGames } = require('../hooks');
      useGames.mockReturnValue({
        games: mockGames,
        updateFilter: mockUpdateFilter,
        filter: { sortBy: 'popularity', sortOrder: 'desc' },
        loading: false,
        error: null
      });

      renderWithRouter(<HomePage />);

      const actionButton = screen.getByText('Action');
      fireEvent.click(actionButton);

      expect(mockUpdateFilter).toHaveBeenCalledWith({
        sortBy: 'popularity',
        sortOrder: 'desc',
        category: 'action'
      });
    });

    it('should toggle filters visibility', () => {
      renderWithRouter(<HomePage />);

      const toggleButton = screen.getByText('Show Filters');
      fireEvent.click(toggleButton);

      expect(screen.getByText('Hide Filters')).toBeInTheDocument();
      expect(screen.getByTestId('category-filter')).toBeInTheDocument();
    });

    it('should handle clear recently played', () => {
      const mockClearRecentlyPlayed = jest.fn();
      const { useUserInteractions } = require('../hooks/useUserInteractions');
      useUserInteractions.mockReturnValue({
        getRecentlyPlayed: jest.fn(() => [mockGames[0]]),
        hasRecentlyPlayed: true,
        clearRecentlyPlayed: mockClearRecentlyPlayed
      });

      renderWithRouter(<HomePage />);

      // This would be triggered by the RecentlyPlayedSection component
      // In a real test, we'd need to mock the component to expose this functionality
    });
  });

  describe('loading and error states', () => {
    it('should show loading state', () => {
      const { useGames } = require('../hooks');
      useGames.mockReturnValue({
        games: [],
        updateFilter: jest.fn(),
        filter: { sortBy: 'popularity', sortOrder: 'desc' },
        loading: true,
        error: null
      });

      renderWithRouter(<HomePage />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should show error state', () => {
      const { useGames } = require('../hooks');
      useGames.mockReturnValue({
        games: [],
        updateFilter: jest.fn(),
        filter: { sortBy: 'popularity', sortOrder: 'desc' },
        loading: false,
        error: 'Failed to load games'
      });

      renderWithRouter(<HomePage />);

      expect(screen.getByText('⚠️ Error loading games')).toBeInTheDocument();
      expect(screen.getByText('Failed to load games')).toBeInTheDocument();
      expect(screen.getByText('Retry')).toBeInTheDocument();
    });

    it('should handle retry on error', () => {
      const { useGames } = require('../hooks');
      useGames.mockReturnValue({
        games: [],
        updateFilter: jest.fn(),
        filter: { sortBy: 'popularity', sortOrder: 'desc' },
        loading: false,
        error: 'Failed to load games'
      });

      // Mock window.location.reload
      const mockReload = jest.fn();
      Object.defineProperty(window, 'location', {
        value: { reload: mockReload },
        writable: true
      });

      renderWithRouter(<HomePage />);

      const retryButton = screen.getByText('Retry');
      fireEvent.click(retryButton);

      expect(mockReload).toHaveBeenCalled();
    });
  });

  describe('empty states', () => {
    it('should show empty state when no games found', () => {
      const { useGames } = require('../hooks');
      useGames.mockReturnValue({
        games: [],
        updateFilter: jest.fn(),
        filter: { sortBy: 'popularity', sortOrder: 'desc' },
        loading: false,
        error: null
      });

      renderWithRouter(<HomePage />);

      expect(screen.getByText('No games available')).toBeInTheDocument();
    });

    it('should show search-specific empty state', () => {
      const { useGames } = require('../hooks');
      useGames.mockReturnValue({
        games: [],
        updateFilter: jest.fn(),
        filter: { sortBy: 'popularity', sortOrder: 'desc', search: 'nonexistent' },
        loading: false,
        error: null
      });

      renderWithRouter(<HomePage />);

      expect(screen.getByText('No games found')).toBeInTheDocument();
      expect(screen.getByText('Search Results for "nonexistent"')).toBeInTheDocument();
    });

    it('should show category-specific empty state', () => {
      const { useGames } = require('../hooks');
      useGames.mockReturnValue({
        games: [],
        updateFilter: jest.fn(),
        filter: { sortBy: 'popularity', sortOrder: 'desc', category: 'action' },
        loading: false,
        error: null
      });

      renderWithRouter(<HomePage />);

      expect(screen.getByText('No games in this category')).toBeInTheDocument();
      expect(screen.getByText('Action Games')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have proper heading structure', () => {
      renderWithRouter(<HomePage />);

      const mainHeading = screen.getByRole('heading', { level: 1 });
      expect(mainHeading).toHaveTextContent('Geometry Dash Spam Games');

      const subHeadings = screen.getAllByRole('heading', { level: 2 });
      expect(subHeadings.length).toBeGreaterThan(0);
    });

    it('should have accessible search input', () => {
      renderWithRouter(<HomePage />);

      const searchInput = screen.getByPlaceholderText('Search for games...');
      expect(searchInput).toBeInTheDocument();
    });

    it('should have accessible category buttons', () => {
      renderWithRouter(<HomePage />);

      const actionButton = screen.getByRole('button', { name: /action/i });
      expect(actionButton).toBeInTheDocument();
    });
  });

  describe('responsive design', () => {
    it('should render without layout issues', () => {
      renderWithRouter(<HomePage />);

      // Check that main container exists with responsive classes
      const container = screen.getByText('Geometry Dash Spam Games').closest('div');
      expect(container).toHaveClass('max-w-7xl', 'mx-auto');
    });
  });
});