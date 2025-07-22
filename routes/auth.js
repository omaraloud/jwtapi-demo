const express = require('express');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { logAuth, logSecurity } = require('../logger');
const router = express.Router();

// Rate limiting for login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login attempts per windowMs
  message: {
    message: 'Too many login attempts from this IP, please try again after 15 minutes',
    retryAfter: Math.ceil(15 * 60 / 60)
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      message: 'Too many login attempts from this IP, please try again after 15 minutes',
      retryAfter: Math.ceil(15 * 60 / 60)
    });
  }
});

// Simple user database (in real apps, use a proper database)
const users = [
  { username: 'admin', password: 'admin123' },
  { username: 'user', password: 'password123' },
  { username: 'demo', password: 'demo123' }
];

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Authenticate user and get JWT token
 *     description: Login with username and password to receive a JWT token for authentication. Rate limited to 5 attempts per 15 minutes per IP.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           examples:
 *             admin:
 *               summary: Admin user login
 *               value:
 *                 username: admin
 *                 password: admin123
 *             user:
 *               summary: Regular user login
 *               value:
 *                 username: user
 *                 password: password123
 *             demo:
 *               summary: Demo user login
 *               value:
 *                 username: demo
 *                 password: demo123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *             examples:
 *               success:
 *                 summary: Successful login
 *                 value:
 *                   token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNzUzMDk4Mjk3LCJleHAiOjE3NTMxMDE4OTd9.5yzOuXLdj-Bq96VIj20-lp65n-H6FdY_6XC1RLiTgeY"
 *                   message: "Login successful"
 *                   user:
 *                     username: "admin"
 *       400:
 *         description: Bad request - missing username or password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Username and password are required"
 *       401:
 *         description: Unauthorized - invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Invalid username or password"
 *       429:
 *         description: Too many login attempts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Rate limit error message
 *                 retryAfter:
 *                   type: number
 *                   description: Minutes to wait before retrying
 *             example:
 *               message: "Too many login attempts from this IP, please try again after 15 minutes"
 *               retryAfter: 15
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Internal server error"
 */
router.post('/login', loginLimiter, (req, res) => {
  const { username, password } = req.body;
  const ip = req.ip || req.connection.remoteAddress;

  if (!username || !password) {
    logAuth(username || 'unknown', 'login_attempt', ip, false);
    logSecurity('Missing credentials', {
      ip,
      providedFields: Object.keys(req.body)
    });
    
    return res.status(400).json({ message: 'Username and password are required' });
  }

  // Find user in our simple database
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    logAuth(username, 'login_failed', ip, false);
    logSecurity('Invalid credentials', {
      username,
      ip,
      userAgent: req.get('User-Agent')
    });
    
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  // Create JWT token
  const token = jwt.sign(
    { username: user.username }, 
    process.env.JWT_SECRET, 
    { expiresIn: '1h' }
  );

  // Log successful login
  logAuth(username, 'login_success', ip, true);

  res.json({ 
    token,
    message: 'Login successful',
    user: { username: user.username }
  });
});

/**
 * @swagger
 * /auth/users:
 *   get:
 *     summary: Get available test users
 *     description: Returns a list of test users available for authentication
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: List of test users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       username:
 *                         type: string
 *                       description:
 *                         type: string
 *             example:
 *               users:
 *                 - username: "admin"
 *                   description: "Administrator account"
 *                 - username: "user"
 *                   description: "Regular user account"
 *                 - username: "demo"
 *                   description: "Demo account"
 */
router.get('/users', (req, res) => {
  const userList = users.map(user => ({
    username: user.username,
    description: `${user.username} account`
  }));
  
  res.json({ users: userList });
});

module.exports = router;