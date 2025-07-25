/**
 * Stats Display Component
 * Shows analytics for a specific short URL
 */

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Search, BarChart3, Loader2, TrendingUp, Clock, Link2, Calendar } from 'lucide-react';
import { getUrlStats } from '../services/api';
import { formatDate, formatNumber, isUrlExpired } from '../utils/helpers';

const StatsDisplay: React.FC = () => {
  const [shortCode, setShortCode] = useState('');
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Handle stats lookup
  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!shortCode.trim()) {
      toast.error('Please enter a short code to look up');
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const response = await getUrlStats(shortCode.trim());
      
      if (response.success) {
        setStats(response.data);
        toast.success('Statistics loaded successfully! 📊');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load statistics';
      toast.error(errorMessage);
      setStats(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear search
  const handleClear = () => {
    setShortCode('');
    setStats(null);
    setHasSearched(false);
  };

  return (
    <div className="card max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <BarChart3 className="w-12 h-12 text-primary-600 mx-auto mb-3" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">URL Analytics</h2>
        <p className="text-gray-600">Look up statistics for any SwiftURL short code</p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleLookup} className="mb-6">
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={shortCode}
              onChange={(e) => setShortCode(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
              placeholder="Enter short code (e.g., abc123)"
              className="input-field pl-12"
              disabled={isLoading}
              maxLength={20}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !shortCode.trim()}
            className="btn-primary flex items-center space-x-2"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Search className="w-5 h-5" />
            )}
            <span className="hidden sm:inline">Search</span>
          </button>
          {(stats || hasSearched) && (
            <button
              type="button"
              onClick={handleClear}
              className="btn-secondary"
            >
              Clear
            </button>
          )}
        </div>
      </form>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-3" />
          <p className="text-gray-600">Loading statistics...</p>
        </div>
      )}

      {/* Statistics Display */}
      {stats && !isLoading && (
        <div className="space-y-6">
          {/* URL Information */}
          <div className="p-4 bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg border border-primary-200">
            <div className="flex items-center space-x-2 mb-3">
              <Link2 className="w-5 h-5 text-primary-600" />
              <h3 className="text-lg font-semibold text-gray-900">URL Information</h3>
            </div>
            
            <div className="space-y-2">
              <div>
                <p className="text-xs text-gray-500">Short Code</p>
                <p className="font-mono text-sm font-medium text-gray-900">{stats.shortCode}</p>
              </div>
              
              <div>
                <p className="text-xs text-gray-500">Original URL</p>
                <p className="text-sm text-gray-900 break-all">{stats.longUrl}</p>
              </div>
            </div>
          </div>

          {/* Analytics Grid */}
          <div className="grid md:grid-cols-3 gap-4">
            {/* Total Clicks */}
            <div className="text-center p-6 bg-white rounded-lg border-2 border-green-200 shadow-sm">
              <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">{formatNumber(stats.clicks)}</p>
              <p className="text-sm text-gray-600">Total Clicks</p>
            </div>

            {/* Creation Date */}
            <div className="text-center p-6 bg-white rounded-lg border-2 border-blue-200 shadow-sm">
              <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-blue-600">{formatDate(stats.createdAt)}</p>
              <p className="text-sm text-gray-600">Created</p>
            </div>

            {/* Expiration Status */}
            <div className="text-center p-6 bg-white rounded-lg border-2 border-purple-200 shadow-sm">
              <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${
                stats.isExpired ? 'bg-red-100' : stats.expiresAt ? 'bg-yellow-100' : 'bg-green-100'
              }`}>
                <Calendar className={`w-5 h-5 ${
                  stats.isExpired ? 'text-red-600' : stats.expiresAt ? 'text-yellow-600' : 'text-green-600'
                }`} />
              </div>
              <p className={`text-sm font-medium ${
                stats.isExpired ? 'text-red-600' : stats.expiresAt ? 'text-yellow-600' : 'text-green-600'
              }`}>
                {stats.isExpired ? 'Expired' : stats.expiresAt ? 'Has Expiry' : 'Never Expires'}
              </p>
              <p className="text-sm text-gray-600">Status</p>
            </div>
          </div>

          {/* Expiration Details */}
          {stats.expiresAt && (
            <div className={`p-4 rounded-lg border ${
              stats.isExpired 
                ? 'bg-red-50 border-red-200' 
                : 'bg-yellow-50 border-yellow-200'
            }`}>
              <div className="flex items-center space-x-2">
                <Calendar className={`w-5 h-5 ${stats.isExpired ? 'text-red-600' : 'text-yellow-600'}`} />
                <p className={`font-medium ${stats.isExpired ? 'text-red-800' : 'text-yellow-800'}`}>
                  {stats.isExpired ? 'This URL has expired' : 'This URL will expire'}
                </p>
              </div>
              <p className={`text-sm mt-1 ${stats.isExpired ? 'text-red-700' : 'text-yellow-700'}`}>
                {stats.isExpired ? 'Expired on' : 'Expires on'}: {formatDate(stats.expiresAt)}
              </p>
            </div>
          )}

          {/* Performance Metrics */}
          <div className="p-4 bg-gray-50 rounded-lg border">
            <h4 className="font-medium text-gray-900 mb-3">Performance Insights</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Average clicks per day:</span>
                <span className="font-medium">
                  {(() => {
                    const daysSinceCreation = Math.max(1, Math.ceil(
                      (new Date().getTime() - new Date(stats.createdAt).getTime()) / (1000 * 60 * 60 * 24)
                    ));
                    return (stats.clicks / daysSinceCreation).toFixed(1);
                  })()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Days active:</span>
                <span className="font-medium">
                  {Math.ceil((new Date().getTime() - new Date(stats.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`font-medium ${
                  stats.isExpired ? 'text-red-600' : 'text-green-600'
                }`}>
                  {stats.isExpired ? 'Inactive (Expired)' : 'Active'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No Results */}
      {hasSearched && !stats && !isLoading && (
        <div className="text-center py-8">
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 mb-2">No statistics found</p>
          <p className="text-sm text-gray-500">
            Make sure the short code is correct and try again
          </p>
        </div>
      )}

      {/* Help Text */}
      {!hasSearched && (
        <div className="text-center py-8">
          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 mb-2">Enter a short code to view analytics</p>
          <p className="text-sm text-gray-500">
            You can find the short code in your shortened URL after the domain
          </p>
        </div>
      )}
    </div>
  );
};

export default StatsDisplay;
