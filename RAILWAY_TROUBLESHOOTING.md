# 🔧 Railway Deployment Troubleshooting

## ❌ Build Error: "npm run build" exit code 127

### 🚨 **Problem**: 
Railway fails with error: `"npm run build" did not complete successfully: exit code: 127`

### ✅ **Solution**:

#### Option 1: Use Environment Variables (Recommended)
1. Go to your Railway project dashboard
2. Click on your service → Settings → Environment
3. Add these build variables:
   ```
   NIXPACKS_BUILD_CMD=cd backend && npm install
   NIXPACKS_START_CMD=cd backend && npm start
   ```
4. Trigger a new deployment

#### Option 2: Update Railway Configuration
1. Make sure you have `railway.toml` in your project root:
   ```toml
   [build]
   builder = "NIXPACKS"

   [deploy]
   startCommand = "cd backend && npm start"

   [variables]
   NODE_ENV = "production"
   ```

#### Option 3: Set Root Directory
1. In Railway dashboard → Settings → Service
2. Set **Root Directory** to `backend`
3. This tells Railway to build from the backend folder

### 🔄 **If Still Failing**:

1. **Check Node.js Version**:
   - Add environment variable: `NODE_VERSION=18`

2. **Manual Build Command**:
   - Add environment variable: `BUILD_CMD=npm install`

3. **Alternative Start Command**:
   - Use: `node server.js` instead of `npm start`

### 🎯 **Working Environment Variables**:
```
NODE_ENV=production
NODE_VERSION=18
NIXPACKS_BUILD_CMD=cd backend && npm install
NIXPACKS_START_CMD=cd backend && npm start
DATABASE_URL=(auto-provided by Railway)
REDIS_URL=(auto-provided by Railway)
BASE_URL=${{RAILWAY_STATIC_URL}}
JWT_SECRET=your-secure-secret
```

### 🚀 **Alternative: Deploy Backend Only**

If issues persist, deploy just the backend:

1. Create a new repository with only the `backend` folder contents
2. Deploy that repository to Railway
3. It will work without any configuration issues

Would you like me to help you implement any of these solutions?
