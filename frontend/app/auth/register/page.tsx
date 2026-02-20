'use client';

/**
 * @file frontend/app/(auth)/register/page.tsx
 * @description User registration page with Zod validation.
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { Mail, Lock, User, UserPlus } from 'lucide-react';

const registerSchema = z.object({
    username: z.string().min(3, { message: "Username must be at least 3 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
    });

    /**
     * Handles the registration form submission.
     * @param {RegisterFormValues} data - The validated form data.
     */
    const onSubmit = async (data: RegisterFormValues) => {
        // TODO: Connect this to our Axios AuthService later
        console.log('Registration Data:', data);
        await new Promise((resolve) => setTimeout(resolve, 1000));
    };

    return (
        <div>
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Create an Account</h1>
                <p className="text-slate-500 text-sm mt-2">Join EduCMS to start managing content.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Username Field */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                            type="text"
                            {...register('username')}
                            className="pl-10 w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                            placeholder="johndoe"
                        />
                    </div>
                    {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
                </div>

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
                    <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
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
                    {isSubmitting ? 'Creating account...' : (
                        <>
                            Sign Up <UserPlus className="h-4 w-4" />
                        </>
                    )}
                </button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-600">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-blue-600 hover:underline font-medium">
                    Sign in here
                </Link>
            </div>
        </div>
    );
}