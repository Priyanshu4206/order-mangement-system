import express from 'express';
import menuService from '../services/menuService.js';
import { successResponse, errorResponse } from '../utils/response.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all menu items
router.get('/', async (req, res) => {
  try {
    const items = await menuService.getAllMenuItems();
    res.json(successResponse(items));
  } catch (err) {
    res.status(500).json(errorResponse(err.message, 'Failed to fetch menu items.', 500));
  }
});

// Get a single menu item by ID
router.get('/:id', async (req, res) => {
  try {
    const item = await menuService.getMenuItemById(req.params.id);
    if (!item) return res.status(404).json(errorResponse(null, 'Menu item not found.', 404));
    res.json(successResponse(item));
  } catch (err) {
    res.status(500).json(errorResponse(err.message, 'Failed to fetch menu item.', 500));
  }
});

// Create a new menu item (admin only)
router.post('/', auth(['admin']), async (req, res) => {
  try {
    const { name, description, price, available, imageUrl } = req.body;
    const newItem = await menuService.createMenuItem({ name, description, price, available, imageUrl });
    res.status(201).json(successResponse(newItem, 'Menu item created.'));
  } catch (err) {
    res.status(400).json(errorResponse(err.message, 'Failed to create menu item.'));
  }
});

// Update a menu item by ID (admin only)
router.put('/:id', auth(['admin']), async (req, res) => {
  try {
    const updated = await menuService.updateMenuItem(req.params.id, req.body);
    res.json(successResponse(updated, 'Menu item updated.'));
  } catch (err) {
    res.status(400).json(errorResponse(err.message, 'Failed to update menu item.'));
  }
});

// Delete a menu item by ID (admin only)
router.delete('/:id', auth(['admin']), async (req, res) => {
  try {
    await menuService.deleteMenuItem(req.params.id);
    res.json(successResponse(null, 'Menu item deleted.'));
  } catch (err) {
    res.status(400).json(errorResponse(err.message, 'Failed to delete menu item.'));
  }
});

export default router; 