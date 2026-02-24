import Link from 'next/link';
import { BookOpen } from 'lucide-react';

/**
 * @file frontend/components/layout/Footer.tsx
 * @description Standard footer updated to reflect the CMS structure 
 * (Articles, Categories, Announcements) instead of an LMS.
 * @returns {JSX.Element} The Footer component.
 */
export default function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-300 py-12">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">

                {/* Brand & Description */}
                <div>
                    <Link href="/" className="flex items-center gap-2 text-white mb-4 hover:opacity-90 transition-opacity">
                        <BookOpen className="h-6 w-6 text-blue-500" />
                        <span className="text-xl font-bold">EduCMS</span>
                    </Link>
                    <p className="text-sm text-slate-400">
                        Empowering developers to learn, build, and share high-impact coding resources.
                    </p>
                </div>

                {/* Content Links */}
                <div>
                    <h4 className="text-white font-semibold mb-4">Content</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/blog" className="hover:text-blue-400 transition-colors">All Articles</Link></li>
                    </ul>
                </div>

                {/* Company Links */}
                <div>
                    <h4 className="text-white font-semibold mb-4">Company</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
                        <li><Link href="/contact" className="hover:text-blue-400 transition-colors">Contact</Link></li>
                    </ul>
                </div>

                {/* Newsletter Signup */}
                <div>
                    <h4 className="text-white font-semibold mb-4">Newsletter</h4>
                    <p className="text-xs text-slate-400 mb-3">Get the latest articles sent to your inbox.</p>
                    <form className="flex gap-2">
                        <input
                            type="email"
                            placeholder="Enter email"
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        />
                        <button
                            type="button"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                            Subscribe
                        </button>
                    </form>
                </div>
            </div>

            {/* Copyright Bar */}
            <div className="container mx-auto px-4 mt-12 pt-8 border-t border-slate-800 text-sm text-center flex flex-col md:flex-row justify-between items-center gap-4">
                <p>&copy; {new Date().getFullYear()} EduCMS. All rights reserved.</p>
                <p className="text-slate-500">Built for Developers.</p>
            </div>
        </footer>
    );
}