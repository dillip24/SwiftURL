/**
 * URL Shortener Component
 * Main form for shortening URLs with custom codes and expiration
 */

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Loader2, Calendar, Settings, Zap } from 'lucide-react';
import { shortenUrl } from '../services/api';
import { validateCustomCode } from '../utils/helpers';
import { UrlData, ShortenUrlRequest } from '../types/url';

interface UrlShortenerProps {
  onUrlShortened: (result: UrlData) => void;
}

const UrlShortener: React.FC<UrlShortenerProps> = ({ onUrlShortened }) => {
  const [longUrl, setLongUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Get minimum date for expiration (current date + 1 hour)
  const getMinDateTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return now.toISOString().slice(0, 16);
  };

  // Validate URL format
  const isValidUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!longUrl.trim()) {
      toast.error('Please enter a URL to shorten');
      return;
    }

    if (!isValidUrl(longUrl)) {
      toast.error('Please enter a valid URL starting with http:// or https://');
      return;
    }

    if (customCode) {
      const validation = validateCustomCode(customCode);
      if (!validation.isValid) {
        toast.error(validation.error!);
        return;
      }
    }

    if (expiresAt) {
      const expireDate = new Date(expiresAt);
      if (expireDate <= new Date()) {
        toast.error('Expiration date must be in the future');
        return;
      }
    }

    setIsLoading(true);

    try {
      const request: ShortenUrlRequest = {
        longUrl: longUrl.trim(),
        ...(customCode && { customCode: customCode.trim() }),
        ...(expiresAt && { expiresAt: new Date(expiresAt).toISOString() }),
      };

      const response = await shortenUrl(request);
      
      if (response.success) {
        onUrlShortened(response.data);
        toast.success('URL shortened successfully! 🎉');
        
        // Reset form
        setLongUrl('');
        setCustomCode('');
        setExpiresAt('');
        setShowAdvanced(false);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to shorten URL';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* URL Input */}
        <div>
          <label htmlFor="longUrl" className="block text-sm font-medium text-gray-700 mb-2">
            Enter your long URL
          </label>
          <input
            type="url"
            id="longUrl"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            placeholder="https://example.com/very/long/url/that/needs/shortening"
            className="input-field"
            disabled={isLoading}
          />
        </div>

        {/* Advanced Options Toggle */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors duration-200"
          >
            <Settings className="w-4 h-4" />
            <span className="text-sm font-medium">
              {showAdvanced ? 'Hide' : 'Show'} Advanced Options
            </span>
          </button>
        </div>

        {/* Advanced Options */}
        {showAdvanced && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            {/* Custom Short Code */}
            <div>
              <label htmlFor="customCode" className="block text-sm font-medium text-gray-700 mb-2">
                Custom Short Code (Optional)
              </label>
              <input
                type="text"
                id="customCode"
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
                placeholder="my-custom-code"
                className="input-field"
                disabled={isLoading}
                minLength={3}
                maxLength={20}
              />
              <p className="text-xs text-gray-500 mt-1">
                3-20 characters, letters and numbers only
              </p>
            </div>

            {/* Expiration Date */}
            <div>
              <label htmlFor="expiresAt" className="block text-sm font-medium text-gray-700 mb-2">
                Expiration Date (Optional)
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="datetime-local"
                  id="expiresAt"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  min={getMinDateTime()}
                  className="input-field pl-12"
                  disabled={isLoading}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Leave empty for permanent links
              </p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !longUrl.trim()}
          className="btn-primary w-full flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Shortening...</span>
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              <span>Shorten URL</span>
            </>
          )}
        </button>
      </form>

      {/* Quick Tips */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Quick Tips:</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Custom codes must be unique and 3-20 characters long</li>
          <li>• Expired URLs will automatically become inactive</li>
          <li>• Click analytics are available for all shortened URLs</li>
          <li>• URLs are cached for better performance</li>
        </ul>
      </div>
    </div>
  );
};

export default UrlShortener;
