# JWT Authentication API Documentation

## Overview

The JWT Authentication API provides secure authentication and authorization using JSON Web Tokens (JWT). This API allows users to authenticate, access protected resources, and manage their sessions.

## Base URL

- **Development:** `http://localhost:3000`
- **Production:** `https://your-production-domain.com`

## Interactive Documentation

Access the interactive Swagger documentation at:
- **Swagger UI:** `http://localhost:3000/api-docs`
- **Alternative URL:** `http://localhost:3000/docs`

## Authentication

This API uses **Bearer Token** authentication. Include your JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Test Users

The following test users are available for development:

| Username | Password | Description |
|----------|----------|-------------|
| `admin`  | `admin123` | Administrator account |
| `user`   | `password123` | Regular user account |
| `demo`   | `demo123` | Demo account |

## Endpoints

### Authentication Endpoints

#### 1. Login User

**POST** `/auth/login`

Authenticate a user and receive a JWT token.

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response (200):**
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
- **400** - Missing username or password
- **401** - Invalid credentials
- **500** - Internal server error

**Example with curl:**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

#### 2. Get Available Users

**GET** `/auth/users`

Get a list of available test users.

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

All protected endpoints require a valid JWT token in the Authorization header.

#### 1. Get User Profile

**GET** `/protected`

Access the user's basic profile information.

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response (200):**
```json
{
  "message": "Hello, admin! This is your profile."
}
```

**Error Responses:**
- **401** - No token provided
- **403** - Invalid or expired token

**Example with curl:**
```bash
curl -X GET http://localhost:3000/protected \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### 2. Get Detailed Profile

**GET** `/protected/profile`

Get detailed user profile including token information.

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response (200):**
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

#### 3. Validate Token

**POST** `/protected/validate`

Check if the provided JWT token is valid and not expired.

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response (200):**
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

### Token Structure

JWT tokens consist of three parts separated by dots:
```
header.payload.signature
```

### Token Payload

The JWT payload contains:
- `username`: User's username
- `iat`: Token issued at timestamp
- `exp`: Token expiration timestamp (1 hour from creation)

### Token Expiration

- **Default expiration:** 1 hour
- **Format:** Unix timestamp
- **Timezone:** UTC

## Error Handling

### Standard Error Response Format

```json
{
  "message": "Error description"
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - No token or invalid credentials |
| 403 | Forbidden - Invalid or expired token |
| 404 | Not Found |
| 500 | Internal Server Error |

## Rate Limiting

Currently, no rate limiting is implemented. Consider implementing rate limiting for production use.

## Security Considerations

### Production Recommendations

1. **Use HTTPS** in production
2. **Implement rate limiting** to prevent brute force attacks
3. **Use strong JWT secrets** (at least 32 characters)
4. **Implement token refresh** mechanism
5. **Add password hashing** with bcrypt
6. **Use secure session management**
7. **Implement CORS** properly
8. **Add input validation** and sanitization

### JWT Security Best Practices

1. **Keep tokens short-lived** (1 hour or less)
2. **Store tokens securely** (HttpOnly cookies for web apps)
3. **Validate tokens** on every request
4. **Use HTTPS** to transmit tokens
5. **Implement token blacklisting** for logout

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

# Set up environment variables
cp .env.example .env
# Edit .env with your JWT_SECRET

# Start the server
npm start
```

### Environment Variables

Create a `.env` file in the root directory:

```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=3000
NODE_ENV=development
```

## Testing

### Using curl

```bash
# Login
TOKEN=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}' | jq -r '.token')

# Use token for protected requests
curl -X GET http://localhost:3000/protected \
  -H "Authorization: Bearer $TOKEN"
```

### Using Postman

1. Import the API collection
2. Set up environment variables
3. Use the provided examples in the Swagger documentation

## Docker Support

### Run with Docker

```bash
# Build and run
docker-compose up --build

# Or run in background
docker-compose up -d --build
```

### Development with Docker

```bash
# Run with hot reload
docker-compose -f docker-compose.dev.yml up --build
```

## Support

For API support and questions:
- **Email:** support@jwtapi-demo.com
- **Documentation:** http://localhost:3000/api-docs
- **GitHub Issues:** [Repository Issues](https://github.com/your-repo/issues)

## License

This project is licensed under the ISC License.

---

**Last Updated:** July 2024  
**API Version:** 1.0.0 