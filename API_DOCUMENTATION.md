# JWT Authentication API Documentation

## Overview
A secure JWT-based authentication system with comprehensive rate limiting protection and security headers against brute force attacks, API abuse, and common web vulnerabilities.

## Base URLs
- **Development:** `http://localhost:3000`
- **API Base:** `http://localhost:3000`

## Interactive Documentation
- **Swagger UI:** http://localhost:3000/api-docs
- **Alternative URL:** http://localhost:3000/docs

## Authentication
This API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Security Features

### Rate Limiting
The API implements multiple layers of rate limiting for security:

#### Login Endpoint
- **Limit:** 5 attempts per 15 minutes per IP
- **Purpose:** Prevent brute force attacks on login
- **Response:** 429 Too Many Requests with retry information

#### General API Endpoints
- **Limit:** 100 requests per 15 minutes per IP
- **Purpose:** Prevent API abuse and DoS attacks
- **Response:** 429 Too Many Requests with retry information

#### Protected Endpoints
- **Limit:** 10 requests per hour per IP
- **Purpose:** Protect sensitive authenticated resources
- **Response:** 429 Too Many Requests with retry information

#### Rate Limit Headers
The API returns rate limit information in response headers:
- `RateLimit-Limit`: Maximum requests allowed
- `RateLimit-Remaining`: Remaining requests in current window
- `RateLimit-Reset`: Time when the rate limit resets (Unix timestamp)

### Security Headers (Helmet.js)
The API implements comprehensive security headers:

#### Content Security Policy (CSP)
- **defaultSrc:** `'self'` - Only allow resources from same origin
- **styleSrc:** `'self'`, `'unsafe-inline'`, `https://fonts.googleapis.com` - Allow inline styles and Google Fonts
- **fontSrc:** `'self'`, `https://fonts.gstatic.com` - Allow Google Fonts
- **scriptSrc:** `'self'` - Only allow scripts from same origin
- **imgSrc:** `'self'`, `data:`, `https:` - Allow images from same origin, data URIs, and HTTPS
- **connectSrc:** `'self'` - Only allow connections to same origin
- **frameSrc:** `'none'` - Block all frames (XSS protection)
- **objectSrc:** `'none'` - Block all objects (XSS protection)

#### Additional Security Headers
- **X-Content-Type-Options:** `nosniff` - Prevent MIME type sniffing
- **X-Frame-Options:** `DENY` - Prevent clickjacking attacks
- **X-XSS-Protection:** `1; mode=block` - Enable XSS protection
- **Strict-Transport-Security:** `max-age=31536000; includeSubDomains` - Force HTTPS
- **Referrer-Policy:** `strict-origin-when-cross-origin` - Control referrer information
- **Permissions-Policy:** Various restrictions on browser features

## Test Users
Use these credentials for testing:

| Username | Password | Description |
|----------|----------|-------------|
| `admin`  | `admin123` | Administrator account |
| `user`   | `password123` | Regular user account |
| `demo`   | `demo123` | Demo account |

## Endpoints

### Authentication Endpoints

#### POST /auth/login
Authenticate user and receive JWT token.

**Rate Limited:** 5 attempts per 15 minutes per IP

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Success Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Login successful",
  "user": {
    "username": "admin"
  }
}
```

**Error Responses:**
- **400 Bad Request:** Missing username or password
- **401 Unauthorized:** Invalid credentials
- **429 Too Many Requests:** Rate limit exceeded
- **500 Internal Server Error:** Server error

**cURL Example:**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

#### GET /auth/users
Get list of available test users.

**Response (200):**
```json
{
  "users": [
    {
      "username": "admin",
      "description": "admin account"
    },
    {
      "username": "user", 
      "description": "user account"
    },
    {
      "username": "demo",
      "description": "demo account"
    }
  ]
}
```

### Protected Endpoints

All protected endpoints require JWT authentication and are rate limited to 10 requests per hour per IP.

#### GET /protected
Access protected user profile.

**Headers Required:**
```
Authorization: Bearer <jwt-token>
```

**Success Response (200):**
```json
{
  "message": "Hello, admin! This is your profile."
}
```

**Error Responses:**
- **401 Unauthorized:** No token provided
- **403 Forbidden:** Invalid or expired token
- **429 Too Many Requests:** Rate limit exceeded

**cURL Example:**
```bash
curl -X GET http://localhost:3000/protected \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### GET /protected/profile
Get detailed user profile information.

**Headers Required:**
```
Authorization: Bearer <jwt-token>
```

**Success Response (200):**
```json
{
  "user": {
    "username": "admin",
    "iat": 1753098297,
    "exp": 1753101897
  },
  "message": "Profile retrieved successfully"
}
```

#### POST /protected/validate
Validate JWT token.

**Headers Required:**
```
Authorization: Bearer <jwt-token>
```

**Success Response (200):**
```json
{
  "valid": true,
  "message": "Token is valid",
  "user": {
    "username": "admin"
  }
}
```

## JWT Token Details
- **Algorithm:** HS256
- **Expiration:** 1 hour from creation
- **Payload:** Contains username and timestamps
- **Secret:** Configured via JWT_SECRET environment variable

## Error Handling
All endpoints return consistent error responses:

```json
{
  "message": "Error description"
}
```

Common HTTP status codes:
- **200:** Success
- **400:** Bad Request (missing/invalid parameters)
- **401:** Unauthorized (no token)
- **403:** Forbidden (invalid token)
- **429:** Too Many Requests (rate limit exceeded)
- **500:** Internal Server Error

## Security Considerations
1. **Rate Limiting:** Multiple layers prevent abuse
2. **Security Headers:** Comprehensive protection against common attacks
3. **Content Security Policy:** Prevents XSS and injection attacks
4. **JWT Expiration:** Tokens expire after 1 hour
5. **HTTPS:** Use HTTPS in production
6. **Environment Variables:** Store secrets securely
7. **Input Validation:** All inputs are validated
8. **CORS:** Configure CORS for production

## Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd jwtapi-demo

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your JWT secret
echo "JWT_SECRET=your-super-secret-jwt-key-change-this-in-production" > .env
echo "PORT=3000" >> .env

# Start development server
npm run dev
```

### Docker Setup
```bash
# Development with hot reload
docker-compose -f docker-compose.dev.yml up

# Production
docker-compose up -d
```

## Testing
Test the API using:
- **Postman:** Import the endpoints
- **cURL:** Use the provided examples
- **Swagger UI:** Interactive testing at `/api-docs`
- **Frontend:** Visit `http://localhost:3000`

## Security Testing
### Rate Limiting Test
```bash
# Test login rate limiting
for i in {1..6}; do 
  curl -X POST http://localhost:3000/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username":"wrong","password":"wrong"}' \
    -w "\nHTTP Status: %{http_code}\n" -s
  echo "---"
done
```

### Security Headers Test
```bash
# Check security headers
curl -I http://localhost:3000 | grep -E "(X-|Content-Security-Policy|Strict-Transport-Security)"
```

## Deployment
1. Set production environment variables
2. Use Docker for containerized deployment
3. Configure reverse proxy (nginx)
4. Enable HTTPS
5. Set up monitoring and logging
6. Configure proper CORS settings
7. Review and adjust CSP policies for production

## Rate Limiting Testing
To test rate limiting:
1. Make multiple rapid requests to `/auth/login`
2. After 5 failed attempts, you'll get a 429 response
3. Wait 15 minutes or use a different IP
4. Protected endpoints have stricter limits (10/hour)

## Support
For API support, contact: support@example.com 