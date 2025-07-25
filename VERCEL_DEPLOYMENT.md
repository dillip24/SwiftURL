# 🚀 Vercel + Supabase Deployment (No Credit Card)

## ✅ **Why Vercel + Supabase?**
- 🆓 Completely free (no credit card)
- 🔄 More reliable than Railway
- 🗄️ Supabase provides PostgreSQL + real-time features
- ⚡ Vercel has excellent Node.js support
- 🌐 Global CDN included

## 📋 **Step-by-Step Deployment**

### 1. **Setup Backend on Vercel**

#### A. Prepare Vercel Configuration
Create `vercel.json` in your root directory:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "backend/server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

#### B. Deploy to Vercel
1. Go to [Vercel.com](https://vercel.com)
2. Sign up with GitHub (free)
3. Click "New Project"
4. Import your SwiftURL repository
5. Vercel automatically deploys

### 2. **Setup Database with Supabase**

#### A. Create Supabase Project
1. Go to [Supabase.com](https://supabase.com)
2. Sign up with GitHub (free)
3. Click "New Project"
4. Choose a name: `swifturl-db`
5. Set a database password
6. Wait for setup (2-3 minutes)

#### B. Create Database Schema
1. In Supabase dashboard → SQL Editor
2. Run this SQL:

```sql
-- Create URLs table
CREATE TABLE urls (
  id SERIAL PRIMARY KEY,
  long_url TEXT NOT NULL,
  short_code VARCHAR(10) UNIQUE NOT NULL,
  clicks INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

-- Create indexes
CREATE INDEX idx_urls_short_code ON urls(short_code);
CREATE INDEX idx_urls_expires_at ON urls(expires_at);
CREATE INDEX idx_urls_created_at ON urls(created_at);

-- Insert sample data
INSERT INTO urls (long_url, short_code) VALUES 
('https://www.google.com', 'google'),
('https://www.github.com', 'github'),
('https://www.stackoverflow.com', 'stack');
```

#### C. Get Connection Details
1. Settings → Database
2. Copy the connection string
3. It looks like: `postgresql://postgres:[password]@[host]:5432/postgres`

### 3. **Configure Environment Variables**

#### A. In Vercel Dashboard
1. Go to your project → Settings → Environment Variables
2. Add these variables:

```
DATABASE_URL=postgresql://postgres:[password]@[host]:5432/postgres
NODE_ENV=production
BASE_URL=https://your-project.vercel.app
JWT_SECRET=your-secure-random-secret
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=10
CACHE_TTL=3600
```

### 4. **Deploy Frontend on Vercel**

#### A. Create Separate Vercel Project for Frontend
1. In Vercel → New Project
2. Import SwiftURL repository again
3. Set Root Directory to `frontend`
4. Add environment variable:
   ```
   VITE_API_URL=https://your-backend.vercel.app
   ```

### 5. **Alternative: Simple Hosting Options**

If you want even simpler options:

#### **Option 1: Netlify + Supabase**
- Frontend: Netlify (drag & drop deployment)
- Backend: Netlify Functions
- Database: Supabase

#### **Option 2: GitHub Pages + JSON Server**
- Frontend: GitHub Pages
- Backend: Simple JSON server on Heroku
- Data: JSON file storage

## 🎯 **Recommended Quick Start**

Let me create the Vercel configuration files for you right now:
