'use client';

/**
 * @file frontend/app/(admin)/posts/page.tsx
 * @description Admin page container for managing blog posts.
 * Delegates table rendering to the PostsTable component.
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, AlertCircle } from 'lucide-react';
import api from '../../../lib/axios';

// Import our new component and the PostItem type
import PostsTable, { PostItem } from '../../../components/admin/posts/PostsTable';

export default function PostsManagementPage() {
    const [posts, setPosts] = useState<PostItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setIsLoading(true);
        try {
            const response = await api.get(`/posts?status=all&_t=${Date.now()}`);
            setPosts(response.data.data || []);
        } catch (err: any) {
            console.error('Failed to fetch posts:', err);
            setError('Could not load posts. Please check your backend connection.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await api.delete(`/posts/${id}`);
            // Update state to remove the deleted post instantly
            setPosts((prevPosts) => prevPosts.filter((post) => (post.post_id || post.id) !== id));
        } catch (err: any) {
            console.error('Delete failed:', err);
            alert(err.response?.data?.message || 'Failed to delete post.');
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Manage Posts</h1>
                    <p className="text-slate-500 text-sm mt-1">Create, edit, and manage your educational content.</p>
                </div>
                <Link
                    href="/admin/posts/new"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm whitespace-nowrap"
                >
                    <Plus className="h-4 w-4" /> Create New Post
                </Link>
            </div>

            {/* Global Error Banner */}
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <p>{error}</p>
                </div>
            )}

            {/* The Extracted Table Component */}
            <PostsTable
                data={posts}
                isLoading={isLoading}
                onDelete={handleDelete}
            />

        </div>
    );
}