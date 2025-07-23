import React from 'react';
import { CategoryFilterProps } from '../../types/game';
import { Triangle, Zap, Puzzle, Gamepad2, Trophy, Target, Grid3X3 } from 'lucide-react';
import { useCategories } from '../../hooks/useCategories';

/**
 * CategoryFilter component for filtering games by category
 */
const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange
}) => {
  // Get categories with game counts
  const { categoriesWithCounts, popularCategories } = useCategories();
  // Icon mapping for categories
  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, React.ComponentType<any>> = {
      Triangle,
      Zap,
      Puzzle,
      Gamepad2,
      Trophy,
      Target
    };
    return iconMap[iconName] || Gamepad2;
  };

  // Color mapping for categories
  const getColorClasses = (color: string, isSelected: boolean) => {
    const colorMap: Record<string, { bg: string; text: string; border: string; hover: string }> = {
      blue: {
        bg: isSelected ? 'bg-blue-500' : 'bg-blue-50',
        text: isSelected ? 'text-white' : 'text-blue-700',
        border: 'border-blue-200',
        hover: 'hover:bg-blue-100'
      },
      red: {
        bg: isSelected ? 'bg-red-500' : 'bg-red-50',
        text: isSelected ? 'text-white' : 'text-red-700',
        border: 'border-red-200',
        hover: 'hover:bg-red-100'
      },
      green: {
        bg: isSelected ? 'bg-green-500' : 'bg-green-50',
        text: isSelected ? 'text-white' : 'text-green-700',
        border: 'border-green-200',
        hover: 'hover:bg-green-100'
      },
      purple: {
        bg: isSelected ? 'bg-purple-500' : 'bg-purple-50',
        text: isSelected ? 'text-white' : 'text-purple-700',
        border: 'border-purple-200',
        hover: 'hover:bg-purple-100'
      },
      orange: {
        bg: isSelected ? 'bg-orange-500' : 'bg-orange-50',
        text: isSelected ? 'text-white' : 'text-orange-700',
        border: 'border-orange-200',
        hover: 'hover:bg-orange-100'
      },
      indigo: {
        bg: isSelected ? 'bg-indigo-500' : 'bg-indigo-50',
        text: isSelected ? 'text-white' : 'text-indigo-700',
        border: 'border-indigo-200',
        hover: 'hover:bg-indigo-100'
      }
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center mb-4">
        <Grid3X3 className="w-5 h-5 mr-2 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Categories</h3>
      </div>

      {/* All Categories Button */}
      <div className="mb-4">
        <button
          onClick={() => onCategoryChange('')}
          className={`w-full flex items-center p-3 rounded-lg border transition-all duration-200 ${
            !selectedCategory
              ? 'bg-gray-900 text-white border-gray-900'
              : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
          }`}
        >
          <Gamepad2 className="w-5 h-5 mr-3" />
          <div className="flex-1 text-left">
            <div className="flex items-center justify-between">
              <div className="font-medium">All Games</div>
              <div className={`text-xs px-2 py-1 rounded-full ${
                !selectedCategory 
                  ? 'bg-white bg-opacity-20 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {categoriesWithCounts.reduce((total, cat) => total + cat.gameCount, 0)} games
              </div>
            </div>
            <div className="text-sm opacity-75">Browse all available games</div>
          </div>
        </button>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
        {categoriesWithCounts.map((categoryWithCount) => {
          const category = categoryWithCount;
          const IconComponent = getIconComponent(category.icon);
          const isSelected = selectedCategory === category.id;
          const colors = getColorClasses(category.color, isSelected);

          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`flex items-center p-3 rounded-lg border transition-all duration-200 ${colors.bg} ${colors.text} ${colors.border} ${
                !isSelected ? colors.hover : ''
              } ${isSelected ? 'ring-2 ring-offset-2 ring-opacity-50' : ''}`}
              style={isSelected ? { ringColor: `var(--${category.color}-500)` } : {}}
            >
              <div className="flex-shrink-0 mr-3">
                <IconComponent className="w-5 h-5" />
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{category.name}</div>
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    isSelected 
                      ? 'bg-white bg-opacity-20 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {categoryWithCount.gameCount} games
                  </div>
                </div>
                <div className={`text-sm ${isSelected ? 'opacity-90' : 'opacity-75'}`}>
                  {category.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Category Stats */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Quick Stats</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Total Categories:</span>
            <span className="ml-1 font-medium text-gray-900">{categories.length}</span>
          </div>
          <div>
            <span className="text-gray-600">Selected:</span>
            <span className="ml-1 font-medium text-gray-900">
              {selectedCategory 
                ? categories.find(c => c.id === selectedCategory)?.name || 'Unknown'
                : 'All Games'
              }
            </span>
          </div>
        </div>
      </div>

      {/* Popular Categories */}
      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Popular Categories</h4>
        <div className="flex flex-wrap gap-2">
          {popularCategories.map((category) => {
            const colors = getColorClasses(category.color, false);
            const categoryWithCount = categoriesWithCounts.find(c => c.id === category.id);
            return (
              <button
                key={`popular-${category.id}`}
                onClick={() => onCategoryChange(category.id)}
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${colors.bg} ${colors.text} ${colors.hover}`}
              >
                {category.name}
                {categoryWithCount && (
                  <span className="ml-1 opacity-75">({categoryWithCount.gameCount})</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;