/**
 * Footer Component
 * Site footer with links and information
 */

import React from 'react';
import { Heart, Github, Link } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Link className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">SwiftURL</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              A modern, fast, and reliable URL shortening service built with cutting-edge technology. 
              Shorten links, track analytics, and share with confidence.
            </p>
            <div className="flex items-center space-x-4">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Features</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors duration-200">
                  URL Shortening
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors duration-200">
                  Custom Short Codes
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors duration-200">
                  Click Analytics
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors duration-200">
                  URL Expiration
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors duration-200">
                  API Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors duration-200">
                  Support
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors duration-200">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors duration-200">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 SwiftURL. All rights reserved.
            </p>
            <div className="flex items-center space-x-1 mt-4 md:mt-0">
              <span className="text-gray-400 text-sm">Made with</span>
              <Heart className="w-4 h-4 text-red-500" />
              <span className="text-gray-400 text-sm">by developers</span>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 mb-2">Built with modern technology</p>
            <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-400">
              <span className="bg-gray-800 px-2 py-1 rounded">React</span>
              <span className="bg-gray-800 px-2 py-1 rounded">TypeScript</span>
              <span className="bg-gray-800 px-2 py-1 rounded">Tailwind CSS</span>
              <span className="bg-gray-800 px-2 py-1 rounded">Node.js</span>
              <span className="bg-gray-800 px-2 py-1 rounded">Express</span>
              <span className="bg-gray-800 px-2 py-1 rounded">PostgreSQL</span>
              <span className="bg-gray-800 px-2 py-1 rounded">Redis</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
