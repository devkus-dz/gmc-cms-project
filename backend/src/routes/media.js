import express from 'express';
import { uploadMedia, getAllMedia, deleteMedia } from '../controllers/mediaController.js';
import { protect, authorize } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// All media routes are protected
router.use(protect);

router.post('/upload', upload.single('image'), uploadMedia);
router.get('/', getAllMedia);
router.delete('/:id', authorize('admin', 'editor'), deleteMedia);

export default router;