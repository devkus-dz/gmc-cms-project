import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { successResponse, errorResponse } from '../utils/helpers.js';
import emailService from '../services/emailService.js';

/**
 * @function sendTokenResponse
 * @description Generates a JWT token, sets it in an HTTP-only cookie, and sends the response.
 * @param {Object} user - The authenticated user object.
 * @param {number} statusCode - The HTTP status code to return.
 * @param {Object} res - The Express response object.
 */
const sendTokenResponse = (user, statusCode, res) => {
    const token = jwt.sign({ id: user.user_id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '30d',
    });

    const options = {
        expires: new Date(
            Date.now() + (parseInt(process.env.JWT_COOKIE_EXPIRE) || 30) * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    };

    user.password_hash = undefined;

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json(successResponse({ token, user }, 'Authentication successful'));
};

/**
 * @function register
 * @description Registers a new user.
 * @route POST /api/v1/auth/register
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {Object} User object and Auth Token.
 */
export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const userExists = await User.findByEmail(email);
        if (userExists) {
            return res.status(400).json(errorResponse('Email already registered'));
        }

        const user = await User.create({ username, email, password });

        emailService.sendWelcomeEmail(user.email, user.username);

        sendTokenResponse(user, 201, res);
    } catch (error) {
        res.status(500).json(errorResponse(error.message));
    }
};

/**
 * @function login
 * @description Logs in a user with email and password.
 * @route POST /api/v1/auth/login
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {Object} User object and Auth Token (via HTTP-only Cookie).
 */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json(errorResponse('Invalid credentials'));
        }

        const isMatch = await User.matchPassword(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json(errorResponse('Invalid credentials'));
        }

        await User.updateLastLogin(user.user_id);

        sendTokenResponse(user, 200, res);
    } catch (error) {
        res.status(500).json(errorResponse(error.message));
    }
};

/**
 * @function logout
 * @description Logs out the user by clearing the auth cookie.
 * @route GET /api/v1/auth/logout
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {Object} Success message.
 */
export const logout = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });

    res.status(200).json({ success: true, message: 'Logged out successfully' });
};

/**
 * @function getMe
 * @description Retrieves the current logged-in user profile.
 * @route GET /api/v1/auth/me
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {Object} User profile data.
 */
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.user_id);
        res.status(200).json(successResponse(user));
    } catch (error) {
        res.status(500).json(errorResponse(error.message));
    }
};