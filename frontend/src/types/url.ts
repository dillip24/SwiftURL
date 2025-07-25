/**
 * TypeScript type definitions for the SwiftURL frontend
 */

export interface UrlData {
  id: number;
  longUrl: string;
  shortCode: string;
  shortUrl: string;
  clicks: number;
  createdAt: string;
  expiresAt?: string | null;
}

export interface ShortenUrlRequest {
  longUrl: string;
  customCode?: string;
  expiresAt?: string;
}

export interface ShortenUrlResponse {
  success: boolean;
  message: string;
  data: UrlData;
}

export interface UrlStatsResponse {
  success: boolean;
  message: string;
  data: {
    shortCode: string;
    longUrl: string;
    clicks: number;
    createdAt: string;
    expiresAt?: string | null;
    isExpired: boolean;
  };
}

export interface ApiError {
  error: boolean;
  message: string;
  details?: string[];
  timestamp: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: boolean;
  details?: string[];
}
