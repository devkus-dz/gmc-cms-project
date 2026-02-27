'use client';

import { useState, useEffect, useCallback } from 'react';
import { AlertCircle } from 'lucide-react';
import api from '../../../lib/axios';
import CommentsTable, { CommentItem } from '../../../components/admin/comments/CommentsTable';
import DeleteConfirmationModal from '../../../components/admin/DeleteConfirmationModal';

/**
 * @file frontend/app/(admin)/comments/page.tsx
 * @description Admin page for moderating comments with server-side pagination.
 */
export default function CommentsManagementPage() {
    const [comments, setComments] = useState<CommentItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Pagination State
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    // Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState<CommentItem | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    /**
     * @function fetchComments
     * @description Retrieves the paginated list of comments.
     */
    const fetchComments = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.get(`/comments?page=${page}&limit=${limit}&search=${encodeURIComponent(searchQuery)}`);
            setComments(response.data.data.items || []);
            setTotalPages(response.data.data.pagination.totalPages || 1);
            setTotalItems(response.data.data.pagination.total || 0);
        } catch (err: any) {
            setError('Could not load comments.');
        } finally {
            setIsLoading(false);
        }
    }, [page, limit, searchQuery]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setPage(1);
    };

    const handleStatusChange = async (id: string, newStatus: string) => {
        try {
            await api.put(`/comments/${id}/status`, { status: newStatus });
            // Update UI optimistically
            setComments((prev) =>
                prev.map(c => c.comment_id === id ? { ...c, status: newStatus as any } : c)
            );
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update status.');
        }
    };

    const handleDeleteClick = (id: string) => {
        const comment = comments.find(c => c.comment_id === id);
        if (comment) {
            setCommentToDelete(comment);
            setDeleteModalOpen(true);
        }
    };

    const confirmDelete = async () => {
        if (!commentToDelete) return;
        setIsDeleting(true);
        try {
            await api.delete(`/comments/${commentToDelete.comment_id}`);
            await fetchComments();
            setDeleteModalOpen(false);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to delete comment.');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Comments</h1>
                <p className="text-slate-500 text-sm mt-1">Moderate user discussions and manage spam.</p>
            </div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <p>{error}</p>
                </div>
            )}

            <CommentsTable
                data={comments}
                isLoading={isLoading}
                page={page}
                totalPages={totalPages}
                totalItems={totalItems}
                onPageChange={setPage}
                onSearch={handleSearch}
                onStatusChange={handleStatusChange}
                onDelete={handleDeleteClick}
            />

            <DeleteConfirmationModal
                isOpen={deleteModalOpen}
                itemName={`comment by ${commentToDelete?.username || 'Anonymous'}`}
                isDeleting={isDeleting}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDelete}
            />
        </div>
    );
}