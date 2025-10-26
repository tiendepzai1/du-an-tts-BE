import express from 'express';
import { register, login } from '../Controller/user.controller.js';
import jwt from 'jsonwebtoken';
import User from '../Model/user.model.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    console.log('Token received:', token);
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || '123456');
    console.log('Decoded token:', decoded);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    console.error('Detailed error in /me:', err);
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;