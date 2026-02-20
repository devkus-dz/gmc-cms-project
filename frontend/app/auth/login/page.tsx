'use client';

/**
 * @file frontend/app/auth/login/page.tsx
 * @description User login page with form validation and cookie-based auth state.
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';

// Adjust this import path if your services folder is located elsewhere
import { authService } from '../../../services/authService';

// 1. Define the validation schema
const loginSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

// Infer the TypeScript type from the schema
type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const [apiError, setApiError] = useState<string | null>(null);

    // 2. Initialize React Hook Form
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    /**
     * Handles the form submission.
     * @param {LoginFormValues} data - The validated form data.
     */
    const onSubmit = async (data: LoginFormValues) => {
        setApiError(null); // Clear previous errors
        try {
            const response = await authService.login(data);
            console.log('Login successful:', response);

            // 👉 Save the token to a cookie so Middleware can protect /admin routes
            // Adjust this based on your Express backend's exact response structure (e.g., response.data.token)
            const token = (response as any).token || (response as any).data?.token;

            if (token) {
                // Set an HTTP-friendly cookie valid for 1 day
                document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Strict`;
            }

            // Redirect to the admin dashboard
            router.push('/admin');
        } catch (error: any) {
            console.error('Login failed:', error);
            // Extract error message from your Express backend response
            const errorMessage = error.response?.data?.message || 'Invalid email or password. Please try again.';
            setApiError(errorMessage);
        }
    };

    return (
        <div>
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>
                <p className="text-slate-500 text-sm mt-2">Sign in to manage your educational content.</p>
            </div>

            {/* Show API Error Message if login fails */}
            {apiError && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <p>{apiError}</p>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Email Field */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                            type="email"
                            {...register('email')}
                            className="pl-10 w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                            placeholder="you@university.edu"
                        />
                    </div>
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>

                {/* Password Field */}
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <label className="block text-sm font-medium text-slate-700">Password</label>
                        <Link href="/auth/forgot-password" className="text-xs text-blue-600 hover:underline">
                            Forgot password?
                        </Link>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                            type="password"
                            {...register('password')}
                            className="pl-10 w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
                >
                    {isSubmitting ? 'Signing in...' : (
                        <>
                            Sign In <LogIn className="h-4 w-4" />
                        </>
                    )}
                </button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-600">
                Don't have an account?{' '}
                <Link href="/auth/register" className="text-blue-600 hover:underline font-medium">
                    Create an account
                </Link>
            </div>
        </div>
    );
}