import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { errorResponse } from '../utils/helpers.js';

// Protect routes
export const protect = async (req, res, next) => {
    let token;

    // Check for token in Cookies
    if (req.cookies.token) {
        token = req.cookies.token;
    }
    // Check for token in Authorization Header
    else if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    // Make sure token exists
    if (!token) {
        return res.status(401).json(errorResponse('Not authorized to access this route'));
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Add user to request object
        req.user = await User.findById(decoded.id);

        if (!req.user) {
            return res.status(401).json(errorResponse('User belonging to this token no longer exists'));
        }

        next();
    } catch (err) {
        return res.status(401).json(errorResponse('Not authorized to access this route'));
    }
};

// Grant access to specific roles
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res
                .status(403)
                .json(errorResponse(`User role ${req.user.role} is not authorized to access this route`));
        }
        next();
    };
};