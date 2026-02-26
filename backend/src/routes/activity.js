import express from 'express';
import { getRecentActivity } from '../controllers/activityController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// GET /api/v1/activity
router.get('/', protect, getRecentActivity);

export default router;