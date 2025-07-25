/**
 * API Service for SwiftURL Frontend
 * Handles all HTTP requests to the backend API
 */

import axios from 'axios';
import { ShortenUrlRequest, ShortenUrlResponse, UrlStatsResponse } from '../types/url';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.data || error.message);
    
    // Handle specific error cases
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.');
    } else if (error.response?.status >= 500) {
      throw new Error('Server error. Please try again later.');
    } else if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.response?.data?.details?.[0]) {
      throw new Error(error.response.data.details[0]);
    } else {
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
);

/**
 * Shorten a URL
 */
export const shortenUrl = async (request: ShortenUrlRequest): Promise<ShortenUrlResponse> => {
  try {
    const response = await api.post<ShortenUrlResponse>('/api/shorten', request);
    return response.data;
  } catch (error) {
    console.error('Error shortening URL:', error);
    throw error;
  }
};

/**
 * Get URL statistics
 */
export const getUrlStats = async (shortCode: string): Promise<UrlStatsResponse> => {
  try {
    const response = await api.get<UrlStatsResponse>(`/api/stats/${shortCode}`);
    return response.data;
  } catch (error) {
    console.error('Error getting URL stats:', error);
    throw error;
  }
};

/**
 * Check API health
 */
export const checkApiHealth = async (): Promise<any> => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('Error checking API health:', error);
    throw error;
  }
};

/**
 * Get detailed API health including database and cache status
 */
export const getDetailedHealth = async (): Promise<any> => {
  try {
    const response = await api.get('/api/health/detailed');
    return response.data;
  } catch (error) {
    console.error('Error getting detailed health:', error);
    throw error;
  }
};

/**
 * Validate URL format
 */
export const isValidUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Format date for API requests
 */
export const formatDateForApi = (date: Date): string => {
  return date.toISOString();
};

export default api;
