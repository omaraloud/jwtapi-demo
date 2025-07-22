const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swagger');
const { logger, stream, logApi, logError, logSecurity } = require('./logger');
const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Log application startup
logger.info('Starting JWT Authentication API', {
  port: PORT,
  environment: process.env.NODE_ENV || 'development',
  timestamp: new Date().toISOString()
});

// Security middleware - Helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// HTTP request logging middleware
app.use(morgan('combined', { stream }));

// Custom middleware to log API requests with response time
app.use((req, res, next) => {
  const start = Date.now();
  
  // Log the request
  logger.debug('Incoming request', {
    method: req.method,
    url: req.url,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('User-Agent')
  });

  // Override res.end to log response
  const originalEnd = res.end;
  res.end = function(chunk, encoding) {
    const responseTime = Date.now() - start;
    
    logApi(
      req.method,
      req.url,
      res.statusCode,
      responseTime,
      req.ip || req.connection.remoteAddress
    );
    
    originalEnd.call(this, chunk, encoding);
  };
  
  next();
});

// Rate limiting configuration
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login attempts per windowMs
  message: {
    message: 'Too many login attempts from this IP, please try again after 15 minutes',
    retryAfter: Math.ceil(15 * 60 / 60) // retry after 15 minutes
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    const ip = req.ip || req.connection.remoteAddress;
    logSecurity('Rate limit exceeded', {
      endpoint: '/auth/login',
      ip,
      limit: '5 attempts per 15 minutes'
    });
    
    res.status(429).json({
      message: 'Too many login attempts from this IP, please try again after 15 minutes',
      retryAfter: Math.ceil(15 * 60 / 60)
    });
  }
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    message: 'Too many requests from this IP, please try again after 15 minutes',
    retryAfter: Math.ceil(15 * 60 / 60)
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    const ip = req.ip || req.connection.remoteAddress;
    logSecurity('Rate limit exceeded', {
      endpoint: req.url,
      ip,
      limit: '100 requests per 15 minutes'
    });
    
    res.status(429).json({
      message: 'Too many requests from this IP, please try again after 15 minutes',
      retryAfter: Math.ceil(15 * 60 / 60)
    });
  }
});

const strictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 requests per hour for sensitive endpoints
  message: {
    message: 'Too many requests to sensitive endpoints, please try again after 1 hour',
    retryAfter: Math.ceil(60 * 60 / 60)
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    const ip = req.ip || req.connection.remoteAddress;
    logSecurity('Rate limit exceeded', {
      endpoint: req.url,
      ip,
      limit: '10 requests per hour'
    });
    
    res.status(429).json({
      message: 'Too many requests to sensitive endpoints, please try again after 1 hour',
      retryAfter: Math.ceil(60 * 60 / 60)
    });
  }
});

// Middleware to parse JSON bodies
app.use(express.json());

// Apply rate limiting to all routes
app.use(apiLimiter);

// Apply strict rate limiting to protected routes
app.use('/protected', strictLimiter);

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Swagger API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'JWT Authentication API Documentation',
  customfavIcon: '/favicon.ico',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    deepLinking: true
  }
}));

// Route registration with specific rate limiting
app.use('/auth', authRoutes);
app.use('/protected', protectedRoutes);

// Root endpoint - serve the login page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API Documentation redirect
app.get('/docs', (req, res) => {
  res.redirect('/api-docs');
});

// Error handling middleware
app.use((err, req, res, next) => {
  logError(err, {
    method: req.method,
    url: req.url,
    ip: req.ip || req.connection.remoteAddress
  });
  
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use((req, res) => {
  logger.warn('Route not found', {
    method: req.method,
    url: req.url,
    ip: req.ip || req.connection.remoteAddress
  });
  
  res.status(404).json({
    message: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  logger.info('Server started successfully', {
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
  
  console.log(`Server listening on port ${PORT}`);
  console.log(`API Documentation available at: http://localhost:${PORT}/api-docs`);
  console.log(`Frontend available at: http://localhost:${PORT}`);
  console.log(`Rate limiting enabled: Login (5/15min), API (100/15min), Protected (10/hour)`);
  console.log(`Security headers enabled with Helmet.js`);
  console.log(`Logging enabled - check logs/ directory for log files`);
});