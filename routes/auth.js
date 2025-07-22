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

// Rate limiting for registration attempts
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 registration attempts per hour
  message: {
    message: 'Too many registration attempts from this IP, please try again after 1 hour',
    retryAfter: Math.ceil(60 * 60 / 60)
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      message: 'Too many registration attempts from this IP, please try again after 1 hour',
      retryAfter: Math.ceil(60 * 60 / 60)
    });
  }
});


// Simple user database (in real apps, use a proper database)
let users = [
  { username: 'admin', password: 'admin123' },
  { username: 'user', password: 'password123' },
  { username: 'demo', password: 'demo123' }
];

// Helper function to validate password strength
const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  if (password.length < minLength) {
    return { valid: false, message: `Password must be at least ${minLength} characters long` };
  }
  if (!hasUpperCase) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  if (!hasLowerCase) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  if (!hasNumbers) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  if (!hasSpecialChar) {
    return { valid: false, message: 'Password must contain at least one special character' };
  }
  
  return { valid: true };
};

// Helper function to validate username
const validateUsername = (username) => {
  const minLength = 3;
  const maxLength = 20;
  const validChars = /^[a-zA-Z0-9_]+$/;
  
  if (username.length < minLength) {
    return { valid: false, message: `Username must be at least ${minLength} characters long` };
  }
  if (username.length > maxLength) {
    return { valid: false, message: `Username must be no more than ${maxLength} characters long` };
  }
  if (!validChars.test(username)) {
    return { valid: false, message: 'Username can only contain letters, numbers, and underscores' };
  }
  
  return { valid: true };
};

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user account
 *     description: Create a new user account with username and password. Rate limited to 3 attempts per hour per IP.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: Username (3-20 characters, letters, numbers, underscores only)
 *                 example: "newuser"
 *               password:
 *                 type: string
 *                 description: Password (min 8 chars, must include uppercase, lowercase, number, special char)
 *                 example: "SecurePass123!"
 *           examples:
 *             valid:
 *               summary: Valid registration
 *               value:
 *                 username: "newuser"
 *                 password: "SecurePass123!"
 *     responses:
 *       201:
 *         description: Registration successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 user:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                       description: Created username
 *             example:
 *               message: "User registered successfully"
 *               user:
 *                 username: "newuser"
 *       400:
 *         description: Bad request - validation errors
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               missing_fields:
 *                 summary: Missing required fields
 *                 value:
 *                   message: "Username and password are required"
 *               weak_password:
 *                 summary: Password too weak
 *                 value:
 *                   message: "Password must contain at least one uppercase letter"
 *               invalid_username:
 *                 summary: Invalid username format
 *                 value:
 *                   message: "Username can only contain letters, numbers, and underscores"
 *       409:
 *         description: Username already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Username already exists"
 *       429:
 *         description: Too many registration attempts
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
 *               message: "Too many registration attempts from this IP, please try again after 1 hour"
 *               retryAfter: 60
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Internal server error"
 */
router.post('/register', registerLimiter, (req, res) => {
  const { username, password } = req.body;
  const ip = req.ip || req.connection.remoteAddress;

  // Validate required fields
  if (!username || !password) {
    logAuth(username || 'unknown', 'registration_attempt', ip, false);
    logSecurity('Missing registration fields', {
      ip,
      providedFields: Object.keys(req.body)
    });
    
    return res.status(400).json({ message: 'Username and password are required' });
  }

  // Validate username
  const usernameValidation = validateUsername(username);
  if (!usernameValidation.valid) {
    logAuth(username, 'registration_failed', ip, false);
    logSecurity('Invalid username format', {
      username,
      ip,
      reason: usernameValidation.message
    });
    
    return res.status(400).json({ message: usernameValidation.message });
  }

  // Validate password strength
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    logAuth(username, 'registration_failed', ip, false);
    logSecurity('Weak password attempt', {
      username,
      ip,
      reason: passwordValidation.message
    });
    
    return res.status(400).json({ message: passwordValidation.message });
  }

  // Check if username already exists
  if (users.find(u => u.username === username)) {
    logAuth(username, 'registration_failed', ip, false);
    logSecurity('Username already exists', {
      username,
      ip
    });
    
    return res.status(409).json({ message: 'Username already exists' });
  }

  // Add new user to database
  const newUser = { username, password };
  users.push(newUser);

  // Log successful registration
  logAuth(username, 'registration_success', ip, true);

  res.status(201).json({ 
    message: 'User registered successfully',
    user: { username: newUser.username }
  });
});

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