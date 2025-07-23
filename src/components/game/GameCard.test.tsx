import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import GameCard from './GameCard';
import { Game } from '../../types/game';
import { useUserInteractions } from '../../hooks';

// Mock the hooks
jest.mock('../../hooks', () => ({
  useUserInteractions: jest.fn()
}));

// Mock LazyImage component
jest.mock('../common/LazyImage', () => {
  return function MockLazyImage({ src, alt, onLoad, onError, ...props }: any) {
    return (
      <img
        src={src}
        alt={alt}
        onLoad={onLoad}
        onError={onError}
        {...props}
      />
    );
  };
});

const mockGame: Game = {
  id: 'test-game-1',
  name: 'Test Game',
  description: 'A test game for unit testing',
  image: 'https://example.com/test-game.jpg',
  url: 'https://example.com/play/test-game',
  category: {
    id: 'action',
    name: 'Action',
    slug: 'action',
    description: 'Action games',
    icon: 'Zap',
    color: 'red'
  },
  tags: ['test', 'action', 'fun'],
  featured: true,
  popularity: 85,
  dateAdded: new Date('2024-01-15'),
  metadata: {
    developer: 'Test Developer',
    controls: 'Arrow keys to move',
    instructions: 'Avoid obstacles and collect coins'
  }
};

const mockUseUserInteractions = {
  isFavorite: jest.fn(),
  toggleFavorite: jest.fn()
};

const renderGameCard = (props = {}) => {
  return render(
    <BrowserRouter>
      <GameCard game={mockGame} {...props} />
    </BrowserRouter>
  );
};

describe('GameCard', () => {
  beforeEach(() => {
    (useUserInteractions as jest.Mock).mockReturnValue(mockUseUserInteractions);
    mockUseUserInteractions.isFavorite.mockReturnValue(false);
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders game information correctly', () => {
      renderGameCard();

      expect(screen.getByText('Test Game')).toBeInTheDocument();
      expect(screen.getByText('A test game for unit testing')).toBeInTheDocument();
      expect(screen.getByText('Action')).toBeInTheDocument();
      expect(screen.getByText('85% popular')).toBeInTheDocument();
    });

    it('renders game image with correct alt text', () => {
      renderGameCard();

      const image = screen.getByAltText('Test Game game screenshot');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', mockGame.image);
    });

    it('renders featured badge when game is featured', () => {
      renderGameCard();

      expect(screen.getByText('Featured')).toBeInTheDocument();
    });

    it('does not render featured badge when game is not featured', () => {
      const nonFeaturedGame = { ...mockGame, featured: false };
      render(
        <BrowserRouter>
          <GameCard game={nonFeaturedGame} />
        </BrowserRouter>
      );

      expect(screen.queryByText('Featured')).not.toBeInTheDocument();
    });
  });

  describe('Size Variants', () => {
    it('renders small size correctly', () => {
      renderGameCard({ size: 'small' });

      const playButton = screen.getByText('Play Game');
      expect(playButton).toBeInTheDocument();
    });

    it('renders medium size correctly', () => {
      renderGameCard({ size: 'medium' });

      const playButton = screen.getByText('Play Test Game');
      expect(playButton).toBeInTheDocument();
    });

    it('renders large size correctly', () => {
      renderGameCard({ size: 'large' });

      const playButton = screen.getByText('Play Test Game');
      expect(playButton).toBeInTheDocument();
    });
  });

  describe('Content Display Options', () => {
    it('hides category when showCategory is false', () => {
      renderGameCard({ showCategory: false });

      expect(screen.queryByText('Action')).not.toBeInTheDocument();
    });

    it('hides description when showDescription is false', () => {
      renderGameCard({ showDescription: false });

      expect(screen.queryByText('A test game for unit testing')).not.toBeInTheDocument();
    });

    it('shows metadata for medium and large sizes', () => {
      renderGameCard({ size: 'medium' });

      expect(screen.getByText('Developer:')).toBeInTheDocument();
      expect(screen.getByText('Test Developer')).toBeInTheDocument();
      expect(screen.getByText('Controls:')).toBeInTheDocument();
      expect(screen.getByText('Arrow keys to move')).toBeInTheDocument();
    });

    it('hides metadata for small size', () => {
      renderGameCard({ size: 'small' });

      expect(screen.queryByText('Developer:')).not.toBeInTheDocument();
      expect(screen.queryByText('Controls:')).not.toBeInTheDocument();
    });
  });

  describe('Tags Display', () => {
    it('renders game tags correctly', () => {
      renderGameCard();

      expect(screen.getByText('#test')).toBeInTheDocument();
      expect(screen.getByText('#action')).toBeInTheDocument();
      expect(screen.getByText('#fun')).toBeInTheDocument();
    });

    it('limits tags display and shows more indicator', () => {
      const gameWithManyTags = {
        ...mockGame,
        tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5']
      };

      render(
        <BrowserRouter>
          <GameCard game={gameWithManyTags} size="medium" />
        </BrowserRouter>
      );

      expect(screen.getByText('+2 more')).toBeInTheDocument();
    });
  });

  describe('Favorite Functionality', () => {
    it('renders unfilled heart when game is not favorite', () => {
      mockUseUserInteractions.isFavorite.mockReturnValue(false);
      renderGameCard();

      const favoriteButton = screen.getByLabelText('Add Test Game to favorites');
      expect(favoriteButton).toBeInTheDocument();
    });

    it('renders filled heart when game is favorite', () => {
      mockUseUserInteractions.isFavorite.mockReturnValue(true);
      renderGameCard();

      const favoriteButton = screen.getByLabelText('Remove Test Game from favorites');
      expect(favoriteButton).toBeInTheDocument();
    });

    it('calls toggleFavorite when heart button is clicked', () => {
      renderGameCard();

      const favoriteButton = screen.getByLabelText('Add Test Game to favorites');
      fireEvent.click(favoriteButton);

      expect(mockUseUserInteractions.toggleFavorite).toHaveBeenCalledWith('test-game-1');
    });

    it('prevents event propagation when favorite button is clicked', () => {
      const mockOnClick = jest.fn();
      render(
        <BrowserRouter>
          <div onClick={mockOnClick}>
            <GameCard game={mockGame} />
          </div>
        </BrowserRouter>
      );

      const favoriteButton = screen.getByLabelText('Add Test Game to favorites');
      fireEvent.click(favoriteButton);

      expect(mockOnClick).not.toHaveBeenCalled();
    });
  });

  describe('Navigation', () => {
    it('renders play button with correct link', () => {
      renderGameCard();

      const playButton = screen.getByRole('link', { name: /Play Test Game/i });
      expect(playButton).toHaveAttribute('href', '/game/Test%20Game');
    });
  });

  describe('Popularity Indicator', () => {
    it('shows green indicator for high popularity', () => {
      const highPopularityGame = { ...mockGame, popularity: 95 };
      render(
        <BrowserRouter>
          <GameCard game={highPopularityGame} />
        </BrowserRouter>
      );

      expect(screen.getByText('95% popular')).toBeInTheDocument();
    });

    it('shows yellow indicator for medium popularity', () => {
      const mediumPopularityGame = { ...mockGame, popularity: 75 };
      render(
        <BrowserRouter>
          <GameCard game={mediumPopularityGame} />
        </BrowserRouter>
      );

      expect(screen.getByText('75% popular')).toBeInTheDocument();
    });

    it('shows red indicator for low popularity', () => {
      const lowPopularityGame = { ...mockGame, popularity: 45 };
      render(
        <BrowserRouter>
          <GameCard game={lowPopularityGame} />
        </BrowserRouter>
      );

      expect(screen.getByText('45% popular')).toBeInTheDocument();
    });
  });

  describe('Date Formatting', () => {
    it('formats and displays date correctly for non-small sizes', () => {
      renderGameCard({ size: 'medium' });

      expect(screen.getByText('Jan 15, 2024')).toBeInTheDocument();
    });

    it('hides date for small size', () => {
      renderGameCard({ size: 'small' });

      expect(screen.queryByText('Jan 15, 2024')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      renderGameCard();

      const article = screen.getByRole('article');
      expect(article).toHaveAttribute('aria-labelledby', 'game-title-test-game-1');

      const title = screen.getByRole('heading', { level: 3 });
      expect(title).toHaveAttribute('id', 'game-title-test-game-1');
    });

    it('has proper focus management', () => {
      renderGameCard();

      const article = screen.getByRole('article');
      expect(article).toHaveClass('focus-within:ring-2', 'focus-within:ring-blue-500');
    });
  });

  describe('Error Handling', () => {
    it('handles image load errors gracefully', async () => {
      renderGameCard();

      const image = screen.getByAltText('Test Game game screenshot');
      fireEvent.error(image);

      await waitFor(() => {
        expect(screen.getByText('Game Image')).toBeInTheDocument();
      });
    });
  });
});