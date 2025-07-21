const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

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
 *     description: Login with username and password to receive a JWT token for authentication
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
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Internal server error"
 */
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  // Find user in our simple database
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  // Create JWT token
  const token = jwt.sign(
    { username: user.username }, 
    process.env.JWT_SECRET, 
    { expiresIn: '1h' }
  );

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