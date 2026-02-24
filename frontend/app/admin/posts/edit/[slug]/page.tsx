'use client';

/**
 * @file frontend/app/(admin)/posts/edit/[slug]/page.tsx
 * @description Page for editing an existing post.
 */

import { useState, useEffect, use } from 'react';
import PostEditor, { PostFormData } from '../../../../../components/admin/posts/PostEditor';
import api from '../../../../../lib/axios';
import { AlertCircle } from 'lucide-react';

/**
 * @interface EditPostPageProps
 * @description Props for the EditPostPage component containing URL parameters.
 */
interface EditPostPageProps {
    params: Promise<{ slug: string }>;
}

/**
 * @function EditPostPage
 * @description Fetches post data by slug and renders the PostEditor.
 * @param {EditPostPageProps} props - Component properties.
 * @returns {JSX.Element} The rendered page.
 */
export default function EditPostPage({ params }: EditPostPageProps) {
    const resolvedParams = use(params);
    const postSlug = resolvedParams.slug;

    const [initialData, setInitialData] = useState<PostFormData | null>(null);
    const [actualPostId, setActualPostId] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchPost();
    }, [postSlug]);

    /**
     * @function fetchPost
     * @description Retrieves the specific post data from the API using the slug.
     * @returns {Promise<void>}
     */
    const fetchPost = async () => {
        try {
            const response = await api.get(`/posts/${postSlug}`);
            const post = response.data.data;

            setActualPostId(post.post_id || post.id);

            // Map all database fields, including new SEO and option fields, to the form state
            setInitialData({
                title: post.title,
                slug: post.slug,
                content: post.content,
                excerpt: post.excerpt || '',
                status: post.status,
                category_id: post.category_id || (post.category?.category_id ?? ''),
                featured_image: post.featured_image || null,
                published_at: post.published_at
                    ? new Date(post.published_at).toISOString().slice(0, 16)
                    : new Date().toISOString().slice(0, 16),
                tags: Array.isArray(post.tags)
                    ? post.tags.map((t: any) => typeof t === 'string' ? t : (t.tag_id || t.id))
                    : [],
                meta_title: post.meta_title || '',
                meta_description: post.meta_description || '',
                meta_keywords: post.meta_keywords || '',
                allow_comments: post.allow_comments ?? true,
                reading_time: post.reading_time || 0,
            });
        } catch (err: any) {
            console.error('Failed to fetch post:', err);
            setError('Could not load the post. It may have been deleted.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 text-slate-400">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                <p>Loading post data...</p>
            </div>
        );
    }

    if (error || !initialData) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-start gap-3 max-w-2xl mx-auto mt-12">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <p>{error || 'An unexpected error occurred.'}</p>
            </div>
        );
    }

    return <PostEditor initialData={initialData} postId={actualPostId} isEdit={true} />;
}