import type { Metadata } from 'next';
import './globals.css';

/**
 * @file frontend/app/layout.tsx
 * @description Root layout for the EduCMS application.
 * This file is required by Next.js and must contain the <html> and <body> tags.
 */

export const metadata: Metadata = {
    title: 'EduCMS - Educational Content Management System',
    description: 'A full-featured CMS designed for educational institutions to manage courses, articles, announcements, and student resources.',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="antialiased bg-slate-50 text-slate-900">
                {children}
            </body>
        </html>
    );
}