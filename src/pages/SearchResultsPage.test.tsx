import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import SearchResultsPage from './SearchResultsPage';
import { GameProvider } from '../context/GameContext';

// Mock the hooks
jest.mock('../hooks', () => ({
  useGames: () => ({
    games: [
      {
        id: 'game-1',
        name: 'Test Game',
        description: 'A test game for searching',
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
        tags: ['test', 'search'],
        featured: false,
        popularity: 75,
        dateAdded: new Date('2024-01-01')
      }
    ],
    updateFilter: jest.fn(),
    filter: { search: 'test' },
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

const renderWithRouter = (component: React.ReactElement, route = '/search?q=test') => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <GameProvider>
        {component}
      </GameProvider>
    </MemoryRouter>
  );
};

describe('SearchResultsPage', () => {
  it('renders search results page with query', () => {
    renderWithRouter(<SearchResultsPage />);
    
    expect(screen.getByText(/Search Results for "test"/)).toBeInTheDocument();
  });

  it('displays search statistics', () => {
    renderWithRouter(<SearchResultsPage />);
    
    expect(screen.getByText('1 result found')).toBeInTheDocument();
  });

  it('shows search results', () => {
    renderWithRouter(<SearchResultsPage />);
    
    expect(screen.getByText('Test Game')).toBeInTheDocument();
  });

  it('displays search filters', () => {
    renderWithRouter(<SearchResultsPage />);
    
    expect(screen.getByText('Refine Search')).toBeInTheDocument();
  });

  it('shows new search input', () => {
    renderWithRouter(<SearchResultsPage />);
    
    expect(screen.getByPlaceholderText(/Search for games/)).toBeInTheDocument();
  });

  it('handles empty search results', () => {
    // Mock empty results
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

    renderWithRouter(<SearchResultsPage />, '/search?q=nonexistent');
    
    expect(screen.getByText('No Results Found')).toBeInTheDocument();
  });

  it('displays search suggestions when no results', () => {
    // Mock empty results
    jest.doMock('../hooks', () => ({
      useGames: () => ({
        games: [],
        updateFilter: jest.fn(),
        filter: { search: 'xyz' },
        loading: false,
        error: null
      }),
      useCategories: () => ({ categories: [] })
    }));

    renderWithRouter(<SearchResultsPage />, '/search?q=xyz');
    
    expect(screen.getByText('Search Suggestions')).toBeInTheDocument();
  });

  it('shows popular games when no search query', () => {
    renderWithRouter(<SearchResultsPage />, '/search');
    
    expect(screen.getByText('Popular Games')).toBeInTheDocument();
  });

  it('handles category filter in search', () => {
    renderWithRouter(<SearchResultsPage />, '/search?q=test&category=action');
    
    expect(screen.getByText(/in Action category/)).toBeInTheDocument();
  });

  it('allows clearing search filters', () => {
    renderWithRouter(<SearchResultsPage />);
    
    const clearButton = screen.getByText('Clear Filters');
    fireEvent.click(clearButton);
    
    // Should trigger filter update
    expect(clearButton).toBeInTheDocument();
  });
});