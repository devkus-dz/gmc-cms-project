import { body, validationResult } from 'express-validator';
import { errorResponse } from '../utils/helpers.js';

// Checks for errors and stops the request
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }

    // Format errors: ["Email is invalid", "Password too short"]
    const extractedErrors = errors.array().map(err => err.msg);
    return res.status(400).json(errorResponse(extractedErrors.join(', ')));
};

// Validation Rules

export const registerValidation = [
    body('username').trim().notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be 6+ chars')
];

export const loginValidation = [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required')
];

export const postValidation = [
    body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }),
    body('content').notEmpty().withMessage('Content is required'),
    body('category_id').isInt().withMessage('Category ID must be a number')
];

export const categoryValidation = [
    body('name').trim().notEmpty().withMessage('Category name is required')
];

export const commentValidation = [
    body('content').trim().notEmpty().withMessage('Comment cannot be empty'),
    body('post_id').isInt().withMessage('Post ID is required')
];