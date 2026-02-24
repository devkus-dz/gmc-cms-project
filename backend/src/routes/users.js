import express from 'express';
import {
    getAllUsers, getProfile, updateProfile,
    createAdminUser, updateAdminUser, deleteAdminUser
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Profile routes (Any logged-in user)
router.get('/me', protect, getProfile);
router.put('/profile', protect, updateProfile);

// Admin Management routes (STRICTLY Admin only)
router.get('/', protect, authorize('admin'), getAllUsers);
router.post('/', protect, authorize('admin'), createAdminUser);
router.put('/:id', protect, authorize('admin'), updateAdminUser);
router.delete('/:id', protect, authorize('admin'), deleteAdminUser);

export default router;