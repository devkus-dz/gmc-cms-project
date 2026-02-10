import User from '../models/User.js';
import { successResponse, errorResponse } from '../utils/helpers.js';

/**
 * @desc    Get the current logged-in user's profile
 * @route   GET /api/v1/users/profile (or /me)
 * @access  Protected
 * @returns {Object} The current user's profile data
 */
export const getProfile = async (req, res) => {
    try {
        // req.user.user_id comes from the 'protect' middleware
        const user = await User.findById(req.user.user_id);

        if (!user) {
            return res.status(404).json(errorResponse('User not found'));
        }

        res.json(successResponse(user));
    } catch (error) {
        res.status(500).json(errorResponse(error.message));
    }
};

/**
 * @desc    Update the current user's profile information
 * @route   PUT /api/v1/users/profile
 * @access  Protected
 * @returns {Object} The updated user object
 */
export const updateProfile = async (req, res) => {
    try {
        const { first_name, last_name, bio, avatar_url } = req.body;

        // update method should exist in User model, similar to Post.update
        const updatedUser = await User.update(req.user.user_id, {
            first_name,
            last_name,
            bio,
            avatar_url
        });

        if (!updatedUser) {
            return res.status(404).json(errorResponse('User not found'));
        }

        res.json(successResponse(updatedUser, 'Profile updated successfully'));
    } catch (error) {
        res.status(400).json(errorResponse(error.message));
    }
};

/**
 * @desc    Get all users list
 * @route   GET /api/v1/users
 * @access  Protected (Admin only)
 * @returns {Object} List of all registered users
 */
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(successResponse(users));
    } catch (error) {
        res.status(500).json(errorResponse(error.message));
    }
};