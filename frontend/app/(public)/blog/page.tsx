/**
 * @file frontend/app/(public)/blog/page.tsx
 * @description The main blog index page. Fetches and displays a grid of published posts.
 * Uses Next.js Server Components for SEO and fast initial load.
 */

import Link from 'next/link';
import { Calendar, User, ArrowRight, BookOpen } from 'lucide-react';
import { postService } from '../../../services/postService';

// Force dynamic rendering if you want real-time updates without rebuilding
export const dynamic = 'force-dynamic';

export default async function BlogIndexPage() {
    // Fetch data directly on the server!
    let posts: any[] = [];
    let error = null;

    try {
        const response = await postService.getAllPosts(1, 10);
        // Depending on your Express backend structure, data might be nested
        posts = response.data || [];
    } catch (err) {
        console.error("Failed to fetch posts:", err);
        error = "Could not load educational resources at this time.";
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="container mx-auto px-4 max-w-6xl">

                {/* Page Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Educational Resources</h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Stay updated with the latest announcements, study guides, and campus news from EduCMS.
                    </p>
                </div>

                {/* Error State */}
                {error && (
                    <div className="text-center py-12 bg-red-50 rounded-xl border border-red-100">
                        <p className="text-red-600 font-medium">{error}</p>
                    </div>
                )}

                {/* Empty State (If DB is empty) */}
                {!error && posts.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
                        <BookOpen className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-slate-700">No posts published yet</h3>
                        <p className="text-slate-500 mt-2">Check back later for new educational content.</p>
                    </div>
                )}

                {/* Posts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post: any) => (
                        <article
                            key={post.post_id}
                            className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col"
                        >
                            {/* Image Placeholder - Uses a gradient if no image is provided */}
                            <div className="aspect-video w-full bg-linear-to-br from-blue-100 to-slate-200 flex items-center justify-center">
                                {post.featured_image ? (
                                    <img src={post.featured_image} alt={post.title} className="w-full h-full object-cover" />
                                ) : (
                                    <BookOpen className="h-10 w-10 text-blue-300 opacity-50" />
                                )}
                            </div>

                            {/* Card Content */}
                            <div className="p-6 flex flex-col grow">
                                <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="h-3.5 w-3.5" />
                                        {new Date(post.created_at || Date.now()).toLocaleDateString()}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <User className="h-3.5 w-3.5" />
                                        {post.author?.username || 'Admin'}
                                    </span>
                                </div>

                                <h2 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2">
                                    {post.title}
                                </h2>

                                <p className="text-slate-600 text-sm mb-6 line-clamp-3">
                                    {post.excerpt || post.content?.substring(0, 120) + '...'}
                                </p>

                                {/* Push link to bottom */}
                                <div className="mt-auto pt-4 border-t border-slate-100">
                                    <Link
                                        href={`/blog/${post.slug || post.post_id}`}
                                        className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1 transition-colors"
                                    >
                                        Read Article <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

            </div>
        </div>
    );
}