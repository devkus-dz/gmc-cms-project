/**
 * @file frontend/lib/axios.ts
 * @description Configured Axios instance for API calls.
 */

import axios from 'axios';

const isServer = typeof window === 'undefined';
const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: isServer ? `${backendUrl}/api/v1` : '/api/v1',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.warn('⚠️ User is not authorized or session expired.');
        }
        return Promise.reject(error);
    }
);

export default api;