'use client';

import { useState, useEffect, JSX } from 'react';
import { Plus, AlertCircle, Save, X } from 'lucide-react';
import api from '../../../lib/axios';
import TagsTable, { TagItem } from '../../../components/admin/tags/TagsTable';
import DeleteConfirmationModal from '../../../components/admin/DeleteConfirmationModal';

/**
 * @interface TagFormData
 * @description Structure of the form state for creating/editing a tag.
 */
interface TagFormData {
    name: string;
    slug: string;
    description: string;
}

/**
 * @function TagsManagementPage
 * @description Admin page for managing tags with a split form/table layout.
 * @returns {JSX.Element} The rendered page.
 */
export default function TagsManagementPage(): JSX.Element {
    const [tags, setTags] = useState<TagItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<TagFormData>({
        name: '',
        slug: '',
        description: '',
    });

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [tagToDelete, setTagToDelete] = useState<TagItem | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchTags();
    }, []);

    /**
     * @function fetchTags
     * @description Fetches all tags from the API.
     * @returns {Promise<void>}
     */
    const fetchTags = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/tags');
            setTags(response.data.data || []);
        } catch (err: any) {
            console.error('Failed to fetch tags:', err);
            setError('Could not load tags. Please check your backend connection.');
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * @function generateSlug
     * @description Auto-generates a URL-friendly slug from the tag name.
     * @param {string} name - The tag name.
     * @returns {string} The formatted slug.
     */
    const generateSlug = (name: string) => {
        return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    };

    /**
     * @function handleNameChange
     * @description Updates the name state and auto-updates the slug if creating a new tag.
     * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
     * @returns {void}
     */
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value;
        setFormData((prev) => ({
            ...prev,
            name: newName,
            slug: !editingId && prev.slug === generateSlug(prev.name) ? generateSlug(newName) : prev.slug,
        }));
    };

    /**
     * @function handleEditClick
     * @description Populates the form with existing tag data for editing.
     * @param {TagItem} tag - The tag to edit.
     * @returns {void}
     */
    const handleEditClick = (tag: TagItem) => {
        setEditingId(tag.tag_id);
        setFormData({
            name: tag.name,
            slug: tag.slug,
            description: tag.description || '',
        });
        setError(null);
    };

    /**
     * @function handleCancelEdit
     * @description Resets the form back to creation mode.
     * @returns {void}
     */
    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({ name: '', slug: '', description: '' });
        setError(null);
    };

    /**
     * @function handleSubmit
     * @description Validates and submits the tag data for creation or update.
     * @param {React.FormEvent} e - The form submission event.
     * @returns {Promise<void>}
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!formData.name || !formData.slug) {
            setError('Name and Slug are required.');
            return;
        }

        setIsSubmitting(true);

        try {
            if (editingId) {
                await api.put(`/tags/${editingId}`, formData);
            } else {
                await api.post('/tags', formData);
            }

            await fetchTags();
            handleCancelEdit();
        } catch (err: any) {
            console.error('Submission failed:', err);
            setError(err.response?.data?.message || 'Failed to save tag.');
        } finally {
            setIsSubmitting(false);
        }
    };

    /**
       * @function handleDeleteClick
       * @description Opens the delete confirmation modal for a specific tag.
       * @param {string} id - The ID of the tag to delete.
       */
    const handleDeleteClick = (id: string) => {
        const tag = tags.find(t => t.tag_id === id);
        if (tag) {
            setTagToDelete(tag);
            setDeleteModalOpen(true);
        }
    };

    /**
     * @function confirmDelete
     * @description Executes the actual API deletion after user confirmation.
     */
    const confirmDelete = async () => {
        if (!tagToDelete) return;
        setIsDeleting(true);

        try {
            await api.delete(`/tags/${tagToDelete.tag_id}`);
            setTags(tags.filter((tag) => tag.tag_id !== tagToDelete.tag_id));
            if (editingId === tagToDelete.tag_id) handleCancelEdit();

            setDeleteModalOpen(false);
            setTagToDelete(null);
        } catch (err: any) {
            console.error('Delete failed:', err);
            setError(err.response?.data?.message || 'Failed to delete tag.');
        } finally {
            setIsDeleting(false);
        }
    };

    function handleDelete(id: string): void {
        throw new Error('Function not implemented.');
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6">

            <div>
                <h1 className="text-2xl font-bold text-slate-900">Tags</h1>
                <p className="text-slate-500 text-sm mt-1">Manage the tags used to organize your content.</p>
            </div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <p>{error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Form */}
                <div className="lg:col-span-1">
                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-5">
                        <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4">
                            {editingId ? 'Edit Tag' : 'Add New Tag'}
                        </h2>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={handleNameChange}
                                placeholder="e.g., React.js"
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm"
                            />
                            <p className="text-xs text-slate-500 mt-1">The name is how it appears on your site.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Slug</label>
                            <input
                                type="text"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm font-mono"
                            />
                            <p className="text-xs text-slate-500 mt-1">The "slug" is the URL-friendly version of the name.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={4}
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm resize-none"
                            />
                        </div>

                        <div className="pt-2 flex gap-3">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                {editingId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                {isSubmitting ? 'Saving...' : editingId ? 'Update Tag' : 'Add Tag'}
                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                                >
                                    <X className="w-4 h-4" /> Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Right Column: TanStack Data Table */}
                <div className="lg:col-span-2">
                    <TagsTable
                        data={tags}
                        isLoading={isLoading}
                        editingId={editingId}
                        onEdit={handleEditClick}
                        onDelete={handleDeleteClick}
                    />
                </div>

            </div>

            {/* Reusable Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={deleteModalOpen}
                itemName={tagToDelete?.name || 'this item'}
                isDeleting={isDeleting}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDelete}
            />
        </div>

    );
}