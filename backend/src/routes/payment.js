import express from 'express';
import orderService from '../services/orderService.js';
import { successResponse, errorResponse } from '../utils/response.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Admin updates payment status/method for an order (offline/manual)
router.post('/', auth(['admin']), async (req, res) => {
  try {
    const { orderId, paymentStatus, paymentMethod } = req.body;
    const order = await orderService.updateOrderPayment(orderId, { paymentStatus, paymentMethod });
    res.json(successResponse(order, 'Payment status updated.'));
  } catch (err) {
    res.status(400).json(errorResponse(err.message, 'Failed to update payment status.'));
  }
});

export default router; 