# JWT Project - Personal Notes

## What I Built
- **JWT Authentication System** - Login system with tokens
- **Modern Dark UI** - Beautiful login page and dashboard
- **Docker Setup** - Containerized for easy deployment
- **API Documentation** - Interactive docs with Swagger

## Key Features
✅ **Login System** - Username/password authentication  
✅ **JWT Tokens** - Secure 1-hour expiration tokens  
✅ **Protected Routes** - Token-required endpoints  
✅ **Modern UI** - Dark theme with animations  
✅ **Docker Ready** - Easy deployment anywhere  
✅ **API Docs** - Interactive testing interface  

## Tech Stack
- **Backend:** Node.js, Express, JWT
- **Frontend:** HTML, CSS, JavaScript
- **DevOps:** Docker, Docker Compose
- **Docs:** Swagger/OpenAPI

## Test Users
- `admin` / `admin123`
- `user` / `password123`  
- `demo` / `demo123`

## How to Run
```bash
# Local
npm install
npm start

# Docker
docker-compose up --build
```

## URLs
- **App:** http://localhost:3000
- **API Docs:** http://localhost:3000/api-docs
- **Docs:** http://localhost:3000/docs

## API Endpoints
- `POST /auth/login` - Login
- `GET /auth/users` - List users
- `GET /protected` - User profile
- `GET /protected/profile` - Detailed profile
- `POST /protected/validate` - Check token

## What I Learned
- JWT token implementation
- Docker containerization
- API documentation with Swagger
- Modern CSS animations
- Security best practices

## Files Created
- `server.js` - Main server
- `routes/auth.js` - Login endpoints
- `routes/protected.js` - Protected routes
- `public/` - Frontend files
- `Dockerfile` - Container setup
- `docker-compose.yml` - Multi-container
- `swagger.js` - API documentation
- `.env` - Environment variables

## Next Steps (Future)
- Add password hashing (bcrypt)
- User registration
- Database integration
- Email verification
- Rate limiting
- Two-factor authentication

## Key Commands
```bash
# Start server
npm start

# Docker build
docker build -t jwt-app .

# Docker run
docker run -p 3000:3000 jwt-app

# Docker compose
docker-compose up -d

# Test API
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

## Project Structure
```
jwtapi-demo/
├── public/           # Frontend files
├── routes/           # API routes
├── server.js         # Main server
├── Dockerfile        # Container config
├── docker-compose.yml
├── swagger.js        # API docs
└── .env             # Environment
```

## Skills Demonstrated
- Full-stack development
- Authentication systems
- Containerization
- API design
- Modern UI/UX
- Documentation
- Security practices

---
**Date:** July 2025 
**Status:** Complete & Working  
**Ready for:** 