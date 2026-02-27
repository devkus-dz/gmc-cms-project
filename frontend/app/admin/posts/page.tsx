'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Plus, AlertCircle } from 'lucide-react';
import api from '../../../lib/axios';
import PostsTable, { PostItem } from '../../../components/admin/posts/PostsTable';
import DeleteConfirmationModal from '../../../components/admin/DeleteConfirmationModal';

export default function PostsManagementPage() {
    const [posts, setPosts] = useState<PostItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [postToDelete, setPostToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchPosts = useCallback(async () => {
        setIsLoading(true);
        try {
            // Note: we request status=all so the admin sees drafts too!
            const response = await api.get(`/posts?status=all&page=${page}&limit=${limit}&search=${encodeURIComponent(searchQuery)}`);
            setPosts(response.data.data.items || []);
            setTotalPages(response.data.data.pagination.totalPages || 1);
            setTotalItems(response.data.data.pagination.total || 0);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Could not load posts.');
        } finally {
            setIsLoading(false);
        }
    }, [page, limit, searchQuery]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setPage(1); // Reset to page 1 on new search
    };

    const handleDeleteClick = (id: string) => {
        setPostToDelete(id);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!postToDelete) return;
        setIsDeleting(true);
        try {
            await api.delete(`/posts/${postToDelete}`);
            await fetchPosts();
            setDeleteModalOpen(false);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to delete post.');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Posts Management</h1>
                    <p className="text-slate-500 text-sm mt-1">Create, edit, and manage your blog content.</p>
                </div>
                <Link href="/admin/posts/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm">
                    <Plus className="h-4 w-4" /> New Post
                </Link>
            </div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <p>{error}</p>
                </div>
            )}

            <PostsTable
                data={posts}
                isLoading={isLoading}
                page={page}
                totalPages={totalPages}
                totalItems={totalItems}
                onPageChange={setPage}
                onSearch={handleSearch}
                onDelete={handleDeleteClick}
            />

            <DeleteConfirmationModal
                isOpen={deleteModalOpen}
                itemName="this post"
                isDeleting={isDeleting}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDelete}
            />
        </div>
    );
}