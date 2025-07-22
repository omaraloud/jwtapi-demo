const express = require('express');
const jwt = require('jsonwebtoken');
const { logAuth, logSecurity } = require('../logger');
const router = express.Router();

/**
 * @swagger
 * /protected:
 *   get:
 *     summary: Access protected user profile
 *     description: Retrieve user profile information using JWT token authentication
 *     tags: [Protected]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProtectedResponse'
 *             examples:
 *               success:
 *                 summary: User profile retrieved
 *                 value:
 *                   message: "Hello, admin! This is your profile."
 *       401:
 *         description: Unauthorized - no token provided
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "No token provided"
 *       403:
 *         description: Forbidden - invalid or expired token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Invalid or expired token"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Internal server error"
 */
router.get('/', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  const ip = req.ip || req.connection.remoteAddress;

  if (!token) {
    logSecurity('No token provided', {
      endpoint: '/protected',
      ip,
      userAgent: req.get('User-Agent')
    });
    return res.sendStatus(401);
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    logAuth(user.username, 'profile_access', ip, true);
    res.json({ message: `Hello, ${user.username}! This is your profile.` });
  } catch (error) {
    logSecurity('Invalid token', {
      endpoint: '/protected',
      ip,
      userAgent: req.get('User-Agent'),
      error: error.message
    });
    res.sendStatus(403);
  }
});

/**
 * @swagger
 * /protected/profile:
 *   get:
 *     summary: Get detailed user profile
 *     description: Retrieve detailed user profile information including token details
 *     tags: [Protected]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved detailed profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                       description: User's username
 *                     iat:
 *                       type: number
 *                       description: Token issued at timestamp
 *                     exp:
 *                       type: number
 *                       description: Token expiration timestamp
 *                 message:
 *                   type: string
 *                   description: Success message
 *             example:
 *               user:
 *                 username: "admin"
 *                 iat: 1753098297
 *                 exp: 1753101897
 *               message: "Profile retrieved successfully"
 *       401:
 *         description: Unauthorized - no token provided
 *       403:
 *         description: Forbidden - invalid or expired token
 */
router.get('/profile', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  const ip = req.ip || req.connection.remoteAddress;

  if (!token) {
    logSecurity('No token provided', {
      endpoint: '/protected/profile',
      ip,
      userAgent: req.get('User-Agent')
    });
    return res.sendStatus(401);
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    logAuth(user.username, 'detailed_profile_access', ip, true);
    res.json({ 
      user: user,
      message: 'Profile retrieved successfully'
    });
  } catch (error) {
    logSecurity('Invalid token', {
      endpoint: '/protected/profile',
      ip,
      userAgent: req.get('User-Agent'),
      error: error.message
    });
    res.sendStatus(403);
  }
});

/**
 * @swagger
 * /protected/validate:
 *   post:
 *     summary: Validate JWT token
 *     description: Check if the provided JWT token is valid and not expired
 *     tags: [Protected]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token is valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valid:
 *                   type: boolean
 *                   description: Token validity status
 *                 message:
 *                   type: string
 *                   description: Validation message
 *                 user:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *             example:
 *               valid: true
 *               message: "Token is valid"
 *               user:
 *                 username: "admin"
 *       401:
 *         description: Unauthorized - no token provided
 *       403:
 *         description: Forbidden - invalid or expired token
 */
router.post('/validate', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  const ip = req.ip || req.connection.remoteAddress;

  if (!token) {
    logSecurity('No token provided', {
      endpoint: '/protected/validate',
      ip,
      userAgent: req.get('User-Agent')
    });
    return res.sendStatus(401);
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    logAuth(user.username, 'token_validation', ip, true);
    res.json({ 
      valid: true,
      message: 'Token is valid',
      user: { username: user.username }
    });
  } catch (error) {
    logSecurity('Invalid token', {
      endpoint: '/protected/validate',
      ip,
      userAgent: req.get('User-Agent'),
      error: error.message
    });
    res.sendStatus(403);
  }
});

module.exports = router;