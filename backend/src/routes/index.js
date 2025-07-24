import express from 'express';
import menuRoutes from './menu.js';
import orderRoutes from './order.js';
import authRoutes from './auth.js';
import paymentRoutes from './payment.js';
import qrRoutes from './qr.js';

const router = express.Router();

router.use('/menu', menuRoutes);
router.use('/orders', orderRoutes);
router.use('/auth', authRoutes);
router.use('/payment', paymentRoutes);
router.use('/qr', qrRoutes);

export default router; 