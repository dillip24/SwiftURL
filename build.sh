#!/bin/bash
# Railway build script

echo "🚀 Starting Railway build process..."

# Navigate to backend directory
cd backend

# Install dependencies
echo "📦 Installing backend dependencies..."
npm install

# Run database setup if needed
echo "🗄️ Setting up database schema..."
npm run setup-db

echo "✅ Build completed successfully!"
