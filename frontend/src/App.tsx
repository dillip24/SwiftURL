/**
 * SwiftURL Frontend - Main App Component
 * A modern, responsive URL shortening service interface
 * 
 * Features:
 * - URL shortening with optional custom codes
 * - URL expiration date selection
 * - Copy-to-clipboard functionality
 * - Click analytics display
 * - Responsive design with Tailwind CSS
 * - Toast notifications for user feedback
 */

import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import UrlShortener from './components/UrlShortener';
import UrlResult from './components/UrlResult';
import StatsDisplay from './components/StatsDisplay';
import Footer from './components/Footer';
import { UrlData } from './types/url';

function App() {
  const [shortUrlResult, setShortUrlResult] = useState<UrlData | null>(null);

  const handleUrlShortened = (result: UrlData) => {
    setShortUrlResult(result);
  };

  const handleReset = () => {
    setShortUrlResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#374151',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '16px',
            fontFamily: 'Inter, sans-serif',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* URL Shortener Form */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Shorten Your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600">
              {' '}URLs
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create short, memorable links that are easy to share. 
            Track clicks, set expiration dates, and customize your URLs.
          </p>
        </div>

        <div className="space-y-8">
          {/* URL Shortening Form */}
          <UrlShortener onUrlShortened={handleUrlShortened} />

          {/* Results Display */}
          {shortUrlResult && (
            <UrlResult 
              urlData={shortUrlResult} 
              onReset={handleReset}
            />
          )}

          {/* Statistics Display */}
          <StatsDisplay />
        </div>

        {/* Features Section */}
        <section className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
            <p className="text-gray-600">Generate short URLs instantly with our optimized backend infrastructure.</p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Analytics</h3>
            <p className="text-gray-600">Track click counts and monitor the performance of your shortened URLs.</p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure & Reliable</h3>
            <p className="text-gray-600">Your URLs are protected with enterprise-grade security and 99.9% uptime.</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
