/**
 * URL Result Component
 * Displays the shortened URL result with copy functionality and analytics
 */

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Copy, ExternalLink, BarChart3, RefreshCw, Check, Calendar, Clock } from 'lucide-react';
import { copyToClipboard, formatDate, formatRelativeTime, getTimeUntilExpiration, isUrlExpired, truncateUrl } from '../utils/helpers';
import { UrlData } from '../types/url';

interface UrlResultProps {
  urlData: UrlData;
  onReset: () => void;
}

const UrlResult: React.FC<UrlResultProps> = ({ urlData, onReset }) => {
  const [copied, setCopied] = useState(false);

  // Handle copy to clipboard
  const handleCopy = async () => {
    const success = await copyToClipboard(urlData.shortUrl);
    
    if (success) {
      setCopied(true);
      toast.success('Copied to clipboard! 📋');
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error('Failed to copy to clipboard');
    }
  };

  // Handle opening short URL
  const handleOpenUrl = () => {
    window.open(urlData.shortUrl, '_blank', 'noopener,noreferrer');
  };

  const expired = isUrlExpired(urlData.expiresAt);
  const timeUntilExpiration = getTimeUntilExpiration(urlData.expiresAt);

  return (
    <div className="result-card max-w-2xl mx-auto">
      {/* Success Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">URL Shortened Successfully!</h2>
        <p className="text-gray-600">Your shortened URL is ready to share</p>
      </div>

      {/* URL Display */}
      <div className="space-y-4">
        {/* Original URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Original URL</label>
          <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg border">
            <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="text-sm text-gray-600 break-all">{truncateUrl(urlData.longUrl, 60)}</span>
          </div>
        </div>

        {/* Shortened URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Shortened URL</label>
          <div className="flex items-center space-x-2">
            <div className="flex-1 flex items-center space-x-3 p-4 bg-white rounded-lg border-2 border-primary-200 shadow-sm">
              <span className="text-lg font-mono text-primary-600 break-all">{urlData.shortUrl}</span>
            </div>
            <button
              onClick={handleCopy}
              className="btn-primary flex items-center space-x-2 px-4 py-4"
              title="Copy to clipboard"
            >
              {copied ? (
                <Check className="w-5 h-5" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
              <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* URL Information */}
      <div className="mt-6 grid md:grid-cols-2 gap-4">
        {/* Creation Date */}
        <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
          <Calendar className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Created</p>
            <p className="text-sm font-medium text-gray-900">{formatRelativeTime(urlData.createdAt)}</p>
            <p className="text-xs text-gray-400">{formatDate(urlData.createdAt)}</p>
          </div>
        </div>

        {/* Expiration */}
        <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
          <Clock className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Expiration</p>
            {urlData.expiresAt ? (
              <>
                <p className={`text-sm font-medium ${expired ? 'text-red-600' : 'text-gray-900'}`}>
                  {expired ? 'Expired' : timeUntilExpiration}
                </p>
                <p className="text-xs text-gray-400">{formatDate(urlData.expiresAt)}</p>
              </>
            ) : (
              <p className="text-sm font-medium text-green-600">Never expires</p>
            )}
          </div>
        </div>

        {/* Click Count */}
        <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
          <BarChart3 className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Total Clicks</p>
            <p className="text-lg font-bold text-gray-900">{urlData.clicks.toLocaleString()}</p>
          </div>
        </div>

        {/* Short Code */}
        <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
          <span className="w-5 h-5 flex items-center justify-center text-gray-400 font-mono text-sm">#</span>
          <div>
            <p className="text-xs text-gray-500">Short Code</p>
            <p className="text-sm font-mono font-medium text-gray-900">{urlData.shortCode}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleOpenUrl}
          className="btn-secondary flex items-center justify-center space-x-2 flex-1"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Test Link</span>
        </button>
        
        <button
          onClick={onReset}
          className="btn-secondary flex items-center justify-center space-x-2 flex-1"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Shorten Another</span>
        </button>
      </div>

      {/* Warning for expired URLs */}
      {expired && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-red-600" />
            <p className="text-sm font-medium text-red-800">This URL has expired</p>
          </div>
          <p className="text-xs text-red-700 mt-1">
            Expired URLs will show an error page when accessed.
          </p>
        </div>
      )}
    </div>
  );
};

export default UrlResult;
