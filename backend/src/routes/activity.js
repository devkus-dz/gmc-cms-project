import express from 'express';
import { getActivityLogs } from '../controllers/activityController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Update authorization to allow editors and authors to see their own timeline!
router.get('/', protect, authorize('admin', 'editor', 'author'), getActivityLogs);

export default router;