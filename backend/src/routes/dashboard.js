import express from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, authorize('admin', 'editor', 'author', 'subscriber'), getDashboardStats);

export default router;