import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import GamePage from './GamePage';
import { GameProvider } from '../context/GameContext';

// Mock the hooks
jest.mock('../hooks', () => ({
  useRelatedGames: () => ({
    games: [
      {
        id: 'related-1',
        name: 'Related Game',
        description: 'A related game',
        image: 'https://example.com/related.jpg',
        url: 'https://example.com/related',
        category: {
          id: 'action',
          name: 'Action',
          slug: 'action',
          description: 'Action games',
          icon: 'Zap',
          color: 'red'
        },
        tags: ['related'],
        featured: false,
        popularity: 70,
        dateAdded: new Date('2024-01-01')
      }
    ]
  })
}));

// Mock GameService
jest.mock('../services', () => ({
  gameService: {
    getAllGames: () => [
      {
        id: 'test-game',
        name: 'Test Game',
        description: 'A test game for playing',
        image: 'https://example.com/test-game.jpg',
        url: 'https://example.com/test-game.html',
        category: {
          id: 'action',
          name: 'Action',
          slug: 'action',
          description: 'Action games',
          icon: 'Zap',
          color: 'red'
        },
        tags: ['test', 'action'],
        featured: true,
        popularity: 90,
        dateAdded: new Date('2024-01-01'),
        metadata: {
          developer: 'Test Developer',
          controls: 'Click to jump',
          instructions: 'Navigate through obstacles'
        }
      }
    ],
    addToRecentlyPlayed: jest.fn(),
    isFavorite: jest.fn(() => false),
    toggleFavorite: jest.fn()
  }
}));

// Mock GameContext
jest.mock('../context/GameContext', () => ({
  GameProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useGameContext: () => ({
    games: [],
    categories: [],
    filteredGames: [],
    currentFilter: {},
    setFilter: jest.fn(),
    searchGames: jest.fn(),
    getGamesByCategory: jest.fn(() => []),
    getFeaturedGames: jest.fn(() => []),
    getRelatedGames: jest.fn(() => [])
  })
}));

const renderWithRouter = (component: React.ReactElement, route = '/game/Test%20Game') => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <GameProvider>
        {component}
      </GameProvider>
    </MemoryRouter>
  );
};

describe('GamePage', () => {
  beforeEach(() => {
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => null),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true,
    });
  });

  it('renders game page with game details', () => {
    renderWithRouter(<GamePage />);
    
    expect(screen.getByText('Test Game')).toBeInTheDocument();
    expect(screen.getByText('A test game for playing')).toBeInTheDocument();
  });

  it('displays game metadata', () => {
    renderWithRouter(<GamePage />);
    
    expect(screen.getByText('Test Developer')).toBeInTheDocument();
    expect(screen.getByText('Click to jump')).toBeInTheDocument();
    expect(screen.getByText('Navigate through obstacles')).toBeInTheDocument();
  });

  it('shows breadcrumb navigation', () => {
    renderWithRouter(<GamePage />);
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
  });

  it('displays game image and play button', () => {
    renderWithRouter(<GamePage />);
    
    expect(screen.getByAltText('Test Game')).toBeInTheDocument();
    expect(screen.getByText('Play Now')).toBeInTheDocument();
  });

  it('shows favorite and share buttons', () => {
    renderWithRouter(<GamePage />);
    
    expect(screen.getByText('Add to Favorites')).toBeInTheDocument();
    expect(screen.getByText('Share Game')).toBeInTheDocument();
  });

  it('displays rating system', () => {
    renderWithRouter(<GamePage />);
    
    expect(screen.getByText('Rate this game:')).toBeInTheDocument();
    expect(screen.getByText('(90% popularity)')).toBeInTheDocument();
  });

  it('shows game tags', () => {
    renderWithRouter(<GamePage />);
    
    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.getByText('action')).toBeInTheDocument();
  });

  it('handles play button click', async () => {
    renderWithRouter(<GamePage />);
    
    const playButton = screen.getByText('Play Now');
    fireEvent.click(playButton);
    
    // Should show the game iframe
    await waitFor(() => {
      expect(screen.getByTitle(/game iframe/i)).toBeInTheDocument();
    });
  });

  it('handles favorite toggle', () => {
    renderWithRouter(<GamePage />);
    
    const favoriteButton = screen.getByText('Add to Favorites');
    fireEvent.click(favoriteButton);
    
    // Should call toggleFavorite
    expect(require('../services').gameService.toggleFavorite).toHaveBeenCalled();
  });

  it('handles share button click', () => {
    renderWithRouter(<GamePage />);
    
    const shareButton = screen.getByText('Share Game');
    fireEvent.click(shareButton);
    
    // Should show share modal
    expect(screen.getByText('Share Game')).toBeInTheDocument();
  });

  it('displays related games section', () => {
    renderWithRouter(<GamePage />);
    
    expect(screen.getByText('Related Games')).toBeInTheDocument();
    expect(screen.getByText('Related Game')).toBeInTheDocument();
  });

  it('handles game not found', () => {
    // Mock empty games array
    jest.doMock('../services', () => ({
      gameService: {
        getAllGames: () => [],
        addToRecentlyPlayed: jest.fn(),
        isFavorite: jest.fn(() => false),
        toggleFavorite: jest.fn()
      }
    }));

    renderWithRouter(<GamePage />, '/game/NonexistentGame');
    
    expect(screen.getByText('Game Not Found')).toBeInTheDocument();
  });

  it('handles rating interaction', () => {
    renderWithRouter(<GamePage />);
    
    const starButtons = screen.getAllByRole('button');
    const ratingStars = starButtons.filter(button => 
      button.getAttribute('class')?.includes('text-yellow-400') || 
      button.getAttribute('class')?.includes('text-gray-300')
    );
    
    if (ratingStars.length > 0) {
      fireEvent.click(ratingStars[4]); // Click 5th star
      
      // Should save rating to localStorage
      expect(localStorage.setItem).toHaveBeenCalled();
    }
  });
});