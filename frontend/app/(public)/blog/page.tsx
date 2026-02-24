/**
 * @file frontend/app/(public)/blog/page.tsx
 * @description The main blog index page. Fetches and displays a grid of published posts.
 * Uses Next.js Server Components for SEO and fast initial load.
 */

import { BookOpen } from 'lucide-react';
import { postService } from '../../../services/postService';
import PostCard from '../../../components/public/PostCard';
import PostFilter from '@/components/public/PostFilter';

export const dynamic = 'force-dynamic';

export default async function BlogIndexPage() {
    // Fetch data directly on the server!
    let posts: any[] = [];
    let error = null;

    try {
        const response = await postService.getAllPosts(1, 12);
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
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
                        Developer Blog
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Explore expertly crafted articles on programming, software development, and modern tech.
                    </p>
                </div>

                {/* Error State */}
                {error && (
                    <div className="text-center py-12 bg-red-50 rounded-xl border border-red-100">
                        <p className="text-red-600 font-medium">{error}</p>
                    </div>
                )}

                {/* Empty DB State */}
                {!error && posts.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
                        <BookOpen className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-slate-700">No posts published yet</h3>
                        <p className="text-slate-500 mt-2">Check back later for new coding tutorials.</p>
                    </div>
                )}

                {/* 👇 The Interactive Grid with Categories! */}
                {!error && posts.length > 0 && (
                    <PostFilter posts={posts} />
                )}

            </div>
        </div>
    );
}