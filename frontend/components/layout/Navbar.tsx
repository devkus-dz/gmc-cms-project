import Link from 'next/link';
import { BookOpen } from 'lucide-react';

/**
 * @file frontend/components/layout/Navbar.tsx
 * @description Top navigation bar for the public-facing pages.
 * Updated to reflect a Blog/CMS structure rather than an LMS.
 * @returns {JSX.Element} The Navbar component.
 */
export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 text-blue-700 hover:opacity-90 transition-opacity">
                    <BookOpen className="h-6 w-6" />
                    <span className="text-xl font-bold text-slate-900">EduCMS</span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
                    <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
                    <Link href="/blog" className="hover:text-blue-600 transition-colors">Articles</Link>
                    {/* Example of linking directly to a specific category filter */}
                    <Link href="/blog?category=announcements" className="hover:text-blue-600 transition-colors">Announcements</Link>
                    <Link href="/contact" className="hover:text-blue-600 transition-colors">Contact</Link>
                </div>

                {/* CTA Buttons */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/auth/login"
                        className="hidden md:block text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
                    >
                        Sign In
                    </Link>
                    <Link
                        href="/auth/register"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md"
                    >
                        Get Started
                    </Link>
                </div>
            </div>
        </nav>
    );
}