/**
 * @file frontend/services/authService.ts
 * @description Service for handling authentication API requests.
 */

import api from '../lib/axios';
import { AuthResponse } from '../types';

export const authService = {
    /**
     * Registers a new user.
     * @param {Record<string, any>} userData - The username, email, and password.
     * @returns {Promise<AuthResponse>} The user data and token.
     */
    async register(userData: Record<string, any>): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/auth/register', userData);
        return response.data;
    },

    /**
     * Logs in an existing user.
     * @param {Record<string, any>} credentials - The email and password.
     * @returns {Promise<AuthResponse>} The user data and token.
     */
    async login(credentials: Record<string, any>): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/auth/login', credentials);
        return response.data;
    },

    /**
     * Logs out the current user by calling the backend GET endpoint.
     * The backend will respond by clearing the HttpOnly cookie.
     * @returns {Promise<void>}
     */
    async logout(): Promise<void> {
        // Updated to use GET as per your Express backend route
        await api.get('/auth/logout');
    },
};