const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'JWT Authentication API',
      version: '1.0.0',
      description: 'A secure JWT-based authentication system with rate limiting protection',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token in the format: Bearer <token>'
        }
      },
      schemas: {
        LoginRequest: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: {
              type: 'string',
              description: 'User username',
              example: 'admin'
            },
            password: {
              type: 'string',
              description: 'User password',
              example: 'admin123'
            }
          }
        },
        LoginResponse: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
              description: 'JWT token for authentication',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
            },
            message: {
              type: 'string',
              description: 'Success message',
              example: 'Login successful'
            },
            user: {
              type: 'object',
              properties: {
                username: {
                  type: 'string',
                  description: 'User username',
                  example: 'admin'
                }
              }
            }
          }
        },
        ProtectedResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Protected resource message',
              example: 'Hello, admin! This is your profile.'
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Error message',
              example: 'Invalid username or password'
            }
          }
        },
        RateLimitResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Rate limit error message',
              example: 'Too many requests from this IP, please try again after 15 minutes'
            },
            retryAfter: {
              type: 'number',
              description: 'Minutes to wait before retrying',
              example: 15
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Authentication',
        description: 'Authentication endpoints for login and user management'
      },
      {
        name: 'Protected',
        description: 'Protected endpoints requiring JWT authentication'
      }
    ],
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./routes/*.js', './server.js']
};

const specs = swaggerJsdoc(options);

module.exports = specs; 