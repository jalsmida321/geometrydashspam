import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Gamepad2, 
  TrendingUp, 
  BookOpen, 
  Wave, 
  Unlock, 
  Search,
  ChevronDown,
  Menu,
  X,
  Grid3X3,
  Heart
} from 'lucide-react';
import { SearchBar } from './game';
import { useCategories } from '../hooks';
import { GameFilter } from '../types/game';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { categories } = useCategories();
  
  // State management
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  
  // Refs for dropdown management
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setShowCategoryDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle search
  const handleSearch = (query: string, filter?: GameFilter) => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (filter?.category) params.set('category', filter.category);
    
    navigate(`/search?${params.toString()}`);
    setShowMobileSearch(false);
    setShowMobileMenu(false);
  };

  // Handle category selection
  const handleCategorySelect = (categorySlug: string) => {
    navigate(`/games/category/${categorySlug}`);
    setShowCategoryDropdown(false);
    setShowMobileMenu(false);
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="font-bold text-xl hover:text-blue-200 transition-colors duration-200">
              Geometry Dash Spam
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {/* Categories Dropdown */}
            <div className="relative" ref={categoryDropdownRef}>
              <button
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
              >
                <Grid3X3 className="mr-1.5 h-4 w-4" />
                Categories
                <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-200 ${showCategoryDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showCategoryDropdown && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-md shadow-lg py-2 z-50">
                  <Link
                    to="/games"
                    onClick={() => setShowCategoryDropdown(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <Grid3X3 className="inline w-4 h-4 mr-2" />
                    All Games
                  </Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategorySelect(category.slug)}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <span className={`inline-block w-3 h-3 rounded-full mr-2 bg-${category.color}-500`}></span>
                      {category.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search Bar */}
            <div className="w-64">
              <SearchBar
                onSearch={handleSearch}
                placeholder="Search games..."
                compact={true}
              />
            </div>

            {/* Navigation Links */}
            <Link 
              to="/games" 
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
            >
              <Gamepad2 className="mr-1.5 h-4 w-4" />
              All Games
            </Link>
            
            <Link 
              to="/popular" 
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
            >
              <TrendingUp className="mr-1.5 h-4 w-4" />
              Popular
            </Link>
            
            <Link 
              to="/favorites" 
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
            >
              <Heart className="mr-1.5 h-4 w-4" />
              Favorites
            </Link>
            
            {/* Legacy Links */}
            <Link 
              to="/space-waves" 
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
            >
              <Wave className="mr-1.5 h-4 w-4" />
              Space Waves
            </Link>
            
            <Link 
              to="/geometry-dash-unblocked" 
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
            >
              <Unlock className="mr-1.5 h-4 w-4" />
              GD Unblocked
            </Link>
            
            <Link 
              to="/unblocked-games" 
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
            >
              <Unlock className="mr-1.5 h-4 w-4" />
              Unblocked
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="p-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              <Search className="h-5 w-5" />
            </button>
            
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              {showMobileMenu ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {showMobileSearch && (
          <div className="lg:hidden py-3 border-t border-blue-500">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search games..."
            />
          </div>
        )}

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="lg:hidden border-t border-blue-500">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Categories Section */}
              <div className="py-2">
                <div className="text-blue-200 text-xs font-semibold uppercase tracking-wide px-3 py-1">
                  Categories
                </div>
                <Link
                  to="/games"
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700 transition-colors duration-200"
                >
                  <Grid3X3 className="mr-3 h-5 w-5" />
                  All Games
                </Link>
                {categories.slice(0, 5).map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category.slug)}
                    className="w-full text-left flex items-center px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700 transition-colors duration-200"
                  >
                    <span className={`inline-block w-3 h-3 rounded-full mr-3 bg-${category.color}-400`}></span>
                    {category.name}
                  </button>
                ))}
              </div>

              {/* Navigation Links */}
              <div className="border-t border-blue-500 pt-2">
                <div className="text-blue-200 text-xs font-semibold uppercase tracking-wide px-3 py-1">
                  Navigation
                </div>
                <Link
                  to="/popular"
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700 transition-colors duration-200"
                >
                  <TrendingUp className="mr-3 h-5 w-5" />
                  Popular Games
                </Link>
                
                <Link
                  to="/favorites"
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700 transition-colors duration-200"
                >
                  <Heart className="mr-3 h-5 w-5" />
                  My Favorites
                </Link>
                
                <Link
                  to="/space-waves"
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700 transition-colors duration-200"
                >
                  <Wave className="mr-3 h-5 w-5" />
                  Space Waves Challenge
                </Link>
                
                <Link
                  to="/geometry-dash-unblocked"
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700 transition-colors duration-200"
                >
                  <Unlock className="mr-3 h-5 w-5" />
                  Geometry Dash Unblocked
                </Link>
                
                <Link
                  to="/unblocked-games"
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700 transition-colors duration-200"
                >
                  <Unlock className="mr-3 h-5 w-5" />
                  Unblocked Games
                </Link>
                
                <Link
                  to="/"
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700 transition-colors duration-200"
                >
                  <BookOpen className="mr-3 h-5 w-5" />
                  Blog
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;