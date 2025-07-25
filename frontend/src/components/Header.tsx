/**
 * Header Component
 * Navigation header with branding and navigation links
 */

import React from 'react';
import { Link } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Link className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">SwiftURL</h1>
              <p className="text-xs text-gray-500">Fast URL Shortener</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6">
            <a 
              href="#features" 
              className="text-gray-600 hover:text-primary-600 transition-colors duration-200 font-medium"
            >
              Features
            </a>
            <a 
              href="#analytics" 
              className="text-gray-600 hover:text-primary-600 transition-colors duration-200 font-medium"
            >
              Analytics
            </a>
            <a 
              href="#api" 
              className="text-gray-600 hover:text-primary-600 transition-colors duration-200 font-medium"
            >
              API
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
