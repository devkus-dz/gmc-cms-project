import express from 'express';
import { getAllTags, createTag, updateTag, deleteTag } from '../controllers/tagController.js';
import { protect, authorize } from '../middleware/auth.js';
import { categoryValidation, validate } from '../middleware/validation.js';

const router = express.Router();

router.get('/', getAllTags);
router.post('/', protect, authorize('admin', 'editor'), categoryValidation, validate, createTag);
router.put('/:id', protect, authorize('admin', 'editor'), categoryValidation, validate, updateTag);
router.delete('/:id', protect, authorize('admin', 'editor'), deleteTag);

export default router;