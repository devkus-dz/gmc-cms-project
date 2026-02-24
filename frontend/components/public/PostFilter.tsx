'use client';

/**
 * @file frontend/components/public/PostFilter.tsx
 * @description Interactive client component that extracts categories from posts and filters the grid.
 */

import { useState, useMemo } from 'react';
import { BookOpen } from 'lucide-react';
import PostCard from './PostCard';

interface PostFilterProps {
    posts: any[];
}

export default function PostFilter({ posts }: PostFilterProps) {
    const [activeCategory, setActiveCategory] = useState<string>('All');

    // Automatically extract unique categories from the posts array!
    const categories = useMemo(() => {
        const extracted = posts
            .map(post => post.category_name)
            .filter(name => name); // Remove null/undefined

        // Return 'All' followed by the unique categories
        return ['All', ...Array.from(new Set(extracted))];
    }, [posts]);

    // Filter posts based on the clicked category
    const filteredPosts = activeCategory === 'All'
        ? posts
        : posts.filter(post => post.category_name === activeCategory);

    return (
        <div>
            {/* Category Filter Pills */}
            {categories.length > 1 && (
                <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${activeCategory === category
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            )}

            {/* Empty State (If somehow a filter returns 0 posts) */}
            {filteredPosts.length === 0 && (
                <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
                    <BookOpen className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-700">No posts found</h3>
                    <p className="text-slate-500 mt-2">Try selecting a different category.</p>
                </div>
            )}

            {/* Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post) => (
                    <PostCard key={post.post_id || post.id} post={post} />
                ))}
            </div>
        </div>
    );
}