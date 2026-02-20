/**
 * @file frontend/app/(public)/blog/[slug]/page.tsx
 * @description Displays a single blog post with its Category and Tags.
 */

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, User, Clock, BookOpen, Tag as TagIcon, Folder } from 'lucide-react';
import { postService } from '../../../../services/postService';
import { Post, Tag } from '../../../../types'; // Ensure you import your types

export const dynamic = 'force-dynamic';

interface SinglePostPageProps {
    params: Promise<{ slug: string }>;
}

export default async function SinglePostPage({ params }: SinglePostPageProps) {
    const resolvedParams = await params;
    const { slug } = resolvedParams;

    let post: Post | null = null;

    try {
        const response = await postService.getPostBySlug(slug);
        post = response.data;
    } catch (error: any) {
        if (error.response?.status === 404) notFound();
    }

    if (!post) notFound();

    return (
        <article className="min-h-screen bg-slate-50 py-12">
            <div className="container mx-auto px-4 max-w-3xl">

                {/* Back Button & Category Badge */}
                <div className="flex items-center justify-between mb-8">
                    <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">
                        <ArrowLeft className="h-4 w-4" /> Back to Blog
                    </Link>

                    {/* Category Display */}
                    {post.category && (
                        <Link href={`/blog?category=${post.category.slug}`} className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-blue-200 transition-colors">
                            <Folder className="h-3.5 w-3.5" />
                            {post.category.name}
                        </Link>
                    )}
                </div>

                {/* Post Header */}
                <header className="mb-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-6">
                        {post.title}
                    </h1>

                    <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-sm text-slate-500">
                        <span className="flex items-center gap-2">
                            <User className="h-4 w-4 text-blue-500" />
                            {post.author?.username || 'EduCMS Admin'}
                        </span>
                        <span className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-blue-500" />
                            {new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-blue-500" />
                            {Math.max(1, Math.ceil((post.content?.split(' ').length || 0) / 200))} min read
                        </span>
                    </div>
                </header>

                {/* Featured Image */}
                {post.featured_image ? (
                    <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-lg mb-12 border border-slate-200">
                        <img src={post.featured_image} alt={post.title} className="w-full h-full object-cover" />
                    </div>
                ) : (
                    <div className="w-full h-48 bg-linear-to-r from-blue-50 to-slate-100 rounded-2xl flex items-center justify-center mb-12 border border-slate-200">
                        <BookOpen className="h-12 w-12 text-blue-200" />
                    </div>
                )}

                {/* Post Content */}
                <div
                    className="prose prose-slate prose-lg max-w-none prose-headings:text-slate-900 prose-headings:font-bold prose-a:text-blue-600 hover:prose-a:text-blue-700 prose-img:rounded-xl prose-img:shadow-md"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* 🏷️ Tags Section */}
                {post.tags && post.tags.length > 0 && (
                    <div className="mt-12 pt-8 border-t border-slate-200">
                        <div className="flex items-center gap-3 flex-wrap">
                            <TagIcon className="h-5 w-5 text-slate-400" />
                            <span className="text-sm font-semibold text-slate-700 mr-2">Tags:</span>
                            {post.tags.map((tag: Tag) => (
                                <Link
                                    key={tag.tag_id}
                                    href={`/blog?tag=${tag.slug}`}
                                    className="px-3 py-1 bg-slate-100 border border-slate-200 text-slate-600 rounded-md text-sm hover:bg-slate-200 hover:text-blue-600 transition-colors"
                                >
                                    #{tag.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </article>
    );
}