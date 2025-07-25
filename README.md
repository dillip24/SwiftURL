# SwiftURL - Modern URL Shortening Service

![SwiftURL Logo](https://via.placeholder.com/400x100/667eea/white?text=SwiftURL)

A comprehensive, modern URL shortening service built with Node.js, React, PostgreSQL, and Redis. Features custom short codes, click analytics, URL expiration, caching, and rate limiting.

## 🚀 Features

### Core Functionality
- **URL Shortening**: Convert long URLs into short, shareable links
- **Custom Short Codes**: Users can specify their own custom codes (3-20 characters)
- **URL Expiration**: Set expiration dates for temporary links
- **Click Analytics**: Track click counts and performance metrics
- **URL Validation**: Comprehensive validation for URLs and custom codes

### Performance & Security
- **Redis Caching**: High-performance caching for frequent URL lookups
- **Rate Limiting**: IP-based rate limiting to prevent abuse
- **Database Optimization**: Indexed PostgreSQL database for fast queries
- **Error Handling**: Comprehensive error handling and user-friendly messages
- **Security Headers**: Helmet.js for security best practices

### User Experience
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Copy to Clipboard**: One-click copying of shortened URLs
- **Real-time Feedback**: Toast notifications for user actions
- **Dark/Light Mode**: Modern UI with gradient backgrounds
- **Progressive Enhancement**: Works without JavaScript for basic functionality

## 🛠 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **PostgreSQL** - Primary database for URL storage
- **Redis** - Caching and rate limiting
- **Joi** - Request validation
- **Helmet** - Security middleware
- **Morgan** - HTTP request logging
- **Nanoid** - URL-safe unique ID generation

### Frontend
- **React 18** - UI library with hooks
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **React Hot Toast** - Toast notifications
- **Lucide React** - Icon library

### DevOps & Tools
- **Nodemon** - Development server auto-restart
- **Concurrently** - Run multiple commands
- **ESLint** - Code linting
- **PostCSS** - CSS processing

## 📦 Project Structure

```
SwiftURL/
├── backend/                 # Node.js Express API
│   ├── config/             # Database and Redis configuration
│   │   ├── database.js
│   │   └── redis.js
│   ├── middleware/         # Express middleware
│   │   ├── errorHandler.js
│   │   └── rateLimiter.js
│   ├── routes/             # API routes
│   │   ├── urlRoutes.js
│   │   └── redirectRoutes.js
│   ├── services/           # Business logic
│   │   ├── urlService.js
│   │   └── cleanupService.js
│   ├── validators/         # Input validation
│   │   └── urlValidator.js
│   ├── utils/              # Utility functions
│   │   └── logger.js
│   ├── scripts/            # Database setup scripts
│   │   └── setup-database.js
│   ├── .env.example        # Environment variables template
│   ├── .env                # Environment variables (create from example)
│   ├── package.json
│   └── server.js           # Main server file
├── frontend/               # React Vite application
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── Header.tsx
│   │   │   ├── UrlShortener.tsx
│   │   │   ├── UrlResult.tsx
│   │   │   ├── StatsDisplay.tsx
│   │   │   └── Footer.tsx
│   │   ├── services/       # API services
│   │   │   └── api.ts
│   │   ├── types/          # TypeScript types
│   │   │   └── url.ts
│   │   ├── utils/          # Utility functions
│   │   │   └── helpers.ts
│   │   ├── App.tsx         # Main App component
│   │   ├── main.tsx        # Entry point
│   │   ├── index.css       # Global styles
│   │   └── vite-env.d.ts   # Vite types
│   ├── public/             # Static assets
│   ├── .env.example        # Frontend environment template
│   ├── .env                # Frontend environment variables
│   ├── package.json
│   ├── tailwind.config.js  # Tailwind configuration
│   ├── postcss.config.js   # PostCSS configuration
│   └── vite.config.js      # Vite configuration
├── .github/
│   └── copilot-instructions.md  # GitHub Copilot instructions
├── package.json            # Root package.json for scripts
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites

Before running SwiftURL, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **PostgreSQL** (v12 or higher)
- **Redis** (v6 or higher)
- **npm** or **yarn**

### 1. Clone the Repository

```bash
git clone <repository-url>
cd SwiftURL
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install all dependencies (backend + frontend)
npm run install-all
```

### 3. Set Up PostgreSQL Database

1. **Create a PostgreSQL database:**
   ```sql
   CREATE DATABASE swifturl;
   CREATE USER swifturl_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE swifturl TO swifturl_user;
   ```

2. **Configure backend environment:**
   ```bash
   cd backend
   cp .env.example .env
   ```

3. **Edit backend/.env with your database credentials:**
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=swifturl
   DB_USER=swifturl_user
   DB_PASSWORD=your_password
   ```

4. **Run database setup:**
   ```bash
   npm run setup-db
   ```

### 4. Set Up Redis

1. **Install Redis** (if not already installed):
   - **Windows**: Download from [Redis Windows](https://github.com/microsoftarchive/redis/releases)
   - **macOS**: `brew install redis`
   - **Linux**: `sudo apt-get install redis-server`

2. **Start Redis server:**
   ```bash
   redis-server
   ```

### 5. Configure Frontend Environment

```bash
cd frontend
cp .env.example .env
```

Edit `frontend/.env` if needed (default should work for local development):
```env
VITE_API_URL=http://localhost:5000
```

### 6. Start the Application

From the root directory:

```bash
# Start both backend and frontend simultaneously
npm run dev
```

This will start:
- Backend API on http://localhost:5000
- Frontend on http://localhost:3000

### Alternative: Start Services Separately

```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend  
npm run client
```

## 🔧 Configuration

### Backend Environment Variables

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=swifturl
DB_USER=postgres
DB_PASSWORD=your_password

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Server Configuration
PORT=5000
NODE_ENV=development
BASE_URL=http://localhost:3000

# Security
JWT_SECRET=your_jwt_secret

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=10

# Cache TTL (in seconds)
CACHE_TTL=3600
```

### Frontend Environment Variables

```env
# API Configuration
VITE_API_URL=http://localhost:5000

# App Configuration
VITE_APP_NAME=SwiftURL
VITE_APP_VERSION=1.0.0
```

## 📖 API Documentation

### Create Short URL

**POST** `/api/shorten`

```json
{
  "longUrl": "https://example.com/very/long/url",
  "customCode": "my-code",           // Optional
  "expiresAt": "2025-12-31T23:59:59Z" // Optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "URL shortened successfully",
  "data": {
    "id": 1,
    "longUrl": "https://example.com/very/long/url",
    "shortCode": "my-code",
    "shortUrl": "http://localhost:3000/my-code",
    "clicks": 0,
    "createdAt": "2025-01-15T10:30:00Z",
    "expiresAt": "2025-12-31T23:59:59Z"
  }
}
```

### Redirect Short URL

**GET** `/:shortCode`

Redirects to the original URL and increments click count.

### Get URL Statistics

**GET** `/api/stats/:shortCode`

**Response:**
```json
{
  "success": true,
  "message": "Statistics retrieved successfully",
  "data": {
    "shortCode": "my-code",
    "longUrl": "https://example.com/very/long/url",
    "clicks": 42,
    "createdAt": "2025-01-15T10:30:00Z",
    "expiresAt": "2025-12-31T23:59:59Z",
    "isExpired": false
  }
}
```

### Health Check

**GET** `/health`

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-01-15T10:30:00Z",
  "uptime": 3600,
  "environment": "development"
}
```

## 🔒 Security Features

- **Rate Limiting**: 10 requests per minute per IP address
- **Input Validation**: Joi schemas for all inputs
- **SQL Injection Protection**: Parameterized queries
- **XSS Protection**: Helmet.js security headers
- **CORS**: Configured for frontend domain
- **Error Handling**: No sensitive information in error responses

## 📊 Performance Features

- **Redis Caching**: Sub-millisecond URL lookups
- **Database Indexing**: Optimized PostgreSQL indexes
- **Connection Pooling**: Efficient database connections
- **Async Operations**: Non-blocking click tracking
- **CDN Ready**: Static assets can be served from CDN

## 🧪 Testing the Application

### Basic Functionality Test

1. **Start the application** following the setup instructions
2. **Open your browser** to http://localhost:3000
3. **Enter a long URL** in the input field
4. **Click "Shorten URL"** 
5. **Copy the shortened URL** and test it in a new tab
6. **Check analytics** by entering the short code in the stats section

### Advanced Features Test

1. **Custom Short Code**: Try creating a URL with a custom code
2. **URL Expiration**: Set an expiration date and test after expiry
3. **Analytics**: Create multiple URLs and check their statistics
4. **Rate Limiting**: Make more than 10 requests quickly to test rate limiting

## 🐛 Troubleshooting

### Common Issues

**1. Database Connection Error**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
- Ensure PostgreSQL is running
- Check database credentials in `.env`
- Verify database exists

**2. Redis Connection Error**
```
Error: connect ECONNREFUSED 127.0.0.1:6379
```
- Ensure Redis server is running
- Check Redis configuration in `.env`

**3. Frontend API Connection Error**
```
Error: Network Error
```
- Ensure backend is running on port 5000
- Check `VITE_API_URL` in frontend `.env`
- Verify CORS configuration

**4. Port Already in Use**
```
Error: listen EADDRINUSE :::5000
```
- Change port in backend `.env`
- Kill process using the port: `lsof -ti:5000 | xargs kill`

### Logs

- **Backend logs**: Check console output and `backend/logs/` directory
- **Frontend logs**: Check browser console
- **Database logs**: Check PostgreSQL logs
- **Redis logs**: Check Redis server output

## 🚀 Production Deployment

### Backend Deployment

1. **Environment Configuration**:
   ```env
   NODE_ENV=production
   PORT=5000
   DB_HOST=your-production-db-host
   REDIS_HOST=your-production-redis-host
   BASE_URL=https://yourdomain.com
   ```

2. **Build and Start**:
   ```bash
   cd backend
   npm install --production
   npm start
   ```

### Frontend Deployment

1. **Build for Production**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Serve Built Files**: Use nginx, Apache, or a CDN to serve the `dist/` directory

### Database Migration

For production, consider using a migration tool:
```bash
cd backend
node scripts/setup-database.js
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by popular URL shortening services
- Community contributions and feedback

## 📞 Support

If you have any questions or need help:

1. Check the [Issues](https://github.com/yourusername/swifturl/issues) page
2. Create a new issue with detailed information
3. Contact the maintainers

---

**Made with ❤️ by developers, for developers**
