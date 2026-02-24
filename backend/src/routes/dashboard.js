import express from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Allow Admin, Editor, AND Author to access the dashboard endpoint
router.get('/', protect, authorize('admin', 'editor', 'author'), getDashboardStats);

export default router;