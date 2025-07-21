const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'JWT Authentication API',
      version: '1.0.0',
      description: 'A modern JWT authentication system with secure token management',
      contact: {
        name: 'API Support',
        email: 'support@jwtapi-demo.com'
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      },
      {
        url: 'https://your-production-domain.com',
        description: 'Production server'
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
        ProtectedResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Success message with user info',
              example: 'Hello, admin! This is your profile.'
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Authentication',
        description: 'Authentication endpoints'
      },
      {
        name: 'Protected',
        description: 'Protected routes requiring authentication'
      }
    ]
  },
  apis: ['./routes/*.js', './server.js'], // Path to the API docs
};

const specs = swaggerJsdoc(options);

module.exports = specs; 