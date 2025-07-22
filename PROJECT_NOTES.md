# JWT API Demo - Project Notes

## What We Built
- Full-stack JWT authentication system
- Modern dark-themed frontend with glassmorphism
- Comprehensive API documentation with Swagger
- Docker containerization (dev & production)
- **Rate limiting protection** against brute force attacks
- **Security headers** with Helmet.js protection
- **Comprehensive logging** system with Winston and Morgan
- **CI/CD Pipeline** with GitHub Actions

## Key Features
- ✅ JWT token authentication
- ✅ Login/logout functionality
- ✅ Protected routes
- ✅ Modern responsive UI
- ✅ API documentation
- ✅ Docker setup
- ✅ **Rate limiting (3 layers)**
- ✅ **Security headers (Helmet.js)**
- ✅ **Content Security Policy (CSP)**
- ✅ **XSS protection**
- ✅ **Clickjacking protection**
- ✅ **Comprehensive logging**
- ✅ **Authentication tracking**
- ✅ **Security event monitoring**
- ✅ **CI/CD Pipeline**
- ✅ **Automated testing**
- ✅ **Security scanning**
- ✅ **Docker image building**
- ✅ **Environment deployment**

## Tech Stack
- **Backend:** Node.js, Express.js
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Authentication:** JWT (jsonwebtoken)
- **Documentation:** Swagger/OpenAPI
- **Containerization:** Docker & Docker Compose
- **Security:** express-rate-limit, helmet
- **Logging:** winston, morgan
- **CI/CD:** GitHub Actions
- **Environment:** dotenv

## Test Users
- `admin` / `admin123`
- `user` / `password123`
- `demo` / `demo123`

## How to Run
```bash
# Local development
npm install
npm run dev

# Docker development
docker-compose -f docker-compose.dev.yml up

# Docker production
docker-compose up -d

# Run tests
npm test
```

## URLs
- **Frontend:** http://localhost:3000
- **API Docs:** http://localhost:3000/api-docs
- **Docs Redirect:** http://localhost:3000/docs

## API Endpoints
- `POST /auth/login` - Login (rate limited: 5/15min)
- `GET /auth/users` - List test users
- `GET /protected` - Protected profile (rate limited: 10/hour)
- `GET /protected/profile` - Detailed profile
- `POST /protected/validate` - Validate token

## Security Configuration

### Rate Limiting
- **Login:** 5 attempts per 15 minutes per IP
- **General API:** 100 requests per 15 minutes per IP
- **Protected endpoints:** 10 requests per hour per IP
- **Headers:** RateLimit-Limit, RateLimit-Remaining, RateLimit-Reset

### Security Headers (Helmet.js)
- **Content Security Policy:** Prevents XSS and injection attacks
- **X-Content-Type-Options:** `nosniff` - Prevent MIME type sniffing
- **X-Frame-Options:** `DENY` - Prevent clickjacking
- **X-XSS-Protection:** `1; mode=block` - Enable XSS protection
- **Strict-Transport-Security:** Force HTTPS in production
- **Referrer-Policy:** Control referrer information
- **Permissions-Policy:** Restrict browser features

### CSP Directives
- **defaultSrc:** `'self'` - Same origin only
- **styleSrc:** `'self'`, `'unsafe-inline'`, `https://fonts.googleapis.com`
- **fontSrc:** `'self'`, `https://fonts.gstatic.com`
- **scriptSrc:** `'self'` - Same origin scripts only
- **imgSrc:** `'self'`, `data:`, `https:`
- **connectSrc:** `'self'` - Same origin connections
- **frameSrc:** `'none'` - Block all frames
- **objectSrc:** `'none'` - Block all objects

## Logging System

### Log Files
- **combined.log** - All logs (info level and above)
- **error.log** - Error logs only
- **debug.log** - Debug logs (most detailed)

### Log Levels
- **error** - Application errors and exceptions
- **warn** - Security events and warnings
- **info** - General application events
- **debug** - Detailed debugging information

### What Gets Logged
- **Authentication Events:** Login attempts, successes, failures
- **API Requests:** All HTTP requests with response times
- **Security Events:** Rate limiting, invalid tokens, suspicious activity
- **Application Events:** Server startup, errors, 404s
- **Performance:** Response times, request details

### Viewing Logs

#### Using the Log Viewer Script
```bash
# Show combined logs (last 50 entries)
node view-logs.js combined

# Show error logs (last 20 entries)
node view-logs.js error 20

# Show debug logs with filter
node view-logs.js debug 30 "admin"

# Show log statistics
node view-logs.js stats

# Get help
node view-logs.js help
```

#### Direct File Access
```bash
# View all logs
tail -f logs/combined.log

# View errors only
tail -f logs/error.log

# Search for specific events
grep "login_success" logs/combined.log

# Search for security events
grep "Security event" logs/combined.log

# Search by IP address
grep "192.168" logs/combined.log
```

#### Common Log Filters
```bash
# Authentication events
node view-logs.js combined 100 "Authentication event"

# Security events
node view-logs.js combined 50 "Security event"

# API requests
node view-logs.js combined 100 "API request"

# Specific user
node view-logs.js combined 50 "admin"

# Rate limiting
node view-logs.js combined 20 "Rate limit exceeded"
```

## CI/CD Pipeline

### Workflows

#### 1. **Main CI/CD Pipeline** (`.github/workflows/ci-cd.yml`)
**Triggers:** Push to main/develop, PRs, releases
**Jobs:**
- ✅ **Test & Lint** - Code quality checks
- 🔒 **Security Scan** - Vulnerability scanning with Trivy
- 🐳 **Build** - Docker image building and pushing
- 🚀 **Deploy Staging** - Automatic staging deployment
- 🌐 **Deploy Production** - Production deployment
- 📦 **Release** - GitHub release creation

#### 2. **Development Workflow** (`.github/workflows/development.yml`)
**Triggers:** Feature branches, PRs
**Jobs:**
- ✅ **Code Quality** - Syntax checks, security audit
- 🐳 **Build Test** - Docker build validation
- 📚 **Documentation** - Doc file validation
- 🔒 **Security Check** - Sensitive file validation

#### 3. **Deployment Workflow** (`.github/workflows/deploy.yml`)
**Triggers:** Manual deployment, tags
**Features:**
- 🎯 **Environment Selection** - Choose staging/production
- 🔄 **Auto-deployment** - Based on branch
- 🏥 **Health Checks** - Post-deployment validation

### Branch Strategy
- **`main`** → Production deployment
- **`develop`** → Staging deployment
- **`feature/*`** → Development workflow only
- **`v*` tags** → Release creation

### Pipeline Stages
```
Code Push → Test & Lint → Security Scan → Build Docker Image → Deploy Staging → Deploy Production → Create Release
```

## What We Learned
- JWT token implementation
- Express.js middleware
- Docker containerization
- API documentation with Swagger
- Modern CSS techniques
- **Rate limiting strategies**
- **Security best practices**
- **Content Security Policy**
- **HTTP security headers**
- **Logging strategies**
- **Winston configuration**
- **Morgan HTTP logging**
- **CI/CD pipeline design**
- **GitHub Actions workflows**
- **Docker image building**
- **Security scanning**
- **Automated testing**
- **Environment deployment**
- **Brute force protection**

## Files Created/Modified
- `server.js` - Added rate limiting, Helmet.js, and logging middleware
- `routes/auth.js` - Added login rate limiting and authentication logging
- `routes/protected.js` - Protected endpoints with logging
- `logger.js` - Winston logging configuration
- `view-logs.js` - Log viewer utility script
- `test/health.test.js` - Health check and API tests
- `.github/workflows/ci-cd.yml` - Main CI/CD pipeline
- `.github/workflows/development.yml` - Development workflow
- `.github/workflows/deploy.yml` - Deployment workflow
- `public/index.html` - Frontend
- `public/styles.css` - Modern styling
- `public/script.js` - Frontend logic
- `swagger.js` - API documentation
- `Dockerfile` - Production container
- `Dockerfile.dev` - Development container
- `docker-compose.yml` - Production orchestration
- `docker-compose.dev.yml` - Development orchestration
- `.env` - Environment variables
- `.env.example` - Environment template
- `.gitignore` - Added logs directory
- `package.json` - Added test scripts and metadata
- `README.md` - Comprehensive documentation
- `API_DOCUMENTATION.md` - Complete API docs
- `PROJECT_NOTES.md` - This file

## Next Steps
- [ ] Add password hashing (bcrypt)
- [ ] Implement user registration
- [ ] Add token refresh mechanism
- [ ] Set up database (MongoDB/PostgreSQL)
- [ ] Add email verification
- [ ] Implement password reset
- [ ] Add role-based access control
- [ ] Set up monitoring/logging
- [ ] Add unit tests
- [ ] Configure CORS for production
- [ ] Add CSRF protection
- [ ] Implement session management
- [ ] Add log rotation
- [ ] Set up log aggregation
- [ ] Add ESLint configuration
- [ ] Implement Jest testing framework
- [ ] Add integration tests
- [ ] Set up monitoring (Prometheus/Grafana)
- [ ] Add load balancing
- [ ] Implement caching (Redis)

## Key Commands
```bash
# Start local server
npm start

# Start with hot reload
npm run dev

# Docker production
docker-compose up -d

# Docker development
docker-compose -f docker-compose.dev.yml up

# Stop Docker
docker-compose down

# View logs
docker-compose logs -f

# Test rate limiting
curl -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d '{"username":"wrong","password":"wrong"}' -w "\nHTTP Status: %{http_code}\n"

# Test security headers
curl -I http://localhost:3000 | grep -E "(X-|Content-Security-Policy|Strict-Transport-Security)"

# View logs (using script)
node view-logs.js combined 20

# View authentication logs
node view-logs.js combined 50 "Authentication event"

# View security events
node view-logs.js combined 30 "Security event"

# Run tests
npm test

# Run security audit
npm run security:audit

# Build Docker image
npm run docker:build

# View log statistics
npm run logs:stats
```

## Project Structure
```
jwtapi-demo/
├── server.js              # Main server with security middleware
├── logger.js              # Winston logging configuration
├── view-logs.js           # Log viewer utility
├── test/
│   └── health.test.js     # Health check and API tests
├── .github/workflows/     # CI/CD workflows
│   ├── ci-cd.yml         # Main pipeline
│   ├── development.yml   # Development workflow
│   └── deploy.yml        # Deployment workflow
├── routes/
│   ├── auth.js           # Authentication routes
│   └── protected.js      # Protected routes
├── public/
│   ├── index.html        # Frontend
│   ├── styles.css        # Modern styling
│   └── script.js         # Frontend logic
├── logs/                 # Log files directory
│   ├── combined.log      # All logs
│   ├── error.log         # Error logs
│   └── debug.log         # Debug logs
├── swagger.js            # API documentation
├── Dockerfile            # Production container
├── Dockerfile.dev        # Development container
├── docker-compose.yml    # Production orchestration
├── docker-compose.dev.yml # Development orchestration
├── .env                  # Environment variables
├── .env.example          # Environment template
├── .gitignore            # Git ignore rules
├── package.json          # Dependencies and scripts
├── README.md             # Comprehensive documentation
├── API_DOCUMENTATION.md  # Complete API docs
└── PROJECT_NOTES.md      # This file
```

## Security Features
- ✅ JWT token expiration (1 hour)
- ✅ Rate limiting on all endpoints
- ✅ Input validation
- ✅ Environment variable protection
- ✅ Non-root Docker containers
- ✅ Health checks
- ✅ Security headers (Helmet.js)
- ✅ Content Security Policy
- ✅ XSS protection
- ✅ Clickjacking protection
- ✅ MIME type sniffing protection
- ✅ HTTPS enforcement (production)
- ✅ Comprehensive logging
- ✅ Authentication tracking
- ✅ Security event monitoring
- ✅ Automated security scanning
- ✅ Vulnerability assessment
- ✅ Secure deployment pipeline 