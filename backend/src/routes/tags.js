import express from 'express';
import { getAllTags, createTag } from '../controllers/tagController.js';
import { protect, authorize } from '../middleware/auth.js';
import { categoryValidation, validate } from '../middleware/validation.js'; // just need a name of the tag like category validation rule

const router = express.Router();

router.get('/', getAllTags);
router.post('/', protect, authorize('admin', 'editor'), categoryValidation, validate, createTag);

export default router;