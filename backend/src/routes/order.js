import express from 'express';
import orderService from '../services/orderService.js';
import { successResponse, errorResponse } from '../utils/response.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Place a new order
router.post('/', async (req, res) => {
  try {
    const { tableId, items } = req.body; // items: [{ menuItemId, quantity }]
    const order = await orderService.placeOrder({ tableId, items });
    res.status(201).json(successResponse(order, 'Order placed.'));
  } catch (err) {
    res.status(400).json(errorResponse(err.message, 'Failed to place order.'));
  }
});

// Get all orders (for kitchen/admin)
router.get('/', async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();
    res.json(successResponse(orders));
  } catch (err) {
    res.status(500).json(errorResponse(err.message, 'Failed to fetch orders.', 500));
  }
});

// Update order status (for kitchen/admin)
router.patch('/:id/status', auth(['kitchen', 'admin']), async (req, res) => {
  try {
    const { status } = req.body;
    const order = await orderService.updateOrderStatus(req.params.id, status);
    res.json(successResponse(order, 'Order status updated.'));
  } catch (err) {
    res.status(400).json(errorResponse(err.message, 'Failed to update order status.'));
  }
});

// Delete an order (admin only)
router.delete('/:id', auth(['admin']), async (req, res) => {
  try {
    await orderService.deleteOrder(req.params.id);
    res.json(successResponse(null, 'Order deleted.'));
  } catch (err) {
    res.status(400).json(errorResponse(err.message, 'Failed to delete order.'));
  }
});

export default router; 