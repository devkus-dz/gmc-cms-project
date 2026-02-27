import express from 'express';
import { getRecentActivity, getAllActivity } from '../controllers/activityController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Allow admin, editor, and author to access these routes
router.get('/', protect, authorize('admin'), getAllActivity);
router.get('/recent', protect, authorize('admin', 'editor', 'author'), getRecentActivity);

export default router;