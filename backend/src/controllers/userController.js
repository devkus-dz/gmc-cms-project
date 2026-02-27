import User from '../models/User.js';
import { successResponse, errorResponse, paginate } from '../utils/helpers.js';
import ActivityLog from '../models/ActivityLog.js';

export const getProfile = async (req, res) => {
    try {
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
 * @function updateProfile
 * @description Updates the current user's profile information and logs the activity.
 * @route   PUT /api/v1/users/profile
 * @access  Protected
 */
export const updateProfile = async (req, res) => {
    try {
        const { first_name, last_name, bio, avatar_url } = req.body;

        // Call the new update method we just added to the User model
        const updatedUser = await User.update(req.user.user_id, {
            first_name,
            last_name,
            bio,
            avatar_url
        });

        if (!updatedUser) {
            return res.status(404).json(errorResponse('User not found'));
        }

        // Log this action in the Activity Log
        await ActivityLog.log({
            user_id: req.user.user_id,
            action: 'UPDATE_PROFILE',
            entity_type: 'user',
            entity_id: req.user.user_id,
            description: `Updated their profile information`,
            ip_address: req.ip,
            user_agent: req.headers['user-agent']
        });

        res.json(successResponse(updatedUser, 'Profile updated successfully'));
    } catch (error) {
        console.error("Profile Update Error:", error);
        res.status(400).json(errorResponse(error.message));
    }
};

/**
 * @function getAllUsers
 * @description Retrieves paginated users for the admin dashboard.
 */
export const getAllUsers = async (req, res) => {
    try {
        const { page, limit, offset } = paginate(req.query.page, req.query.limit);
        const search = req.query.search || '';

        const result = await User.findAll({ limit, offset, search });

        res.json(successResponse({
            items: result.users,
            pagination: {
                total: result.total,
                page,
                limit,
                totalPages: Math.ceil(result.total / limit)
            }
        }));
    } catch (error) {
        res.status(500).json(errorResponse(error.message));
    }
};

/**
 * @desc    Create a new user (Admin)
 * @route   POST /api/v1/users
 * @access  Protected (Admin only)
 */
export const createUser = async (req, res) => {
    try {
        const newUser = await User.create(req.body);
        res.status(201).json(successResponse(newUser, 'User created successfully'));
    } catch (error) {
        console.error("Create User Error:", error);
        if (error.code === '23505') { // PostgreSQL unique violation code
            return res.status(400).json(errorResponse('Username or email already exists.'));
        }
        res.status(500).json(errorResponse(error.message));
    }
};

/**
 * @desc    Update a user (Admin)
 * @route   PUT /api/v1/users/:id
 * @access  Protected (Admin only)
 */
export const updateUser = async (req, res) => {
    try {
        const updatedUser = await User.adminUpdate(req.params.id, req.body);
        if (!updatedUser) {
            return res.status(404).json(errorResponse('User not found'));
        }
        res.json(successResponse(updatedUser, 'User updated successfully'));
    } catch (error) {
        console.error("Update User Error:", error);
        if (error.code === '23505') {
            return res.status(400).json(errorResponse('Username or email already exists.'));
        }
        res.status(500).json(errorResponse(error.message));
    }
};

/**
 * @desc    Delete a user (Admin)
 * @route   DELETE /api/v1/users/:id
 * @access  Protected (Admin only)
 */
export const deleteUser = async (req, res) => {
    try {
        // Prevent admin from deleting themselves
        if (parseInt(req.params.id) === req.user.user_id) {
            return res.status(400).json(errorResponse('You cannot delete your own account.'));
        }

        const deletedUser = await User.delete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json(errorResponse('User not found'));
        }
        res.json(successResponse(null, 'User deleted successfully'));
    } catch (error) {
        console.error("Delete User Error:", error);
        res.status(500).json(errorResponse(error.message));
    }
};