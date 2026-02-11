import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';

/**
 * @file frontend/lib/axios.ts
 * @description Global Axios instance for API communication.
 * Configured to handle credentials (cookies) and base URLs automatically.
 */

// Define the base URL from environment variables or fallback to localhost
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

/**
 * Singleton Axios instance.
 * @property {string} baseURL - The root URL for your backend API.
 * @property {boolean} withCredentials - Ensures HttpOnly cookies (JWT) are sent with requests.
 */
const api: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // CRITICAL: Allows the browser to send the 'token' cookie
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Response Interceptor
 * cathes errors globally before they reach the component.
 */
api.interceptors.response.use(
    (response: AxiosResponse) => {
        // Return the response directly if successful
        return response;
    },
    (error: AxiosError) => {
        // Log errors for debugging
        if (error.response) {
            console.error('❌ API Error:', error.response.status, error.response.data);

            // Optional: specific handling for 401 (Unauthorized)
            // We generally let the calling component handle the redirect to login
            if (error.response.status === 401) {
                console.warn('⚠️ User is not authorized or session expired.');
            }
        } else if (error.request) {
            console.error('❌ Network Error: No response received', error.request);
        } else {
            console.error('❌ Request Setup Error:', error.message);
        }

        return Promise.reject(error);
    }
);

export default api;