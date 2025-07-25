-- SwiftURL Database Schema for Supabase
-- Run this in Supabase SQL Editor

-- Create URLs table
CREATE TABLE IF NOT EXISTS urls (
  id SERIAL PRIMARY KEY,
  long_url TEXT NOT NULL,
  short_code VARCHAR(10) UNIQUE NOT NULL,
  clicks INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_urls_short_code ON urls(short_code);
CREATE INDEX IF NOT EXISTS idx_urls_expires_at ON urls(expires_at);
CREATE INDEX IF NOT EXISTS idx_urls_created_at ON urls(created_at);

-- Insert sample data
INSERT INTO urls (long_url, short_code) VALUES 
('https://www.google.com', 'google'),
('https://www.github.com', 'github'),
('https://www.stackoverflow.com', 'stack')
ON CONFLICT (short_code) DO NOTHING;

-- Verify the setup
SELECT * FROM urls;
