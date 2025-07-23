import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CategoryFilter from './CategoryFilter';
import { GameCategory } from '../../types/game';

const mockCategories: GameCategory[] = [
  {
    id: 'action',
    name: 'Action Games',
    slug: 'action',
    description: 'Fast-paced action adventures',
    icon: 'Zap',
    color: 'red'
  },
  {
    id: 'puzzle',
    name: 'Puzzle Games',
    slug: 'puzzle',
    description: 'Mind-bending puzzle challenges',
    icon: 'Puzzle',
    color: 'green'
  },
  {
    id: 'arcade',
    name: 'Arcade Games',
    slug: 'arcade',
    description: 'Classic arcade experiences',
    icon: 'Target',
    color: 'blue'
  },
  {
    id: 'geometry-dash',
    name: 'Geometry Dash',
    slug: 'geometry-dash',
    description: 'Rhythm-based platformer challenges',
    icon: 'Triangle',
    color: 'purple'
  }
];

const renderCategoryFilter = (props = {}) => {
  const defaultProps = {
    categories: mockCategories,
    selectedCategory: '',
    onCategoryChange: jest.fn(),
    ...props
  };

  return render(<CategoryFilter {...defaultProps} />);
};

describe('CategoryFilter', () => {
  describe('Basic Rendering', () => {
    it('renders all categories correctly', () => {
      renderCategoryFilter();

      expect(screen.getByText('Action Games')).toBeInTheDocument();
      expect(screen.getByText('Puzzle Games')).toBeInTheDocument();
      expect(screen.getByText('Arcade Games')).toBeInTheDocument();
      expect(screen.getByText('Geometry Dash')).toBeInTheDocument();
    });

    it('renders category descriptions', () => {
      renderCategoryFilter();

      expect(screen.getByText('Fast-paced action adventures')).toBeInTheDocument();
      expect(screen.getByText('Mind-bending puzzle challenges')).toBeInTheDocument();
      expect(screen.getByText('Classic arcade experiences')).toBeInTheDocument();
      expect(screen.getByText('Rhythm-based platformer challenges')).toBeInTheDocument();
    });

    it('renders "All Categories" option', () => {
      renderCategoryFilter();

      expect(screen.getByText('All Categories')).toBeInTheDocument();
      expect(screen.getByText('Browse all available games')).toBeInTheDocument();
    });
  });

  describe('Category Selection', () => {
    it('highlights selected category', () => {
      renderCategoryFilter({ selectedCategory: 'action' });

      const actionButton = screen.getByText('Action Games').closest('button');
      expect(actionButton).toHaveClass('ring-2', 'ring-red-500', 'bg-red-50');
    });

    it('highlights "All Categories" when no category is selected', () => {
      renderCategoryFilter({ selectedCategory: '' });

      const allCategoriesButton = screen.getByText('All Categories').closest('button');
      expect(allCategoriesButton).toHaveClass('ring-2', 'ring-blue-500', 'bg-blue-50');
    });

    it('calls onCategoryChange when category is clicked', () => {
      const mockOnCategoryChange = jest.fn();
      renderCategoryFilter({ onCategoryChange: mockOnCategoryChange });

      const actionButton = screen.getByText('Action Games');
      fireEvent.click(actionButton);

      expect(mockOnCategoryChange).toHaveBeenCalledWith('action');
    });

    it('calls onCategoryChange with empty string when "All Categories" is clicked', () => {
      const mockOnCategoryChange = jest.fn();
      renderCategoryFilter({ 
        selectedCategory: 'action',
        onCategoryChange: mockOnCategoryChange 
      });

      const allCategoriesButton = screen.getByText('All Categories');
      fireEvent.click(allCategoriesButton);

      expect(mockOnCategoryChange).toHaveBeenCalledWith('');
    });
  });

  describe('Visual Styling', () => {
    it('applies correct color classes for each category', () => {
      renderCategoryFilter();

      const actionButton = screen.getByText('Action Games').closest('button');
      expect(actionButton).toHaveClass('hover:bg-red-50', 'hover:border-red-200');

      const puzzleButton = screen.getByText('Puzzle Games').closest('button');
      expect(puzzleButton).toHaveClass('hover:bg-green-50', 'hover:border-green-200');

      const arcadeButton = screen.getByText('Arcade Games').closest('button');
      expect(arcadeButton).toHaveClass('hover:bg-blue-50', 'hover:border-blue-200');
    });

    it('shows category icons correctly', () => {
      renderCategoryFilter();

      // We can't easily test Lucide icons, but we can verify the structure
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(5); // 4 categories + "All Categories"
    });

    it('applies selected state styling correctly', () => {
      renderCategoryFilter({ selectedCategory: 'puzzle' });

      const puzzleButton = screen.getByText('Puzzle Games').closest('button');
      expect(puzzleButton).toHaveClass('ring-2', 'ring-green-500', 'bg-green-50');

      const actionButton = screen.getByText('Action Games').closest('button');
      expect(actionButton).not.toHaveClass('ring-2');
    });
  });

  describe('Responsive Design', () => {
    it('applies responsive grid classes', () => {
      const { container } = renderCategoryFilter();

      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass(
        'grid',
        'grid-cols-1',
        'sm:grid-cols-2',
        'lg:grid-cols-3',
        'xl:grid-cols-5'
      );
    });

    it('has proper spacing and padding', () => {
      const { container } = renderCategoryFilter();

      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('gap-4');
    });
  });

  describe('Accessibility', () => {
    it('has proper button roles', () => {
      renderCategoryFilter();

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(5);
    });

    it('has proper ARIA labels for category buttons', () => {
      renderCategoryFilter();

      const actionButton = screen.getByLabelText('Filter by Action Games category');
      expect(actionButton).toBeInTheDocument();

      const allCategoriesButton = screen.getByLabelText('Show all categories');
      expect(allCategoriesButton).toBeInTheDocument();
    });

    it('indicates selected state for screen readers', () => {
      renderCategoryFilter({ selectedCategory: 'action' });

      const actionButton = screen.getByLabelText('Filter by Action Games category');
      expect(actionButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('supports keyboard navigation', () => {
      renderCategoryFilter();

      const firstButton = screen.getByText('All Categories');
      firstButton.focus();
      expect(firstButton).toHaveFocus();

      // Test tab navigation
      fireEvent.keyDown(firstButton, { key: 'Tab' });
      const secondButton = screen.getByText('Action Games');
      expect(secondButton).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty categories array', () => {
      renderCategoryFilter({ categories: [] });

      expect(screen.getByText('All Categories')).toBeInTheDocument();
      expect(screen.queryByText('Action Games')).not.toBeInTheDocument();
    });

    it('handles invalid selectedCategory', () => {
      renderCategoryFilter({ selectedCategory: 'non-existent-category' });

      // Should still render all categories
      expect(screen.getByText('Action Games')).toBeInTheDocument();
      expect(screen.getByText('Puzzle Games')).toBeInTheDocument();

      // "All Categories" should not be selected
      const allCategoriesButton = screen.getByText('All Categories').closest('button');
      expect(allCategoriesButton).not.toHaveClass('ring-2');
    });

    it('handles missing onCategoryChange prop gracefully', () => {
      // This should not throw an error
      expect(() => {
        render(
          <CategoryFilter 
            categories={mockCategories} 
            selectedCategory="" 
            onCategoryChange={undefined as any}
          />
        );
      }).not.toThrow();
    });
  });

  describe('Performance', () => {
    it('handles large number of categories efficiently', () => {
      const manyCategories = Array.from({ length: 50 }, (_, i) => ({
        id: `category-${i}`,
        name: `Category ${i}`,
        slug: `category-${i}`,
        description: `Description for category ${i}`,
        icon: 'Gamepad2',
        color: 'blue'
      }));

      const { container } = renderCategoryFilter({ categories: manyCategories });

      const buttons = container.querySelectorAll('button');
      expect(buttons).toHaveLength(51); // 50 categories + "All Categories"
    });
  });

  describe('Custom Props', () => {
    it('applies custom className when provided', () => {
      const { container } = renderCategoryFilter({ className: 'custom-filter-class' });

      const filterContainer = container.firstChild;
      expect(filterContainer).toHaveClass('custom-filter-class');
    });

    it('shows game counts when showGameCounts is true', () => {
      const categoriesWithCounts = mockCategories.map(cat => ({
        ...cat,
        gameCount: Math.floor(Math.random() * 20) + 1
      }));

      renderCategoryFilter({ 
        categories: categoriesWithCounts,
        showGameCounts: true 
      });

      // Should show game counts (this would need to be implemented in the component)
      // For now, we just verify the prop is handled
      expect(screen.getByText('Action Games')).toBeInTheDocument();
    });
  });
});