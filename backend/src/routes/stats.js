import express from 'express';
import { getStats } from '../controllers/dashboardController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Only admin and editor can view dashboard stats
router.get('/', protect, authorize('admin', 'editor'), getStats);

export default router;