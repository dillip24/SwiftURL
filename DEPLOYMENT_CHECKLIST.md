# 🚀 SwiftURL Deployment Checklist

## ✅ Pre-Deployment Steps

- [ ] Update `frontend/package.json` homepage URL
- [ ] Update `frontend/.env.production` with backend URL
- [ ] Update `backend/.env.production` with database URLs
- [ ] Test application locally
- [ ] Commit all changes to git

## 🌐 Free Hosting Setup

### 1. Backend on Render.com
- [ ] Create Render account
- [ ] Create PostgreSQL database
- [ ] Create Redis instance  
- [ ] Deploy backend web service
- [ ] Configure environment variables
- [ ] Test API endpoints

### 2. Frontend on GitHub Pages
- [ ] Push code to GitHub repository
- [ ] Run `npm run deploy` in frontend folder
- [ ] Enable GitHub Pages in repository settings
- [ ] Test deployed frontend

### 3. Connect Frontend to Backend
- [ ] Update frontend production API URL
- [ ] Update backend CORS settings
- [ ] Test end-to-end functionality

## 🔧 Environment Variables Checklist

### Backend (Render.com)
```
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
NODE_ENV=production
BASE_URL=https://your-app.onrender.com
JWT_SECRET=secure-random-string
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=10
CACHE_TTL=3600
```

### Frontend (GitHub Pages)
```
VITE_API_URL=https://your-backend.onrender.com
```

## 🎯 Final Testing

- [ ] Frontend loads correctly
- [ ] Can create short URLs
- [ ] Short URLs redirect properly
- [ ] Analytics page works
- [ ] Rate limiting is active
- [ ] Error handling works

## 📝 Post-Deployment

- [ ] Update README with live URLs
- [ ] Set up monitoring/logging
- [ ] Configure custom domain (optional)
- [ ] Share your amazing URL shortener!

---

**Your app will be live at:**
- Frontend: `https://YOUR_USERNAME.github.io/SwiftURL`
- Backend: `https://your-app-name.onrender.com`
