import express from 'express';
import {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  seedMenuItems
} from '../controllers/menuController.js';

const router = express.Router();

// Public routes
router.get('/', getMenuItems);
router.get('/:id', getMenuItemById);

// Seed route (development only)
router.post('/seed', seedMenuItems);

// Admin routes (would need auth middleware in production)
router.post('/', createMenuItem);
router.put('/:id', updateMenuItem);
router.delete('/:id', deleteMenuItem);

export default router;
