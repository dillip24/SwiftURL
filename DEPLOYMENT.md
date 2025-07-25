# SwiftURL Deployment Guide 🚀

## Overview
This guide will help you deploy SwiftURL using **100% FREE** services:
- **Frontend**: GitHub Pages (Free)
- **Backend**: Render.com (Free tier)
- **Database**: Render PostgreSQL (Free tier)
- **Cache**: Render Redis (Free tier)

## Prerequisites
- GitHub account
- Render.com account (free)
- Git installed on your machine

## 📋 Step-by-Step Deployment

### 1. Prepare Your GitHub Repository

```bash
# Initialize git repository (if not already done)
cd SwiftURL
git init
git add .
git commit -m "Initial commit: SwiftURL complete application"

# Create GitHub repository and push
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/SwiftURL.git
git push -u origin main
```

### 2. Deploy Backend on Render.com

#### A. Create PostgreSQL Database
1. Go to [Render.com](https://render.com) and sign up/login
2. Click "New +" → "PostgreSQL"
3. Fill in:
   - **Name**: `swifturl-db`
   - **Database**: `swifturl_db`
   - **User**: `swifturl_user`
   - **Region**: Choose closest to your users
4. Click "Create Database"
5. **Copy the connection details** (you'll need these)

#### B. Create Redis Instance
1. Click "New +" → "Redis"
2. Fill in:
   - **Name**: `swifturl-redis`
   - **Region**: Same as your database
3. Click "Create Redis"
4. **Copy the Redis URL** (you'll need this)

#### C. Deploy Backend Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Fill in:
   - **Name**: `swifturl-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add Environment Variables:
   ```
   DATABASE_URL=postgresql://swifturl_user:password@hostname:5432/swifturl_db
   REDIS_URL=redis://hostname:6379
   NODE_ENV=production
   BASE_URL=https://swifturl-backend.onrender.com
   JWT_SECRET=your-super-secure-jwt-secret
   RATE_LIMIT_WINDOW_MS=60000
   RATE_LIMIT_MAX_REQUESTS=10
   CACHE_TTL=3600
   ```
5. Click "Create Web Service"

### 3. Deploy Frontend on GitHub Pages

#### A. Update Configuration
1. Edit `frontend/package.json`:
   ```json
   "homepage": "https://YOUR_USERNAME.github.io/SwiftURL"
   ```

2. Edit `frontend/.env.production`:
   ```
   VITE_API_URL=https://swifturl-backend.onrender.com
   ```

#### B. Deploy to GitHub Pages
```bash
cd frontend

# Build and deploy
npm run deploy
```

#### C. Enable GitHub Pages
1. Go to your GitHub repository
2. Settings → Pages
3. Source: "Deploy from a branch"
4. Branch: `gh-pages`
5. Folder: `/ (root)`
6. Save

### 4. Configure Custom Domain (Optional)

#### For Frontend:
1. Add `CNAME` file in `frontend/public/`:
   ```
   yourdomain.com
   ```
2. Update DNS records to point to GitHub Pages

#### For Backend:
1. Add custom domain in Render dashboard
2. Update DNS records

## 🌐 Alternative Free Hosting Options

### Backend Alternatives:
1. **Railway.app** (Free tier)
2. **Cyclic.sh** (Free tier)
3. **Fly.io** (Free allowance)
4. **Heroku** (Free dyno hours)

### Database Alternatives:
1. **PlanetScale** (Free tier)
2. **Neon** (Free PostgreSQL)
3. **Supabase** (Free tier)
4. **CockroachDB** (Free tier)

### Redis Alternatives:
1. **Upstash** (Free Redis)
2. **Redis Labs** (Free tier)

## 🔧 Environment Variables Summary

### Backend (.env.production):
```bash
DATABASE_URL=postgresql://user:pass@host:port/db
REDIS_URL=redis://host:port
NODE_ENV=production
BASE_URL=https://your-backend.onrender.com
JWT_SECRET=secure-secret
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=10
CACHE_TTL=3600
```

### Frontend (.env.production):
```bash
VITE_API_URL=https://your-backend.onrender.com
VITE_APP_NAME=SwiftURL
VITE_APP_VERSION=1.0.0
```

## 🚀 Quick Deploy Commands

```bash
# Backend (Render will auto-deploy from GitHub)
git add .
git commit -m "Deploy backend to Render"
git push origin main

# Frontend (Deploy to GitHub Pages)
cd frontend
npm run deploy
```

## 📝 Post-Deployment Checklist

- [ ] Backend API responds at health endpoint
- [ ] Database connection working
- [ ] Redis cache working
- [ ] Frontend loads correctly
- [ ] URL shortening works
- [ ] URL redirection works
- [ ] Analytics working
- [ ] Custom domains configured (if applicable)

## 🎯 Your Deployed URLs

- **Frontend**: `https://YOUR_USERNAME.github.io/SwiftURL`
- **Backend**: `https://swifturl-backend.onrender.com`
- **API Health**: `https://swifturl-backend.onrender.com/health`

## 💡 Tips for Free Tier Limitations

1. **Render Free Tier**:
   - Service sleeps after 15 minutes of inactivity
   - 750 hours/month limit
   - Use a cron job to keep it awake during business hours

2. **GitHub Pages**:
   - 1GB storage limit
   - 100GB bandwidth/month
   - Perfect for static sites

3. **Database**:
   - Most free tiers have connection limits
   - Monitor usage to avoid overages

## 🔄 Continuous Deployment

Both platforms support automatic deployment:
- **Render**: Auto-deploys on git push to main branch
- **GitHub Pages**: Use GitHub Actions for automated deployment

Your SwiftURL application will be live and accessible worldwide! 🌍
