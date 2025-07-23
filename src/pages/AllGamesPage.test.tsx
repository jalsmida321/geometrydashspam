import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import AllGamesPage from './AllGamesPage';
import { GameProvider } from '../context/GameContext';

// Mock the hooks
jest.mock('../hooks', () => ({
  useGames: () => ({
    games: [
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
      }
    ],
    updateFilter: jest.fn(),
    filter: {},
    loading: false,
    error: null
  }),
  useCategories: () => ({
    categories: [
      {
        id: 'action',
        name: 'Action',
        slug: 'action',
        description: 'Action games',
        icon: 'Zap',
        color: 'red'
      }
    ]
  })
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

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <GameProvider>
        {component}
      </GameProvider>
    </BrowserRouter>
  );
};

describe('AllGamesPage', () => {
  it('renders page title and description', () => {
    renderWithProviders(<AllGamesPage />);
    
    expect(screen.getByText('All Games')).toBeInTheDocument();
    expect(screen.getByText(/Discover our complete collection/)).toBeInTheDocument();
  });

  it('displays game statistics', () => {
    renderWithProviders(<AllGamesPage />);
    
    expect(screen.getByText('1')).toBeInTheDocument(); // Total games
    expect(screen.getByText('Total Games')).toBeInTheDocument();
  });

  it('shows search and filter controls', () => {
    renderWithProviders(<AllGamesPage />);
    
    expect(screen.getByPlaceholderText(/Search all games/)).toBeInTheDocument();
    expect(screen.getByText('Show Filters')).toBeInTheDocument();
  });

  it('displays games grid', () => {
    renderWithProviders(<AllGamesPage />);
    
    expect(screen.getByText('Test Game 1')).toBeInTheDocument();
  });

  it('toggles filter visibility', () => {
    renderWithProviders(<AllGamesPage />);
    
    const filterButton = screen.getByText('Show Filters');
    fireEvent.click(filterButton);
    
    expect(screen.getByText('Hide Filters')).toBeInTheDocument();
  });

  it('handles search input', async () => {
    renderWithProviders(<AllGamesPage />);
    
    const searchInput = screen.getByPlaceholderText(/Search all games/);
    fireEvent.change(searchInput, { target: { value: 'test game' } });
    
    await waitFor(() => {
      expect(searchInput).toHaveValue('test game');
    });
  });

  it('displays empty state when no games found', () => {
    // Mock empty games array
    jest.doMock('../hooks', () => ({
      useGames: () => ({
        games: [],
        updateFilter: jest.fn(),
        filter: { search: 'nonexistent' },
        loading: false,
        error: null
      }),
      useCategories: () => ({ categories: [] })
    }));

    renderWithProviders(<AllGamesPage />);
    
    // Should show some indication of no results
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});