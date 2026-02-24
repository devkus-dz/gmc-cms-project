'use client';

import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import api from '../../../lib/axios';
import CommentsTable, { CommentItem } from '../../../components/admin/comments/CommentsTable';
import DeleteConfirmationModal from '../../../components/admin/DeleteConfirmationModal';

export default function CommentsManagementPage() {
    const [comments, setComments] = useState<CommentItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState<CommentItem | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchComments();
    }, []);

    const fetchComments = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/comments');
            setComments(response.data.data || []);
        } catch (err: any) {
            setError('Could not load comments.');
        } finally {
            setIsLoading(false);
        }
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
            setComments(comments.filter((c) => c.comment_id !== commentToDelete.comment_id));
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

            {/* Full width table for comments */}
            <CommentsTable
                data={comments}
                isLoading={isLoading}
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