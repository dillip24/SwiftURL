/**
 * Utility Functions for SwiftURL Frontend
 */

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      // Use modern clipboard API
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      return success;
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

/**
 * Format date for display
 */
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return 'Invalid date';
  }
};

/**
 * Format relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    if (days < 30) return `${days} day${days !== 1 ? 's' : ''} ago`;
    
    return formatDate(dateString);
  } catch {
    return 'Unknown time';
  }
};

/**
 * Check if a URL has expired
 */
export const isUrlExpired = (expiresAt?: string | null): boolean => {
  if (!expiresAt) return false;
  try {
    return new Date(expiresAt) < new Date();
  } catch {
    return false;
  }
};

/**
 * Get time until expiration
 */
export const getTimeUntilExpiration = (expiresAt?: string | null): string | null => {
  if (!expiresAt) return null;
  
  try {
    const expireDate = new Date(expiresAt);
    const now = new Date();
    const diffMs = expireDate.getTime() - now.getTime();
    
    if (diffMs <= 0) return 'Expired';
    
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days} day${days !== 1 ? 's' : ''}`;
    if (hours > 0) return `${hours} hour${hours !== 1 ? 's' : ''}`;
    if (minutes > 0) return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    
    return 'Less than a minute';
  } catch {
    return null;
  }
};

/**
 * Validate custom short code
 */
export const validateCustomCode = (code: string): { isValid: boolean; error?: string } => {
  if (code.length < 3) {
    return { isValid: false, error: 'Custom code must be at least 3 characters long' };
  }
  
  if (code.length > 20) {
    return { isValid: false, error: 'Custom code cannot be longer than 20 characters' };
  }
  
  if (!/^[a-zA-Z0-9]+$/.test(code)) {
    return { isValid: false, error: 'Custom code can only contain letters and numbers' };
  }
  
  // Reserved keywords
  const reserved = [
    'api', 'admin', 'www', 'app', 'mail', 'email', 'support', 'help',
    'about', 'contact', 'terms', 'privacy', 'login', 'register', 'signup',
    'dashboard', 'account', 'profile', 'settings', 'home', 'index'
  ];
  
  if (reserved.includes(code.toLowerCase())) {
    return { isValid: false, error: 'This code is reserved and cannot be used' };
  }
  
  return { isValid: true };
};

/**
 * Truncate long URLs for display
 */
export const truncateUrl = (url: string, maxLength: number = 50): string => {
  if (url.length <= maxLength) return url;
  
  const start = url.substring(0, Math.floor(maxLength / 2) - 2);
  const end = url.substring(url.length - Math.floor(maxLength / 2) + 2);
  
  return `${start}...${end}`;
};

/**
 * Format number with commas
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

/**
 * Debounce function for search/input
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Generate a simple hash for caching
 */
export const simpleHash = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
};
