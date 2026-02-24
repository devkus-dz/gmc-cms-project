'use client';

import { useState, useEffect } from 'react';
import { Plus, AlertCircle, Save, X } from 'lucide-react';
import api from '../../../lib/axios';
import CategoriesTable, { CategoryItem } from '../../../components/admin/categories/CategoriesTable';
import DeleteConfirmationModal from '../../../components/admin/DeleteConfirmationModal';

interface CategoryFormData {
    name: string;
    slug: string;
    description: string;
    parent_id: string;
    display_order: number;
}

export default function CategoriesManagementPage() {
    const [categories, setCategories] = useState<CategoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<CategoryFormData>({
        name: '',
        slug: '',
        description: '',
        parent_id: '',
        display_order: 0,
    });

    // Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<CategoryItem | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/categories');
            setCategories(response.data.data || []);
        } catch (err: any) {
            setError('Could not load categories.');
        } finally {
            setIsLoading(false);
        }
    };

    const generateSlug = (name: string) => {
        return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value;
        setFormData((prev) => ({
            ...prev,
            name: newName,
            slug: !editingId && prev.slug === generateSlug(prev.name) ? generateSlug(newName) : prev.slug,
        }));
    };

    const handleEditClick = (category: CategoryItem) => {
        setEditingId(category.category_id);
        setFormData({
            name: category.name,
            slug: category.slug,
            description: category.description || '',
            parent_id: category.parent_id || '',
            display_order: category.display_order || 0,
        });
        setError(null);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({ name: '', slug: '', description: '', parent_id: '', display_order: 0 });
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!formData.name || !formData.slug) {
            setError('Name and Slug are required.');
            return;
        }

        if (editingId && formData.parent_id === editingId) {
            setError('A category cannot be its own parent.');
            return;
        }

        setIsSubmitting(true);
        const payload = { ...formData, parent_id: formData.parent_id || null };

        try {
            if (editingId) {
                await api.put(`/categories/${editingId}`, payload);
            } else {
                await api.post('/categories', payload);
            }
            await fetchCategories();
            handleCancelEdit();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to save category.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteClick = (id: string) => {
        const category = categories.find(c => c.category_id === id);
        if (category) {
            setCategoryToDelete(category);
            setDeleteModalOpen(true);
        }
    };

    const confirmDelete = async () => {
        if (!categoryToDelete) return;
        setIsDeleting(true);
        try {
            await api.delete(`/categories/${categoryToDelete.category_id}`);
            await fetchCategories(); // Refetch to update UI (child categories will lose parent)
            if (editingId === categoryToDelete.category_id) handleCancelEdit();
            setDeleteModalOpen(false);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to delete category.');
        } finally {
            setIsDeleting(false);
        }
    };

    // Filter out the currently editing category so it can't be selected as its own parent
    const availableParents = categories.filter(c => c.category_id !== editingId);

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Categories</h1>
                <p className="text-slate-500 text-sm mt-1">Organize your blog posts into hierarchical topics.</p>
            </div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <p>{error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Form */}
                <div className="lg:col-span-1">
                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-5">
                        <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4">
                            {editingId ? 'Edit Category' : 'Add New Category'}
                        </h2>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                            <input type="text" value={formData.name} onChange={handleNameChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 text-sm" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Slug</label>
                            <input type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 text-sm font-mono" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Parent Category</label>
                            <select
                                value={formData.parent_id}
                                onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                            >
                                <option value="">None (Top Level)</option>
                                {availableParents.map(cat => (
                                    <option key={cat.category_id} value={cat.category_id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 text-sm resize-none" />
                        </div>

                        <div className="pt-2 flex gap-3">
                            <button type="submit" disabled={isSubmitting} className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                                {editingId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                {isSubmitting ? 'Saving...' : editingId ? 'Update' : 'Add Category'}
                            </button>
                            {editingId && (
                                <button type="button" onClick={handleCancelEdit} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Right Table */}
                <div className="lg:col-span-2">
                    <CategoriesTable data={categories} isLoading={isLoading} editingId={editingId} onEdit={handleEditClick} onDelete={handleDeleteClick} />
                </div>
            </div>

            <DeleteConfirmationModal
                isOpen={deleteModalOpen}
                itemName={categoryToDelete?.name || 'this category'}
                isDeleting={isDeleting}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDelete}
            />
        </div>
    );
}