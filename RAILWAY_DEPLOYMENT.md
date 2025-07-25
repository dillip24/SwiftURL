# 🚀 Railway.app Deployment Guide (No Credit Card Required)

## ✅ **Why Railway.app?**
- 🆓 Completely free tier (500 hours/month)
- 🚫 No credit card required
- 🗄️ PostgreSQL and Redis included
- 🔄 Auto-deployment from GitHub
- 🌐 Global CDN included

## 📋 **Step-by-Step Railway Deployment**

### 1. **Prepare Your Repository**
```bash
# Make sure all changes are committed
git add .
git commit -m "Prepare for Railway deployment"
git push origin main
```

### 2. **Deploy Backend on Railway**

#### A. Sign Up & Connect GitHub
1. Go to [Railway.app](https://railway.app)
2. Click "Login" → "Login with GitHub"
3. Authorize Railway to access your repositories

#### B. Create New Project
1. Click "New Project"
2. Click "Deploy from GitHub repo"
3. Select your `SwiftURL` repository
4. Railway automatically detects and deploys your Node.js backend

#### C. Add PostgreSQL Database
1. In your project dashboard, click "New"
2. Select "Database" → "Add PostgreSQL"
3. Railway automatically creates and connects the database
4. Note: `DATABASE_URL` environment variable is automatically provided

#### D. Add Redis Cache
1. Click "New" again
2. Select "Database" → "Add Redis"  
3. Railway automatically creates and connects Redis
4. Note: `REDIS_URL` environment variable is automatically provided

#### E. Configure Environment Variables
1. Click on your backend service
2. Go to "Variables" tab
3. Add these environment variables:
   ```
   NODE_ENV=production
   BASE_URL=${{RAILWAY_STATIC_URL}}
   JWT_SECRET=your-super-secure-jwt-secret-key
   RATE_LIMIT_WINDOW_MS=60000
   RATE_LIMIT_MAX_REQUESTS=10
   CACHE_TTL=3600
   ```

#### F. Trigger Redeploy
1. Go to "Deployments" tab
2. Click "Deploy Latest"
3. Wait for deployment to complete (usually 2-3 minutes)

### 3. **Deploy Frontend on GitHub Pages**

```bash
# Navigate to frontend directory
cd frontend

# Update API URL in .env.production
echo "VITE_API_URL=https://your-app.railway.app" > .env.production

# Deploy to GitHub Pages
npm run deploy
```

### 4. **Update Frontend Configuration**

Update your `frontend/.env.production` with your Railway backend URL:
```env
VITE_API_URL=https://swifturl-backend-production.railway.app
```

### 5. **Test Your Deployment**

#### Backend Tests:
- Health check: `https://your-app.railway.app/health`
- API test: Create a short URL through your frontend

#### Frontend Tests:
- Access: `https://YOUR_USERNAME.github.io/SwiftURL`
- Test URL shortening functionality
- Test analytics page

## 🎯 **Your Live URLs**

After successful deployment:
- **Frontend**: `https://YOUR_USERNAME.github.io/SwiftURL`
- **Backend API**: `https://your-app.railway.app`
- **Health Check**: `https://your-app.railway.app/health`

## 🔧 **Railway Configuration Files**

I've already created these files for you:
- `backend/railway.toml` - Railway configuration
- `backend/scripts/railway-setup.js` - Database setup script
- Updated database and Redis configs for Railway URLs

## 💡 **Railway Free Tier Limits**

- ✅ **500 execution hours/month** (about 16 hours/day)
- ✅ **PostgreSQL**: 1GB storage, 1M rows
- ✅ **Redis**: 25MB storage
- ✅ **Bandwidth**: 100GB/month
- ✅ **Custom domains**: Supported
- ⏰ **Sleep**: Services sleep after 15min inactivity (auto-wake on request)

## 🚀 **Quick Railway Deployment Commands**

```bash
# 1. Commit your changes
git add .
git commit -m "Deploy to Railway"
git push origin main

# 2. Deploy frontend
cd frontend
npm run deploy

# 3. That's it! Railway auto-deploys from GitHub
```

## 🎉 **Success!**

Your SwiftURL application is now live on Railway.app with:
- ✅ Full backend API with PostgreSQL and Redis
- ✅ Beautiful frontend on GitHub Pages  
- ✅ 100% free hosting (no credit card required)
- ✅ Auto-deployment from GitHub
- ✅ Professional production URLs

**Total cost: $0.00** 🆓

Start sharing your custom URL shortener with the world! 🌍
