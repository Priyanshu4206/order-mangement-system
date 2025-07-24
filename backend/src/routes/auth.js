import express from 'express';
import jwt from 'jsonwebtoken';
import userService from '../services/userService.js';
import { successResponse, errorResponse } from '../utils/response.js';
import auth from '../middleware/auth.js';

const router = express.Router();
const secret = process.env.JWT_SECRET || 'devsecret';

// Register (admin/kitchen)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const user = await userService.register({ name, email, password, role });
    res.status(201).json(successResponse({ id: user.id, email: user.email, role: user.role }, 'User registered.'));
  } catch (err) {
    res.status(400).json(errorResponse(err.message, 'Registration failed.'));
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userService.authenticate(email, password);
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, secret, { expiresIn: '12h' });
    res.json(successResponse({ token, user: { id: user.id, email: user.email, role: user.role } }, 'Login successful.'));
  } catch (err) {
    res.status(401).json(errorResponse(err.message, 'Login failed.', 401));
  }
});

// Get current user info
router.get('/me', auth(), (req, res) => {
  const { id, email, role } = req.user;
  res.json(successResponse({ id, email, role }, 'User info'));
});

export default router; 