import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import FavoritesPage from './FavoritesPage';

// Mock the hooks
jest.mock('../hooks/useUserInteractions', () => ({
  useUserInteractions: jest.fn()
}));

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

// Mock window.confirm
const mockConfirm = jest.fn();
Object.defineProperty(window, 'confirm', {
  value: mockConfirm,
  writable: true
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

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('FavoritesPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockConfirm.mockReturnValue(false);
  });

  describe('with favorite games', () => {
    beforeEach(() => {
      const { useUserInteractions } = require('../hooks/useUserInteractions');
      useUserInteractions.mockReturnValue({
        getFavorites: jest.fn(() => mockGames),
        hasFavorites: true,
        favoritesCount: 2,
        clearFavorites: jest.fn()
      });
    });

    it('should render favorites page with games', () => {
      renderWithRouter(<FavoritesPage />);

      expect(screen.getByText('My Favorites')).toBeInTheDocument();
      expect(screen.getByText('2 games in your favorites collection')).toBeInTheDocument();
      expect(screen.getByText('Your Favorite Games')).toBeInTheDocument();
    });

    it('should display favorites statistics', () => {
      renderWithRouter(<FavoritesPage />);

      expect(screen.getByText('2')).toBeInTheDocument(); // Favorite Games count
      expect(screen.getByText('85%')).toBeInTheDocument(); // Average popularity
      expect(screen.getByText('2')).toBeInTheDocument(); // Categories count
    });

    it('should show clear all favorites button', () => {
      renderWithRouter(<FavoritesPage />);

      expect(screen.getByText('Clear All Favorites')).toBeInTheDocument();
    });

    it('should show tips section', () => {
      renderWithRouter(<FavoritesPage />);

      expect(screen.getByText('💡 Tips for Managing Favorites')).toBeInTheDocument();
      expect(screen.getByText('Click the heart icon on any game card to add it to favorites')).toBeInTheDocument();
      expect(screen.getByText('Your favorites are saved locally and private to you')).toBeInTheDocument();
    });

    it('should call clearFavorites when clear button is clicked and confirmed', async () => {
      const mockClearFavorites = jest.fn();
      const { useUserInteractions } = require('../hooks/useUserInteractions');
      useUserInteractions.mockReturnValue({
        getFavorites: jest.fn(() => mockGames),
        hasFavorites: true,
        favoritesCount: 2,
        clearFavorites: mockClearFavorites
      });

      mockConfirm.mockReturnValue(true);

      renderWithRouter(<FavoritesPage />);

      const clearButton = screen.getByText('Clear All Favorites');
      fireEvent.click(clearButton);

      await waitFor(() => {
        expect(mockConfirm).toHaveBeenCalledWith(
          'Are you sure you want to remove all games from your favorites? This action cannot be undone.'
        );
        expect(mockClearFavorites).toHaveBeenCalled();
      });
    });

    it('should not call clearFavorites when clear button is clicked but not confirmed', async () => {
      const mockClearFavorites = jest.fn();
      const { useUserInteractions } = require('../hooks/useUserInteractions');
      useUserInteractions.mockReturnValue({
        getFavorites: jest.fn(() => mockGames),
        hasFavorites: true,
        favoritesCount: 2,
        clearFavorites: mockClearFavorites
      });

      mockConfirm.mockReturnValue(false);

      renderWithRouter(<FavoritesPage />);

      const clearButton = screen.getByText('Clear All Favorites');
      fireEvent.click(clearButton);

      await waitFor(() => {
        expect(mockConfirm).toHaveBeenCalled();
        expect(mockClearFavorites).not.toHaveBeenCalled();
      });
    });
  });

  describe('without favorite games', () => {
    beforeEach(() => {
      const { useUserInteractions } = require('../hooks/useUserInteractions');
      useUserInteractions.mockReturnValue({
        getFavorites: jest.fn(() => []),
        hasFavorites: false,
        favoritesCount: 0,
        clearFavorites: jest.fn()
      });
    });

    it('should render empty state', () => {
      renderWithRouter(<FavoritesPage />);

      expect(screen.getByText('My Favorites')).toBeInTheDocument();
      expect(screen.getByText('Build your personal collection of favorite games')).toBeInTheDocument();
      expect(screen.getByText('No Favorite Games Yet')).toBeInTheDocument();
    });

    it('should not show clear all favorites button', () => {
      renderWithRouter(<FavoritesPage />);

      expect(screen.queryByText('Clear All Favorites')).not.toBeInTheDocument();
    });

    it('should show empty state message and instructions', () => {
      renderWithRouter(<FavoritesPage />);

      expect(screen.getByText('Start building your personal collection by adding games to your favorites.')).toBeInTheDocument();
      expect(screen.getByText('How to Add Favorites')).toBeInTheDocument();
    });

    it('should show browse games and view all games buttons', () => {
      renderWithRouter(<FavoritesPage />);

      expect(screen.getByText('Browse Games')).toBeInTheDocument();
      expect(screen.getByText('View All Games')).toBeInTheDocument();
    });

    it('should navigate to home when browse games is clicked', () => {
      renderWithRouter(<FavoritesPage />);

      const browseButton = screen.getByText('Browse Games');
      fireEvent.click(browseButton);

      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('should navigate to games page when view all games is clicked', () => {
      renderWithRouter(<FavoritesPage />);

      const viewAllButton = screen.getByText('View All Games');
      fireEvent.click(viewAllButton);

      expect(mockNavigate).toHaveBeenCalledWith('/games');
    });

    it('should show onboarding steps', () => {
      renderWithRouter(<FavoritesPage />);

      expect(screen.getByText('Find a Game')).toBeInTheDocument();
      expect(screen.getByText('Click the Heart')).toBeInTheDocument();
      expect(screen.getByText('Access Anytime')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    beforeEach(() => {
      const { useUserInteractions } = require('../hooks/useUserInteractions');
      useUserInteractions.mockReturnValue({
        getFavorites: jest.fn(() => mockGames),
        hasFavorites: true,
        favoritesCount: 2,
        clearFavorites: jest.fn()
      });
    });

    it('should have proper heading structure', () => {
      renderWithRouter(<FavoritesPage />);

      const mainHeading = screen.getByRole('heading', { level: 1 });
      expect(mainHeading).toHaveTextContent('My Favorites');

      const subHeadings = screen.getAllByRole('heading', { level: 2 });
      expect(subHeadings.length).toBeGreaterThan(0);
    });

    it('should have accessible buttons', () => {
      renderWithRouter(<FavoritesPage />);

      const clearButton = screen.getByRole('button', { name: /clear all favorites/i });
      expect(clearButton).toBeInTheDocument();
    });
  });

  describe('responsive design', () => {
    beforeEach(() => {
      const { useUserInteractions } = require('../hooks/useUserInteractions');
      useUserInteractions.mockReturnValue({
        getFavorites: jest.fn(() => mockGames),
        hasFavorites: true,
        favoritesCount: 2,
        clearFavorites: jest.fn()
      });
    });

    it('should render without layout issues', () => {
      renderWithRouter(<FavoritesPage />);

      // Check that main container exists
      const container = screen.getByText('My Favorites').closest('div');
      expect(container).toHaveClass('max-w-7xl', 'mx-auto');
    });
  });
});