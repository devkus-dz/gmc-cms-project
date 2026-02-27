import express from 'express';
import {
    getAllUsers,
    getProfile,
    updateProfile,
    createUser,
    updateUser,
    deleteUser
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Profile routes (Any logged in user)
router.get('/me', protect, getProfile);
router.put('/profile', protect, updateProfile);

// Admin Management routes
router.get('/', protect, authorize('admin'), getAllUsers);
router.post('/', protect, authorize('admin'), createUser);
router.put('/:id', protect, authorize('admin'), updateUser);
router.delete('/:id', protect, authorize('admin'), deleteUser);

export default router;