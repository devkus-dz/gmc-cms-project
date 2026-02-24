import User from '../models/User.js';
import { successResponse, errorResponse } from '../utils/helpers.js';

// ==========================================
// USER PROFILE METHODS (For the logged-in user)
// ==========================================

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.user_id);
        if (!user) return res.status(404).json(errorResponse('User not found'));
        res.json(successResponse(user));
    } catch (error) {
        res.status(500).json(errorResponse(error.message));
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { first_name, last_name, bio, avatar_url } = req.body;
        // Changed to use the specific updateProfile method
        const updatedUser = await User.updateProfile(req.user.user_id, {
            first_name, last_name, bio, avatar_url
        });

        if (!updatedUser) return res.status(404).json(errorResponse('User not found'));
        res.json(successResponse(updatedUser, 'Profile updated successfully'));
    } catch (error) {
        res.status(400).json(errorResponse(error.message));
    }
};

// ==========================================
// ADMIN METHODS (For User Management Page)
// ==========================================

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(successResponse(users));
    } catch (error) {
        res.status(500).json(errorResponse(error.message));
    }
};

export const createAdminUser = async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json(successResponse(user, 'User created successfully'));
    } catch (error) {
        if (error.code === '23505') return res.status(400).json(errorResponse('Username or email already exists.'));
        res.status(400).json(errorResponse(error.message));
    }
};

export const updateAdminUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Prevent an admin from deactivating or demoting themselves
        if (parseInt(id) === req.user.user_id && (req.body.role !== 'admin' || req.body.is_active === false)) {
            return res.status(403).json(errorResponse('You cannot demote or deactivate your own admin account.'));
        }

        const user = await User.updateAdmin(id, req.body);
        res.json(successResponse(user, 'User updated successfully'));
    } catch (error) {
        if (error.code === '23505') return res.status(400).json(errorResponse('Username or email already in use.'));
        res.status(400).json(errorResponse(error.message));
    }
};

export const deleteAdminUser = async (req, res) => {
    try {
        const { id } = req.params;
        if (parseInt(id) === req.user.user_id) {
            return res.status(403).json(errorResponse('You cannot delete your own account.'));
        }
        await User.delete(id);
        res.json(successResponse(null, 'User deleted successfully'));
    } catch (error) {
        res.status(500).json(errorResponse(error.message));
    }
};