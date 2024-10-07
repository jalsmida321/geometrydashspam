import React from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, TrendingUp, BookOpen } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <nav className="bg-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="font-bold text-xl">Geometry Dash Spam</Link>
          </div>
          <div className="flex">
            <Link to="/" className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
              <Gamepad2 className="mr-1.5 h-5 w-5" />
              Popular Games
            </Link>
            <Link to="/" className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
              <TrendingUp className="mr-1.5 h-5 w-5" />
              Trending
            </Link>
            <Link to="/" className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
              <BookOpen className="mr-1.5 h-5 w-5" />
              Blog
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;