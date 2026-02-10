import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { successResponse, errorResponse } from '../utils/helpers.js';
import emailService from '../services/emailService.js';

/**
 * Helper to generate JWT token, set it in HTTP-only cookie, and send response
 */
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = jwt.sign({ id: user.user_id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '30d',
    });

    // Cookie options
    const options = {
        expires: new Date(
            Date.now() + (parseInt(process.env.JWT_COOKIE_EXPIRE) || 30) * 24 * 60 * 60 * 1000
        ),
        httpOnly: true, // (prevents XSS)
        secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
        sameSite: 'strict' // CSRF protection
    };

    // Remove password from output
    user.password_hash = undefined;

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json(successResponse({ token, user }, 'Authentication successful'));
};

/**
 * @desc    Register a new user
 * @route   POST /api/v1/auth/register
 * @returns {Object} User object and Auth Token
 */
export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const userExists = await User.findByEmail(email);
        if (userExists) {
            return res.status(400).json(errorResponse('Email already registered'));
        }

        const user = await User.create({ username, email, password });

        // 📧 Send Welcome Email (Fire and forget - don't await to keep response fast)
        emailService.sendWelcomeEmail(user.email, user.username);

        sendTokenResponse(user, 201, res);
    } catch (error) {
        res.status(500).json(errorResponse(error.message));
    }
};

// @desc    Login user with email and password
// @route   POST /api/v1/auth/login
// @return  {Object} User object and Auth Token (via Cookie)
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for user existence
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json(errorResponse('Invalid credentials'));
        }

        // Check if password matches
        const isMatch = await User.matchPassword(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json(errorResponse('Invalid credentials'));
        }

        // Update last login timestamp
        await User.updateLastLogin(user.user_id);

        // Send token in cookie
        sendTokenResponse(user, 200, res);
    } catch (error) {
        res.status(500).json(errorResponse(error.message));
    }
};

// @desc    Logout user by clearing the auth cookie
// @route   GET /api/v1/auth/logout
// @return  {Object} Success message
export const logout = async (req, res) => {
    // We overwrite the cookie with a dummy value and expire it immediately
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    res.status(200).json(successResponse(null, 'User logged out successfully'));
};

// @desc    Get current logged-in user profile
// @route   GET /api/v1/auth/me
// @return  {Object} User profile data
export const getMe = async (req, res) => {
    // req.user is already populated by the protect middleware
    const user = await User.findById(req.user.user_id);
    res.status(200).json(successResponse(user));
};