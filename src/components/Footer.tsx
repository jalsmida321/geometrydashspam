import React from 'react';
import { Info, BookOpen, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-between items-center">
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className="text-xl font-bold mb-2 flex items-center">
              <Info className="mr-2 h-5 w-5" />
              ABOUT US
            </h3>
            <p className="text-gray-400">
              We are passionate about bringing you the best Geometry Dash spam challenges and games.
            </p>
          </div>
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className="text-xl font-bold mb-2 flex items-center">
              <BookOpen className="mr-2 h-5 w-5" />
              READ MORE
            </h3>
            <ul className="text-gray-400">
              <li><a href="#" className="hover:text-white">Game Tutorials</a></li>
              <li><a href="#" className="hover:text-white">Spam Techniques</a></li>
              <li><a href="#" className="hover:text-white">Community Highlights</a></li>
            </ul>
          </div>
          <div className="w-full md:w-1/3">
            <h3 className="text-xl font-bold mb-2 flex items-center">
              <Mail className="mr-2 h-5 w-5" />
              CONTACT US
            </h3>
            <p className="text-gray-400">
              Have questions or feedback? Reach out to us at:
              <a href="mailto:contact@geometrydashspam.com" className="hover:text-white">
                contact@geometrydashspam.com
              </a>
            </p>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8 text-center text-gray-400">
          <p>&copy; 2023 Geometry Dash Spam. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;