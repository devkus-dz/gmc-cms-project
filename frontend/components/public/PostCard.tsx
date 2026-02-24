/**
 * @file frontend/components/public/PostCard.tsx
 * @description A reusable Shadcn Card component for displaying blog posts in a grid.
 * Updated for perfect top-edge image fit.
 */

import Link from 'next/link';
import { Calendar, User, ArrowRight, BookOpen } from 'lucide-react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter
} from '@/components/ui/card';
import { Post } from '../../types';

interface PostCardProps {
    post: Post | any;
}

export default function PostCard({ post }: PostCardProps) {
    // Safely strip HTML tags if we need to fallback to content. 
    // If both are empty, provide a default string.
    const cleanContent = post.content ? post.content.replace(/<[^>]+>/g, '') : '';
    const displayExcerpt = post.excerpt || (cleanContent.length > 0 ? cleanContent.substring(0, 120) + '...' : 'No description available.');

    return (
        // Added 'p-0' to remove any default internal padding from the Card component itself, ensuring full bleed.
        <Card className="flex flex-col overflow-hidden hover:shadow-md transition-shadow border-slate-200 p-0">

            {/* Image Section 
                1. 'relative': Establishes positioning context for the image.
                2. 'aspect-video': Maintains 16:9 ratio.
                3. 'overflow-hidden': Ensures the zoom effect doesn't spill out.
            */}
            <div className="relative w-full aspect-video bg-slate-100 overflow-hidden">
                {post.featured_image ? (
                    <img
                        src={post.featured_image}
                        alt={post.title}
                        /* 1. 'absolute inset-0': Forces image to fill the container exactly to the edges.
                           2. 'object-cover': Ensures image fills space without stretching, cropping if needed.
                        */
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                ) : (
                    /* Placeholder centered using flex only when needed */
                    <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-blue-50 to-slate-200">
                        <BookOpen className="h-10 w-10 text-blue-300 opacity-50" />
                    </div>
                )}
            </div>

            <CardHeader className="pb-2 pt-4 px-6">
                <div className="mb-3">
                    <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase">
                        {post.category_name || 'Uncategorized'}
                    </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500 mb-2">
                    <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(post.created_at || Date.now()).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5" />
                        {/* Updated to look for author_name instead of author.username */}
                        {post.author_name || 'EduCMS Admin'}
                    </span>
                </div>
                <CardTitle className="text-xl font-bold text-slate-900 line-clamp-2 leading-snug">
                    {post.title}
                </CardTitle>
            </CardHeader>

            <CardContent className="grow px-6">
                <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed">
                    {displayExcerpt}
                </p>
            </CardContent>

            <CardFooter className="pt-4 pb-6 px-6 border-t border-slate-100 mt-auto">
                <Link
                    href={`/blog/${post.slug || post.post_id}`}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1.5 transition-colors group"
                >
                    Read Article
                    <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </Link>
            </CardFooter>
        </Card>
    );
}