'use client';

import { useState, useEffect } from 'react';
import { Plus, AlertCircle, Save, X } from 'lucide-react';
import api from '../../../lib/axios';
import UsersTable, { UserItem } from '../../../components/admin/users/UsersTable';
import DeleteConfirmationModal from '../../../components/admin/DeleteConfirmationModal';
import { useRoleGuard } from '../../../hooks/useRoleGuard';

export default function UsersManagementPage() {

    const { isAuthorized, isLoading: roleLoading } = useRoleGuard(['admin']);

    const [users, setUsers] = useState<UserItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [editingId, setEditingId] = useState<string | null>(null);

    // Added firstName and lastName to match your backend creation logic
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        role: 'subscriber',
        is_active: true,
    });

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<UserItem | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/users');
            setUsers(response.data.data || []);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Could not load users.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditClick = (user: any) => {
        setEditingId(user.user_id);
        setFormData({
            username: user.username,
            email: user.email,
            firstName: user.first_name || '',
            lastName: user.last_name || '',
            password: '',
            role: user.role,
            is_active: user.is_active,
        });
        setError(null);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({ username: '', email: '', firstName: '', lastName: '', password: '', role: 'subscriber', is_active: true });
        setError(null);
    };

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setError(null);

        if (!formData.username || !formData.email) {
            setError('Username and email are required.');
            return;
        }
        if (!editingId && !formData.password) {
            setError('Password is required for new users.');
            return;
        }

        setIsSubmitting(true);

        // Build the payload cleanly without using the 'delete' keyword
        // Also mapping camelCase to snake_case for the backend
        const payload: Record<string, any> = {
            username: formData.username,
            email: formData.email,
            first_name: formData.firstName,
            last_name: formData.lastName,
            role: formData.role,
            is_active: formData.is_active,
        };

        // Only attach the password if the user actually typed one
        if (formData.password) {
            payload.password = formData.password;
        }

        try {
            if (editingId) {
                await api.put(`/users/${editingId}`, payload);
            } else {
                await api.post('/users', payload);
            }
            await fetchUsers();
            handleCancelEdit();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to save user.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteClick = (id: string) => {
        const user = users.find(u => u.user_id === id);
        if (user) {
            setUserToDelete(user);
            setDeleteModalOpen(true);
        }
    };

    const confirmDelete = async () => {
        if (!userToDelete) return;
        setIsDeleting(true);
        try {
            await api.delete(`/users/${userToDelete.user_id}`);
            setUsers(users.filter((u) => u.user_id !== userToDelete.user_id));
            if (editingId === userToDelete.user_id) handleCancelEdit();
            setDeleteModalOpen(false);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to delete user.');
        } finally {
            setIsDeleting(false);
        }
    };

    if (roleLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 text-slate-400">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                <p>Checking permissions...</p>
            </div>
        );
    }
    if (!isAuthorized) return null; // Prevents UI flicker while redirecting

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
                <p className="text-slate-500 text-sm mt-1">Manage administrators, authors, and subscribers.</p>
            </div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <p>{error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-5">
                        <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4">
                            {editingId ? 'Edit User' : 'Add New User'}
                        </h2>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                                <input type="text" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                                <input type="text" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 text-sm" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                            <input type="text" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 text-sm" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                            <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 text-sm" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                {editingId ? 'New Password (leave blank to keep current)' : 'Password'}
                            </label>
                            <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 text-sm" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                                <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 text-sm capitalize">
                                    <option value="subscriber">Subscriber</option>
                                    <option value="author">Author</option>
                                    <option value="editor">Editor</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                                <select value={formData.is_active.toString()} onChange={(e) => setFormData({ ...formData, is_active: e.target.value === 'true' })} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 text-sm">
                                    <option value="true">Active</option>
                                    <option value="false">Locked</option>
                                </select>
                            </div>
                        </div>

                        <div className="pt-2 flex gap-3">
                            <button type="submit" disabled={isSubmitting} className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                                {editingId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                {isSubmitting ? 'Saving...' : editingId ? 'Update' : 'Create User'}
                            </button>
                            {editingId && (
                                <button type="button" onClick={handleCancelEdit} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <div className="lg:col-span-2">
                    <UsersTable data={users} isLoading={isLoading} editingId={editingId} onEdit={handleEditClick} onDelete={handleDeleteClick} />
                </div>
            </div>

            <DeleteConfirmationModal
                isOpen={deleteModalOpen}
                itemName={`user ${userToDelete?.username}`}
                isDeleting={isDeleting}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDelete}
            />
        </div>
    );
}