# JWT Authentication System

A modern, production-ready JWT authentication system with a beautiful dark-themed frontend and comprehensive backend API.

![JWT Auth Demo](https://img.shields.io/badge/JWT-Authentication-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)
![Swagger](https://img.shields.io/badge/Swagger-Documented-orange)

## ✨ Features

- 🔐 **JWT Authentication** - Secure token-based authentication
- 🎨 **Modern Dark UI** - Beautiful glassmorphism design
- 🐳 **Docker Ready** - Easy deployment with containers
- 📚 **Interactive API Docs** - Swagger/OpenAPI documentation
- 📱 **Responsive Design** - Works on all devices
- 🔒 **Security First** - Industry-standard security practices

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or Docker
- npm or yarn

### Local Development
```bash
# Clone the repository
git clone https://github.com/yourusername/jwtapi-demo.git
cd jwtapi-demo

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your JWT_SECRET

# Start the server
npm start
```

### Docker Deployment
```bash
# Build and run with Docker
docker-compose up --build

# Or run in background
docker-compose up -d --build
```

## 🌐 Access Points

- **Frontend:** http://localhost:3000
- **API Documentation:** http://localhost:3000/api-docs
- **Alternative Docs:** http://localhost:3000/docs

## 🔐 Test Users

| Username | Password | Description |
|----------|----------|-------------|
| `admin`  | `admin123` | Administrator account |
| `user`   | `password123` | Regular user account |
| `demo`   | `demo123` | Demo account |

## 📡 API Endpoints

### Authentication
- `POST /auth/login` - User authentication
- `GET /auth/users` - Available test users

### Protected Routes
- `GET /protected` - Basic user profile
- `GET /protected/profile` - Detailed profile with token info
- `POST /protected/validate` - Token validation

### Documentation
- `GET /api-docs` - Interactive Swagger UI
- `GET /docs` - Documentation redirect

## 🛠️ Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **JWT** - JSON Web Tokens
- **Swagger** - API documentation

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with animations
- **JavaScript (ES6+)** - Interactive functionality

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Alpine Linux** - Lightweight base images

## 📁 Project Structure

```
jwtapi-demo/
├── public/                 # Frontend files
│   ├── index.html         # Main application page
│   ├── styles.css         # Modern dark theme styles
│   └── script.js          # Frontend JavaScript
├── routes/                # API routes
│   ├── auth.js           # Authentication endpoints
│   └── protected.js      # Protected routes
├── server.js             # Express server setup
├── swagger.js            # API documentation config
├── Dockerfile            # Production Docker config
├── Dockerfile.dev        # Development Docker config
├── docker-compose.yml    # Production Docker Compose
├── docker-compose.dev.yml # Development Docker Compose
├── package.json          # Dependencies and scripts
├── .env                  # Environment variables
└── README.md            # This file
```

## 🔧 Development

### Available Scripts
```bash
npm start          # Start production server
npm run dev        # Start development server with hot reload
```

### Environment Variables
Create a `.env` file in the root directory:
```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=3000
NODE_ENV=development
```

## 🐳 Docker Commands

```bash
# Development with hot reload
docker-compose -f docker-compose.dev.yml up --build

# Production deployment
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

## 🧪 Testing

### API Testing with curl
```bash
# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'

# Use token for protected requests
curl -X GET http://localhost:3000/protected \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Interactive Testing
Visit http://localhost:3000/api-docs for interactive API testing with Swagger UI.

## 🚀 Deployment

### Cloud Platforms
This Docker setup works with:
- **AWS ECS/Fargate**
- **Google Cloud Run**
- **Azure Container Instances**
- **DigitalOcean App Platform**
- **Heroku Container Registry**

### Example: Deploy to DigitalOcean
```bash
# Tag your image
docker tag jwt-app registry.digitalocean.com/your-registry/jwt-app

# Push to registry
docker push registry.digitalocean.com/your-registry/jwt-app
```

## 🔒 Security Features

- **JWT Token Expiration** (1 hour)
- **Secure Token Storage** (HttpOnly cookies ready)
- **Input Validation** (Request sanitization)
- **Error Handling** (Secure error responses)
- **CORS Support** (Cross-origin resource sharing)

## 🎨 UI Features

- **Dark Theme** with glassmorphism effects
- **Animated Background** with floating particles
- **Responsive Design** for all screen sizes
- **Smooth Animations** and hover effects
- **Modern Typography** with Inter font
- **Token Display** with copy functionality

## 📈 Performance

- **Efficient Token Validation** - Fast JWT verification
- **Minimal Dependencies** - Lightweight production build
- **Optimized Docker Images** - Alpine Linux base
- **Static File Serving** - Efficient frontend delivery
- **Caching Ready** - HTTP caching headers

## 🔮 Future Enhancements

- [ ] Password hashing with bcrypt
- [ ] User registration system
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Two-factor authentication (2FA)
- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] Rate limiting
- [ ] Real-time features (WebSocket)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Express.js](https://expressjs.com/) - Web framework
- [JWT](https://jwt.io/) - JSON Web Tokens
- [Swagger](https://swagger.io/) - API documentation
- [Docker](https://www.docker.com/) - Containerization

---

**Built with ❤️ using modern web technologies**

⭐ **Star this repository if you found it helpful!**

