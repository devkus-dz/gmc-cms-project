/**
 * @file frontend/app/(auth)/layout.tsx
 * @description Dedicated layout for authentication pages.
 * Centers the auth forms on the screen with a clean background.
 */

import { BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-2 mb-8 text-blue-700 hover:opacity-80 transition-opacity">
                <BookOpen className="h-8 w-8" />
                <span className="text-3xl font-bold text-slate-900">EduCMS</span>
            </Link>

            {/* Form Container */}
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
                {children}
            </div>
        </div>
    );
}