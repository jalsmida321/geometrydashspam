import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SearchBar from './SearchBar';
import { GameFilter } from '../../types/game';

// Mock the hooks
jest.mock('../../hooks', () => ({
  useSearchSuggestions: () => ({
    suggestions: ['geometry dash', 'spam test', 'challenge'],
    loading: false
  }),
  useCategories: () => ({
    categories: [
      { id: 'geometry-dash', name: 'Geometry Dash', slug: 'geometry-dash' },
      { id: 'action', name: 'Action Games', slug: 'action' }
    ]
  })
}));

describe('SearchBar Component', () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
    localStorage.clear();
  });

  test('renders search input with placeholder', () => {
    render(
      <SearchBar 
        onSearch={mockOnSearch}
        placeholder="Search for games..."
      />
    );

    const searchInput = screen.getByPlaceholderText('Search for games...');
    expect(searchInput).toBeInTheDocument();
  });

  test('shows suggestions when typing', async () => {
    render(
      <SearchBar 
        onSearch={mockOnSearch}
        placeholder="Search for games..."
      />
    );

    const searchInput = screen.getByPlaceholderText('Search for games...');
    fireEvent.change(searchInput, { target: { value: 'geo' } });

    await waitFor(() => {
      expect(screen.getByText('Suggestions')).toBeInTheDocument();
    });
  });

  test('calls onSearch when form is submitted', () => {
    render(
      <SearchBar 
        onSearch={mockOnSearch}
        placeholder="Search for games..."
      />
    );

    const searchInput = screen.getByPlaceholderText('Search for games...');
    fireEvent.change(searchInput, { target: { value: 'geometry dash' } });
    fireEvent.submit(searchInput.closest('form')!);

    expect(mockOnSearch).toHaveBeenCalledWith('geometry dash', expect.any(Object));
  });

  test('shows filters dropdown when filter button is clicked', () => {
    render(
      <SearchBar 
        onSearch={mockOnSearch}
        showFilters={true}
      />
    );

    const filterButton = screen.getByText('Filters');
    fireEvent.click(filterButton);

    expect(screen.getByText('Search Filters')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Tags')).toBeInTheDocument();
    expect(screen.getByText('Sort By')).toBeInTheDocument();
  });

  test('saves and displays search history', async () => {
    render(
      <SearchBar 
        onSearch={mockOnSearch}
        placeholder="Search for games..."
      />
    );

    const searchInput = screen.getByPlaceholderText('Search for games...');
    
    // Perform a search
    fireEvent.change(searchInput, { target: { value: 'geometry dash' } });
    fireEvent.submit(searchInput.closest('form')!);

    // Clear input and focus to show history
    fireEvent.change(searchInput, { target: { value: '' } });
    fireEvent.focus(searchInput);

    await waitFor(() => {
      expect(screen.getByText('Recent Searches')).toBeInTheDocument();
      expect(screen.getByText('geometry dash')).toBeInTheDocument();
    });
  });

  test('clears search when X button is clicked', () => {
    render(
      <SearchBar 
        onSearch={mockOnSearch}
        placeholder="Search for games..."
      />
    );

    const searchInput = screen.getByPlaceholderText('Search for games...');
    fireEvent.change(searchInput, { target: { value: 'test query' } });

    const clearButton = screen.getByRole('button');
    fireEvent.click(clearButton);

    expect(searchInput).toHaveValue('');
    expect(mockOnSearch).toHaveBeenCalledWith('');
  });
});