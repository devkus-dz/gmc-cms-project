/**
 * @file frontend/lib/axios.ts
 * @description Configured Axios instance for API calls.
 * Now includes withCredentials to allow backend HttpOnly cookies.
 */

import axios from 'axios';

const api = axios.create({

    baseURL: '/api/v1',
    withCredentials: true,

    headers: {
        'Content-Type': 'application/json',
    },
});

// Optional: Interceptor to handle global 401 Unauthorized responses
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.warn('⚠️ User is not authorized or session expired.');
            // You can add global redirect logic here if desired
        }
        return Promise.reject(error);
    }
);

export default api;